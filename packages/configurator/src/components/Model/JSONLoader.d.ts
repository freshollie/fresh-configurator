export default class JSONLoader extends Loader {
  constructor(manager?: LoadingManager);

  manager: LoadingManager;

  withCredentials: boolean;

  load(
    url: string,
    onLoad?: (geometry: Geometry, materials: Material[]) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void
  ): void;
  setTexturePath(value: string): void;
  parse(
    json: unknown,
    texturePath?: string
  ): { geometry: Geometry; materials?: Material[] };
}
