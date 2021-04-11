import withApp from "../helpers/with-app";

describe("configure", () => {
  it("should allow a device to be connnected to and configuration opened", async () => {
    const app = await withApp();

    const connectButton = await app.client.$("[data-testid='connect-button']");
    await connectButton.waitForExist();
    await connectButton.click();

    const configureButton = await app.client.$(
      "[data-testid='configure-button']"
    );
    await configureButton.waitForExist();
    await configureButton.click();

    await (await app.client.$("[data-testid='device-name']")).waitForExist();

    expect(
      await (await app.client.$("[data-testid='device-name']")).getText()
    ).toContain("mock-device");
  });
});
