export const serverQueue = new sst.aws.Queue("server-queue", {
  fifo: true,
});
