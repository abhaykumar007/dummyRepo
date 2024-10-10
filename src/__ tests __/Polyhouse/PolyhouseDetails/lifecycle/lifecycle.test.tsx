/* eslint-disable @typescript-eslint/no-explicit-any */
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../../../utils/setupTests";
import { renderWithProvider } from "../../../utils/testUtils";
import { getTranslation } from "@/translation/i18n";
import LifeCycle from "@/pages/polyhouse/polyhouseDetails/Components/LifeCycle";
import { useParams } from "react-router-dom";
import PolyhouseActions from "@/redux/polyhouse/action";
import FarmActions from "@/redux/farm/action";
import userEvent from "@testing-library/user-event";
import routePaths from "@/config/routePaths";

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
      id: "65f170d5a1f83de61bd71f87",
      name: "Trough System ",
      description: "for Cucumbers",
      workflowInstanceId: "wfe81d5e08",
      inventoryId: "65e4b962ffec21df94467b0e",
      organisationId: "or5c4b170e",
      farmId: "fmc999c4e1",
      polyhouseId: "ple11ad963",
      batchPrefix: "cucumber",
      completedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
      startedBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
      createdBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
      updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
      qty: 147,
      startedOn: "2024-03-13T09:27:39.714Z",
      createdDate: "2024-03-13T09:24:37.201Z",
      updatedDate: "2024-05-21T06:55:55.380Z",
      completedOn: "2024-05-21T06:55:55.380Z",
      workflowInstanceSteps: [
        {
          name: "Germination",
          stepId: "oawsGAyNntwgO_WbxbRjc",
          parentId: null,
          description: null,
          sequence: 1,
          duration: 3,
          startDate: "2024-03-13T09:27:39.715Z",
          actualStartDate: "2024-03-13T09:27:39.715Z",
          endDate: "2024-03-16T09:27:39.714Z",
          actualEndDate: "2024-03-13T09:28:08.464Z",
          inboundQty: 147,
          outboundQty: 147,
          qty: 0,
          mortalityQty: 0,
          status: null,
          zoneId: null,
          nurseryId: "nud1534ae1",
          workflowInstanceStepLogs: [
            {
              qty: 147,
              movement: 1,
              date: "2024-03-13T09:27:39.715Z",
            },
            {
              qty: 147,
              movement: -1,
              date: "2024-03-13T09:28:08.464Z",
            },
          ],
        },
        {
          name: "Nursery",
          stepId: "qN6jWd-neKPGr_34dw8BI",
          parentId: "oawsGAyNntwgO_WbxbRjc",
          description: null,
          sequence: 2,
          duration: 12,
          startDate: "2024-03-17T09:27:39.714Z",
          actualStartDate: "2024-03-13T09:28:08.465Z",
          endDate: "2024-03-29T09:27:39.714Z",
          actualEndDate: "2024-03-13T09:28:28.470Z",
          inboundQty: 147,
          outboundQty: 147,
          qty: 0,
          mortalityQty: 0,
          status: null,
          zoneId: null,
          nurseryId: "nud1534ae1",
          workflowInstanceStepLogs: [
            {
              qty: 147,
              movement: 1,
              date: "2024-03-13T09:28:08.465Z",
            },
            {
              qty: 147,
              movement: -1,
              date: "2024-03-13T09:28:28.471Z",
            },
          ],
        },
        {
          name: "Vegetative",
          stepId: "GLVnwxlfhx8ETYTplRHnL",
          parentId: "qN6jWd-neKPGr_34dw8BI",
          description: null,
          sequence: 3,
          duration: 25,
          startDate: "2024-03-29T09:27:39.714Z",
          actualStartDate: "2024-03-13T09:28:28.471Z",
          endDate: "2024-04-23T09:27:39.714Z",
          actualEndDate: "2024-04-01T08:51:46.584Z",
          inboundQty: 147,
          outboundQty: 147,
          qty: 0,
          mortalityQty: 0,
          status: null,
          zoneId: "znc419c6af",
          nurseryId: null,
          workflowInstanceStepLogs: [
            {
              qty: 147,
              movement: 1,
              date: "2024-03-13T09:28:28.471Z",
            },
            {
              qty: 147,
              movement: -1,
              date: "2024-04-01T08:51:46.584Z",
            },
          ],
        },
        {
          name: "Flowering/Fruiting",
          stepId: "d6I6h_LIAGGS6VWhuxntZ",
          parentId: "GLVnwxlfhx8ETYTplRHnL",
          description: null,
          sequence: 4,
          duration: 40,
          startDate: "2024-04-23T09:27:39.714Z",
          actualStartDate: "2024-04-01T08:51:46.585Z",
          endDate: "2024-06-02T09:27:39.714Z",
          actualEndDate: "2024-04-17T08:30:04.642Z",
          inboundQty: 147,
          outboundQty: 145,
          qty: 0,
          mortalityQty: 2,
          status: null,
          zoneId: "znc419c6af",
          nurseryId: null,
          workflowInstanceStepLogs: [
            {
              qty: 147,
              movement: 1,
              date: "2024-04-01T08:51:46.585Z",
            },
            {
              qty: 2,
              movement: 0,
              date: "2024-04-17T08:30:04.642Z",
            },
            {
              qty: 145,
              movement: -1,
              date: "2024-04-17T08:30:04.642Z",
            },
          ],
        },
        {
          name: "Harvest",
          stepId: "OuBOj4lQa7ZDBlo1qAXTu",
          parentId: "d6I6h_LIAGGS6VWhuxntZ",
          description: null,
          sequence: 5,
          duration: 10,
          startDate: "2024-06-02T09:27:39.714Z",
          actualStartDate: "2024-04-17T08:30:04.642Z",
          endDate: "2024-06-12T09:27:39.714Z",
          actualEndDate: null,
          inboundQty: 145,
          outboundQty: 0,
          qty: 145,
          mortalityQty: 0,
          status: null,
          zoneId: "znc419c6af",
          nurseryId: null,
          workflowInstanceStepLogs: [
            {
              qty: 145,
              movement: 1,
              date: "2024-04-17T08:30:04.642Z",
            },
          ],
        },
      ],
      status: "COMPLETED",
      isCompleted: true,
      unit: "KG",
      batches: [],
      inventory: {
        id: "65e4b962ffec21df94467b0e",
        productId: "6579d855026c967a135f49ca",
        farmId: "fma5a3555d",
        description: "For demo",
        provider: "Growloc",
        quantity: 435,
        used: 565,
        wastage: 0,
        createdBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
        updatedBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
        createdDate: "2024-03-03T17:54:42.009Z",
        updatedDate: "2024-03-13T09:41:09.508Z",
        product: {
          id: "6579d855026c967a135f49ca",
          subCategoryId: "65dcc0591e82ab3fc6d9d768",
          name: "Cucumber",
          unit: "nos",
          properties: null,
          isAdminApproved: true,
          createdBy: "+918530484193",
          updatedBy: "+918530484193",
          createdDate: "2023-12-13T16:14:13.862Z",
          updatedDate: "2023-12-13T16:14:13.862Z",
        },
      },
    },
  ],
};

const dummyUser = {
  users: {
    entities: {
      users: {
        "21f3bd3a-9011-70fd-8aba-8ed6189af0fe": {
          userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          firstName: "Ravi",
          lastName: "Soni",
          phone: "+919782546549",
          roles: null,
          role: "OWNER",
          organisationId: null,
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          updatedBy: null,
          createdDate: "2024-06-11T11:05:20.656Z",
          updatedDate: 0,
        },
      },
    },
    result: ["21f3bd3a-9011-70fd-8aba-8ed6189af0fe"],
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

describe("Lifecycle page", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
    });
    (useParams as jest.Mock).mockReturnValue({ polyhouseId: "ple11ad963" });
  });

  test("should render the component correctly", () => {
    renderWithProvider(<LifeCycle />, { store });

    expect(
      screen.getByText(getTranslation("polyhouse.polyhouseDetails.lifeCycle"))
    ).toBeInTheDocument();
    expect(screen.getByText("Trough System")).toBeInTheDocument();
    expect(screen.getByText("Cucumber")).toBeInTheDocument();
    expect(screen.getByText("147")).toBeInTheDocument();
    expect(screen.getByText("Harvest")).toBeInTheDocument();
    expect(screen.getByText("completed")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: getTranslation(
          "polyhouse.polyhouseDetails.lifecycle.addLifeCycle"
        ),
      })
    ).toBeInTheDocument();
  });

  test("should render the no life cycle when lifeCycles is empty array ", async () => {
    store = setupDefaultStore({
      users: { ...dummyUser },
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse, lifeCycles: [] },
    });
    renderWithProvider(<LifeCycle />, { store });
    expect(
      await screen.findByText(
        getTranslation("polyhouse.polyhouseDetails.lifecycle.noLifeCycle")
      )
    ).toBeInTheDocument();
  });

  test("should render LifeCycle loader when api request is send", async () => {
    store.getState().requesting[PolyhouseActions.REQUEST_POLYHOUSES] = true;
    store.getState().requesting[FarmActions.REQUEST_FARMS] = true;

    renderWithProvider(<LifeCycle />, { store });

    const loader = screen.getByRole("img", { name: "loading" });
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass("anticon-loading");
  });

  test("should navigate to polyhouse route on close icon click", async () => {
    renderWithProvider(<LifeCycle />, { store });

    await userEvent.click(screen.getByTestId("lifeCycle-close-icon"));
    expect(mockNavigate).toHaveBeenCalledWith(
      routePaths.polyhouseDetails.replace(":polyhouseId", "ple11ad963")
    );
  });

  test("should render error state", () => {
    store.getState().error[PolyhouseActions.REQUEST_POLYHOUSE_FINISHED] = {
      errors: [{ message: "Error occurred" }],
    };

    renderWithProvider(<LifeCycle />, { store });

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("should navigate to add create lifecycle on Add Life cycle button click", async () => {
    renderWithProvider(<LifeCycle />, { store });

    await userEvent.click(
      screen.getByRole("button", {
        name: getTranslation(
          "polyhouse.polyhouseDetails.lifecycle.addLifeCycle"
        ),
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      routePaths.addLifeCycle.replace(":polyhouseId", "ple11ad963")
    );
  });
});
