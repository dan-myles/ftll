/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    FTLLWeb: {
      type: "sst.aws.Nextjs"
      url: string
    }
    ServerQueue: {
      type: "sst.aws.Queue"
      url: string
    }
  }
}
export {}