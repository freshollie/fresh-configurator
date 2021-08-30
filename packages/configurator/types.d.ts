declare module "*.svg" {
  const content: React.FC<React.SVGAttributes<SVGElement>>;
  export default content;
}
declare module "*.woff2";
declare module "*.woff";
declare module "*.ttf";
declare module "*.png";
declare module "*.gltf";
declare module "*.jpeg";
{
  declare const someString: string;
  export default someString;
}
