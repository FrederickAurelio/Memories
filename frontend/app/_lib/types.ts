export type FetchResponse = {
  success: boolean;
  message: string;
  errors: Record<string, string>;
};

export type UserProfile = {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
};
