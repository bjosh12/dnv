import { type SchemaTypeDefinition } from 'sanity'
import post from '../schemas/post'
import author from '../schemas/author'
import category from '../schemas/category'
import siteSettings from '../schemas/siteSettings'
import homePage from '../schemas/homePage'
import aboutPage from '../schemas/aboutPage'
import testimonial from '../schemas/testimonial'
import teamMember from '../schemas/teamMember'
import faqItem from '../schemas/faqItem'
import serviceContent from '../schemas/serviceContent'
import seoObject from '../schemas/seoObject'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Object types (reusable)
    seoObject,
    // Singletons
    siteSettings,
    homePage,
    aboutPage,
    // Repeatable content
    testimonial,
    teamMember,
    faqItem,
    serviceContent,
    // Blog
    post,
    author,
    category,
  ],
}
