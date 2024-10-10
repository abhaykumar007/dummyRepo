import { getTranslation } from "@/translation/i18n";

export const taskStatusValueTokey: { [key: string]: string } = {
  all: "all",
  OPEN: "open",
  IN_REVIEW: "inReview",
  IN_PROGRESS: "inProgress",
  CLOSED: "closed",
  CANCELLED: "cancelled",
};

export const taskStatusKeyToValue: { [key: string]: string } = {
  open: "OPEN",
  inReview: "IN_REVIEW",
  inProgress: "IN_PROGRESS",
  closed: "CLOSED",
  cancelled: "CANCELLED",
};

export const taskStatusValueToLabel: { [key: string]: string } = {
  all: getTranslation("global.all"),
  OPEN: getTranslation("task.open"),
  IN_REVIEW: getTranslation("task.inProgress"),
  IN_PROGRESS: getTranslation("task.inReview"),
  CLOSED: getTranslation("task.closed"),
  CANCELLED: getTranslation("task.cancelled"),
};

export const taskStatusKeyToLabel: { [key: string]: string } = {
  open: getTranslation("task.open"),
  inProgress: getTranslation("task.inProgress"),
  inReview: getTranslation("task.inReview"),
  closed: getTranslation("task.closed"),
  cancelled: getTranslation("task.cancelled"),
};

export const taskStatusKeyToColor: { [key: string]: string } = {
  open: "#0049B7",
  inProgress: "#00b2be",
  inReview: "#f56a00",
  closed: "#87d068",
  cancelled: "red",
};
export const severityToColors: { [key: number]: string } = {
  0: "red",
  1: "orange",
  2: "green",
};

export const severityToLabel: { [key: number]: string } = {
  0: getTranslation("task.urgent"),
  1: getTranslation("task.medium"),
  2: getTranslation("task.normal"),
};

export const categoryOptions = [
  {
    label: getTranslation("task.category.cleaning"),
    value: "Cleaning",
  },
  {
    label: getTranslation("task.category.waterQuality"),
    value: "Water Quality",
  },
  {
    label: getTranslation("task.category.soilPreparation"),
    value: "Soil Preparation",
  },
  {
    label: getTranslation("task.category.plantation"),
    value: "Plantation",
  },
  {
    label: getTranslation("task.category.irrigation"),
    value: "Irrigation",
  },
  {
    label: getTranslation("task.category.cropMaintenance"),
    value: "Crop Maintenance",
  },
  {
    label: getTranslation("task.category.fertilizer"),
    value: "Fertilizer",
  },
  {
    label: getTranslation("task.category.scouting"),
    value: "Scouting",
  },
  {
    label: getTranslation("task.category.defence"),
    value: "Defence",
  },
  {
    label: getTranslation("task.category.harvest"),
    value: "Harvest",
  },
  {
    label: getTranslation("task.category.processing"),
    value: "Processing",
  },
  {
    label: getTranslation("task.category.storage"),
    value: "Storage",
  },
  {
    label: getTranslation("task.category.packing"),
    value: "Packing",
  },
  {
    label: getTranslation("task.category.loading"),
    value: "Loading",
  },
  {
    label: getTranslation("task.category.transportation"),
    value: "Transportation",
  },
  {
    label: getTranslation("task.category.selling"),
    value: "Selling",
  },
];

export const calculateTextSize = (text: string): number => {
  const blob = new Blob([text], { type: "text/html" });
  return blob.size;
};
