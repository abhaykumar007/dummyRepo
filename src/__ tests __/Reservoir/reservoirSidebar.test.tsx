/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import { getTranslation } from "@/translation/i18n";
import ReservoirSideBar from "@/pages/reservoirs/Sidebar";
import ReservoirActions from "@/redux/reservoir/action";

const dummyFarms = {
  farms: null,
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

const dummyReservoir = {
  reservoirs: null,
  selectedReservoir: {
    reservoirId: "re98742fc5",
    name: "Test Reservoir",
    reservoirCapacity: 10,
    nutrientWaterReservoirCapacity: 60,
    phReservoirCapacity: 40,
    stockNutrientSolutionCapacity: 80,
    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
    createdDate: null,
    updatedDate: null,
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

describe("Reservoir sidebar", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("should render the reservoir side bar", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<ReservoirSideBar />, { store });

    expect(
      await screen.findByText(
        getTranslation("reservoir.sideBar.reservoirDetails")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("global.name")}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("reservoir.reservoirCapacity")}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${getTranslation("reservoir.nutrientWaterReservoirCapacity")}:`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("reservoir.phReservoirCapacity")}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${getTranslation("reservoir.stockNutrientSolutionCapacity")}:`
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(`${getTranslation("global.createdBy")}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("global.createdDate")}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("global.updatedBy")}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("global.updatedDate")}:`)
    ).toBeInTheDocument();
  });

  test("should close reservoir sidebar when close icon is clicked", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<ReservoirSideBar />, { store });

    expect(
      screen.queryByText(getTranslation("reservoir.sideBar.reservoirDetails"))
    ).toBeInTheDocument();

    const closeIcon = screen.getByTestId("reservoir-sidebar-close-btn");
    fireEvent.click(closeIcon);

    expect(store.dispatch).toHaveBeenCalledWith(
      ReservoirActions.setSelectedReservoir(null)
    );
  });

  test("should not render the reservoir sidebar when selectedReservoir is null", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir, selectedReservoir: null },
    });
    renderWithProvider(<ReservoirSideBar />, { store });

    expect(
      screen.queryByText(getTranslation("reservoir.sideBar.reservoirDetails"))
    ).not.toBeInTheDocument();
  });

  test("should render reservoir details correctly with selected reservoir", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<ReservoirSideBar />, { store });

    expect(
      screen.getByText(dummyReservoir.selectedReservoir.name)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        dummyReservoir.selectedReservoir.reservoirCapacity.toString()
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        dummyReservoir.selectedReservoir.nutrientWaterReservoirCapacity.toString()
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        dummyReservoir.selectedReservoir.phReservoirCapacity.toString()
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        dummyReservoir.selectedReservoir.stockNutrientSolutionCapacity.toString()
      )
    ).toBeInTheDocument();
  });

  test("should render input field when EditableReservoirField is clicked", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<ReservoirSideBar />, { store });

    // name
    const editableNameField = screen.getByTestId("name-container");
    fireEvent.click(editableNameField);

    expect(screen.getByTestId("name-input")).toHaveValue("Test Reservoir");

    // reservoirCapacity
    const editableReservoirCapacityField = screen.getByTestId(
      "reservoirCapacity-container"
    );
    fireEvent.click(editableReservoirCapacityField);

    expect(screen.getByTestId("reservoirCapacity-input")).toHaveValue("10");

    // nutrientWaterReservoirCapacity
    const editableNutrientWaterReservoirCapacityField = screen.getByTestId(
      "nutrientWaterReservoirCapacity-container"
    );
    fireEvent.click(editableNutrientWaterReservoirCapacityField);

    expect(
      screen.getByTestId("nutrientWaterReservoirCapacity-input")
    ).toHaveValue("60");

    // phReservoirCapacity
    const editablePHReservoirCapacityField = screen.getByTestId(
      "phReservoirCapacity-container"
    );
    fireEvent.click(editablePHReservoirCapacityField);

    expect(screen.getByTestId("phReservoirCapacity-input")).toHaveValue("40");

    // stockNutrientSolutionCapacity
    const editableStockNutrientSolutionCapacityField = screen.getByTestId(
      "stockNutrientSolutionCapacity-container"
    );
    fireEvent.click(editableStockNutrientSolutionCapacityField);

    expect(
      screen.getByTestId("stockNutrientSolutionCapacity-input")
    ).toHaveValue("80");
  });

  test("should edit the EditableReservoirField and dispatch it with updated data by clicking on save button", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<ReservoirSideBar />, { store });

    // name
    const editableNameField = screen.getByTestId("name-container");
    fireEvent.click(editableNameField);
    const nameInput = screen.getByTestId("name-input");
    fireEvent.change(nameInput, {
      target: { value: "Updated reservoir Name" },
    });
    expect(nameInput).toHaveValue("Updated reservoir Name");

    const nameSaveButton = screen.getByTestId("name-save");
    fireEvent.click(nameSaveButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      ReservoirActions.updateReservoir("name", "re98742fc5", {
        name: "Updated reservoir Name",
      })
    );

    // reservoirCapacity
    const editableReservoirCapacityField = screen.getByTestId(
      "reservoirCapacity-container"
    );
    fireEvent.click(editableReservoirCapacityField);
    const reservoirCapacityInput = screen.getByTestId(
      "reservoirCapacity-input"
    );
    fireEvent.change(reservoirCapacityInput, { target: { value: 7000 } });
    expect(reservoirCapacityInput).toHaveValue("7000");

    const reservoirCapacitySaveButton = screen.getByTestId(
      "reservoirCapacity-save"
    );
    fireEvent.click(reservoirCapacitySaveButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      ReservoirActions.updateReservoir("reservoirCapacity", "re98742fc5", {
        reservoirCapacity: 7000,
      })
    );

    // nutrientWaterReservoirCapacity
    const editableNutrientWaterReservoirCapacityField = screen.getByTestId(
      "nutrientWaterReservoirCapacity-container"
    );
    fireEvent.click(editableNutrientWaterReservoirCapacityField);
    const nutrientWaterReservoirCapacityInput = screen.getByTestId(
      "nutrientWaterReservoirCapacity-input"
    );
    fireEvent.change(nutrientWaterReservoirCapacityInput, {
      target: { value: 34 },
    });
    expect(nutrientWaterReservoirCapacityInput).toHaveValue("34");

    const nutrientWaterReservoirCapacitySaveButton = screen.getByTestId(
      "nutrientWaterReservoirCapacity-save"
    );
    fireEvent.click(nutrientWaterReservoirCapacitySaveButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      ReservoirActions.updateReservoir(
        "nutrientWaterReservoirCapacity",
        "re98742fc5",
        {
          nutrientWaterReservoirCapacity: 34,
        }
      )
    );

    // phReservoirCapacity
    const editablePHReservoirCapacityField = screen.getByTestId(
      "phReservoirCapacity-container"
    );
    fireEvent.click(editablePHReservoirCapacityField);
    const phReservoirCapacityInput = screen.getByTestId(
      "phReservoirCapacity-input"
    );
    fireEvent.change(phReservoirCapacityInput, {
      target: { value: 44 },
    });
    expect(phReservoirCapacityInput).toHaveValue("44");

    const phReservoirCapacitySaveButton = screen.getByTestId(
      "phReservoirCapacity-save"
    );
    fireEvent.click(phReservoirCapacitySaveButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      ReservoirActions.updateReservoir("phReservoirCapacity", "re98742fc5", {
        phReservoirCapacity: 44,
      })
    );

    // stockNutrientSolutionCapacity
    const editableStockNutrientSolutionCapacityField = screen.getByTestId(
      "stockNutrientSolutionCapacity-container"
    );
    fireEvent.click(editableStockNutrientSolutionCapacityField);
    const stockNutrientSolutionCapacityInput = screen.getByTestId(
      "stockNutrientSolutionCapacity-input"
    );
    fireEvent.change(stockNutrientSolutionCapacityInput, {
      target: { value: 47 },
    });
    expect(stockNutrientSolutionCapacityInput).toHaveValue("47");

    const stockNutrientSolutionCapacitySaveButton = screen.getByTestId(
      "stockNutrientSolutionCapacity-save"
    );
    fireEvent.click(stockNutrientSolutionCapacitySaveButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      ReservoirActions.updateReservoir(
        "stockNutrientSolutionCapacity",
        "re98742fc5",
        {
          stockNutrientSolutionCapacity: 47,
        }
      )
    );
  });

  test("should revert to previous value when EditableReservoirField cancel button is clicked", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<ReservoirSideBar />, { store });

    // name
    let editableNameField = screen.getByTestId("name-container");
    fireEvent.click(editableNameField);
    const nameInput = screen.getByTestId("name-input");
    fireEvent.change(nameInput, {
      target: { value: "Updated reservoir Name" },
    });
    expect(nameInput).toHaveValue("Updated reservoir Name");

    const nameCancelButton = screen.getByTestId("name-cancel");
    fireEvent.click(nameCancelButton);

    await waitFor(() => {
      editableNameField = screen.getByTestId("name-container");
      expect(editableNameField).toHaveTextContent("Test Reservoir");
    });

    // reservoirCapacity
    let editableReservoirCapacityField = screen.getByTestId(
      "reservoirCapacity-container"
    );
    fireEvent.click(editableReservoirCapacityField);
    const reservoirCapacityInput = screen.getByTestId(
      "reservoirCapacity-input"
    );
    fireEvent.change(reservoirCapacityInput, { target: { value: 7000 } });
    expect(reservoirCapacityInput).toHaveValue("7000");

    const reservoirCapacityCancelButton = screen.getByTestId(
      "reservoirCapacity-cancel"
    );
    fireEvent.click(reservoirCapacityCancelButton);

    await waitFor(() => {
      editableReservoirCapacityField = screen.getByTestId(
        "reservoirCapacity-container"
      );
      expect(editableReservoirCapacityField).toHaveTextContent("10");
    });

    // nutrientWaterReservoirCapacity
    let editableNutrientWaterReservoirCapacityField = screen.getByTestId(
      "nutrientWaterReservoirCapacity-container"
    );
    fireEvent.click(editableNutrientWaterReservoirCapacityField);
    const nutrientWaterReservoirCapacityInput = screen.getByTestId(
      "nutrientWaterReservoirCapacity-input"
    );
    fireEvent.change(nutrientWaterReservoirCapacityInput, {
      target: { value: 34 },
    });
    expect(nutrientWaterReservoirCapacityInput).toHaveValue("34");

    const nutrientWaterReservoirCapacityCancelButton = screen.getByTestId(
      "nutrientWaterReservoirCapacity-cancel"
    );
    fireEvent.click(nutrientWaterReservoirCapacityCancelButton);

    await waitFor(() => {
      editableNutrientWaterReservoirCapacityField = screen.getByTestId(
        "nutrientWaterReservoirCapacity-container"
      );
      expect(editableNutrientWaterReservoirCapacityField).toHaveTextContent(
        "60"
      );
    });

    // phReservoirCapacity
    let editablePHReservoirCapacityField = screen.getByTestId(
      "phReservoirCapacity-container"
    );
    fireEvent.click(editablePHReservoirCapacityField);
    const phReservoirCapacityInput = screen.getByTestId(
      "phReservoirCapacity-input"
    );
    fireEvent.change(phReservoirCapacityInput, {
      target: { value: 44 },
    });
    expect(phReservoirCapacityInput).toHaveValue("44");

    const phReservoirCapacityCancelButton = screen.getByTestId(
      "phReservoirCapacity-cancel"
    );
    fireEvent.click(phReservoirCapacityCancelButton);

    await waitFor(() => {
      editablePHReservoirCapacityField = screen.getByTestId(
        "phReservoirCapacity-container"
      );
      expect(editablePHReservoirCapacityField).toHaveTextContent("40");
    });

    // stockNutrientSolutionCapacity
    let editableStockNutrientSolutionCapacityField = screen.getByTestId(
      "stockNutrientSolutionCapacity-container"
    );
    fireEvent.click(editableStockNutrientSolutionCapacityField);
    const stockNutrientSolutionCapacityInput = screen.getByTestId(
      "stockNutrientSolutionCapacity-input"
    );
    fireEvent.change(stockNutrientSolutionCapacityInput, {
      target: { value: 47 },
    });
    expect(stockNutrientSolutionCapacityInput).toHaveValue("47");

    const stockNutrientSolutionCapacityCancelButton = screen.getByTestId(
      "stockNutrientSolutionCapacity-cancel"
    );
    fireEvent.click(stockNutrientSolutionCapacityCancelButton);

    await waitFor(() => {
      editableStockNutrientSolutionCapacityField = screen.getByTestId(
        "stockNutrientSolutionCapacity-container"
      );
      expect(editableStockNutrientSolutionCapacityField).toHaveTextContent(
        "80"
      );
    });
  });

  test("should validate reservoirCapacity field", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<ReservoirSideBar />, { store });

    const reservoirCapacityField = screen.getByTestId(
      "reservoirCapacity-container"
    );
    fireEvent.click(reservoirCapacityField);
    const reservoirCapacityInput = screen.getByTestId(
      "reservoirCapacity-input"
    );

    // as a validator function takes string, so it will fail when you pass number in string. eg("876")
    fireEvent.change(reservoirCapacityInput, { target: { value: "jdbksd" } });
    const reservoirCapacitySaveButton = screen.getByTestId(
      "reservoirCapacity-save"
    );
    fireEvent.click(reservoirCapacitySaveButton);

    await waitFor(() => {
      expect(
        screen.getByText(getTranslation("farm.numberValidator"))
      ).toBeInTheDocument();
    });
  });

  test("should validate nutrientWaterReservoirCapacity field", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<ReservoirSideBar />, { store });

    const nutrientWaterReservoirCapacityField = screen.getByTestId(
      "nutrientWaterReservoirCapacity-container"
    );
    fireEvent.click(nutrientWaterReservoirCapacityField);
    const nutrientWaterReservoirCapacityInput = screen.getByTestId(
      "nutrientWaterReservoirCapacity-input"
    );

    // as a validator function takes string, so it will fail when you pass number in string. eg("876")
    fireEvent.change(nutrientWaterReservoirCapacityInput, {
      target: { value: "jdbksd" },
    });
    const nutrientWaterReservoirCapacitySaveButton = screen.getByTestId(
      "nutrientWaterReservoirCapacity-save"
    );
    fireEvent.click(nutrientWaterReservoirCapacitySaveButton);

    await waitFor(() => {
      expect(
        screen.getByText(getTranslation("farm.numberValidator"))
      ).toBeInTheDocument();
    });
  });

  test("should validate phReservoirCapacity field", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<ReservoirSideBar />, { store });

    const phReservoirCapacityField = screen.getByTestId(
      "phReservoirCapacity-container"
    );
    fireEvent.click(phReservoirCapacityField);
    const phReservoirCapacityInput = screen.getByTestId(
      "phReservoirCapacity-input"
    );

    // as a validator function takes string, so it will fail when you pass number in string. eg("876")
    fireEvent.change(phReservoirCapacityInput, {
      target: { value: "jdbksd" },
    });
    const phReservoirCapacitySaveButton = screen.getByTestId(
      "phReservoirCapacity-save"
    );
    fireEvent.click(phReservoirCapacitySaveButton);

    await waitFor(() => {
      expect(
        screen.getByText(getTranslation("farm.numberValidator"))
      ).toBeInTheDocument();
    });
  });

  test("should validate stockNutrientSolutionCapacity field", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<ReservoirSideBar />, { store });

    const stockNutrientSolutionCapacityField = screen.getByTestId(
      "stockNutrientSolutionCapacity-container"
    );
    fireEvent.click(stockNutrientSolutionCapacityField);
    const stockNutrientSolutionCapacityInput = screen.getByTestId(
      "stockNutrientSolutionCapacity-input"
    );

    // as a validator function takes string, so it will fail when you pass number in string. eg("876")
    fireEvent.change(stockNutrientSolutionCapacityInput, {
      target: { value: "jdbksd" },
    });
    const stockNutrientSolutionCapacitySaveButton = screen.getByTestId(
      "stockNutrientSolutionCapacity-save"
    );
    fireEvent.click(stockNutrientSolutionCapacitySaveButton);

    await waitFor(() => {
      expect(
        screen.getByText(getTranslation("farm.numberValidator"))
      ).toBeInTheDocument();
    });
  });

  test("should display error on EditableReservoirField field", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
      error: {
        "[scope:reservoirCapacity]RESERVOIR/UPDATE_RESERVOIR_FINISHED": {
          errors: [
            {
              error: "ERR_INVALID_FIELD_RESERVOIRCAPACITY",
              //   message: "reservoirCapacity must not be greater than 50000",
              type: "error",
              location: "reservoirCapacity",
            },
          ],
        },
      },
    });

    renderWithProvider(<ReservoirSideBar />, { store });

    const reservoirCapacityField = screen.getByTestId(
      "reservoirCapacity-container"
    );
    fireEvent.click(reservoirCapacityField);

    await waitFor(() => {
      expect(
        screen.queryByText("Please enter valid value")
      ).toBeInTheDocument();
    });
  });

  test("should delete the reservoir", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<ReservoirSideBar />, { store });

    fireEvent.click(screen.getByTestId("reservoir-sidebar-threeDots-icon"));
    expect(
      await screen.findByText(getTranslation("global.delete"))
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(getTranslation("global.delete")));

    expect(
      await screen.findByText(getTranslation("global.yes"))
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText(getTranslation("global.yes")));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        ReservoirActions.deleteReservoir()
      );
    });
  });

  test("Displays error message when detele reservoir api fails", () => {
    store = setupDefaultStore({
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
      error: {
        [ReservoirActions.DELETE_RESERVOIR_FINISHED]: {
          errors: [{ message: "Error occurred" }],
        },
      },
    });

    renderWithProvider(<ReservoirSideBar />, { store });

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });
});
