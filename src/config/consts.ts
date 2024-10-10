import { workflowStage } from "@/pages/workflow/types";

export const exceptions = {
  FieldValidationException: "FieldLevelException",
};

export const passwordPolicy = {
  minimumLength: 8,
  lowerCase: true,
  upperCase: true,
  numbers: true,
  symbols: true,
};

export const TOKEN_EXPIRE_TIME = 3600;

export const LOCAL_STORAGE_KEYS = {
  farm: "farm",
  organization: "organization",
  language: "language",
};

export const LANGUAGE_KEYS = {
  en: "en",
};

export const LANGUAGE_OPTIONS = [
  {
    label: "EN",
    key: LANGUAGE_KEYS.en,
  },
];

export const WORKFLOW_STAGE_LIST: workflowStage[] = [
  {
    id: 1,
    name: "Germination",
    sequence: 1,
  },
  {
    id: 2,
    name: "Nursery",
    sequence: 2,
  },
  {
    id: 3,
    name: "Vegetative",
    sequence: 3,
  },
  {
    id: 4,
    name: "Flowering/Fruiting",
    sequence: 4,
  },
  {
    id: 5,
    name: "Harvest",
    sequence: 5,
  },
];

export const LIFECYCLE_STATUS = {
  DRAFT: "DRAFT",
  COMPLETED: "COMPLETED",
  RUNNING: "RUNNING",
};
