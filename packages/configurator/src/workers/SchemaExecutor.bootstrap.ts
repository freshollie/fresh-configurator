const worker = new Worker(
  new URL("./SchemaExecutor.worker.ts", import.meta.url)
);

export default {
  initialise: async (mocked: boolean): Promise<Worker> => {
    worker.postMessage({ type: "init", mocked });
    // Wait for the response to mark as initialised
    await new Promise((resolve) => {
      worker.onmessage = resolve;
    });

    return worker;
  },
};
