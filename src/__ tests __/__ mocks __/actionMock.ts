jest.mock("../../utilities/actionUtility", () => ({
  getKeyForAction: jest.fn(
    (actionType, scope) => `${scope ? `[scope:${scope}]` : ""}${actionType}`
  ),
  createAction: jest.fn((type, payload, error, meta) => ({
    type,
    payload,
    error,
    meta,
  })),
}));
