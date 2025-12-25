import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
  useCdn: true,
})

// Export as sanityClient for compatibility with existing imports
export const sanityClient = client;

const builder = createImageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)