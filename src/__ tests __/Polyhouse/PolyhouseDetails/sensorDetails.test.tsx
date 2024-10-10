/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../../utils/setupTests";
import { renderWithProvider } from "../../utils/testUtils";
import { useParams } from "react-router-dom";
import SensorDetails from "@/pages/polyhouse/polyhouseDetails/Components/Sensor/sensorDetails";
import PolyhouseActions from "@/redux/polyhouse/action";
import routePaths from "@/config/routePaths";
import LineGraph from "@/pages/polyhouse/polyhouseDetails/Components/Sensor/lineGraph";
import Chart from "react-apexcharts";
import moment from "moment";

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

  sensorData: {
    CO2: [
      {
        id: "659d5c27a48eb723a85fbe4c",
        sensorId: "sn42766747",
        deviceId: "dvfa398532",
        sensorComponent: "CO2",
        version: "Farm dependant",
        iotDeviceVersion: "v1",
        provider: "Softhard",
        category: "Environment Sensor",
        zoneId: "pl2160c597",
        createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
        updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
        createdDate: "2024-01-09T14:45:59.625Z",
        updatedDate: "2024-07-25T14:43:40.392Z",
        parameters: [
          {
            parameterId: "PMCO21A2B3G",
            uiLabel: "CO2",
            visiblity: "USER",
            description: "To measure CO2 content inside a polyhouse/farm",
            defaultValue: "600",
            minValue: 0,
            maxValue: 2000,
            currentValue: "8",
            setting: null,
            isWriteable: false,
            isSchedule: false,
            scheduleCount: 0,
            maxSchedule: 0,
            schedule: null,
            isGraph: true,
            unit: "PPM",
            readDataType: "integer",
            writeDataType: "integer",
          },
        ],
      },
    ],
  },

  componentData: {
    "Fogger pump": [
      {
        id: "65982f9d05ab27be2e67af99",
        sensorId: "sn3f8ed1ce",
        deviceId: "dvfa398532",
        sensorComponent: "Fogging pump",
        version: "Farm dependant",
        iotDeviceVersion: "v1",
        provider: "Farm dependant",
        category: "Fogging Pump",
        zoneId: "pl2160c597",
        createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
        updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
        createdDate: "2024-01-05T16:34:35.382Z",
        updatedDate: "2024-07-25T14:43:40.390Z",
        parameters: [
          {
            parameterId: "PMFOG1A2B3P",
            uiLabel: "Fogger pump",
            visiblity: "USER",
            description:
              "To start fogger in the polyhouse, used to control humidity, temperature and in general provide moisture to the plants",
            defaultValue: "off",
            minValue: null,
            maxValue: null,
            currentValue: "0",
            setting: null,
            isWriteable: true,
            isSchedule: true,
            scheduleCount: 5,
            maxSchedule: 2,
            schedule: [
              {
                id: "1",
                stopTime: 17.3,
                startTime: 9.05,
              },
              {
                id: "2",
                stopTime: 0,
                startTime: 0,
              },
            ],
            isGraph: false,
            unit: null,
            readDataType: "string",
            writeDataType: "string",
          },
        ],
      },
    ],
  },

  selectedSensorName: "CO2",
};

const mockLabels = ["12-08-2024 12:00:00", "13-08-2024 12:00:00"];
const mockValues = [10, 20];

jest.mock("react-apexcharts", () => jest.fn(() => <div data-testid="chart" />));

jest.mock("@/utilities/toast", () => ({
  errorToast: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

describe("SensorDetails component", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
    (useParams as jest.Mock).mockReturnValue({
      polyhouseId: "ple11ad963",
      sensorName: "CO2",
    });
  });

  test("should render the SensorDetails component correctly", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<SensorDetails />, { store });
    expect(screen.getByText("CO2 1")).toBeInTheDocument();
  });

  test("should request polyhouse sensor data when selectedSensor is null", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: {
        ...dummyPolyhouse,
        selectedPolyhouse: null,
        selectedSensorName: null,
      },
      users: { ...dummyUser },
    });
    renderWithProvider(<SensorDetails />, { store });

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.requestSensorData("ple11ad963")
      );
    });
  });

  test("should render loader on graph component", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      requesting: {
        [PolyhouseActions.REQUEST_GRAPH_DATA]: true,
      },
    });

    renderWithProvider(<SensorDetails />, { store });

    const loader = screen.getByRole("img", { name: "loading" });
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass("anticon-loading");
  });

  test("should render loader on SensorDetails component", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      requesting: {
        [PolyhouseActions.REQUEST_POLYHOUSE]: true,
      },
    });

    renderWithProvider(<SensorDetails />, { store });

    const loader = screen.getByRole("img", { name: "loading" });
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass("anticon-loading");
  });

  test("should render SensorGraph component when isGraph is true", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<SensorDetails />, { store });

    expect(screen.getByText("CO2 1")).toBeInTheDocument();
    expect(screen.getByTestId("sensor-graph-container")).toBeInTheDocument();
  });

  test("should not render SensorGraph component when isGraph is false", () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse, selectedSensorName: "Fogger pump" },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<SensorDetails />, { store });

    expect(
      screen.queryByTestId("sensor-graph-container")
    ).not.toBeInTheDocument();
  });

  test("should navigate to polyhouse details page when close button is clicked", () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<SensorDetails />, { store });

    expect(
      screen.getByTestId("sensorDetails-close-button")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("sensorDetails-close-button"));

    expect(mockNavigate).toHaveBeenCalledWith(
      routePaths.polyhouseDetails.replace(":polyhouseId", "ple11ad963")
    );
  });

  test("should display schedule details correctly", () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse, selectedSensorName: "Fogger pump" },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<SensorDetails />, { store });

    expect(screen.getByText("Schedule")).toBeInTheDocument();
  });

  test("should render SensorGraph component when isGraph is true", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<SensorDetails />, { store });

    expect(screen.getByText("CO2 1")).toBeInTheDocument();
    expect(screen.getByTestId("sensor-graph-container")).toBeInTheDocument();

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.requestGraphData(
          [
            {
              id: "659d5c27a48eb723a85fbe4c",
              sensorId: "sn42766747",
              deviceId: "dvfa398532",
              sensorComponent: "CO2",
              version: "Farm dependant",
              iotDeviceVersion: "v1",
              provider: "Softhard",
              category: "Environment Sensor",
              zoneId: "pl2160c597",
              createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              createdDate: "2024-01-09T14:45:59.625Z",
              updatedDate: "2024-07-25T14:43:40.392Z",
              parameters: [
                {
                  parameterId: "PMCO21A2B3G",
                  uiLabel: "CO2",
                  visiblity: "USER",
                  description: "To measure CO2 content inside a polyhouse/farm",
                  defaultValue: "600",
                  minValue: 0,
                  maxValue: 2000,
                  currentValue: "8",
                  setting: null,
                  isWriteable: false,
                  isSchedule: false,
                  scheduleCount: 0,
                  maxSchedule: 0,
                  schedule: null,
                  isGraph: true,
                  unit: "PPM",
                  readDataType: "integer",
                  writeDataType: "integer",
                },
              ],
            },
          ],
          "4"
        )
      );
    });
  });

  test("should navigate to zone details page when close button is clicked", () => {
    (useParams as jest.Mock).mockReturnValue({
      polyhouseId: "ple11ad963",
      zoneId: "dummyId",
    });
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<SensorDetails />, { store });

    expect(
      screen.getByTestId("sensorDetails-close-button")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("sensorDetails-close-button"));

    expect(mockNavigate).toHaveBeenCalledWith(
      routePaths.zoneDetails
        .replace(":polyhouseId", "ple11ad963")
        .replace(":zoneId", "dummyId")
    );
  });

  test("should navigate to nursery details page when close button is clicked", () => {
    (useParams as jest.Mock).mockReturnValue({
      polyhouseId: "ple11ad963",
      nurseryId: "dummyId",
    });
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<SensorDetails />, { store });

    expect(
      screen.getByTestId("sensorDetails-close-button")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("sensorDetails-close-button"));

    expect(mockNavigate).toHaveBeenCalledWith(
      routePaths.nurseryDetails
        .replace(":polyhouseId", "ple11ad963")
        .replace(":nurseryId", "dummyId")
    );
  });

  test("should request zone sensor data when selectedSensor is null", async () => {
    (useParams as jest.Mock).mockReturnValue({
      polyhouseId: "ple11ad963",
      zoneId: "dummyId",
    });
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse, selectedPolyhouse: null },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<SensorDetails />, { store });

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.requestZoneSensorData("dummyId")
      );
    });
  });

  test("should request nursery sensor data when selectedSensor is null", async () => {
    (useParams as jest.Mock).mockReturnValue({
      polyhouseId: "ple11ad963",
      nurseryId: "dummyId",
    });
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse, selectedPolyhouse: null },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<SensorDetails />, { store });

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.requestNurserySensorData("dummyId")
      );
    });
  });

  test("should dispatch requestGraphData when click on refresh button", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<SensorDetails />, { store });

    expect(screen.getByText("CO2 1")).toBeInTheDocument();
    expect(screen.getByTestId("sensor-graph-container")).toBeInTheDocument();

    expect(screen.getByTestId("graph-refresh-button")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("graph-refresh-button"));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.requestGraphData(
          [
            {
              id: "659d5c27a48eb723a85fbe4c",
              sensorId: "sn42766747",
              deviceId: "dvfa398532",
              sensorComponent: "CO2",
              version: "Farm dependant",
              iotDeviceVersion: "v1",
              provider: "Softhard",
              category: "Environment Sensor",
              zoneId: "pl2160c597",
              createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              createdDate: "2024-01-09T14:45:59.625Z",
              updatedDate: "2024-07-25T14:43:40.392Z",
              parameters: [
                {
                  parameterId: "PMCO21A2B3G",
                  uiLabel: "CO2",
                  visiblity: "USER",
                  description: "To measure CO2 content inside a polyhouse/farm",
                  defaultValue: "600",
                  minValue: 0,
                  maxValue: 2000,
                  currentValue: "8",
                  setting: null,
                  isWriteable: false,
                  isSchedule: false,
                  scheduleCount: 0,
                  maxSchedule: 0,
                  schedule: null,
                  isGraph: true,
                  unit: "PPM",
                  readDataType: "integer",
                  writeDataType: "integer",
                },
              ],
            },
          ],
          "4"
        )
      );
    });
  });

  test("should dispatch 4H duration requestGraphData request when click on 4Hr button", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<SensorDetails />, { store });

    expect(screen.getByText("CO2 1")).toBeInTheDocument();
    expect(screen.getByTestId("sensor-graph-container")).toBeInTheDocument();

    expect(screen.getByTestId("graph-4Hr-button")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("graph-4Hr-button"));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.requestGraphData(
          [
            {
              id: "659d5c27a48eb723a85fbe4c",
              sensorId: "sn42766747",
              deviceId: "dvfa398532",
              sensorComponent: "CO2",
              version: "Farm dependant",
              iotDeviceVersion: "v1",
              provider: "Softhard",
              category: "Environment Sensor",
              zoneId: "pl2160c597",
              createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              createdDate: "2024-01-09T14:45:59.625Z",
              updatedDate: "2024-07-25T14:43:40.392Z",
              parameters: [
                {
                  parameterId: "PMCO21A2B3G",
                  uiLabel: "CO2",
                  visiblity: "USER",
                  description: "To measure CO2 content inside a polyhouse/farm",
                  defaultValue: "600",
                  minValue: 0,
                  maxValue: 2000,
                  currentValue: "8",
                  setting: null,
                  isWriteable: false,
                  isSchedule: false,
                  scheduleCount: 0,
                  maxSchedule: 0,
                  schedule: null,
                  isGraph: true,
                  unit: "PPM",
                  readDataType: "integer",
                  writeDataType: "integer",
                },
              ],
            },
          ],
          "4"
        )
      );
    });
  });

  test("should dispatch 12H duration requestGraphData request when click on 12Hr button", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<SensorDetails />, { store });

    expect(screen.getByText("CO2 1")).toBeInTheDocument();
    expect(screen.getByTestId("sensor-graph-container")).toBeInTheDocument();

    expect(screen.getByTestId("graph-12Hr-button")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("graph-12Hr-button"));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.requestGraphData(
          [
            {
              id: "659d5c27a48eb723a85fbe4c",
              sensorId: "sn42766747",
              deviceId: "dvfa398532",
              sensorComponent: "CO2",
              version: "Farm dependant",
              iotDeviceVersion: "v1",
              provider: "Softhard",
              category: "Environment Sensor",
              zoneId: "pl2160c597",
              createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              createdDate: "2024-01-09T14:45:59.625Z",
              updatedDate: "2024-07-25T14:43:40.392Z",
              parameters: [
                {
                  parameterId: "PMCO21A2B3G",
                  uiLabel: "CO2",
                  visiblity: "USER",
                  description: "To measure CO2 content inside a polyhouse/farm",
                  defaultValue: "600",
                  minValue: 0,
                  maxValue: 2000,
                  currentValue: "8",
                  setting: null,
                  isWriteable: false,
                  isSchedule: false,
                  scheduleCount: 0,
                  maxSchedule: 0,
                  schedule: null,
                  isGraph: true,
                  unit: "PPM",
                  readDataType: "integer",
                  writeDataType: "integer",
                },
              ],
            },
          ],
          "12"
        )
      );
    });
  });

  test("should dispatch 24H duration requestGraphData request when click on 24Hr button", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<SensorDetails />, { store });

    expect(screen.getByText("CO2 1")).toBeInTheDocument();
    expect(screen.getByTestId("sensor-graph-container")).toBeInTheDocument();

    expect(screen.getByTestId("graph-24Hr-button")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("graph-24Hr-button"));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.requestGraphData(
          [
            {
              id: "659d5c27a48eb723a85fbe4c",
              sensorId: "sn42766747",
              deviceId: "dvfa398532",
              sensorComponent: "CO2",
              version: "Farm dependant",
              iotDeviceVersion: "v1",
              provider: "Softhard",
              category: "Environment Sensor",
              zoneId: "pl2160c597",
              createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              createdDate: "2024-01-09T14:45:59.625Z",
              updatedDate: "2024-07-25T14:43:40.392Z",
              parameters: [
                {
                  parameterId: "PMCO21A2B3G",
                  uiLabel: "CO2",
                  visiblity: "USER",
                  description: "To measure CO2 content inside a polyhouse/farm",
                  defaultValue: "600",
                  minValue: 0,
                  maxValue: 2000,
                  currentValue: "8",
                  setting: null,
                  isWriteable: false,
                  isSchedule: false,
                  scheduleCount: 0,
                  maxSchedule: 0,
                  schedule: null,
                  isGraph: true,
                  unit: "PPM",
                  readDataType: "integer",
                  writeDataType: "integer",
                },
              ],
            },
          ],
          "24"
        )
      );
    });
  });

  test("should dispatch 72Hr duration requestGraphData request when click on 3D button", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<SensorDetails />, { store });

    expect(screen.getByText("CO2 1")).toBeInTheDocument();
    expect(screen.getByTestId("sensor-graph-container")).toBeInTheDocument();

    expect(screen.getByTestId("graph-3D-button")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("graph-3D-button"));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.requestGraphData(
          [
            {
              id: "659d5c27a48eb723a85fbe4c",
              sensorId: "sn42766747",
              deviceId: "dvfa398532",
              sensorComponent: "CO2",
              version: "Farm dependant",
              iotDeviceVersion: "v1",
              provider: "Softhard",
              category: "Environment Sensor",
              zoneId: "pl2160c597",
              createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              createdDate: "2024-01-09T14:45:59.625Z",
              updatedDate: "2024-07-25T14:43:40.392Z",
              parameters: [
                {
                  parameterId: "PMCO21A2B3G",
                  uiLabel: "CO2",
                  visiblity: "USER",
                  description: "To measure CO2 content inside a polyhouse/farm",
                  defaultValue: "600",
                  minValue: 0,
                  maxValue: 2000,
                  currentValue: "8",
                  setting: null,
                  isWriteable: false,
                  isSchedule: false,
                  scheduleCount: 0,
                  maxSchedule: 0,
                  schedule: null,
                  isGraph: true,
                  unit: "PPM",
                  readDataType: "integer",
                  writeDataType: "integer",
                },
              ],
            },
          ],
          "72"
        )
      );
    });
  });

  test("should dispatch 168Hr duration requestGraphData request when click on 1W button", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<SensorDetails />, { store });

    expect(screen.getByText("CO2 1")).toBeInTheDocument();
    expect(screen.getByTestId("sensor-graph-container")).toBeInTheDocument();

    expect(screen.getByTestId("graph-1W-button")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("graph-1W-button"));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.requestGraphData(
          [
            {
              id: "659d5c27a48eb723a85fbe4c",
              sensorId: "sn42766747",
              deviceId: "dvfa398532",
              sensorComponent: "CO2",
              version: "Farm dependant",
              iotDeviceVersion: "v1",
              provider: "Softhard",
              category: "Environment Sensor",
              zoneId: "pl2160c597",
              createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              createdDate: "2024-01-09T14:45:59.625Z",
              updatedDate: "2024-07-25T14:43:40.392Z",
              parameters: [
                {
                  parameterId: "PMCO21A2B3G",
                  uiLabel: "CO2",
                  visiblity: "USER",
                  description: "To measure CO2 content inside a polyhouse/farm",
                  defaultValue: "600",
                  minValue: 0,
                  maxValue: 2000,
                  currentValue: "8",
                  setting: null,
                  isWriteable: false,
                  isSchedule: false,
                  scheduleCount: 0,
                  maxSchedule: 0,
                  schedule: null,
                  isGraph: true,
                  unit: "PPM",
                  readDataType: "integer",
                  writeDataType: "integer",
                },
              ],
            },
          ],
          "168"
        )
      );
    });
  });

  test("renders LineGraph correctly with given props", () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });
    renderWithProvider(<LineGraph labels={mockLabels} values={mockValues} />, {
      store,
    });

    expect(Chart).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          xaxis: expect.objectContaining({
            categories: mockLabels.map((label) =>
              moment(label, "DD-MM-YYYY HH:mm:ss").format("YYYY-MM-DDTHH:mm:ss")
            ),
            labels: expect.objectContaining({
              formatter: expect.any(Function),
            }),
          }),
          tooltip: expect.objectContaining({
            x: expect.objectContaining({
              formatter: expect.any(Function),
            }),
          }),
        }),
        series: expect.arrayContaining([
          expect.objectContaining({
            name: "value",
            data: mockValues,
          }),
        ]),
      }),
      expect.anything()
    );

    expect(screen.getByTestId("line-graph")).toBeInTheDocument();
    expect(screen.getByTestId("chart")).toBeInTheDocument();
  });

  test("should render render graph", async () => {
    store = setupDefaultStore({
      polyhouses: {
        ...dummyPolyhouse,
        graph: {
          sn42766748: {
            uiLabel: "CO2",
            unit: "PPM",
            parameterId: "PMCO21A2B3G",
            sensorId: "sn4276674",
            labels: [
              "19-08-2024 23:57:43",
              "20-08-2024 00:07:44",
              "20-08-2024 00:17:44",
              "20-08-2024 00:27:44",
              "20-08-2024 00:37:43",
              "20-08-2024 00:47:43",
              "20-08-2024 00:57:43",
              "20-08-2024 01:07:44",
              "20-08-2024 01:17:43",
              "20-08-2024 01:27:44",
              "20-08-2024 01:37:44",
              "20-08-2024 01:47:41",
              "20-08-2024 01:57:44",
              "20-08-2024 02:07:44",
              "20-08-2024 02:17:40",
              "20-08-2024 02:27:44",
              "20-08-2024 02:37:42",
              "20-08-2024 02:47:43",
              "20-08-2024 02:57:42",
              "20-08-2024 03:07:43",
              "20-08-2024 03:17:44",
              "20-08-2024 03:27:43",
              "20-08-2024 03:37:44",
              "20-08-2024 03:47:43",
            ],
            values: [
              9, 9, 9, 9, 10, 9, 10, 10, 10, 9, 10, 10, 10, 9, 10, 10, 10, 10,
              10, 10, 9, 10, 10, 9,
            ],
          },
        },
      },
      users: { ...dummyUser },
      farms: { ...dummyFarms },
    });

    renderWithProvider(<SensorDetails />, { store });

    expect(screen.queryByTestId("line-graph")).not.toBeInTheDocument();
  });
});
