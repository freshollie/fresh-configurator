Feature("Connect and configurator");

Scenario("Connect to device and open configuration for device", ({ I }) => {
  I.waitForText("/dev/somemockport");
  I.click("[data-testid='connect-button']");

  I.waitForElement("[data-testid='configure-button']");
  I.click("[data-testid='configure-button']");

  I.waitForElement("[data-testid='device-name']");
  within("[data-testid='device-name']", () => {
    I.see("mock-device");
  });
});
