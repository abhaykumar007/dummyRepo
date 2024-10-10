import { getTranslation } from "@/translation/i18n";
import { errorDetail } from "@/types/error";
import { FormInstance } from "antd";

export const stepperNames = {
  FARM_CREATION: "Form",
  RESERVOIRS: "Reservoirs",
  POLYHOUSES: "Poly houses",
  ZONE: "Zone",
  NURSERY: "Nursery",
};

export const stepper = {
  [stepperNames.FARM_CREATION]: 0,
  [stepperNames.RESERVOIRS]: 1,
  [stepperNames.POLYHOUSES]: 2,
  [stepperNames.ZONE]: 3,
  [stepperNames.NURSERY]: 4,
};

export const FARM_REGEX = {
  ratioValidationRegex: /^\d+:\d+$/,
  number: /^(?:[1-9]\d{0,4}|50000)(?:\.\d+)?$/,
  wholeNumber: /^(?:0|(?:[1-9]\d{0,4}|50000))(?:\.\d+)?$/,
};

export const isNumber = (value: string) => FARM_REGEX.number.test(value);
export const isRatioValidationRegex = (value: string) =>
  FARM_REGEX.ratioValidationRegex.test(value);

export const numberValidator = (_: object, value: string) => {
  if (value && !isNumber(value))
    return Promise.reject(new Error(getTranslation("farm.numberValidator")));
  return Promise.resolve();
};

export const ratioValidationRegex = (_: object, value: string) => {
  if (value && !isRatioValidationRegex(value))
    return Promise.reject(new Error(getTranslation("farm.ratioValidator")));
  return Promise.resolve();
};

export const applyErrorsToFields = (
  form: FormInstance,
  errors: errorDetail[],
  errRefrence = ""
) => {
  errors.forEach((err) => {
    if (!err.location) return;

    const fieldParts = err.location.split(".");
    if (fieldParts[0] === errRefrence) {
      const index = fieldParts[1];
      const fieldName = fieldParts[2];
      const formFieldName = `${fieldName}_${index}`;

      form.setFields([
        {
          name: formFieldName,
          errors: [err.message || "Please enter valid value"],
          value: form.getFieldValue(formFieldName),
        },
      ]);
    } else if (fieldParts.length === 2) {
      const index = fieldParts[0];
      const fieldName = fieldParts[1];
      const formFieldName = `${fieldName}_${index}`;

      form.setFields([
        {
          name: formFieldName,
          errors: [err.message || "Please enter valid value"],
          value: form.getFieldValue(formFieldName),
        },
      ]);
    } else {
      const fieldName = fieldParts.join(".");
      form.setFields([
        {
          name: fieldName,
          errors: [err.message || "Please enter valid value"],
          value: form.getFieldValue(fieldName),
        },
      ]);
    }
  });
};

export const applyErrorsToCardFields = (
  form: FormInstance,
  errors: errorDetail[],
  currentZoneKey: string,
  cardType: string
) => {
  errors.forEach((err) => {
    if (!err.location) return;

    const fieldParts = err.location.split(".");
    const isZonesError = fieldParts.includes("zones");
    const isNursariesError = fieldParts.includes("nurseries");

    if (isZonesError && cardType === "zones") {
      const zonesIndex = fieldParts[2];
      const fieldName = fieldParts[fieldParts.length - 1];
      const fieldType = fieldParts.includes("growingArea")
        ? `growingArea.${fieldName}`
        : fieldName;

      if (parseInt(currentZoneKey, 10) === parseInt(zonesIndex, 10)) {
        form.setFields([
          {
            name: fieldType,
            errors: [err.message || "Please enter valid value"],
            value: form.getFieldValue(fieldType),
          },
        ]);
      }
    }

    if (isNursariesError && cardType === "nurseries") {
      const nurseryIndex = fieldParts[2];
      const fieldName = fieldParts[fieldParts.length - 1];

      if (parseInt(currentZoneKey, 10) === parseInt(nurseryIndex, 10)) {
        form.setFields([
          {
            name: fieldName,
            errors: [err.message || "Please enter valid value"],
            value: form.getFieldValue(fieldName),
          },
        ]);
      }
    }
  });
};

export const applyErrorsInModal = (
  form: FormInstance,
  errors: Array<{ location?: string; message?: string }>
): void => {
  errors.forEach((err: any) => {
    if (!err.location) return;
    const fieldName = err.location;
    form.setFields([
      {
        name: fieldName,
        errors: [err.message || "Please enter valid value"],
        value: form.getFieldValue(fieldName),
      },
    ]);
  });
};

export const nurseryType = [
  {
    label: `${getTranslation(
      "farm.createFarm.polyhouse.nursery.nurseryType.openDome"
    )}`,
    value: "Open (no humidity control)",
  },
  {
    label: `${getTranslation(
      "farm.createFarm.polyhouse.nursery.nurseryType.closeDome"
    )}`,
    value: "Closed dome (humidity control)",
  },
];

export const nurseryGerminationType = [
  {
    label: `${getTranslation(
      "farm.createFarm.polyhouse.nursery.germinationType.trayWithCocoPeat"
    )}`,
    value: "Tray with coco peat",
  },
  {
    label: `${getTranslation(
      "farm.createFarm.polyhouse.nursery.germinationType.oasisCubies"
    )}`,
    value: "Oasis cubies",
  },
  {
    label: `${getTranslation(
      "farm.createFarm.polyhouse.nursery.germinationType.cocoPlugs"
    )}`,
    value: "Coco plugs",
  },
];

export const wateringType = [
  { label: `${getTranslation("global.manual")}`, value: "Manual" },
  { label: `${getTranslation("global.automatic")}`, value: "Automatic" },
];

export const zoneSystemType = [
  {
    label: `${getTranslation(
      "farm.createFarm.polyhouse.zone.systemType.NFTsystem"
    )}`,
    value: "NFT system",
  },
  {
    label: `${getTranslation(
      "farm.createFarm.polyhouse.zone.systemType.troughSystem"
    )}`,
    value: "Trough system",
  },
  {
    label: `${getTranslation(
      "farm.createFarm.polyhouse.zone.systemType.raftSystem"
    )}`,
    value: "Raft system",
  },
  {
    label: `${getTranslation(
      "farm.createFarm.polyhouse.zone.systemType.dutchBucketSystem"
    )}`,
    value: "Dutch bucket system",
  },
];
