// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'bookmarker',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        aws: {
          region: 'ap-south-1',
        },
      },
    }
  },
  async run() {
    const googleClientId = new sst.Secret('BOOKMARKER_GOOGLE_CLIENT_ID')
    const googleClientSecret = new sst.Secret('BOOKMARKER_GOOGLE_CLIENT_SECRET')
    const databaseUrl = new sst.Secret('BOOKMARKER_DATABASE_URL')
    const authSecret = new sst.Secret('BOOKMARKER_AUTH_SECRET')

    const app = new sst.aws.Remix('BookmarkerWeb', {
      edge: false,
      link: [googleClientId, googleClientSecret, databaseUrl, authSecret],
      domain:
        $app.stage === 'production'
          ? {
              name: 'bookmarker.prodioslabs.com',
              redirects: ['www.bookmarker.prodioslabs.com'],
            }
          : undefined,
      transform: {
        server: {
          copyFiles: [{ from: 'node_modules/.prisma/client/' }],
        },
      },
    })

    return {
      url: app.url,
    }
  },
})
