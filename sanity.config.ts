'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool, defineLocations, defineDocuments} from 'sanity/presentation'

import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    presentationTool({
      resolve: {
        // mainDocuments: which document is editable on each URL
        mainDocuments: defineDocuments([
          {
            route: '/',
            filter: `_type == "homePage"`,
          },
          {
            route: '/about',
            filter: `_type == "aboutPage"`,
          },
          {
            route: '/book',
            filter: `_type == "aboutPage"`,
          },
          {
            route: '/faq',
            filter: `_type == "faqItem"`,
          },
          {
            route: '/services/digital-nomad-visa',
            filter: `_type == "serviceContent" && slug == "digital-nomad-visa"`,
          },
          {
            route: '/services/non-lucrative-visa',
            filter: `_type == "serviceContent" && slug == "non-lucrative-visa"`,
          },
          {
            route: '/blog/:slug',
            filter: `_type == "post" && slug.current == $slug`,
          },
        ]),
        // locations: where each document type appears (for preview links in Structure)
        locations: {
          aboutPage: defineLocations({
            select: { id: '_id' },
            resolve: () => ({
              locations: [
                { title: 'About Us', href: '/about' },
                { title: 'Book a Consultation', href: '/book' },
              ],
            }),
          }),
          homePage: defineLocations({
            select: { headline: 'heroHeadline' },
            resolve: () => ({
              locations: [{ title: 'Home', href: '/' }],
            }),
          }),
          siteSettings: defineLocations({
            select: { name: 'siteName' },
            message: 'Used site-wide',
            tone: 'caution' as const,
            resolve: () => ({
              locations: [{ title: 'Home', href: '/' }],
            }),
          }),
          testimonial: defineLocations({
            select: { name: 'name' },
            resolve: (doc) => ({
              locations: [{ title: `Testimonial: ${doc?.name ?? 'Unnamed'}`, href: '/' }],
            }),
          }),
          teamMember: defineLocations({
            select: { name: 'name' },
            resolve: (doc) => ({
              locations: [{ title: `Team: ${doc?.name ?? 'Unnamed'}`, href: '/about' }],
            }),
          }),
          faqItem: defineLocations({
            select: { question: 'question' },
            resolve: (doc) => ({
              locations: [{ title: doc?.question ?? 'FAQ', href: '/faq' }],
            }),
          }),
          serviceContent: defineLocations({
            select: { slug: 'slug', headline: 'heroHeadline' },
            resolve: (doc) => ({
              locations: [{
                title: doc?.headline ?? 'Service Page',
                href: `/services/${doc?.slug ?? ''}`,
              }],
            }),
          }),
          post: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title ?? 'Post', href: `/blog/${doc?.slug ?? ''}` },
                { title: 'Blog', href: '/blog' },
              ],
            }),
          }),
        },
      },
      previewUrl: {
        origin: process.env.NODE_ENV === 'production'
          ? 'https://www.digitalnomadinspain.com'
          : 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
