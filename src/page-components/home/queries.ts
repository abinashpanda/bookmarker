import { Bookmark } from 'types/bookmark.types'

export async function fetchBookmarks(): Promise<Bookmark[]> {
  return [
    {
      id: 'bookmark-1',
      image:
        'https://web-dev.imgix.net/image/FNkVSAX8UDTTQWQkKftSgGe9clO2/uZ3hQS2EPrA9csOgkoXI.png?auto=format&fit=max&w=1200&fm=auto',
      title: 'How browsers work',
      site: {
        favicon: 'https://web.dev/images/favicon.ico',
        url: 'https://web.dev/howbrowserswork/',
        name: 'web.dev',
      },
    },
    {
      id: 'bookmark-2',
      title: 'Fed Risks Imploding The Highly Levered Global Financial System: Lawrence Lepard',
      image:
        'https://substackcdn.com/image/fetch/w_1200,h_600,c_limit,f_jpg,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F9ec5d244-9c39-4b8f-88b9-67112afdfba3_435x340.png',
      description: "Part 1 of Larry's latest take on the market, crypto, gold and the Fed.",
      site: {
        favicon:
          'https://bucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com/public/images/26ebf1e2-3982-4673-bb95-e29f9a1becb7/favicon.ico',
        url: 'https://quoththeraven.substack.com/p/fed-risks-imploding-the-highly-levered',
      },
    },
  ]
}
