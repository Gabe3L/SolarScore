export {};

declare global {
  declare module "*.webp" {
    const value: string;
    export default value;
  }
}
