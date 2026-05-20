export type APIResponse = Array<{
  family: string;
  variants: Array<string>;
  files: Record<string, string>;
  menu: string;
}>;

export type GoogleAPIResponse = {
  items: APIResponse;
};
