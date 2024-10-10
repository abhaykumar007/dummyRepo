/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../../utils/setupTests";
import { renderWithProvider } from "../../utils/testUtils";
import PolyhouseHeader from "@/pages/polyhouse/polyhouseDetails/polyhouseHeader";
import UserActions from "@/redux/user/actions";
import routePaths from "@/config/routePaths";
import PolyhouseActions from "@/redux/polyhouse/action";
import { successToast } from "@/utilities/toast";
import { getTranslation } from "@/translation/i18n";
import userEvent from "@testing-library/user-event";

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
        createdBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
        updatedBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
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
};

jest.mock("@/utilities/toast", () => ({
  errorToast: jest.fn(),
  successToast: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

describe("PolyhouseHeader component", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
    jest.clearAllMocks();
  });

  test("should render PolyhouseHeader component correctly", () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    expect(screen.getByText("dummy polyhouse")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("should dispatch fetchUsers action if users list is empty", () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { users: { entities: { users: {} }, result: [] } },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    expect(store.dispatch).toHaveBeenCalledWith(UserActions.fetchUsers());
  });

  test("should navigate to polyhouse route on close icon click", () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    fireEvent.click(screen.getByTestId("polyhouse-close-icon"));
    expect(mockNavigate).toHaveBeenCalledWith(routePaths.polyhouse);
  });

  test("should display success toast and navigate on successful polyhouse deletion", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      requesting: { [PolyhouseActions.DELETE_POLYHOUSE]: false },
    });
    renderWithProvider(<PolyhouseHeader />, { store });

    fireEvent.click(screen.getByTestId("polyhouse-threeDots-icon"));
    expect(
      await screen.findByText(getTranslation("global.delete"))
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(getTranslation("global.delete")));

    expect(
      await screen.findByText(getTranslation("global.yes"))
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText(getTranslation("global.yes")));

    await waitFor(() => {
      expect(successToast).toHaveBeenCalledWith(
        getTranslation("polyhouse.polyhouseDetails.polyhouseDeleteToast")
      );
      expect(mockNavigate).toHaveBeenCalledWith(routePaths.polyhouse);
    });
  });

  test("should display error on polyhouse request failure", () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      error: {
        [PolyhouseActions.REQUEST_POLYHOUSE_FINISHED]: {
          errors: [{ message: "Error occurred" }],
        },
      },
    });

    renderWithProvider(<PolyhouseHeader />, { store });
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("should display error on polyhouse deletion failure", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },

      error: {
        [PolyhouseActions.DELETE_POLYHOUSE_FINISHED]: {
          errors: [{ message: "Failed to delete polyhouse" }],
        },
      },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    fireEvent.click(screen.getByTestId("polyhouse-threeDots-icon"));
    expect(
      await screen.findByText(getTranslation("global.delete"))
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(getTranslation("global.delete")));

    expect(
      await screen.findByText(getTranslation("global.yes"))
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText(getTranslation("global.yes")));

    expect(screen.getByText("Failed to delete polyhouse")).toBeInTheDocument();
  });

  test("should render input field when EditablePolyhouseField is clicked", () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });

    // name
    const editableNameField = screen.getByTestId("name-container");
    fireEvent.click(editableNameField);
    expect(screen.getByTestId("name-input")).toHaveValue("dummy polyhouse");

    // structureExpectedLife
    const editableStructureExpectedLifeField = screen.getByTestId(
      "structureExpectedLife-container"
    );
    fireEvent.click(editableStructureExpectedLifeField);

    expect(screen.getByTestId("structureExpectedLife-input")).toHaveValue("6");

    // plasticExpectedLife
    const editablePlasticExpectedLifeField = screen.getByTestId(
      "plasticExpectedLife-container"
    );
    fireEvent.click(editablePlasticExpectedLifeField);

    expect(screen.getByTestId("plasticExpectedLife-input")).toHaveValue("2");
  });

  test("should edit the editable field and dispatch it with updated data by clicking on save button", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });

    // name
    const editableNameField = screen.getByTestId("name-container");
    fireEvent.click(editableNameField);
    const nameInput = screen.getByTestId("name-input");
    fireEvent.change(nameInput, {
      target: { value: "Updated polyhouse Name" },
    });
    expect(nameInput).toHaveValue("Updated polyhouse Name");

    const nameSaveButton = screen.getByTestId("name-save");
    fireEvent.click(nameSaveButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      PolyhouseActions.updatePolyhouse("name", "ple11ad963", {
        name: "Updated polyhouse Name",
      })
    );

    // structureExpectedLife
    const editableStructureExpectedLifeField = screen.getByTestId(
      "structureExpectedLife-container"
    );
    fireEvent.click(editableStructureExpectedLifeField);
    const structureExpectedLifeInput = screen.getByTestId(
      "structureExpectedLife-input"
    );
    fireEvent.change(structureExpectedLifeInput, {
      target: { value: "10" },
    });
    expect(structureExpectedLifeInput).toHaveValue("10");

    const structureExpectedLifeSaveButton = screen.getByTestId(
      "structureExpectedLife-save"
    );
    fireEvent.click(structureExpectedLifeSaveButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      PolyhouseActions.updatePolyhouse("structureExpectedLife", "ple11ad963", {
        structureExpectedLife: 10,
      })
    );
  });

  test("should display error on fields in polyhouse header", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      error: {
        "[scope:structureExpectedLife]Polyhouses/UPDATE_POLYHOUSES_FINISHED": {
          errors: [
            {
              error: "ERR_INVALID_FIELD_STRUCTUREEXPECTEDLIFE",
              type: "error",
              location: "structureExpectedLife",
            },
          ],
        },
      },
    });

    renderWithProvider(<PolyhouseHeader />, { store });

    const editableField = screen.getByTestId("structureExpectedLife-container");
    fireEvent.click(editableField);

    await waitFor(() => {
      expect(
        screen.queryByText("Please enter valid value")
      ).toBeInTheDocument();
    });
  });
});

describe("Add Sensor data", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
    jest.clearAllMocks();
  });
  test("should open add sensor modal on clicking add sensor button", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    expect(screen.getByTestId("add-sensor-data-modal")).toBeInTheDocument();
  });

  test("should give error on adding row without selecting sensor", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    const addRowBtn = screen.getByRole("button", {
      name: getTranslation("polyhouse.addSensorData.addRow"),
    });
    await userEvent.click(addRowBtn);
    await waitFor(() => {
      expect(
        screen.getByText(
          getTranslation("polyhouse.addSensorData.selectSensorError")
        )
      ).toBeInTheDocument();
    });
  });
  test("should be able to add row after selecting sensor", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    const sensorSelect = screen.getByTestId("sensor-select").firstElementChild;
    if (sensorSelect) await userEvent.click(sensorSelect);
    await userEvent.click(screen.getByText("CO2 1"));

    const addRowBtn = screen.getByRole("button", {
      name: getTranslation("polyhouse.addSensorData.addRow"),
    });
    await userEvent.click(addRowBtn);

    expect(
      screen.getByText(getTranslation("global.parameter"))
    ).toBeInTheDocument();
  });
  test("should give error on clicking add without filling form", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    const sensorSelect = screen.getByTestId("sensor-select").firstElementChild;
    if (sensorSelect) await userEvent.click(sensorSelect);
    await userEvent.click(screen.getByText("CO2 1"));

    const addRowBtn = screen.getByRole("button", {
      name: getTranslation("polyhouse.addSensorData.addRow"),
    });
    await userEvent.click(addRowBtn);
    const addBtn = screen.getByRole("button", {
      name: getTranslation("global.add"),
    });
    await userEvent.click(addBtn);
    await waitFor(() => {
      expect(
        screen.getByText(
          getTranslation("polyhouse.addSensorData.selectParameterError")
        )
      ).toBeInTheDocument();
    });
  });

  test("should be able to add multiple rows", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    const sensorSelect = screen.getByTestId("sensor-select").firstElementChild;
    if (sensorSelect) await userEvent.click(sensorSelect);
    await userEvent.click(screen.getByText("CO2 1"));

    const addRowBtn = screen.getByRole("button", {
      name: getTranslation("polyhouse.addSensorData.addRow"),
    });
    await userEvent.click(addRowBtn);
    await userEvent.click(addRowBtn);
    expect(screen.getByTestId("1-value-input")).toBeInTheDocument();
  });

  test("should be able to delete rows", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    const sensorSelect = screen.getByTestId("sensor-select").firstElementChild;
    if (sensorSelect) await userEvent.click(sensorSelect);
    await userEvent.click(screen.getByText("CO2 1"));

    const addRowBtn = screen.getByRole("button", {
      name: getTranslation("polyhouse.addSensorData.addRow"),
    });
    await userEvent.click(addRowBtn);
    await userEvent.click(addRowBtn);
    expect(screen.getByTestId("1-value-input")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("1-delete-button"));
    expect(screen.queryByTestId("1-value-input")).toBeNull();
  });

  test("should be autofill the paramter on selecting previous parameter", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    const sensorSelect = screen.getByTestId("sensor-select").firstElementChild;
    if (sensorSelect) await userEvent.click(sensorSelect);
    await userEvent.click(screen.getByText("CO2 1"));

    const addRowBtn = screen.getByRole("button", {
      name: getTranslation("polyhouse.addSensorData.addRow"),
    });
    await userEvent.click(addRowBtn);
    const parameterSelect =
      screen.getByTestId("0-parameter-select").firstElementChild;
    if (parameterSelect) await userEvent.click(parameterSelect);
    await userEvent.click(screen.getAllByText("PMCO21A2B3G")[0]);
    await userEvent.click(addRowBtn);
    const parameterValue = screen.getAllByText("PMCO21A2B3G");
    expect(parameterValue).toHaveLength(2);
  });
  test("should fill value to prevoius row parameter value on clicking tab", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    const sensorSelect = screen.getByTestId("sensor-select").firstElementChild;
    if (sensorSelect) await userEvent.click(sensorSelect);
    await userEvent.click(screen.getByText("CO2 1"));

    const addRowBtn = screen.getByRole("button", {
      name: getTranslation("polyhouse.addSensorData.addRow"),
    });
    await userEvent.click(addRowBtn);
    await userEvent.type(screen.getByTestId("0-value-input"), "10");
    await userEvent.click(addRowBtn);
    await userEvent.click(screen.getByTestId("1-value-input"));
    await userEvent.tab();
    expect(screen.getByTestId("1-value-input")).toHaveValue("10");
  });

  test("should hide the modal on clicking cancel", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    const cancel = screen.getByRole("button", {
      name: getTranslation("global.cancel"),
    });
    await userEvent.click(cancel);
    expect(
      screen.queryByTestId("add-sensor-data-modal")
    ).not.toBeInTheDocument();
  });
  test("should call add sensor data action on add button", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    const sensorSelect = screen.getByTestId("sensor-select").firstElementChild;
    if (sensorSelect) await userEvent.click(sensorSelect);
    await userEvent.click(screen.getByText("CO2 1"));

    const addRowBtn = screen.getByRole("button", {
      name: getTranslation("polyhouse.addSensorData.addRow"),
    });
    await userEvent.click(addRowBtn);
    const parameterSelect =
      screen.getByTestId("0-parameter-select").firstElementChild;
    if (parameterSelect) await userEvent.click(parameterSelect);
    await userEvent.click(screen.getAllByText("PMCO21A2B3G")[1]);
    await userEvent.type(screen.getByTestId("0-value-input"), "10");
    await userEvent.click(screen.getByTestId("0-time-input"));
    await userEvent.click(screen.getAllByText("29")[0]);
    await userEvent.click(screen.getByText("OK"));
    const addBtn = screen.getByRole("button", {
      name: getTranslation("global.add"),
    });
    await userEvent.click(addBtn);
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.addSensorData({
          data: {
            polyhouse: {
              id: "ple11ad963",
            },
            parameters: [
              {
                parameterId: "PMCO21A2B3G",
                value: "10",
                time: 1727548200,
              },
            ],
          },
          sensorId: "sn42766747",
          deviceId: "dvfa398532",
        })
      );
    });
  });

  test("should give warning on sensor change after adding a row", async () => {
    store = setupDefaultStore({
      polyhouses: {
        ...dummyPolyhouse,
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
              createdBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
              updatedBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
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
            {
              id: "659d5c27a48eb723a85fbe4d",
              sensorId: "sn42766748",
              deviceId: "dvfa398532",
              sensorComponent: "CO2",
              version: "Farm dependant",
              iotDeviceVersion: "v1",
              provider: "Softhard",
              category: "Environment Sensor",
              zoneId: "pl2160c597",
              createdBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
              updatedBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
              createdDate: "2024-01-09T14:45:59.625Z",
              updatedDate: "2024-07-25T14:43:40.392Z",
              parameters: [
                {
                  parameterId: "PMCO21A2B3F",
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
      },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    const sensorSelect = screen.getByTestId("sensor-select").firstElementChild;
    if (sensorSelect) await userEvent.click(sensorSelect);
    await userEvent.click(screen.getAllByText("CO2 1")[0]);

    const addRowBtn = screen.getByRole("button", {
      name: getTranslation("polyhouse.addSensorData.addRow"),
    });
    await userEvent.click(addRowBtn);
    if (sensorSelect) await userEvent.click(sensorSelect);
    await userEvent.click(screen.getAllByText("CO2 2")[0]);
    await waitFor(() => {
      expect(
        screen.getAllByTestId("sensor-change-warning")[0]
      ).toBeInTheDocument();
    });
  });
  test("should change sensor on ok click at warning", async () => {
    store = setupDefaultStore({
      polyhouses: {
        ...dummyPolyhouse,
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
              createdBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
              updatedBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
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
            {
              id: "659d5c27a48eb723a85fbe4d",
              sensorId: "sn42766748",
              deviceId: "dvfa398532",
              sensorComponent: "CO2",
              version: "Farm dependant",
              iotDeviceVersion: "v1",
              provider: "Softhard",
              category: "Environment Sensor",
              zoneId: "pl2160c597",
              createdBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
              updatedBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
              createdDate: "2024-01-09T14:45:59.625Z",
              updatedDate: "2024-07-25T14:43:40.392Z",
              parameters: [
                {
                  parameterId: "PMCO21A2B3F",
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
      },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    const sensorSelect = screen.getByTestId("sensor-select").firstElementChild;
    if (sensorSelect) await userEvent.click(sensorSelect);
    await userEvent.click(screen.getAllByText("CO2 1")[0]);

    const addRowBtn = screen.getByRole("button", {
      name: getTranslation("polyhouse.addSensorData.addRow"),
    });
    await userEvent.click(addRowBtn);
    if (sensorSelect) await userEvent.click(sensorSelect);
    await userEvent.click(screen.getAllByText("CO2 2")[0]);
    await waitFor(() => {
      expect(
        screen.getAllByTestId("sensor-change-warning")[0]
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByRole("button", { name: "OK" })[0]);
    expect(screen.queryAllByText("CO2 2")[0]).toBeInTheDocument();
  });
  test("shouldnot change sensor on cancel click at warning", async () => {
    store = setupDefaultStore({
      polyhouses: {
        ...dummyPolyhouse,
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
              createdBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
              updatedBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
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
            {
              id: "659d5c27a48eb723a85fbe4d",
              sensorId: "sn42766748",
              deviceId: "dvfa398532",
              sensorComponent: "CO2",
              version: "Farm dependant",
              iotDeviceVersion: "v1",
              provider: "Softhard",
              category: "Environment Sensor",
              zoneId: "pl2160c597",
              createdBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
              updatedBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
              createdDate: "2024-01-09T14:45:59.625Z",
              updatedDate: "2024-07-25T14:43:40.392Z",
              parameters: [
                {
                  parameterId: "PMCO21A2B3F",
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
      },
      users: { ...dummyUser },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    const sensorSelect = screen.getByTestId("sensor-select").firstElementChild;
    if (sensorSelect) await userEvent.click(sensorSelect);
    await userEvent.click(screen.getAllByText("CO2 1")[0]);

    const addRowBtn = screen.getByRole("button", {
      name: getTranslation("polyhouse.addSensorData.addRow"),
    });
    await userEvent.click(addRowBtn);
    if (sensorSelect) await userEvent.click(sensorSelect);
    await userEvent.click(screen.getAllByText("CO2 2")[0]);
    await waitFor(() => {
      expect(
        screen.getAllByTestId("sensor-change-warning")[0]
      ).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByRole("button", { name: "Cancel" })[1]);
  });
  test("should show field err", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      error: {
        [PolyhouseActions.ADD_SENSOR_DATA_FINISHED]: {
          errors: [
            {
              error: "ERR_INVALID_FIELD_PARAMETERS.0.TIME",
              message: "time must be between 1970-01-01 and the current time",
              type: "error",
              location: "parameters.0.time",
            },
          ],
          exception: "FieldLevelException",
          path: "/v2/sensor-data/farms/fm1a215ac2/devices/dvfd1422e3/sensors/sn25e420e1",
          code: 400,
          timestamp: 1725353845211,
          actionType: "Polyhouses/ADD_SENSOR_DATA_FINISHED",
        },
      },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    expect(screen.getByTestId("add-sensor-data-modal")).toBeInTheDocument();
    const sensorSelect = screen.getByTestId("sensor-select").firstElementChild;
    if (sensorSelect) await userEvent.click(sensorSelect);
    await userEvent.click(screen.getByText("CO2 1"));

    const addRowBtn = screen.getByRole("button", {
      name: getTranslation("polyhouse.addSensorData.addRow"),
    });
    await userEvent.click(addRowBtn);
    expect(
      screen.getByText(getTranslation("global.parameter"))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "time must be between 1970-01-01 and the current time"
      )
    ).toBeInTheDocument();
  });
  test("should show banner err", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      error: {
        "Polyhouses/ADD_SENSOR_DATA_FINISHED": {
          errors: [
            {
              error: "ERR_INVALID_FIELD_PARAMETERS.0.TIME",
              message: "time must be between 1970-01-01 and the current time",
              type: "error",
              location: "parameters.0.time",
            },
          ],
          exception: "BadRequestException",
          path: "/v2/sensor-data/farms/fm1a215ac2/devices/dvfd1422e3/sensors/sn25e420e1",
          code: 400,
          timestamp: 1725353845211,
          actionType: "Polyhouses/ADD_SENSOR_DATA_FINISHED",
        },
      },
    });
    renderWithProvider(<PolyhouseHeader />, { store });
    const threeDots = screen.getByTestId("polyhouse-threeDots-icon");
    await userEvent.click(threeDots);
    await userEvent.click(
      screen.getByText(getTranslation("polyhouse.addData"))
    );
    expect(screen.getByTestId("add-sensor-data-modal")).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByText("time must be between 1970-01-01 and the current time")
      ).toBeInTheDocument();
    });
  });
});
