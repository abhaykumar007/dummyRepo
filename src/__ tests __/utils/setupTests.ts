import { LANGUAGE_KEYS } from "@/config/consts";
import { createMockStore } from "./testUtils";

export const setupDefaultStore = (initialState: Record<string, any> = {}) => {
  return createMockStore({
    session: {
      token: null,
      accountApprovalStatus: null,
      currentLanguage: LANGUAGE_KEYS.en,
      details: {},
    },
    requesting: {},
    error: {},
    organizations: {
      organisations: [],
      selectedOrganisationId: null,
    },
    farms: {
      farms: {},
      selectedFarmId: null,
    },
    workflows: {
      workflows: {},
      selectedWorkflow: null,
    },
    polyhouses: {
      spolyhouses: null,
      selectedPolyhouse: null,
      sensorData: null,
      batchCount: null,
      selectedSensorName: null,
      graph: null,
      componentData: null,
      selectedNursery: null,
      nurserySensorData: null,
      nurseryComponentData: null,
      selectedZone: null,
      zoneSensorData: null,
      zoneComponentData: null,
      lifeCycles: null,
    },
    inventories: {
      inventories: {},
      subCategories: {},
    },
    ...initialState,
  });
};
