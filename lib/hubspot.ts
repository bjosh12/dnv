import { Client, AssociationTypes } from "@hubspot/api-client";
import { SITE_URL } from "@/lib/constants";
import type { AnswerEntry, WizardResult, AiAnalysis } from "@/app/api/prequalify/route";

// The SDK doesn't re-export AssociationSpecAssociationCategoryEnum from its public
// entry point (only per-module internal copies), so these types are derived straight
// from the actual method signatures instead of reaching into internal module paths.
type DealAssociations = Parameters<Client["crm"]["deals"]["basicApi"]["create"]>[0]["associations"];
type NoteAssociations = Parameters<Client["crm"]["objects"]["notes"]["basicApi"]["create"]>[0]["associations"];

let hubspotClient: Client | null = null;

function getHubspotClient(): Client | null {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return null;
  if (!hubspotClient) hubspotClient = new Client({ accessToken: token });
  return hubspotClient;
}

// Pipeline lookups rarely change — cache for the life of the server process.
let cachedPipelineStage: { pipelineId: string; stageId: string } | null = null;

async function getDefaultPipelineAndStage(
  client: Client
): Promise<{ pipelineId: string; stageId: string } | null> {
  const envPipeline = process.env.HUBSPOT_PIPELINE_ID;
  const envStage = process.env.HUBSPOT_DEAL_STAGE_ID;
  if (envPipeline && envStage) return { pipelineId: envPipeline, stageId: envStage };

  if (cachedPipelineStage) return cachedPipelineStage;

  try {
    const { results } = await client.crm.pipelines.pipelinesApi.getAll("deals");
    if (!results.length) return null;
    // The account's default pipeline is conventionally the one with the lowest
    // display order; same logic for its first (leftmost) stage.
    const pipeline = [...results].sort((a, b) => a.displayOrder - b.displayOrder)[0];
    const stage = [...pipeline.stages].sort((a, b) => a.displayOrder - b.displayOrder)[0];
    if (!stage) return null;
    cachedPipelineStage = { pipelineId: pipeline.id, stageId: stage.id };
    return cachedPipelineStage;
  } catch (err) {
    console.error("HubSpot: failed to look up default pipeline/stage", err);
    return null;
  }
}

function splitName(fullName: string): { firstname: string; lastname: string } {
  const parts = fullName.trim().split(/\s+/);
  return { firstname: parts[0] ?? fullName, lastname: parts.slice(1).join(" ") };
}

// The dropdown options in this HubSpot portal were created with capitalized
// values ("Eligible", "Hot", ...), and HubSpot requires an exact match on the
// stored option value — map our internal lowercase values onto them.
const HUBSPOT_OPTION_VALUES: Record<string, string> = {
  eligible: "Eligible",
  likely: "Likely",
  "not-eligible": "Not-eligible",
  hot: "Hot",
  warm: "Warm",
  cold: "Cold",
};

async function upsertContact(
  client: Client,
  input: { name: string; email: string; phone: string; result: WizardResult; analysis: AiAnalysis | null }
): Promise<string | null> {
  const { firstname, lastname } = splitName(input.name);
  const properties: Record<string, string> = {
    email: input.email,
    firstname,
    lastname,
    dnv_eligibility_result: HUBSPOT_OPTION_VALUES[input.result.status] ?? input.result.status,
  };
  if (input.phone) properties.phone = input.phone;
  if (input.analysis) {
    properties.dnv_lead_score = String(input.analysis.score);
    properties.dnv_lead_tier = HUBSPOT_OPTION_VALUES[input.analysis.tier] ?? input.analysis.tier;
    properties.dnv_ai_summary = input.analysis.summary;
  }

  try {
    const response = await client.crm.contacts.batchApi.upsert({
      inputs: [{ id: input.email, idProperty: "email", properties }],
    });
    return response.results[0]?.id ?? null;
  } catch (err) {
    console.error("HubSpot: failed to upsert contact", err);
    return null;
  }
}

async function createDealForContact(
  client: Client,
  contactId: string,
  input: { name: string; analysis: AiAnalysis | null }
): Promise<string | null> {
  const stage = await getDefaultPipelineAndStage(client);
  if (!stage) return null;

  const tierLabel = input.analysis ? ` (${input.analysis.tier})` : "";
  try {
    const response = await client.crm.deals.basicApi.create({
      properties: {
        dealname: `Pre-qualification: ${input.name}${tierLabel}`,
        pipeline: stage.pipelineId,
        dealstage: stage.stageId,
      },
      associations: [
        {
          to: { id: contactId },
          types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: AssociationTypes.dealToContact }],
        },
      ] as DealAssociations,
    });
    return response.id;
  } catch (err) {
    console.error("HubSpot: failed to create deal", err);
    return null;
  }
}

function buildNoteHtml(
  leadId: string,
  answers: AnswerEntry[],
  result: WizardResult,
  analysis: AiAnalysis | null
): string {
  const rows = answers
    .map((a) => `<li><strong>${a.question}</strong> — ${a.answer}</li>`)
    .join("");
  const aiSection = analysis
    ? `<p><strong>AI summary:</strong> ${analysis.summary}</p>
       ${analysis.riskFlags.length ? `<p><strong>Risk flags:</strong></p><ul>${analysis.riskFlags.map((f) => `<li>${f}</li>`).join("")}</ul>` : ""}
       ${analysis.nextSteps.length ? `<p><strong>Next steps:</strong></p><ol>${analysis.nextSteps.map((s) => `<li>${s}</li>`).join("")}</ol>` : ""}`
    : "<p>AI analysis unavailable for this lead.</p>";

  return `
    <p><strong>Eligibility result:</strong> ${result.status}</p>
    ${aiSection}
    <p><strong>Full questionnaire:</strong></p>
    <ul>${rows}</ul>
    <p><a href="${SITE_URL}/studio/structure/leadProfile;${leadId}">Open this lead in Sanity Studio</a></p>
  `;
}

async function createTranscriptNote(
  client: Client,
  contactId: string,
  dealId: string | null,
  input: { leadId: string; answers: AnswerEntry[]; result: WizardResult; analysis: AiAnalysis | null }
): Promise<void> {
  const associations = [
    {
      to: { id: contactId },
      types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: AssociationTypes.noteToContact }],
    },
    ...(dealId
      ? [
          {
            to: { id: dealId },
            types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: AssociationTypes.noteToDeal }],
          },
        ]
      : []),
  ] as NoteAssociations;

  try {
    await client.crm.objects.notes.basicApi.create({
      properties: {
        hs_note_body: buildNoteHtml(input.leadId, input.answers, input.result, input.analysis),
        hs_timestamp: String(Date.now()),
      },
      associations,
    });
  } catch (err) {
    console.error("HubSpot: failed to create transcript note", err);
  }
}

function contactUrlFor(contactId: string): string | undefined {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  return portalId ? `https://app.hubspot.com/contacts/${portalId}/record/0-1/${contactId}` : undefined;
}

function dealUrlFor(dealId: string): string | undefined {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  return portalId ? `https://app.hubspot.com/contacts/${portalId}/record/0-3/${dealId}` : undefined;
}

export async function syncLeadToHubspot(input: {
  leadId: string;
  name: string;
  email: string;
  phone: string;
  answers: AnswerEntry[];
  result: WizardResult;
  analysis: AiAnalysis | null;
}): Promise<{ contactUrl?: string; dealUrl?: string } | null> {
  const client = getHubspotClient();
  if (!client) return null;

  const contactId = await upsertContact(client, input);
  if (!contactId) return null;

  const dealId = await createDealForContact(client, contactId, input);
  await createTranscriptNote(client, contactId, dealId, input);

  return {
    contactUrl: contactUrlFor(contactId),
    dealUrl: dealId ? dealUrlFor(dealId) : undefined,
  };
}
