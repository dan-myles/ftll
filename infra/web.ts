/// <reference path="../.sst/platform/config.d.ts" />
export const web = new sst.aws.Nextjs("FTLLWeb", {
  path: "apps/web",
  domain: {
    name: $app.stage === "prod" ? "ftll.io" : `${$app.stage}.ftll.io`,
    dns: sst.cloudflare.dns(),
  },
});
