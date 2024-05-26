/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "ftl-web",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: { cloudflare: true },
    }
  },

  async run() {
    new sst.aws.Nextjs("FTLWeb", {
      domain: {
        name: $app.stage === "prod" ? "ftll.io" : `${$app.stage}.ftll.io`,
        dns: sst.cloudflare.dns(),
      },
    })
  },
})
