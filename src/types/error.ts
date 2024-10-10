export type errorDetail = {
  error: string;

  location: string;

  message?: string;

  type: string;
};

export type errorModel = {
  errors: errorDetail[];

  exception: string;

  path: string;

  code: string;

  timestamp: string;

  actionType: string;

  scope?: string;
};
