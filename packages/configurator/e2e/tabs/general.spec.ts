import withApp from "../helpers/with-app";

describe("general", () => {
  it("should be the first tab visisble after connecting", async () => {
    const app = await withApp();

    const connectButton = await app.client.$("[data-testid='connect-button']");
    await connectButton.waitForExist();
    await connectButton.click();

    await (await app.client.$("#general")).waitForExist();

    expect(await (await app.client.$("#general h1")).getText()).toContain(
      "General"
    );
  });
});
