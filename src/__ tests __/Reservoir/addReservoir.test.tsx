/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import { getTranslation } from "@/translation/i18n";
import AddReservoir from "@/pages/reservoirs/AddReserviour";
import ReservoirActions from "@/redux/reservoir/action";
import { Reservoir } from "@/pages/farm/types";
import routePaths from "@/config/routePaths";
import userEvent from "@testing-library/user-event";

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
}));

describe("Add reservoir page", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("should render the add reservoir page correctly", () => {
    renderWithProvider(<AddReservoir />, { store });
    expect(
      screen.getByText(getTranslation("farm.createFarm.addFarm.addReservoir"))
    ).toBeInTheDocument();

    expect(
      screen.getByText(getTranslation("global.cancel"))
    ).toBeInTheDocument();

    expect(screen.getByText(getTranslation("global.add"))).toBeInTheDocument();
  });

  test("should apply regex validation errors to add reservoir fields", async () => {
    renderWithProvider(<AddReservoir />, { store });

    await userEvent.type(
      screen.getByLabelText(
        getTranslation("farm.createFarm.reservoir.reservoirCapacity")
      ),
      "abc"
    );
    await userEvent.type(
      screen.getByLabelText(
        getTranslation("farm.createFarm.reservoir.phReservoirCapacity")
      ),
      "xyz"
    );

    await userEvent.type(
      screen.getByLabelText(
        getTranslation(
          "farm.createFarm.reservoir.nutrientWaterReservoirCapacity"
        )
      ),
      "prt"
    );

    await userEvent.type(
      screen.getByLabelText(
        getTranslation(
          "farm.createFarm.reservoir.stockNutrientSolutionCapacity"
        )
      ),
      "rty"
    );

    await waitFor(async () => {
      expect(
        await screen.findByText(
          getTranslation(
            "farm.createFarm.reservoir.reservoirCapacityRegexMessage"
          )
        )
      ).toBeInTheDocument();
      expect(
        await screen.findByText(
          getTranslation(
            "farm.createFarm.reservoir.phReservoirCapacityRegexMessage"
          )
        )
      ).toBeInTheDocument();

      expect(
        await screen.findByText(
          getTranslation(
            "farm.createFarm.reservoir.nutrientWaterReservoirCapacityRegexMessage"
          )
        )
      ).toBeInTheDocument();

      expect(
        await screen.findByText(
          getTranslation(
            "farm.createFarm.reservoir.stockNutrientSolutionCapacityRegexMessage"
          )
        )
      ).toBeInTheDocument();
    });
  });

  test("should handle errors from the store and apply to form reservoir fields", async () => {
    const errorState = {
      [ReservoirActions.ADD_RESERVOIR_FINISHED]: {
        errors: [
          {
            location: "reservoirCapacity",
            message: "reservoirCapacity error",
          },
          {
            location: "phReservoirCapacity",
            message: "phReservoirCapacity error",
          },
        ],
      },
    };

    store = setupDefaultStore({ error: errorState });

    renderWithProvider(<AddReservoir />, { store });

    expect(
      await screen.findByText("reservoirCapacity error")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("phReservoirCapacity error")
    ).toBeInTheDocument();
  });

  test("should create reservoir", async () => {
    renderWithProvider(<AddReservoir />, { store });

    fireEvent.change(screen.getByLabelText(getTranslation("global.name")), {
      target: { value: "reservoir" },
    });

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.reservoir.reservoirCapacity")
      ),
      { target: { value: "1234" } }
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.reservoir.phReservoirCapacity")
      ),
      { target: { value: "2345" } }
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation(
          "farm.createFarm.reservoir.nutrientWaterReservoirCapacity"
        )
      ),
      { target: { value: "789" } }
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation(
          "farm.createFarm.reservoir.stockNutrientSolutionCapacity"
        )
      ),
      { target: { value: "876" } }
    );

    fireEvent.click(await screen.findByTestId("addRerservoir-addButton"));

    const reservoir: Reservoir = {
      name: "reservoir",
      reservoirCapacity: 1234,
      nutrientWaterReservoirCapacity: 789,
      phReservoirCapacity: 2345,
      stockNutrientSolutionCapacity: 876,
    };

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        ReservoirActions.addReservoir(reservoir)
      );
    });
  });

  test("should navigate to reservoir page when 'X' button is clicked", () => {
    renderWithProvider(<AddReservoir />, { store });

    const closeButton = screen.getByTestId("reservoir-close-icon");
    fireEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith(routePaths.reservoirs);
  });

  test("should navigate to reservoir page when 'Cancel' button is clicked", () => {
    renderWithProvider(<AddReservoir />, { store });

    const cancelButton = screen.getByTestId("addRerservoir-cancelButton");
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith(routePaths.reservoirs);
  });
});
