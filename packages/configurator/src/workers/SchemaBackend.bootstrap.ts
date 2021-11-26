const worker = new Worker(
  new URL("./SchemaBackend.worker.ts", import.meta.url)
);

export default worker;
