/* eslint-disable @typescript-eslint/no-explicit-any */
import * as reduxHooks from "@/hooks/redux";
import AddLifeCycle from "@/pages/polyhouse/polyhouseDetails/Components/LifeCycle/AddLifeCycle";
import WorkflowActions from "@/redux/workflow/actions";
import { getTranslation } from "@/translation/i18n";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { useParams } from "react-router-dom";
import { setupDefaultStore } from "../../../utils/setupTests";
import { renderWithProvider } from "../../../utils/testUtils";
import userEvent from "@testing-library/user-event";
import PolyhouseActions from "@/redux/polyhouse/action";

const dummyFarms = {
  farms: {
    entities: {
      farms: {
        fm5e2d43ef: {
          farmId: "fm5e2d43ef",
          id: "667144a7b616e5e13c7ab512",
          organisationId: "or63bcc3a4",
          name: "Dummy Farm 123",
          area: 600,
          cultivableArea: 600,
          location: {
            address: "Pune",
            lat: 1.24,
            long: 1.24,
          },
          polyhouses: [
            {
              polyhouseId: "ple11ad963",
              name: "dummy polyhouse",
              structureExpectedLife: 6,
              plasticExpectedLife: 2,
              zones: [
                {
                  name: "zone 1",
                  zoneId: "zn41f063fb",
                  systemType: "Trough system",
                  area: 678,
                  growingArea: {
                    wateringType: "Manual",
                    wateringSchedule: "7",
                    area: 78,
                    rowCount: 87,
                    plantCountPerRow: 7,
                    plantSpacing: 7,
                    rowSpacing: 78,
                  },
                  createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                  updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                  createdDate: "2024-08-05T06:30:50.251Z",
                  updatedDate: "2024-08-05T06:30:50.251Z",
                },
              ],
              nurseries: [
                {
                  nurseryId: "nub4cde909",
                  name: "Nursery 1",
                  type: "Closed dome (humidity control)",
                  wateringType: "Manual",
                  wateringSchedule: "787",
                  germinationType: "Oasis cubies",
                  area: 78,
                  seedCount: 7,
                  germinationArea: 7,
                  createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                  updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                  createdDate: "2024-08-05T06:30:50.251Z",
                  updatedDate: "2024-08-05T06:30:50.251Z",
                },
              ],
              createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              createdDate: "2024-08-05T06:30:50.251Z",
              updatedDate: "2024-08-05T06:30:50.251Z",
            },
          ],
          reservoirs: [],
          nutrient: {
            type: "3 Part mix",
            dilutionRatio: {
              numerator: 2,
              denominator: 3,
            },
          },
          device: null,
          state: "DRAFT",
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          createdDate: "2024-06-18T08:26:15.093Z",
          updatedDate: "2024-07-02T10:43:30.291Z",
        },
      },
    },
    result: ["fm5e2d43ef"],
  },
  selectedFarmId: "fm5e2d43ef",
};

const dummyWorkflows = {
  workflows: {
    entities: {
      workflows: {
        wf94bea51b: {
          id: "66e40407d05e5e1221924bb8",
          workflowId: "wf94bea51b",
          description: "testing",
          name: "Workflow with harvest",
          organisationId: "or63bcc3a4",
          workflowSteps: [
            {
              name: "Germination",
              stepId: "63f97a12-73a1-4ea8-92d2-f494976f16b7",
              parentId: null,
              description: "",
              sequence: 1,
            },
            {
              name: "Nursery",
              stepId: "a006ec8d-cb07-433d-b5a9-8ea2b0568768",
              parentId: "63f97a12-73a1-4ea8-92d2-f494976f16b7",
              description: "",
              sequence: 2,
            },
            {
              name: "Vegetative",
              stepId: "fd97403b-0069-4bf9-8623-54431c251419",
              parentId: "a006ec8d-cb07-433d-b5a9-8ea2b0568768",
              description: "",
              sequence: 3,
            },
          ],
          isInbuilt: true,
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          createdDate: "2024-09-13T09:21:11.465Z",
          updatedDate: "2024-09-13T09:21:29.314Z",
        },
        wf949642a4: {
          id: "66e19cce3b9efcc0f990dcd6",
          workflowId: "wf949642a4",
          description: "",
          name: "New ID Workflow",
          organisationId: "or63bcc3a4",
          workflowSteps: [
            {
              name: "Germination",
              stepId: "b8868c66-fe95-4cb5-9315-0195e96b8c26",
              parentId: null,
              description: "",
              sequence: 1,
            },
            {
              name: "Vegetative",
              stepId: "4cb7fce3-6319-402f-9e4a-d16b1edb9b02",
              parentId: "b8868c66-fe95-4cb5-9315-0195e96b8c26",
              description: "",
              sequence: 3,
            },
            {
              name: "Harvest",
              stepId: "8edd11b1-3d6c-4e50-80ef-8d326001d9e0",
              parentId: "4cb7fce3-6319-402f-9e4a-d16b1edb9b02",
              description: "",
              sequence: 5,
            },
          ],
          isInbuilt: true,
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          createdDate: "2024-09-11T13:36:14.239Z",
          updatedDate: "2024-09-11T13:36:14.239Z",
        },
        wffb5a0ac5: {
          id: "66e19b2b3b9efcc0f990dcd5",
          workflowId: "wffb5a0ac5",
          description: "",
          name: "New Workflow",
          organisationId: "or63bcc3a4",
          workflowSteps: [
            {
              name: "Germination",
              stepId: "7b052823-5ab8-4474-88fd-86310e4c7ef9",
              parentId: null,
              description: "",
              sequence: 1,
            },
            {
              name: "Nursery",
              stepId: "05121f3c-3d0e-4a74-a885-0dffaadce3ab",
              parentId: "7b052823-5ab8-4474-88fd-86310e4c7ef9",
              description: "",
              sequence: 2,
            },
            {
              name: "Vegetative",
              stepId: "9487c106-9285-4fe2-a63d-888984c262bd",
              parentId: "05121f3c-3d0e-4a74-a885-0dffaadce3ab",
              description: "",
              sequence: 3,
            },
            {
              name: "Flowering/Fruiting",
              stepId: "05169931-c61f-47f1-a15b-24a377449ba7",
              parentId: "9487c106-9285-4fe2-a63d-888984c262bd",
              description: "",
              sequence: 4,
            },
            {
              name: "Harvest",
              stepId: "49e980eb-d1d8-47c3-ac82-e27c0d2929fd",
              parentId: "05169931-c61f-47f1-a15b-24a377449ba7",
              description: "",
              sequence: 5,
            },
          ],
          isInbuilt: true,
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          createdDate: "2024-09-11T13:29:15.769Z",
          updatedDate: "2024-09-11T13:29:15.769Z",
        },
        wf875b53da: {
          id: "66e19b103b9efcc0f990dcd4",
          workflowId: "wf875b53da",
          description: "",
          name: "New Workflow",
          organisationId: "or63bcc3a4",
          workflowSteps: [
            {
              name: "Germination",
              stepId: "SRf92R3LlBeawKId2Ux16",
              parentId: null,
              description: "",
              sequence: 1,
            },
            {
              name: "Nursery",
              stepId: "FFkX5R5uDg8gesO2Or43J",
              parentId: "SRf92R3LlBeawKId2Ux16",
              description: "",
              sequence: 2,
            },
            {
              name: "Vegetative",
              stepId: "P5I7Ld-cNcgXw9lQOdcap",
              parentId: "FFkX5R5uDg8gesO2Or43J",
              description: "",
              sequence: 3,
            },
            {
              name: "Flowering/Fruiting",
              stepId: "v6lA3l8WLZwzzvcABkYD3",
              parentId: "P5I7Ld-cNcgXw9lQOdcap",
              description: "",
              sequence: 4,
            },
            {
              name: "Harvest",
              stepId: "k0AOj5lFRcaZcgK3KH50R",
              parentId: "v6lA3l8WLZwzzvcABkYD3",
              description: "",
              sequence: 5,
            },
          ],
          isInbuilt: true,
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          createdDate: "2024-09-11T13:28:48.410Z",
          updatedDate: "2024-09-11T13:28:48.410Z",
        },
      },
    },
    result: ["wf94bea51b", "wf949642a4", "wffb5a0ac5", "wf875b53da"],
  },
};

const dummyPolyhouse = {
  polyhouses: null,
  selectedPolyhouse: {
    polyhouseId: "ple11ad963",
    name: "dummy polyhouse",
    structureExpectedLife: 6,
    plasticExpectedLife: 2,
    zones: [
      {
        name: "zone 1",
        zoneId: "zn41f063fb",
        systemType: "NFT system",
        area: 678,
        growingArea: {
          wateringType: "Manual",
          wateringSchedule: "7",
          area: 78,
          rowCount: 87,
          plantCountPerRow: 7,
          plantSpacing: 7,
          rowSpacing: 78,
        },
        createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
        updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
        createdDate: "2024-08-05T06:30:50.251Z",
        updatedDate: "2024-08-05T06:30:50.251Z",
      },
    ],
    nurseries: [
      {
        nurseryId: "nub4cde909",
        name: "Nursery 1",
        type: "Open (no humidity control)",
        wateringType: "Manual",
        wateringSchedule: "787",
        germinationType: "Tray with coco peat",
        area: 78,
        seedCount: 7,
        germinationArea: 7,
        createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
        updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
        createdDate: "2024-08-05T06:30:50.251Z",
        updatedDate: "2024-08-05T06:30:50.251Z",
      },
    ],
    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
    createdDate: "2024-08-05T06:30:50.251Z",
    updatedDate: "2024-08-05T06:30:50.251Z",
  },
  lifeCycles: [
    {
      id: "66e15eb7786eddfee4bbe0c0",
      name: "Life cycle new",
      description: "",
      workflowInstanceId: "wf8890f54d",
      inventoryId: "668e2232c9e5711d505b7bf4",
      organisationId: "or63bcc3a4",
      farmId: "fm0a0a202e",
      polyhouseId: "ple678ea55",
      batchPrefix: "NEW",
      completedBy: null,
      startedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
      createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
      updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
      qty: 210,
      startedOn: "2024-09-11T09:12:43.539Z",
      createdDate: "2024-09-11T09:11:19.793Z",
      updatedDate: "2024-09-13T06:40:39.437Z",
      completedOn: null,
      workflowInstanceSteps: [
        {
          name: "Germination",
          stepId: "lT8PtLRTiphIy5GXztbIF",
          parentId: null,
          description: null,
          sequence: 1,
          duration: 10,
          startDate: "2024-09-11T09:12:43.542Z",
          actualStartDate: "2024-09-11T09:12:43.542Z",
          endDate: "2024-09-21T09:12:43.540Z",
          actualEndDate: null,
          inboundQty: 210,
          outboundQty: 13,
          qty: 197,
          mortalityQty: 0,
          status: null,
          zoneId: null,
          nurseryId: "nu975f7d63",
          workflowInstanceStepLogs: [
            {
              qty: 210,
              movement: 1,
              date: "2024-09-11T09:12:43.542Z",
            },
            {
              qty: 10,
              movement: -1,
              date: "2024-09-11T09:28:30.262Z",
            },
            {
              qty: 1,
              movement: -1,
              date: "2024-09-12T05:49:35.317Z",
            },
            {
              qty: 1,
              movement: -1,
              date: "2024-09-12T06:29:21.731Z",
            },
            {
              qty: 1,
              movement: -1,
              date: "2024-09-13T06:40:37.111Z",
            },
          ],
        },
        {
          name: "Flowering/Fruiting",
          stepId: "Z1oZxlDbkaYJo-IVhqwlr",
          parentId: "lT8PtLRTiphIy5GXztbIF",
          description: null,
          sequence: 4,
          duration: 150,
          startDate: "2024-09-22T09:12:43.540Z",
          actualStartDate: "2024-09-11T09:28:30.262Z",
          endDate: "2025-02-19T09:12:43.540Z",
          actualEndDate: "2024-09-13T06:40:39.437Z",
          inboundQty: 13,
          outboundQty: 13,
          qty: 0,
          mortalityQty: 0,
          status: null,
          zoneId: "zn8d384562",
          nurseryId: null,
          workflowInstanceStepLogs: [
            {
              qty: 10,
              movement: 1,
              date: "2024-09-11T09:28:30.262Z",
            },
            {
              qty: 10,
              movement: -1,
              date: "2024-09-11T09:28:40.945Z",
            },
            {
              qty: 1,
              movement: 1,
              date: "2024-09-12T05:49:35.317Z",
            },
            {
              qty: 1,
              movement: -1,
              date: "2024-09-12T05:49:38.172Z",
            },
            {
              qty: 1,
              movement: 1,
              date: "2024-09-12T06:29:21.731Z",
            },
            {
              qty: 1,
              movement: -1,
              date: "2024-09-13T06:40:25.790Z",
            },
            {
              qty: 1,
              movement: 1,
              date: "2024-09-13T06:40:37.111Z",
            },
            {
              qty: 1,
              movement: -1,
              date: "2024-09-13T06:40:39.437Z",
            },
          ],
        },
        {
          name: "Harvest",
          stepId: "VDFpsLPl04FV66CRZO51d",
          parentId: "Z1oZxlDbkaYJo-IVhqwlr",
          description: null,
          sequence: 5,
          duration: 180,
          startDate: "2025-02-19T09:12:43.540Z",
          actualStartDate: "2024-09-11T09:28:40.945Z",
          endDate: "2025-08-18T09:12:43.540Z",
          actualEndDate: null,
          inboundQty: 13,
          outboundQty: 1,
          qty: 1,
          mortalityQty: 10,
          status: null,
          zoneId: "zn8d384562",
          nurseryId: null,
          workflowInstanceStepLogs: [
            {
              qty: 10,
              movement: 1,
              date: "2024-09-11T09:28:40.945Z",
            },
            {
              qty: 10,
              movement: 0,
              date: "2024-09-11T09:41:41.408Z",
            },
            {
              qty: 1,
              movement: 1,
              date: "2024-09-12T05:49:38.172Z",
            },
            {
              qty: 1,
              movement: -1,
              date: "2024-09-12T05:49:40.882Z",
            },
            {
              qty: 1,
              movement: 1,
              date: "2024-09-13T06:40:25.790Z",
            },
            {
              qty: 1,
              movement: -1,
              date: "2024-09-13T06:40:28.918Z",
            },
            {
              qty: 1,
              movement: 1,
              date: "2024-09-13T06:40:39.437Z",
            },
          ],
        },
      ],
      status: "RUNNING",
      isCompleted: false,
      unit: "KG",
      batches: [
        {
          batchNo: "NEW-202409110909",
          qty: 1,
          mortalityQty: 10,
          outboundQty: 0,
          createdDate: "2024-09-11T09:41:41.399Z",
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
        },
        {
          batchNo: "NEW-202409120509",
          qty: 1,
          mortalityQty: 0,
          outboundQty: 1,
          createdDate: "2024-09-12T05:49:40.869Z",
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
        },
        {
          batchNo: "NEW-202409130609",
          qty: 1,
          mortalityQty: 0,
          outboundQty: 1,
          createdDate: "2024-09-13T06:40:28.910Z",
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
        },
      ],
      inventory: {
        id: "668e2232c9e5711d505b7bf4",
        productId: "6579d8bc026c967a135f49cd",
        farmId: "fm0a0a202e",
        description: "",
        provider: "testyy",
        cost: null,
        time: null,
        quantity: 110,
        used: 698,
        wastage: 0,
        createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
        updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
        createdDate: "2024-07-10T05:54:58.882Z",
        updatedDate: "2024-09-13T11:41:55.514Z",
        files: [],
        product: {
          id: "6579d8bc026c967a135f49cd",
          subCategoryId: "65dcc0591e82ab3fc6d9d768",
          name: "Baby Spinach",
          unit: "nos",
          properties: null,
          isAdminApproved: true,
          createdBy: "+918530484193",
          updatedBy: "+918530484193",
          createdDate: "2023-12-13T16:15:56.339Z",
          updatedDate: "2023-12-13T16:15:56.339Z",
        },
      },
    },
  ],
};

const dummySubCategories = {
  subCategories: {
    entities: {
      subCategories: {
        "65dcc0591e82ab3fc6d9d768": {
          subCategoryId: "65dcc0591e82ab3fc6d9d768",
          productCategoryId: "6578b98aade8930415fc0483",
          name: "Seeds",
          description: "This is Seeds",
          units: ["Nos"],
          products: [
            {
              id: "6578b9f2ade8930415fc0484",
              subCategoryId: "65dcc0591e82ab3fc6d9d768",
              name: "Basil",
              unit: "nos",
              properties: null,
              isAdminApproved: true,
              createdBy: "+918530484193",
              updatedBy: "+918530484193",
              createdDate: "2023-12-12T19:52:18.660Z",
              updatedDate: "2023-12-12T19:52:18.660Z",
            },
            {
              id: "6579d7f5026c967a135f49c7",
              subCategoryId: "65dcc0591e82ab3fc6d9d768",
              name: "Bell pepper",
              unit: "nos",
              properties: null,
              isAdminApproved: true,
              createdBy: "+918530484193",
              updatedBy: "+918530484193",
              createdDate: "2023-12-13T16:12:37.319Z",
              updatedDate: "2023-12-13T16:12:37.319Z",
            },
            {
              id: "6579d8a0026c967a135f49cc",
              subCategoryId: "65dcc0591e82ab3fc6d9d768",
              name: "Rosemary",
              unit: "nos",
              properties: null,
              isAdminApproved: true,
              createdBy: "+918530484193",
              updatedBy: "+918530484193",
              createdDate: "2023-12-13T16:15:28.538Z",
              updatedDate: "2023-12-13T16:15:28.538Z",
            },
            {
              id: "6579d8bc026c967a135f49cd",
              subCategoryId: "65dcc0591e82ab3fc6d9d768",
              name: "Baby Spinach",
              unit: "nos",
              properties: null,
              isAdminApproved: true,
              createdBy: "+918530484193",
              updatedBy: "+918530484193",
              createdDate: "2023-12-13T16:15:56.339Z",
              updatedDate: "2023-12-13T16:15:56.339Z",
            },
          ],
          createdBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
          updatedBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
          createdDate: "2024-02-26T16:46:15.674Z",
          updatedDate: "2024-02-26T16:46:15.674Z",
        },
      },
    },
    result: ["65dcc0591e82ab3fc6d9d768"],
  },
};

const dummyInventories = {
  inventories: {
    entities: {
      inventories: {
        "668e2232c9e5711d505b7bf4": {
          inventoryId: "668e2232c9e5711d505b7bf4",
          productId: "6579d8bc026c967a135f49cd",
          name: "Baby Spinach",
          prduct: {
            name: "Baby Spinach",
            units: "nos",
          },
          farmId: "fm0a0a202e",
          description: "",
          provider: "testyy",
          quantity: 110,
          cost: null,
          time: null,
          unit: "nos",
          used: 698,
          wastage: 0,
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          createdDate: "2024-07-10T05:54:58.882Z",
          updatedDate: "2024-09-13T11:41:55.514Z",
        },
      },
    },
    result: ["668e2232c9e5711d505b7bf4"],
  },
};

jest.mock("@/utilities/toast", () => ({
  errorToast: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

const mockDispatch = jest.fn();
jest.spyOn(reduxHooks, "useAppDispatch").mockReturnValue(mockDispatch);

describe("Add Update lifecycle page", () => {
  let store: any;

  let consoleErrorMock: any;
  let consoleWarnMock: any;
  beforeAll(() => {
    consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {
      return;
    });
    consoleWarnMock = jest.spyOn(console, "warn").mockImplementation(() => {
      return;
    });
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
    consoleWarnMock.mockRestore();
  });

  beforeEach(() => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      workflows: { ...dummyWorkflows },
    });
    (useParams as jest.Mock).mockReturnValue({ polyhouseId: "ple11ad963" });
  });

  test("should render the component correctly", () => {
    renderWithProvider(<AddLifeCycle />, { store });

    expect(
      screen.getByText(
        getTranslation(
          "polyhouse.polyhouseDetails.lifecycle.chooseWorkflowTemplate"
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: getTranslation(
          "polyhouse.polyhouseDetails.lifecycle.createNewTemplate"
        ),
      })
    ).toBeInTheDocument();
  });

  test("should dispatch the requestWorkflow action on mount", () => {
    store.getState().workflows.workflows = {};

    renderWithProvider(<AddLifeCycle />, { store });

    expect(mockDispatch).toHaveBeenCalledWith(
      WorkflowActions.requestWorkflow()
    );
  });

  test("should open the workflow modal if no lifeCycleId exists", async () => {
    renderWithProvider(<AddLifeCycle />, { store });

    expect(screen.getByTestId("workflow-select")).toBeInTheDocument();

    const workflowSelect =
      screen.getByTestId("workflow-select").firstElementChild;

    if (workflowSelect) {
      await userEvent.click(workflowSelect);
      await userEvent.click(screen.getByText("Workflow with harvest"));
    }

    await userEvent.click(
      screen.getByRole("button", {
        name: getTranslation("global.confirm"),
      })
    );

    const modal = screen.getByText(
      getTranslation("polyhouse.polyhouseDetails.lifecycle.lifeCycleStages")
    );
    expect(modal).toBeInTheDocument();
  });

  test("should click and update the name & description", async () => {
    renderWithProvider(<AddLifeCycle />, { store });

    expect(screen.getByTestId("workflow-select")).toBeInTheDocument();

    const workflowSelect =
      screen.getByTestId("workflow-select").firstElementChild;

    if (workflowSelect) {
      await userEvent.click(workflowSelect);
      await userEvent.click(screen.getByText("Workflow with harvest"));
    }

    await userEvent.click(
      screen.getByRole("button", {
        name: getTranslation("global.confirm"),
      })
    );

    const name = screen.getByText("New Life cycle");
    await userEvent.click(name);
    const input = screen.getByTestId("name-input");
    await userEvent.type(input, "Update Life cycle");
    const saveButton = screen.getByTestId("name-save");
    await userEvent.click(saveButton);

    const description = screen.getByText(
      getTranslation(
        "polyhouse.polyhouseDetails.lifecycle.enterLifeCycleDescription"
      )
    );
    await userEvent.click(description);
    const descriptionInput = screen.getByTestId("description-input");
    await userEvent.type(descriptionInput, "Test Life cycle Description");
    const descriptionSaveButton = screen.getByTestId("description-save");
    await userEvent.click(descriptionSaveButton);
  });

  test("should dispatch addLifeCycle when submit button is clicked", async () => {
    renderWithProvider(<AddLifeCycle />, { store });

    expect(screen.getByTestId("workflow-select")).toBeInTheDocument();

    const workflowSelect =
      screen.getByTestId("workflow-select").firstElementChild;

    if (workflowSelect) {
      await userEvent.click(workflowSelect);
      await userEvent.click(screen.getByText("Workflow with harvest"));
    }

    await userEvent.click(
      screen.getByRole("button", {
        name: getTranslation("global.confirm"),
      })
    );

    const submitButton = screen.getByText(
      getTranslation("polyhouse.polyhouseDetails.lifecycle.createLifeCycle")
    );
    await userEvent.click(submitButton);

    const payload = {
      name: "New Life cycle",
      description: "",
      farmId: "fm5e2d43ef",
      polyhouseId: "ple11ad963",
      workflowInstanceSteps: [
        {
          name: "Germination",
          stepId: "63f97a12-73a1-4ea8-92d2-f494976f16b7",
          parentId: null,
          sequence: 1,
          duration: 1,
        },
        {
          name: "Nursery",
          stepId: "a006ec8d-cb07-433d-b5a9-8ea2b0568768",
          parentId: "63f97a12-73a1-4ea8-92d2-f494976f16b7",
          sequence: 2,
          duration: 1,
        },
        {
          name: "Vegetative",
          stepId: "fd97403b-0069-4bf9-8623-54431c251419",
          parentId: "a006ec8d-cb07-433d-b5a9-8ea2b0568768",
          sequence: 3,
          duration: 1,
        },
      ],
    };

    expect(mockDispatch).toHaveBeenCalledWith(
      PolyhouseActions.addLifeCycle(payload)
    );
  });

  test("should show loading when submit button is clicked", async () => {
    store.getState().requesting[PolyhouseActions.ADD_LIFECYCLE] = true;

    renderWithProvider(<AddLifeCycle />, { store });

    expect(screen.getByTestId("workflow-select")).toBeInTheDocument();

    const workflowSelect =
      screen.getByTestId("workflow-select").firstElementChild;

    if (workflowSelect) {
      await userEvent.click(workflowSelect);
      await userEvent.click(screen.getByText("Workflow with harvest"));
    }

    await userEvent.click(
      screen.getByRole("button", {
        name: getTranslation("global.confirm"),
      })
    );

    expect(
      screen.getByRole("button", { name: /create life cycle/i })
    ).toBeDisabled();
  });

  test("should update the duration & zone/nursery for a particular stage", async () => {
    store.getState().requesting[PolyhouseActions.ADD_LIFECYCLE] = true;

    renderWithProvider(<AddLifeCycle />, { store });

    expect(screen.getByTestId("workflow-select")).toBeInTheDocument();

    const workflowSelect =
      screen.getByTestId("workflow-select").firstElementChild;

    if (workflowSelect) {
      await userEvent.click(workflowSelect);
      await userEvent.click(screen.getByText("Workflow with harvest"));
    }

    await userEvent.click(
      screen.getByRole("button", {
        name: getTranslation("global.confirm"),
      })
    );

    const durationInput = screen.getByTestId("duration-input");
    await userEvent.type(durationInput, "10");

    const configureSelect =
      screen.getByTestId("configure-select").firstElementChild;

    if (configureSelect) {
      await userEvent.click(configureSelect);
      await userEvent.click(screen.getByText("Nursery 1"));
    }
  });

  test("Render updated data of lifecycle", async () => {
    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({
      lifeCycleId: "wf8890f54d",
    });

    store.getState().inventories.subCategories = dummySubCategories;
    store.getState().inventories.inventories = dummyInventories;

    renderWithProvider(<AddLifeCycle />, { store });

    expect(screen.getByText("Life cycle new")).toBeInTheDocument();
    expect(
      screen.getByText(
        getTranslation("polyhouse.polyhouseDetails.lifecycle.startLifeCycle")
      )
    ).toBeInTheDocument();

    expect(screen.getByTestId("crop-select")).toBeInTheDocument();

    // const cropSelect = screen.getByTestId("crop-select").firstElementChild;

    // if (cropSelect) {
    //   await userEvent.click(cropSelect);
    //   await userEvent.click(screen.getByText("Baby Spinach"));
    // }

    const quantityInput = screen.getByTestId("quantity-input");
    await userEvent.type(quantityInput, "10");

    const batchInput = screen.getByTestId("batch-prefix-input");
    await userEvent.type(batchInput, "TEST");

    const batchMeasurementUnitSelect = screen.getByTestId(
      "batch-measurement-unit-select"
    ).firstElementChild;

    if (batchMeasurementUnitSelect) {
      await userEvent.click(batchMeasurementUnitSelect);
      await userEvent.click(screen.getByText("Piece"));
    }

    await userEvent.click(
      screen.getByRole("button", {
        name: getTranslation("global.start"),
      })
    );

    // const payload = {
    //   batchPrefix: "TEST",
    //   inventoryId: "668e2232c9e5711d505b7bf4",
    //   qty: 10,
    //   unit: "Piece",
    // };

    // expect(mockDispatch).toHaveBeenCalledWith(
    //   PolyhouseActions.startLifeCycle({
    //     payload,
    //     workflowInstancesId: "wf8890f54d",
    //     polyhouseId: "ple11ad963",
    //   })
    // );
  });

  test("should render error state at the time of creating life cycle", () => {
    store.getState().error[PolyhouseActions.ADD_LIFECYCLE_FINISHED] = {
      errors: [{ message: "Error occurred" }],
    };

    renderWithProvider(<AddLifeCycle />, { store });

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });
  test("should render error state at the time of updating life cycle", () => {
    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({
      lifeCycleId: "wf8890f54d",
    });

    store.getState().error[PolyhouseActions.UPDATE_LIFECYCLE_FINISHED] = {
      errors: [{ message: "Error occurred" }],
    };

    renderWithProvider(<AddLifeCycle />, { store });

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("should render error state at the time of start life cycle", () => {
    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({
      lifeCycleId: "wf8890f54d",
    });

    store.getState().error[PolyhouseActions.START_LIFECYCLE_FINISHED] = {
      errors: [{ message: "Error occurred" }],
    };

    renderWithProvider(<AddLifeCycle />, { store });

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });
});
