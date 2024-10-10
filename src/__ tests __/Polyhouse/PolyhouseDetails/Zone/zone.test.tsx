/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../../../utils/setupTests";
import { renderWithProvider } from "../../../utils/testUtils";
import { useParams } from "react-router-dom";
import { getTranslation } from "@/translation/i18n";
import Zones from "@/pages/polyhouse/polyhouseDetails/Components/Zones";
import PolyhouseActions from "@/redux/polyhouse/action";
import { Zone } from "@/pages/farm/types";
import routePaths from "@/config/routePaths";
import userEvent from "@testing-library/user-event";
import AddZone from "@/pages/polyhouse/polyhouseDetails/Components/Zones/addZone";

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

describe("Zone page", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
    (useParams as jest.Mock).mockReturnValue({ polyhouseId: "ple11ad963" });
  });

  test("should render the zone component correctly", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<Zones />, { store });
    expect(
      screen.getByText(getTranslation("polyhouse.polyhouseDetails.zones.zones"))
    ).toBeInTheDocument();
  });

  test("should dispatch requestPolyhouse action if no selectedPolyhouse", async () => {
    store = setupDefaultStore({
      farms: { farms: null, selectedFarmId: "dummySelectedFarmId" },
      polyhouses: { polyhouses: null, selectedPolyhouse: null },
    });

    renderWithProvider(<Zones />, { store });

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.requestPolyhouse("ple11ad963")
      );
    });
  });

  test("should show no zones when there are no zones", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: {
        ...dummyPolyhouse,
        selectedPolyhouse: { ...dummyPolyhouse.selectedPolyhouse, zones: [] },
      },
      users: { ...dummyUser },
    });
    renderWithProvider(<Zones />, { store });
    expect(
      screen.getByText(getTranslation("zone.noZones"))
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
    renderWithProvider(<Zones />, { store });

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("should open modal when click on add zone button", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<Zones />, { store });

    expect(
      screen.getByText(getTranslation("farm.createFarm.polyhouse.zone.addZone"))
    ).toBeInTheDocument();

    const addButton = await screen.findByTestId("polyhouse-addZone");
    await userEvent.click(addButton);

    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.polyhouse.zone.name")
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.polyhouse.zone.systemType")
      )
    ).toBeInTheDocument();
  });

  test("should close modal when click on close button", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<Zones />, { store });

    fireEvent.click(
      screen.getByText(getTranslation("farm.createFarm.polyhouse.zone.addZone"))
    );

    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.polyhouse.zone.name")
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.polyhouse.zone.systemType")
      )
    ).toBeInTheDocument();

    expect(await screen.findByText("Cancel")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.polyhouse.zone.rowCount")
      )
    ).toBeInTheDocument();
  });

  test("should navigate to polyhouse route on close icon click", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<Zones />, { store });
    expect(screen.getByTestId("zone-close-icon")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("zone-close-icon"));
    expect(mockNavigate).toHaveBeenCalledWith(
      routePaths.polyhouseDetails.replace(":polyhouseId", "ple11ad963")
    );
  });

  test("displays validation errors on invalid values", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<Zones />, { store });

    fireEvent.click(
      screen.getByText(getTranslation("farm.createFarm.polyhouse.zone.addZone"))
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.zoneArea")
      ),
      { target: { value: "invalid" } }
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.growArea")
      ),
      { target: { value: "invalid" } }
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.rowCount")
      ),
      { target: { value: "invalid" } }
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.rowSpacing")
      ),
      { target: { value: "invalid" } }
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.plantSpacing")
      ),
      { target: { value: "invalid" } }
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.plantCountPerRow")
      ),
      { target: { value: "invalid" } }
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          getTranslation("farm.createFarm.polyhouse.zone.zoneAreaRegexMessage")
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          getTranslation("farm.createFarm.polyhouse.zone.growAreaRegexMessage")
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          getTranslation("farm.createFarm.polyhouse.zone.rowCountRegexMessage")
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          getTranslation(
            "farm.createFarm.polyhouse.zone.rowSpacingRegexMessage"
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          getTranslation(
            "farm.createFarm.polyhouse.zone.plantSpacingRegexMessage"
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          getTranslation(
            "farm.createFarm.polyhouse.zone.plantCountPerRowRegexMessage"
          )
        )
      ).toBeInTheDocument();
    });
  });

  test("add a zone successfully", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<Zones />, { store });

    fireEvent.click(
      screen.getByText(getTranslation("farm.createFarm.polyhouse.zone.addZone"))
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.name")
      ),
      { target: { value: "New Zone" } }
    );
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.name")
      )
    ).toHaveValue("New Zone");

    const element = screen.getByTestId("zone-systemType");
    const select = element.firstElementChild;
    if (select) {
      await userEvent.click(select);
    }

    const typeOptions = await screen.findAllByText("Raft system");
    const typeOption = typeOptions.find((option) =>
      option.classList.contains("ant-select-item-option-content")
    );

    if (typeOption) await userEvent.click(typeOption);

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.zoneArea")
      ),
      { target: { value: 100 } }
    );
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.zoneArea")
      )
    ).toHaveValue("100");

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.growArea")
      ),
      { target: { value: 50 } }
    );
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.growArea")
      )
    ).toHaveValue("50");

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.rowCount")
      ),
      { target: { value: 5 } }
    );
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.rowCount")
      )
    ).toHaveValue("5");
    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.rowSpacing")
      ),
      { target: { value: 2 } }
    );
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.rowSpacing")
      )
    ).toHaveValue("2");
    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.plantSpacing")
      ),
      { target: { value: 1 } }
    );
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.plantSpacing")
      )
    ).toHaveValue("1");
    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.plantCountPerRow")
      ),
      { target: { value: 10 } }
    );
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.plantCountPerRow")
      )
    ).toHaveValue("10");

    const wateringType = screen.getByTestId("zone-wateringType");
    const wateringTypeSelect = wateringType.firstElementChild;
    if (wateringTypeSelect) {
      await userEvent.click(wateringTypeSelect);
    }

    const wateringTypeOptions = await screen.findAllByText("Automatic");

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
      const zone: Zone = {
        name: "New Zone",
        systemType: "Raft system",
        area: 100,
        growingArea: {
          area: 50,
          rowCount: 5,
          plantCountPerRow: 10,
          plantSpacing: 1,
          rowSpacing: 2,
          wateringType: "Automatic",
          wateringSchedule: "Daily",
        },
      };

      expect(store.dispatch).toHaveBeenCalledWith(
        PolyhouseActions.addZone(zone)
      );
    });
  });

  test("should directed to the zone details page when clicking on zone card", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      users: { ...dummyUser },
    });
    renderWithProvider(<Zones />, { store });
    expect(
      screen.getByText(getTranslation("polyhouse.polyhouseDetails.zones.zones"))
    ).toBeInTheDocument();

    expect(screen.getByText("zone 1")).toBeInTheDocument();
    fireEvent.click(screen.getByText("zone 1"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        routePaths.zoneDetails
          .replace(":polyhouseId", "ple11ad963")
          .replace(":zoneId", "zn41f063fb")
      );
    });
  });
  test("should handle errors from the store and apply to zone form fields", async () => {
    const errorState = {
      [PolyhouseActions.ADD_ZONE_FINISHED]: {
        errors: [
          {
            location: "growingArea.rowCount",
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
    renderWithProvider(<AddZone />, { store });

    expect(
      screen.getByText(getTranslation("farm.createFarm.polyhouse.zone.addZone"))
    );

    expect(screen.getByTestId("polyhouse-addZone"));
    await userEvent.click(screen.getByTestId("polyhouse-addZone"));

    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.zoneArea")
      )
    );
    expect(
      await screen.findByText("Please enter valid value")
    ).toBeInTheDocument();
  });
});
