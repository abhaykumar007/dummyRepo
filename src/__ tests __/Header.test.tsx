import Header from "@/components/layout/Header";
import { getTranslation } from "@/translation/i18n";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { setupDefaultStore } from "./utils/setupTests";
import { renderWithProvider } from "./utils/testUtils";

const toggleSidebar = jest.fn();

const mockData = {
  userDetails: {
    given_name: "John",
    family_name: "Doe",
    "custom:role": "Admin",
  },
  activeFarmOptions: [
    { key: "1", label: "Farm 1" },
    { key: "2", label: "Farm 2" },
  ],
  farms: {
    entities: {
      farms: {
        1: {
          farmId: "1",
          name: "Farm 1",
        },
        2: {
          farmId: "2",
          name: "Farm 2",
        },
      },
    },
    result: ["1", "2"],
  },
};

describe("Header Component", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("renders 'Select Farm' when no farm is selected", () => {
    renderWithProvider(<Header toggleSidebar={toggleSidebar} />, { store });

    expect(
      screen.getByText(getTranslation("header.selectFarm"))
    ).toBeInTheDocument();
  });

  test("renders farm dropdown with selected farm", () => {
    store = setupDefaultStore({
      farms: {
        activeFarmOptions: mockData.activeFarmOptions,
        selectedFarmId: "1",
        farms: mockData.farms,
      },
    });
    renderWithProvider(<Header toggleSidebar={toggleSidebar} />, { store });

    expect(screen.getByText("Farm 1")).toBeInTheDocument();
  });

  test("renders language dropdown with selected language", () => {
    renderWithProvider(<Header toggleSidebar={toggleSidebar} />, { store });

    expect(screen.getByText("en")).toBeInTheDocument();
  });

  test("renders user profile with user details", () => {
    store = setupDefaultStore({
      session: {
        details: mockData.userDetails,
      },
    });

    renderWithProvider(<Header toggleSidebar={toggleSidebar} />, { store });
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });
});
