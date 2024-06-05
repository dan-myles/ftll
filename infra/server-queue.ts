export const serverQueue = new sst.aws.Queue("ServerQueue", {
  fifo: true,
});
