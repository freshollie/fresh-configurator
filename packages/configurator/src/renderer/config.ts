const searchParams = new URLSearchParams(window.location.search.slice(1));

export default {
  // all versions are specified and compared using semantic versioning http://semver.org/
  apiVersionAccepted: "1.2.1",
  backupRestoreMinApiVersionAccepted: "1.5.0",
  pidControllerChangeMinApiVersion: "1.5.0",
  backupFileMinVersionAccepted: "0.55.0", // chrome.runtime.getManifest().version is stored as string, so does this one

  connectionValid: false,
  connectionValidCliOnly: false,
  cliActive: false,
  cliValid: false,
  gitChangesetId: "unknown",
  isElectron: !!window.ipcRenderer,
  isMocked: !!searchParams.get("mocked"),
  wsBackend: searchParams.get("backend"),
  artifactsFolder: searchParams.get("artifacts"),
} as const;
