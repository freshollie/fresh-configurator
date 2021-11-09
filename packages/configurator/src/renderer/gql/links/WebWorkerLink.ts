/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */
import MessengerLink from "./MessengerLink";

export default class WebWorkerLink extends MessengerLink {
  constructor(worker: Worker) {
    super(worker.postMessage);

    worker.onmessage = (event) => this.listener(event.data);
  }
}
