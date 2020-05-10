import withApp from "../helpers/with-app";

jest.setTimeout(100000);

describe("setup", () => {
  it("should be the first tab visisble after connecting", async () => {
    const app = await withApp();
    await app.client.waitForExist("[data-testid='connect-button']");
    await app.client.element("[data-testid='connect-button']").click();
    await app.client.waitForVisible("#setup");

    expect(await app.client.getText("#setup h1")).toContain("Setup");
  });
});
