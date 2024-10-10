/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../../../utils/setupTests";
import { renderWithProvider } from "../../../utils/testUtils";
import { useParams } from "react-router-dom";
import { getTranslation } from "@/translation/i18n";
import Nursery from "@/pages/polyhouse/polyhouseDetails/Components/Nursery";
import PolyhouseActions from "@/redux/polyhouse/action";
import routePaths from "@/config/routePaths";
import { Nursery as NurseryType } from "@/pages/farm/types";
import userEvent from "@testing-library/user-event";
import AddNursery from "@/pages/polyhouse/polyhouseDetails/Components/Nursery/addNusery";

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

describe("Nursery page", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
    (useParams as jest.Mock).mockReturnValue({ polyhouseId: "ple11ad963" });
  });

  test("should render the nursery component correctly", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<Nursery />, { store });
    expect(
      screen.getByText(
        getTranslation("polyhouse.polyhouseDetails.nurseries.nurseries")
      )
    ).toBeInTheDocument();
  });

  test("should dispatch requestPolyhouse action if no selectedPolyhouse", async () => {
    store = setupDefaultStore({
      farms: { farms: null, selectedFarmId: "dummySelectedFarmId" },
      polyhouses: { polyhouses: null, selectedPolyhouse: null },
    });

    renderWithProvider(<Nursery />, { store });

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.requestPolyhouse("ple11ad963")
      );
    });
  });

  test("should show no nurseries when there are no nurseries", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: {
        ...dummyPolyhouse,
        selectedPolyhouse: {
          ...dummyPolyhouse.selectedPolyhouse,
          nurseries: [],
        },
      },
      users: { ...dummyUser },
    });
    renderWithProvider(<Nursery />, { store });
    expect(
      screen.getByText(getTranslation("nursery.noNurseries"))
    ).toBeInTheDocument();
  });

  test("should render error state", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      error: {
        [PolyhouseActions.REQUEST_POLYHOUSE_FINISHED]: {
          errors: [{ message: "Error occurred" }],
        },
      },
    });
    renderWithProvider(<Nursery />, { store });

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("should open modal when click on add nursery button", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<Nursery />, { store });

    expect(
      screen.getByText(
        getTranslation("farm.createFarm.polyhouse.nursery.addNursery")
      )
    ).toBeInTheDocument();

    const addNurseryButton = await screen.findByTestId("polyhouse-addNursery");

    await userEvent.click(addNurseryButton);

    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.polyhouse.nursery.nurseryName")
      )
    ).toBeInTheDocument();
  });

  test("should close modal when click on close button", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<Nursery />, { store });

    fireEvent.click(
      screen.getByText(
        getTranslation("farm.createFarm.polyhouse.nursery.addNursery")
      )
    );

    expect(
      await screen.findByText(getTranslation("global.add"))
    ).toBeInTheDocument();

    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.polyhouse.nursery.nurseryName")
      )
    ).toBeInTheDocument();

    expect(await screen.findByText("Cancel")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.polyhouse.nursery.seedCount")
      )
    ).toBeInTheDocument();
  });

  test("should navigate to polyhouse route on close icon click", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<Nursery />, { store });
    expect(screen.getByTestId("nursery-close-icon")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("nursery-close-icon"));
    expect(mockNavigate).toHaveBeenCalledWith(
      routePaths.polyhouseDetails.replace(":polyhouseId", "ple11ad963")
    );
  });

  test("should display validation errors for invalid inputs in nursery add modal", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<Nursery />, { store });

    fireEvent.click(
      screen.getByText(
        getTranslation("farm.createFarm.polyhouse.nursery.addNursery")
      )
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.nursery.nurseryArea")
      ),
      { target: { value: "invalid" } }
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.nursery.germinationArea")
      ),
      { target: { value: "invalid" } }
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.nursery.seedCount")
      ),
      { target: { value: "invalid" } }
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          getTranslation(
            "farm.createFarm.polyhouse.nursery.nurseryAreaRegexMessage"
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          getTranslation(
            "farm.createFarm.polyhouse.nursery.germinationAreaRegexMessage"
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          getTranslation(
            "farm.createFarm.polyhouse.nursery.seedCountRegexMessage"
          )
        )
      ).toBeInTheDocument();
    });
  });

  test("add a nursery successfully", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<Nursery />, { store });

    fireEvent.click(
      screen.getByText(
        getTranslation("farm.createFarm.polyhouse.nursery.addNursery")
      )
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.nursery.nurseryName")
      ),
      { target: { value: "New nursery" } }
    );
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.nursery.nurseryName")
      )
    ).toHaveValue("New nursery");

    const element = screen.getByTestId("nursery-systemType");
    const select = element.firstElementChild;
    if (select) {
      await userEvent.click(select);
    }

    const typeOptions = await screen.findAllByText(
      "Open (no humidity control)"
    );
    const typeOption = typeOptions.find((option) =>
      option.classList.contains("ant-select-item-option-content")
    );

    if (typeOption) await userEvent.click(typeOption);

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.nursery.nurseryArea")
      ),
      { target: { value: 100 } }
    );
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.nursery.nurseryArea")
      )
    ).toHaveValue("100");

    const germinationType = screen.getByTestId("nursery-germinationType");
    const germinationTypeSelect = germinationType.firstElementChild;
    if (germinationTypeSelect) {
      await userEvent.click(germinationTypeSelect);
    }

    const germinationTypeOptions = await screen.findAllByText(
      "Tray with coco peat"
    );
    const germinationTypeOption = germinationTypeOptions.find((option) =>
      option.classList.contains("ant-select-item-option-content")
    );

    if (germinationTypeOption) await userEvent.click(germinationTypeOption);

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.nursery.germinationArea")
      ),
      { target: { value: 50 } }
    );
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.nursery.germinationArea")
      )
    ).toHaveValue("50");

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.nursery.seedCount")
      ),
      { target: { value: 5 } }
    );
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.nursery.seedCount")
      )
    ).toHaveValue("5");

    const wateringType = screen.getByTestId("nursery-wateringType");
    const wateringTypeSelect = wateringType.firstElementChild;
    if (wateringTypeSelect) {
      await userEvent.click(wateringTypeSelect);
    }

    const wateringTypeOptions = await screen.findAllByText("Manual");

    const wateringTypeOption = wateringTypeOptions.find((option) =>
      option.classList.contains("ant-select-item-option-content")
    );

    if (wateringTypeOption) await userEvent.click(wateringTypeOption);

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.wateringSchedule")
      ),
      { target: { value: "Daily" } }
    );
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.wateringSchedule")
      )
    ).toHaveValue("Daily");

    fireEvent.click(screen.getByText(getTranslation("global.add")));

    await waitFor(() => {
      const nursery: NurseryType = {
        name: "New nursery",
        type: "Open (no humidity control)",
        area: 100,
        germinationType: "Tray with coco peat",
        germinationArea: 50,
        seedCount: 5,
        wateringType: "Manual",
        wateringSchedule: "Daily",
      };

      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.addNursery(nursery)
      );
    });
  });

  test("should directed to the nursery details page when clicking on nursery card", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<Nursery />, { store });
    expect(
      screen.getByText(
        getTranslation("polyhouse.polyhouseDetails.nurseries.nurseries")
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Nursery 1")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Nursery 1"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        routePaths.nurseryDetails
          .replace(":polyhouseId", "ple11ad963")
          .replace(":nurseryId", "nub4cde909")
      );
    });
  });

  test("should handle errors from the store and apply to nursery form fields", async () => {
    const errorState = {
      [PolyhouseActions.ADD_NURSERY_FINISHED]: {
        errors: [
          {
            location: "seedCount",
          },
        ],
      },
    };
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
      error: errorState,
    });
    renderWithProvider(<AddNursery />, { store });

    expect(
      screen.getByText(
        getTranslation("farm.createFarm.polyhouse.nursery.addNursery")
      )
    );

    expect(screen.getByTestId("polyhouse-addNursery"));
    await userEvent.click(screen.getByTestId("polyhouse-addNursery"));

    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.nursery.nurseryName")
      )
    );
    expect(
      await screen.findByText("Please enter valid value")
    ).toBeInTheDocument();
  });
});
