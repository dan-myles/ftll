/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "ftll-web",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: { cloudflare: true },
    }
  },

  async run() {
    new sst.aws.Nextjs("FTLLWeb", {
      domain: {
        name: $app.stage === "prod" ? "ftll.io" : `${$app.stage}.ftll.io`,
        dns: sst.cloudflare.dns(),
      },
    })
  },
})
