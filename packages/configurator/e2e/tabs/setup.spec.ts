import withApp from "../helpers/with-app";

describe("setup", () => {
  it("should be the first tab visisble after connecting", async () => {
    const app = await withApp();

    const connectButton = await app.client.$("[data-testid='connect-button']");
    await connectButton.waitForExist();
    await connectButton.click();

    await (await app.client.$("#setup")).waitForExist();

    expect(await (await app.client.$("#setup h1")).getText()).toContain(
      "Setup"
    );
  });
});
