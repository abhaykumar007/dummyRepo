/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../../../utils/setupTests";
import { renderWithProvider } from "../../../utils/testUtils";
import { useParams } from "react-router-dom";
import NurseryDetailsHeaders from "@/pages/polyhouse/polyhouseDetails/Components/Nursery/nurseryDetailsHeader";
import routePaths from "@/config/routePaths";
import { getTranslation } from "@/translation/i18n";
import { successToast } from "@/utilities/toast";
import PolyhouseActions from "@/redux/polyhouse/action";
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

  selectedNursery: {
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

  nurserySensorData: {
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
            minValue: "0",
            maxValue: "2000",
            currentValue: 8,
            setting: null,
            isWriteable: false,
            isSchedule: null,
            scheduleCount: null,
            maxSchedule: null,
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

  nurseryComponentData: {
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
        createdBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
        updatedBy: "f193dd0a-10b1-7044-604e-611551bf5b71",
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
};

jest.mock("@/utilities/toast", () => ({
  errorToast: jest.fn(),
}));

jest.mock("@/utilities/toast", () => ({
  errorToast: jest.fn(),
  successToast: jest.fn(),
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

describe("nursery details page", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
    (useParams as jest.Mock).mockReturnValue({
      nurseryId: "nub4cde909",
      polyhouseId: "ple11ad963",
    });
  });

  test("should render the nursery details component correctly", () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<NurseryDetailsHeaders />, { store });
    expect(screen.getByText("Nursery 1")).toBeInTheDocument();
    expect(screen.getByText("Open (no humidity control)")).toBeInTheDocument();
    expect(screen.getByText("Tray with coco peat")).toBeInTheDocument();
  });

  test("should navigate to polyhouse route on close icon click", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });

    renderWithProvider(<NurseryDetailsHeaders />, { store });

    expect(screen.getByTestId("nursery-header-close-icon")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("nursery-header-close-icon"));

    expect(mockNavigate).toHaveBeenCalledWith(
      routePaths.nurseries.replace(":polyhouseId", "ple11ad963")
    );
  });

  test("should display success toast and navigate on nurseries page after delete operation", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<NurseryDetailsHeaders />, { store });

    expect(
      await screen.findByTestId("nursery-threeDots-icon")
    ).toBeInTheDocument();

    await userEvent.click(await screen.findByTestId("nursery-threeDots-icon"));

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
        getTranslation("polyhouse.polyhouseDetails.nurseryDeleteToast")
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        routePaths.nurseries.replace(":polyhouseId", "ple11ad963")
      );
    });
  });

  test("should display error on delete failure", () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      error: {
        [PolyhouseActions.DELETE_NURSERY_FINISHED]: {
          errors: [{ message: "Error occurred" }],
        },
      },
    });

    renderWithProvider(<NurseryDetailsHeaders />, { store });
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("should render input field when EditableNurseryField is clicked", () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<NurseryDetailsHeaders />, { store });

    // name
    const editableNameField = screen.getByTestId("name-container");
    fireEvent.click(editableNameField);
    expect(screen.getByTestId("name-input")).toHaveValue("Nursery 1");

    // type
    const typeField = screen.getByTestId("type-container");
    fireEvent.click(typeField);

    expect(typeField).toHaveTextContent("Open (no humidity control)");

    // wateringType
    const wateringTypeField = screen.getByTestId("wateringType-container");
    fireEvent.click(wateringTypeField);

    expect(wateringTypeField).toHaveTextContent("Manual");

    // wateringSchedule
    const wateringScheduleField = screen.getByTestId(
      "wateringSchedule-container"
    );
    fireEvent.click(wateringScheduleField);

    expect(screen.getByTestId("wateringSchedule-input")).toHaveValue("787");

    // germinationType
    const germinationTypeField = screen.getByTestId(
      "germinationType-container"
    );
    fireEvent.click(germinationTypeField);

    expect(germinationTypeField).toHaveTextContent("Tray with coco peat");

    // area
    const editableAreaField = screen.getByTestId("area-container");
    fireEvent.click(editableAreaField);

    expect(screen.getByTestId("area-input")).toHaveValue("78");

    // seedCount
    const editableSeedCountField = screen.getByTestId("seedCount-container");
    fireEvent.click(editableSeedCountField);

    expect(screen.getByTestId("seedCount-input")).toHaveValue("7");

    // germinationArea
    const editableGerminationAreaField = screen.getByTestId(
      "germinationArea-container"
    );
    fireEvent.click(editableGerminationAreaField);

    expect(screen.getByTestId("germinationArea-input")).toHaveValue("7");
  });

  test("should edit the nursery editable field and dispatch it with updated data by clicking on save button", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<NurseryDetailsHeaders />, { store });

    // name
    const editableNameField = screen.getByTestId("name-container");
    fireEvent.click(editableNameField);
    const nameInput = screen.getByTestId("name-input");
    fireEvent.change(nameInput, {
      target: { value: "Update nursery Name" },
    });
    expect(nameInput).toHaveValue("Update nursery Name");

    const nameSaveButton = screen.getByTestId("name-save");
    fireEvent.click(nameSaveButton);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.updateNursery("name", "ple11ad963", "nub4cde909", {
          name: "Update nursery Name",
        })
      );
    });

    // area
    const editableAreaField = screen.getByTestId("area-container");
    fireEvent.click(editableAreaField);
    const areaInput = screen.getByTestId("area-input");
    fireEvent.change(areaInput, { target: { value: 7000 } });
    expect(areaInput).toHaveValue("7000");

    const areaSaveButton = screen.getByTestId("area-save");
    fireEvent.click(areaSaveButton);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.updateNursery("area", "ple11ad963", "nub4cde909", {
          area: 7000,
        })
      );
    });

    // wateringSchedule
    const editableWateringScheduleField = screen.getByTestId(
      "wateringSchedule-container"
    );
    fireEvent.click(editableWateringScheduleField);
    const wateringScheduleInput = screen.getByTestId("wateringSchedule-input");
    fireEvent.change(wateringScheduleInput, {
      target: { value: "Update wateringSchedule" },
    });
    expect(wateringScheduleInput).toHaveValue("Update wateringSchedule");

    const nameWateringScheduleButton = screen.getByTestId(
      "wateringSchedule-save"
    );
    fireEvent.click(nameWateringScheduleButton);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.updateNursery(
          "wateringSchedule",
          "ple11ad963",
          "nub4cde909",
          {
            wateringSchedule: "Update wateringSchedule",
          }
        )
      );
    });
  });

  test("should display error on fields in nursery details header", async () => {
    store = setupDefaultStore({
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      error: {
        "[scope:seedCount]Polyhouses/UPDATE_NURSERY_FINISHED": {
          errors: [
            {
              error: "ERR_INVALID_FIELD_SEEDCOUNT",
              message: "seedCount must not be greater than 50000",
              type: "error",
              location: "seedCount",
            },
          ],
        },
      },
    });

    renderWithProvider(<NurseryDetailsHeaders />, { store });

    const editableField = screen.getByTestId("seedCount-container");
    await userEvent.click(editableField);

    await waitFor(() => {
      expect(
        screen.queryByText("seedCount must not be greater than 50000")
      ).toBeInTheDocument();
    });
  });
});
