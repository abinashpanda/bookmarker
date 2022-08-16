import { Bookmark } from 'types/bookmark.types'
import { apiClient } from 'utils/client'

export async function fetchBookmarkData(url: string) {
  const { data } = await apiClient.post<Omit<Bookmark, 'id'>>('/metadata', { url })
  return data
}
