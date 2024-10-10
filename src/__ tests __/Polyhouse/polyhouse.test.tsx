/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import { getTranslation } from "@/translation/i18n";
import Polyhouse from "@/pages/polyhouse";
import PolyhouseActions from "@/redux/polyhouse/action";
import routePaths from "@/config/routePaths";
import FarmActions from "@/redux/farm/action";
import PolyhouseCard from "@/pages/polyhouse/polyhouseCard";

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
  polyhouses: {
    entities: {
      polyhouses: {
        ple11ad963: {
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
      },
    },
    result: ["ple11ad963"],
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
}));

describe("Polyhouse page", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("should render the component correctly", () => {
    renderWithProvider(<Polyhouse />, { store });
    expect(
      screen.getByText(getTranslation("global.polyhouses"))
    ).toBeInTheDocument();
  });

  test("should render no polyhouse when there is no polyhouses present", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
    });
    renderWithProvider(<Polyhouse />, { store });

    expect(
      screen.getByText(getTranslation("polyhouse.noPolyhouse"))
    ).toBeInTheDocument();
  });

  test("should dispatch fetchPolyhouses action on component mount if selectedFarmId is present", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
    });

    renderWithProvider(<Polyhouse />, { store });

    expect(store.dispatch).toHaveBeenCalledWith(
      PolyhouseActions.fetchPolyhouses(true)
    );
  });

  test("should navigate to polyhouseCreate page when Add polyhouse button is clicked", () => {
    renderWithProvider(<Polyhouse />, { store });
    fireEvent.click(screen.getByText(getTranslation("polyhouse.addPolyhouse")));
    expect(mockNavigate).toHaveBeenCalledWith(routePaths.polyhouseCreate);
  });

  test("should dispatch fetchPolyhouses action on clicking refresh button", () => {
    renderWithProvider(<Polyhouse />, { store });

    const refreshButton = screen.getByTestId("polyhouse-refresh-button");
    fireEvent.click(refreshButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      PolyhouseActions.fetchPolyhouses(true)
    );
  });

  test("should not dispatch fetchPolyhouses action if selectedFarmId is null", () => {
    store = setupDefaultStore({
      farms: { farms: null, selectedFarmId: null },
    });

    renderWithProvider(<Polyhouse />, { store });

    expect(store.dispatch).not.toHaveBeenCalledWith(
      PolyhouseActions.fetchPolyhouses(true)
    );
  });

  test("Displays error message when Request farm api fails", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      error: {
        [PolyhouseActions.REQUEST_POLYHOUSES_FINISHED]: {
          errors: [{ message: "Error occurred" }],
        },
      },
    });

    renderWithProvider(<Polyhouse />, { store });

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("should dispatch requestBatchCount and setSelectedPolyhouse actions on polyhouse card click", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
    });

    renderWithProvider(<Polyhouse />, { store });
    expect(
      screen.getByText(`${getTranslation("polyhouse.structureExpectedLife")}:`)
    ).toBeInTheDocument();
  });

  test("should go to polyhouse details page when clicking on polyhouse card", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
    });

    renderWithProvider(<Polyhouse />, { store });

    fireEvent.click(screen.getByText("dummy polyhouse"));
    expect(mockNavigate).toHaveBeenCalledWith(
      routePaths.polyhouseDetails.replace(":polyhouseId", "ple11ad963")
    );
  });

  test("should render loader when api request is send", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      polyhouses: { ...dummyPolyhouse },
      requesting: {
        [PolyhouseActions.REQUEST_POLYHOUSES]: true,
        [FarmActions.REQUEST_FARMS]: true,
      },
    });

    renderWithProvider(<PolyhouseCard />, { store });

    const loader = screen.getByRole("img", { name: "loading" });
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass("anticon-loading");
  });
});

