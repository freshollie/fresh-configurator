/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import MessengerLink from "./MessengerLink";

export default class WebWorkerLink extends MessengerLink {
  constructor(worker: Worker) {
    super((message) => {
      worker.postMessage(message);
    });

    // eslint-disable-next-line no-param-reassign
    worker.onmessage = (event) => this.listener(event.data);
  }
}
