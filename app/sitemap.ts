import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://wowzer.tech',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // We can add other routes later if needed
  ]
}
