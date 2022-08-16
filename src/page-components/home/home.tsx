import BookmarkCard from 'components/bookmark-card'
import { BookmarkLoader } from 'components/loaders'
import { range } from 'lodash'
import { useMemo } from 'react'
import { HiBookmark } from 'react-icons/hi'
import { useQuery } from 'react-query'
import Empty from 'ui/empty'
import ErrorMessage from 'ui/error-message'
import { fetchBookmarks } from './queries'

export default function Home() {
  const { data, isLoading, isError } = useQuery(['bookmarks'], fetchBookmarks)

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {range(4).map((key) => (
            <BookmarkLoader key={key} />
          ))}
        </div>
      )
    }

    if (isError) {
      return <ErrorMessage />
    }

    if (data) {
      if (data.length === 0) {
        return <Empty />
      }

      return (
        <div className="space-y-4">
          {data.map((bookmark) => (
            <BookmarkCard bookmark={bookmark} key={bookmark.id} />
          ))}
        </div>
      )
    }

    return null
  }, [isLoading, isError, data])

  return (
    <>
      <div className="mx-auto max-w-screen-lg">
        <h2 className="mb-4 flex items-center space-x-1 font-medium">
          <HiBookmark className="h-5 w-5" />
          <span>Saved Bookmarks</span>
        </h2>
        {content}
      </div>
    </>
  )
}
