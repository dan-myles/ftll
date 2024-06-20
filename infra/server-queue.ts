export const serverQueue = new sst.aws.Queue("FTLLDayzServerQueue", {
  fifo: true,
});
