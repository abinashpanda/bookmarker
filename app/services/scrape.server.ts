import { createOpenAI } from '@ai-sdk/openai'
import { Resource } from 'sst'
import { generateObject } from 'ai'
import { z } from 'zod'
import { prisma } from './db.server'

const openai = createOpenAI({
  apiKey: Resource['BOOKMARKER_OPENAI_API_KEY'].value,
})

const PARSER_SYSTEM_INSTRUCTION = `
You are a web scraper bot, tasked with extracting relevant information from an HTML page. Your goal is to
retrieve the title, description, OG image, and header images of the page, as well as generate a summary of the
content.

As you begin your search, you find yourself navigating through a vast digital library, scrolling through lines of
code and HTML tags. You feel like a detective, searching for clues to uncover the hidden secrets of the web.
    `.trim()

const scrappedDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  favicon: z.string().optional(),
  image: z.string().optional(),
  tags: z.string().array(),
  summary: z.string(),
})

export async function scrapeUrl(url: string) {
  // remove any query params from the url, and remove trailing slashes
  const normalizedUrl = url.replace(/\?.*$/, '').replace(/\/$/, '')

  const prevData = await prisma.scrappedData.findUnique({
    where: {
      url: normalizedUrl,
    },
  })
  if (prevData) {
    const result = scrappedDataSchema.safeParse(prevData.data)
    if (result.success) {
      return { result: result.data, url }
    }
  }

  const res = await fetch(url)
  const html = await res.text()

  const result = await generateObject({
    model: openai('gpt-4o'),
    schema: scrappedDataSchema,
    system: PARSER_SYSTEM_INSTRUCTION,
    prompt: `Scrape the following HTML Content\n\n\n${html}`,
  })
  await prisma.scrappedData.upsert({
    create: {
      url: normalizedUrl,
      data: result.object,
    },
    where: {
      url: normalizedUrl,
    },
    update: {
      data: result.object,
    },
  })

  return { result: result.object, url }
}
