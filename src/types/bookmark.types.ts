type BookmarkSite = {
  url: string
  name?: string
  favicon?: string
}

export type Bookmark = {
  id: string
  image?: string
  title: string
  description?: string
  site: BookmarkSite
}
