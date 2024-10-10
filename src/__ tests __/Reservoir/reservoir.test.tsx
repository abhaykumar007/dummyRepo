/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import { getTranslation } from "@/translation/i18n";
import Reservoirs from "@/pages/reservoirs";
import ReservoirActions from "@/redux/reservoir/action";
import routePaths from "@/config/routePaths";
import ReservoirCard from "@/pages/reservoirs/reservoirCard";

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
  reservoirs: {
    entities: {
      reservoirs: {
        re98742fc5: {
          reservoirId: "re98742fc5",
          name: "Test Reservoir",
          reservoirCapacity: 10,
          nutrientWaterReservoirCapacity: 60,
          phReservoirCapacity: 40,
          stockNutrientSolutionCapacity: 80,
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          createdDate: "2024-07-05T06:08:11.250Z",
          updatedDate: "2024-07-05T06:08:11.250Z",
        },
      },
    },
    result: ["re98742fc5"],
  },
  selectedReservoir: null,
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

describe("Reservoir page", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("should render the reservoir cards", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<Reservoirs />, { store });

    const reservoirCapacityDivArray = screen.getAllByText(
      `${getTranslation("reservoir.reservoirCapacity")}:`
    );
    const nutrientWaterReservoirCapacityDivArray = screen.getAllByText(
      `${getTranslation("reservoir.nutrientWaterReservoirCapacity")}:`
    );
    expect(reservoirCapacityDivArray[0]).toBeInTheDocument();
    expect(nutrientWaterReservoirCapacityDivArray[0]).toBeInTheDocument();
  });

  test("should render no reservoir when there is no reservoir present", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: {},
    });
    renderWithProvider(<Reservoirs />, { store });

    expect(
      screen.getByText(getTranslation("reservoir.noReservoir"))
    ).toBeInTheDocument();
  });

  test("should dispatch setSelectedReservoir action when reservoir card is clicked", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<Reservoirs />, { store });

    const reservoirCard = screen.getByText("Test Reservoir");
    fireEvent.click(reservoirCard);

    expect(store.dispatch).toHaveBeenCalledWith(
      ReservoirActions.setSelectedReservoir(
        dummyReservoir.reservoirs.entities.reservoirs.re98742fc5
      )
    );
  });

  test("should navigate to reservoir creation page when 'Add reservoir' button is clicked", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<Reservoirs />, { store });

    const addReservoirButton = screen.getByText(
      getTranslation("farm.createFarm.addFarm.addReservoir")
    );
    fireEvent.click(addReservoirButton);

    expect(mockNavigate).toHaveBeenCalledWith(routePaths.reservoirCreate);
  });

  test("should fetch reservoir data again when refresh button is clicked", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: { ...dummyReservoir },
    });
    renderWithProvider(<Reservoirs />, { store });

    const refreshButton = screen.getByTestId("reservoir-refresh-button");
    fireEvent.click(refreshButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      ReservoirActions.fetchReservoir()
    );
  });

  test("Displays error message when Request reservoir api fails", () => {
    store = setupDefaultStore({
      users: { ...dummyUser },
      error: {
        [ReservoirActions.REQUEST_RESERVOIR_FINISHED]: {
          errors: [{ message: "Error occurred" }],
        },
      },
    });

    renderWithProvider(<Reservoirs />, { store });

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("should render loader in reservoir card when api request is send", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms, farms: null, selectedFarmId: null },
      users: { ...dummyUser },
      requesting: {
        [ReservoirActions.REQUEST_RESERVOIR]: true,
      },
    });

    renderWithProvider(<ReservoirCard />, { store });

    const loader = screen.getByRole("img", { name: "loading" });
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass("anticon-loading");
  });

  test("should render the reservoir sidebar", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
      reservoirs: {
        ...dummyReservoir,
        selectedReservoir:
          dummyReservoir.reservoirs.entities.reservoirs.re98742fc5,
      },
    });
    renderWithProvider(<Reservoirs />, { store });

    expect(
      await screen.findByText(
        getTranslation("reservoir.sideBar.reservoirDetails")
      )
    ).toBeInTheDocument();
  });
});
