import { BadRequestException, Body, createHandler, Post, ValidationPipe } from '@storyofams/next-api-decorators'
import { IsString } from 'class-validator'
import got from 'got'
import createMetascraper from 'metascraper'
import metascraperDescription from 'metascraper-description'
import metascraperImage from 'metascraper-image'
import metascraperTitle from 'metascraper-title'
import metascraperPublisher from 'metascraper-publisher'
import metascraperUrl from 'metascraper-url'
import metascraperLogoFavicon from 'metascraper-logo-favicon'
import metascraperVideo from 'metascraper-video'
import { Bookmark } from 'types/bookmark.types'

const metascraper = createMetascraper([
  metascraperDescription(),
  metascraperImage(),
  metascraperTitle(),
  metascraperPublisher(),
  metascraperUrl(),
  metascraperLogoFavicon(),
  metascraperVideo(),
])

export class FetchMetadataDto {
  @IsString()
  url: string
}

class MetadataHandler {
  @Post()
  async fetchMetadata(@Body(ValidationPipe) fetchMetadataDto: FetchMetadataDto) {
    try {
      const { body: html, url } = await got(fetchMetadataDto.url)
      const metadata = await metascraper({ html, url, validateUrl: true })
      const bookmarkData: Omit<Bookmark, 'id'> = {
        title: metadata.title,
        description: metadata.description,
        image: metadata.image,
        site: {
          name: metadata.publisher,
          url: metadata.url,
          // @ts-expect-error as the types don't have logo property but it's ok
          favicon: metadata.logo,
        },
      }
      return bookmarkData
    } catch (error) {
      throw new BadRequestException('Invalid url')
    }
  }
}

export default createHandler(MetadataHandler)
