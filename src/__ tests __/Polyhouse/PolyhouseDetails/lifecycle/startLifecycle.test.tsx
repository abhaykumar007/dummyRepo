/* eslint-disable @typescript-eslint/no-explicit-any */
import * as reduxHooks from "@/hooks/redux";
import StartLifeCycle from "@/pages/polyhouse/polyhouseDetails/Components/LifeCycle/startLifeCycle";
import { getTranslation } from "@/translation/i18n";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useParams } from "react-router-dom";
import { setupDefaultStore } from "../../../utils/setupTests";
import { renderWithProvider } from "../../../utils/testUtils";
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
      updatedDate: "2024-09-17T05:16:55.419Z",
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
          outboundQty: 33,
          qty: 177,
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
            {
              qty: 10,
              movement: -1,
              date: "2024-09-17T05:16:17.581Z",
            },
            {
              qty: 10,
              movement: -1,
              date: "2024-09-17T05:16:43.532Z",
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
          actualEndDate: "2024-09-17T05:16:49.720Z",
          inboundQty: 33,
          outboundQty: 33,
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
            {
              qty: 10,
              movement: 1,
              date: "2024-09-17T05:16:17.581Z",
            },
            {
              qty: 10,
              movement: -1,
              date: "2024-09-17T05:16:23.018Z",
            },
            {
              qty: 10,
              movement: 1,
              date: "2024-09-17T05:16:43.532Z",
            },
            {
              qty: 10,
              movement: -1,
              date: "2024-09-17T05:16:49.720Z",
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
          inboundQty: 33,
          outboundQty: 10,
          qty: 0,
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
            {
              qty: 10,
              movement: 1,
              date: "2024-09-17T05:16:23.018Z",
            },
            {
              qty: 11,
              movement: -1,
              date: "2024-09-17T05:16:34.206Z",
            },
            {
              qty: 10,
              movement: 1,
              date: "2024-09-17T05:16:49.720Z",
            },
            {
              qty: 10,
              movement: -1,
              date: "2024-09-17T05:16:55.419Z",
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
        {
          batchNo: "NEW-202409170509",
          qty: 10,
          mortalityQty: 0,
          outboundQty: 11,
          createdDate: "2024-09-17T05:16:34.194Z",
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
        },
        {
          batchNo: "NEW-202409170509",
          qty: 10,
          mortalityQty: 0,
          outboundQty: 10,
          createdDate: "2024-09-17T05:16:55.409Z",
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

const harvestCropData = [
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
    updatedDate: "2024-09-18T05:08:01.855Z",
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
        outboundQty: 34,
        qty: 176,
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
          {
            qty: 10,
            movement: -1,
            date: "2024-09-17T05:16:17.581Z",
          },
          {
            qty: 10,
            movement: -1,
            date: "2024-09-17T05:16:43.532Z",
          },
          {
            qty: 1,
            movement: -1,
            date: "2024-09-18T05:07:59.010Z",
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
        actualEndDate: "2024-09-18T05:08:01.855Z",
        inboundQty: 34,
        outboundQty: 34,
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
          {
            qty: 10,
            movement: 1,
            date: "2024-09-17T05:16:17.581Z",
          },
          {
            qty: 10,
            movement: -1,
            date: "2024-09-17T05:16:23.018Z",
          },
          {
            qty: 10,
            movement: 1,
            date: "2024-09-17T05:16:43.532Z",
          },
          {
            qty: 10,
            movement: -1,
            date: "2024-09-17T05:16:49.720Z",
          },
          {
            qty: 1,
            movement: 1,
            date: "2024-09-18T05:07:59.010Z",
          },
          {
            qty: 1,
            movement: -1,
            date: "2024-09-18T05:08:01.855Z",
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
        inboundQty: 34,
        outboundQty: 10,
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
          {
            qty: 10,
            movement: 1,
            date: "2024-09-17T05:16:23.018Z",
          },
          {
            qty: 11,
            movement: -1,
            date: "2024-09-17T05:16:34.206Z",
          },
          {
            qty: 10,
            movement: 1,
            date: "2024-09-17T05:16:49.720Z",
          },
          {
            qty: 10,
            movement: -1,
            date: "2024-09-17T05:16:55.419Z",
          },
          {
            qty: 1,
            movement: 1,
            date: "2024-09-18T05:08:01.855Z",
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
      {
        batchNo: "NEW-202409170509",
        qty: 10,
        mortalityQty: 0,
        outboundQty: 11,
        createdDate: "2024-09-17T05:16:34.194Z",
        createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
      },
      {
        batchNo: "NEW-202409170509",
        qty: 10,
        mortalityQty: 0,
        outboundQty: 10,
        createdDate: "2024-09-17T05:16:55.409Z",
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
];

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
    (useParams as jest.Mock).mockReturnValue({
      polyhouseId: "ple11ad963",
      lifeCycleId: "wf8890f54d",
    });
  });

  test("should render the component correctly", () => {
    renderWithProvider(<StartLifeCycle />, { store });

    expect(screen.getByText("Life cycle new")).toBeInTheDocument();

    expect(screen.getAllByText("Germination")).toHaveLength(2);
    expect(screen.getAllByText("Flowering/Fruiting")).toHaveLength(2);
    expect(screen.getAllByText("Harvest")).toHaveLength(2);

    expect(
      screen.getByRole("button", {
        name: getTranslation(
          "polyhouse.polyhouseDetails.lifecycle.lifeCycleComplete"
        ),
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Move to Flowering/Fruiting",
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId("lifeCycle-close-icon")).toBeInTheDocument();
    expect(screen.getByText("177")).toBeInTheDocument();
    expect(
      screen.getByText(
        getTranslation("polyhouse.polyhouseDetails.lifecycle.stageDetails")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        getTranslation("polyhouse.polyhouseDetails.lifecycle.stageHistory")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        getTranslation("polyhouse.polyhouseDetails.lifecycle.harvestedBatches")
      )
    ).toBeInTheDocument();
  });

  test("should navigate to lifecycle route on close icon click", async () => {
    renderWithProvider(<StartLifeCycle />, { store });

    await userEvent.click(screen.getByTestId("lifeCycle-close-icon"));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test("should render stage details", async () => {
    renderWithProvider(<StartLifeCycle />, { store });

    expect(screen.getByText("177")).toBeInTheDocument();
    expect(screen.getByText("210")).toBeInTheDocument();
    expect(screen.getByText("33")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("September 11th 2024")).toBeInTheDocument();
    expect(
      screen.getByText("September 11th 2024 02:42:43 PM")
    ).toBeInTheDocument();
    expect(screen.getByText("10 Days")).toBeInTheDocument();
    expect(
      screen.getByText("September 21st 2024 02:42:43 PM")
    ).toBeInTheDocument();
  });

  test("Complete lifecycle process", async () => {
    renderWithProvider(<StartLifeCycle />, { store });

    await userEvent.click(
      screen.getByRole("button", {
        name: getTranslation(
          "polyhouse.polyhouseDetails.lifecycle.lifeCycleComplete"
        ),
      })
    );

    expect(
      screen.getByText(getTranslation("global.areYouSure"))
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        getTranslation(
          "polyhouse.polyhouseDetails.lifecycle.lifeCycleCompleteMsg"
        )
      )
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", {
        name: "OK",
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      PolyhouseActions.lifeCycleCompleted({
        polyhouseId: "ple11ad963",
        workflowInstancesId: "wf8890f54d",
        handleModalClose: expect.any(Function),
      })
    );
  });

  test("Complete lifecycle process loading", async () => {
    store.getState().requesting[PolyhouseActions.LIFECYCLE_COMPLETED] = true;

    renderWithProvider(<StartLifeCycle />, { store });

    await userEvent.click(
      screen.getByRole("button", {
        name: getTranslation(
          "polyhouse.polyhouseDetails.lifecycle.lifeCycleComplete"
        ),
      })
    );

    expect(
      screen.getByRole("button", { name: /loading OK/i })
    ).toBeInTheDocument();
  });

  test("Move crop to different stage process", async () => {
    renderWithProvider(<StartLifeCycle />, { store });

    await userEvent.click(
      screen.getByRole("button", {
        name: "Move to Flowering/Fruiting",
      })
    );

    expect(
      screen.getByText("Move crops from Germination to Flowering/Fruiting")
    ).toBeInTheDocument();

    const outboundQtyInput = screen.getByTestId("outbound-qty");
    await userEvent.type(outboundQtyInput, "10");

    const mortalityQtyInput = screen.getByTestId("mortality-qty");
    await userEvent.type(mortalityQtyInput, "10");

    await userEvent.click(
      screen.getByRole("button", {
        name: "OK",
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      PolyhouseActions.moveCropStepInLifeCycle({
        polyhouseId: "ple11ad963",
        workflowInstancesId: "wf8890f54d",
        handleModalClose: expect.any(Function),
        stepId: "lT8PtLRTiphIy5GXztbIF",
        payload: {
          mortalityQty: 10,
          outboundQty: 110,
          moveDate: "2024-10-08T08:14:02.456Z",
        },
      })
    );
  });

  test("Move crop to different stage process loading", async () => {
    store.getState().requesting[PolyhouseActions.MOVE_CROPS_IN_LIFECYCLE] =
      true;

    renderWithProvider(<StartLifeCycle />, { store });

    await userEvent.click(
      screen.getByRole("button", {
        name: "Move to Flowering/Fruiting",
      })
    );

    expect(
      screen.getByText("Move crops from Germination to Flowering/Fruiting")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /loading OK/i })
    ).toBeInTheDocument();
  });

  test("Harvest crop process", async () => {
    store.getState().polyhouses.lifeCycles = harvestCropData;

    renderWithProvider(<StartLifeCycle />, { store });

    await userEvent.click(
      screen.getByRole("button", {
        name: "Harvest batch",
      })
    );

    expect(screen.getByText("Create a new batch")).toBeInTheDocument();

    expect(screen.getByTestId("harvest-outbound-qty")).toBeInTheDocument();
    expect(screen.getByTestId("harvest-mortality-qty")).toBeInTheDocument();
    expect(screen.getByTestId("harvest-qty")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", {
        name: "OK",
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      PolyhouseActions.harvestCropsInLifeCycle({
        polyhouseId: "ple11ad963",
        workflowInstancesId: "wf8890f54d",
        handleModalClose: expect.any(Function),
        stepId: "VDFpsLPl04FV66CRZO51d",
        payload: {
          mortalityQty: 0,
          outboundQty: 1,
          qty: 1,
          harvestDate: "2024-10-08T08:14:02.456Z",
        },
      })
    );
  });

  test("Harvest crop process loading", async () => {
    store.getState().polyhouses.lifeCycles = harvestCropData;
    store.getState().requesting[PolyhouseActions.HARVEST_CROPS_IN_LIFECYCLE] =
      true;

    renderWithProvider(<StartLifeCycle />, { store });

    await userEvent.click(
      screen.getByRole("button", {
        name: "Harvest batch",
      })
    );

    expect(screen.getByText("Create a new batch")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /loading OK/i })
    ).toBeInTheDocument();
  });

  test("should render stage history list", async () => {
    renderWithProvider(<StartLifeCycle />, { store });

    await userEvent.click(
      screen.getByRole("button", {
        name: getTranslation(
          "polyhouse.polyhouseDetails.lifecycle.stageHistory"
        ),
      })
    );

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Units")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getAllByText("September 11th 2024 02:42:43 PM")).toHaveLength(
      2
    );
    expect(screen.getAllByText("210")).toHaveLength(2);
    expect(
      screen.getByText("210 units were moved in to Germination")
    ).toBeInTheDocument();
  });

  test("should render harvest batches list", async () => {
    renderWithProvider(<StartLifeCycle />, { store });

    await userEvent.click(
      screen.getByRole("button", {
        name: getTranslation(
          "polyhouse.polyhouseDetails.lifecycle.harvestedBatches"
        ),
      })
    );

    expect(
      screen.getByText(
        getTranslation("polyhouse.polyhouseDetails.lifecycle.batchName")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        getTranslation("polyhouse.polyhouseDetails.lifecycle.harvestedUnits")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        getTranslation("polyhouse.polyhouseDetails.lifecycle.cropUsed")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        getTranslation("polyhouse.polyhouseDetails.lifecycle.harvestedDate")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        getTranslation("polyhouse.polyhouseDetails.lifecycle.cropMortality")
      )
    ).toBeInTheDocument();

    expect(screen.getByText("NEW-202409110909")).toBeInTheDocument();
    expect(screen.getAllByText("1 kg")).toHaveLength(3);
    expect(screen.getAllByText("0 Units")).toHaveLength(5);
    expect(
      screen.getByText("September 11th 2024 03:11:41 PM")
    ).toBeInTheDocument();
    expect(screen.getAllByText("10 Units")).toHaveLength(2);
  });

  test("should render error state at the time of request life cycle", () => {
    store.getState().error[
      PolyhouseActions.REQUEST_LIFE_CYCLE_FOR_POLYHOUSE_FINISHED
    ] = {
      errors: [{ message: "Error occurred" }],
    };

    renderWithProvider(<StartLifeCycle />, { store });

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("should render error state at the time of request complete life cycle process", async () => {
    store.getState().error[PolyhouseActions.LIFECYCLE_COMPLETED_FINISHED] = {
      errors: [{ message: "Error occurred" }],
    };

    renderWithProvider(<StartLifeCycle />, { store });

    await userEvent.click(
      screen.getByRole("button", {
        name: getTranslation(
          "polyhouse.polyhouseDetails.lifecycle.lifeCycleComplete"
        ),
      })
    );

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("should render error state at the time of request complete life cycle process", async () => {
    store.getState().error[PolyhouseActions.MOVE_CROPS_IN_LIFECYCLE_FINISHED] =
      {
        errors: [{ message: "Error occurred" }],
      };

    renderWithProvider(<StartLifeCycle />, { store });

    await userEvent.click(
      screen.getByRole("button", {
        name: "Move to Flowering/Fruiting",
      })
    );

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("should render error state at the time of request harvest crop process", async () => {
    store.getState().polyhouses.lifeCycles = [
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
        updatedDate: "2024-09-18T05:08:01.855Z",
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
            outboundQty: 34,
            qty: 176,
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
              {
                qty: 10,
                movement: -1,
                date: "2024-09-17T05:16:17.581Z",
              },
              {
                qty: 10,
                movement: -1,
                date: "2024-09-17T05:16:43.532Z",
              },
              {
                qty: 1,
                movement: -1,
                date: "2024-09-18T05:07:59.010Z",
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
            actualEndDate: "2024-09-18T05:08:01.855Z",
            inboundQty: 34,
            outboundQty: 34,
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
              {
                qty: 10,
                movement: 1,
                date: "2024-09-17T05:16:17.581Z",
              },
              {
                qty: 10,
                movement: -1,
                date: "2024-09-17T05:16:23.018Z",
              },
              {
                qty: 10,
                movement: 1,
                date: "2024-09-17T05:16:43.532Z",
              },
              {
                qty: 10,
                movement: -1,
                date: "2024-09-17T05:16:49.720Z",
              },
              {
                qty: 1,
                movement: 1,
                date: "2024-09-18T05:07:59.010Z",
              },
              {
                qty: 1,
                movement: -1,
                date: "2024-09-18T05:08:01.855Z",
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
            inboundQty: 34,
            outboundQty: 10,
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
              {
                qty: 10,
                movement: 1,
                date: "2024-09-17T05:16:23.018Z",
              },
              {
                qty: 11,
                movement: -1,
                date: "2024-09-17T05:16:34.206Z",
              },
              {
                qty: 10,
                movement: 1,
                date: "2024-09-17T05:16:49.720Z",
              },
              {
                qty: 10,
                movement: -1,
                date: "2024-09-17T05:16:55.419Z",
              },
              {
                qty: 1,
                movement: 1,
                date: "2024-09-18T05:08:01.855Z",
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
          {
            batchNo: "NEW-202409170509",
            qty: 10,
            mortalityQty: 0,
            outboundQty: 11,
            createdDate: "2024-09-17T05:16:34.194Z",
            createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          },
          {
            batchNo: "NEW-202409170509",
            qty: 10,
            mortalityQty: 0,
            outboundQty: 10,
            createdDate: "2024-09-17T05:16:55.409Z",
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
    ];

    store.getState().error[
      PolyhouseActions.HARVEST_CROPS_IN_LIFECYCLE_FINISHED
    ] = {
      errors: [{ message: "Error occurred" }],
    };

    renderWithProvider(<StartLifeCycle />, { store });

    await userEvent.click(
      screen.getByRole("button", {
        name: "Harvest batch",
      })
    );

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });
});
