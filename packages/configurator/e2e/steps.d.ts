/* eslint-disable */
/// <reference types='codeceptjs' />

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
  }
  interface Methods extends Puppeteer {}
  interface I extends WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
