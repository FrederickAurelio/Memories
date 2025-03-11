export type FetchResponse = {
  success: boolean;
  message: string;
  errors: Record<string, string>;
};