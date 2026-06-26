"use client";

import { useEffect } from "react";
import { enableVisualEditing } from "@sanity/visual-editing";

export default function SanityVisualEditing() {
  useEffect(() => {
    return enableVisualEditing();
  }, []);
  return null;
}
