/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "ftl-web",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    }
  },

  async run() {
    new sst.aws.Nextjs("FTLWeb")
  },
})
