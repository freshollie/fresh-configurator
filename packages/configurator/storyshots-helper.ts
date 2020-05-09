import { imageSnapshot, Context } from "@storybook/addon-storyshots-puppeteer";
import path from "path";
import puppeteer from "puppeteer";

declare global {
  // eslint-disable-next-line functional/prefer-type-literal
  interface Window {
    snaps: {
      animationsFinished: Promise<unknown>;
    };
  }
}

jest.setTimeout(100000);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const snapshotsHelper = ({ dark }: { dark: boolean }) => {
  let browser: puppeteer.Browser | undefined;
  const testFunction = imageSnapshot({
    chromeExecutablePath: process.env.PUPPETEER_EXEC_PATH,
    storybookUrl: !process.env.STORYBOOK_PORT
      ? `file://${path.resolve(__dirname, "storybook-static")}`
      : `http://localhost:${process.env.STORYBOOK_PORT}`,
    getCustomBrowser: async () => {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-web-security",
          "--allow-file-access-from-files",
          "--allow-file-access",
        ],
      });
      return browser;
    },
    getMatchOptions: () => ({
      failureThreshold: 0.02,
      failureThresholdType: "percent",
    }),
    getScreenshotOptions: () => ({
      encoding: "base64",
      omitBackground: true,
    }),
    customizePage: (page) => page.setViewport({ width: 960, height: 640 }),
    beforeScreenshot: (page) =>
      page.evaluate(() => window.snaps.animationsFinished),
    getGotoOptions: ({ context: { kind, story } }) => {
      process.stdout.write(
        `Testing(${dark ? "dark" : "light"}) ${kind}:${story}\n`
      );
      return { waitUntil: "networkidle0" };
    },
  });

  const customTest = (({ context }: { context: Context & { id: string } }) => {
    return testFunction({
      context: {
        ...context,
        id: `${context.id}${dark ? "&dark=true" : ""}&snapshot=true`,
      },
    });
  }) as ReturnType<typeof imageSnapshot>;

  customTest.afterAll = async () => {
    await browser?.close();
    browser = undefined;
  };
  process.on("SIGINT", async () => {
    await browser?.close();
    browser = undefined;
    process.exit(120);
  });
  customTest.beforeAll = testFunction.beforeAll;
  customTest.timeout = testFunction.timeout;
  return customTest;
};

export default snapshotsHelper;
