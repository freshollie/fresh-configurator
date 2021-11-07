import { version } from "../../package.json";

type OsVersion =
  | "Windows"
  | "MacOS"
  | "ChromeOS"
  | "Linux"
  | "UNIX"
  | "Unknown";

type VersionInfo = {
  os: OsVersion;
  chromeVersion: string;
  version: string;
};

const os = (): OsVersion => {
  if (navigator.appVersion.includes("Win")) return "Windows";
  if (navigator.appVersion.includes("Mac")) return "MacOS";
  if (navigator.appVersion.includes("CrOS")) return "ChromeOS";
  if (navigator.appVersion.includes("Linux")) return "Linux";
  if (navigator.appVersion.includes("X11")) return "UNIX";
  return "Unknown";
};

// eslint-disable-next-line import/prefer-default-export
export const versionInfo = (): VersionInfo => ({
  os: os(),
  chromeVersion: window.navigator.appVersion.replace(
    /.*Chrome\/([0-9.]*).*/,
    "$1"
  ),
  version,
});
