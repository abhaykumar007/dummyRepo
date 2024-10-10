/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import { getTranslation } from "@/translation/i18n";
import CreateFarm from "@/pages/farm/CreateFarm";
import Stepper from "@/pages/farm/CreateFarm/stepper";
import FarmActions from "@/redux/farm/action";
import AddFarm from "@/pages/farm/CreateFarm/Steps/addFarm";
import { Form } from "antd";
import AddReservoirs from "@/pages/farm/CreateFarm/Steps/addReservoirs";
import AddPolyhouses from "@/pages/farm/CreateFarm/Steps/addPolyhouses";
import ZoneCard from "@/pages/farm/CreateFarm/Steps/zoneCard";
import { Nursery } from "@/pages/farm/types";
import AddNursery from "@/pages/farm/CreateFarm/Steps/addNursery";
import { errorDetail } from "@/types/error";
import NuseryCard from "@/pages/farm/CreateFarm/Steps/nurseryCard";
import StepperNavigation from "@/pages/farm/CreateFarm/stepperNavigation";
import userEvent from "@testing-library/user-event";
import AddZones from "@/pages/farm/CreateFarm/Steps/addZones";
import routePaths from "@/config/routePaths";

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

const mockNurseries: Nursery[] = [
  {
    key: 0,
    name: "Nursery 1",
    area: 100,
    seedCount: 200,
    germinationArea: 50,
    type: "Open",
    germinationType: "Tray",
    wateringType: "Manual",
    wateringSchedule: "Daily",
  },
  {
    key: 1,
    name: "Nursery 2",
    area: 200,
    seedCount: 400,
    germinationArea: 100,
    type: "Close",
    germinationType: "Coco plugs",
    wateringType: "Automatic",
    wateringSchedule: "Daily 9-12",
  },
];

const mockAddNursery = jest.fn();
const mockUpdateNurseries = jest.fn();

const mockZones = [
  {
    key: 0,
    name: "Zone 1",
    systemType: "NFT system",
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
  },
  {
    key: 1,
    name: "Zone 2",
    systemType: "Raft system",
    area: 200,
    growingArea: {
      area: 30,
      rowCount: 51,
      plantCountPerRow: 20,
      plantSpacing: 14,
      rowSpacing: 3,
      wateringType: "Manual",
      wateringSchedule: "Daily 9-12",
    },
  },
];

const addZone = jest.fn();
const updateZones = jest.fn();

describe("Add farm page", () => {
  let store: any;
  beforeEach(() => {
    store = setupDefaultStore();
  });
  test("should render the create farm", () => {
    renderWithProvider(<CreateFarm />, { store });
    expect(
      screen.getByText(getTranslation("farm.farmCreation"))
    ).toBeInTheDocument();
  });
  test("should render farm error", () => {
    store = setupDefaultStore({
      error: {
        [FarmActions.ADD_FARM_FINISHED]: {
          errors: [
            {
              error: "Not Found",
              message: "Cannot POST /v2/farmskjbkjb",
              type: "error",
              location: "",
            },
          ],
          exception: "NotFoundException",
          path: "/v2/farmskjbkjb",
          code: 404,
          timestamp: 1725253062594,
          actionType: "farms/ADD_FARM_FINISHED",
        },
      },
    });
    renderWithProvider(<CreateFarm />, { store });

    expect(screen.getByText("Cannot POST /v2/farmskjbkjb")).toBeInTheDocument();
  });

  test("should render polyhouse error", () => {
    store = setupDefaultStore({
      error: {
        [FarmActions.ADD_POLYHOUSE_TO_FARM_FINISHED]: {
          errors: [
            {
              error: "Not Found",
              message: "Cannot POST /v2/farmskjbkjb",
              type: "error",
              location: "",
            },
          ],
          exception: "NotFoundException",
          path: "/v2/farmskjbkjb",
          code: 404,
          timestamp: 1725253062594,
          actionType: "FarmActions.ADD_POLYHOUSE_TO_FARM_FINISHED",
        },
      },
    });
    renderWithProvider(<CreateFarm />, { store });

    expect(screen.getByText("Cannot POST /v2/farmskjbkjb")).toBeInTheDocument();
  });
});

describe("Stepper component", () => {
  let store: any;
  let form: any;
  let setFarmValues: any;
  let setCurrent: any;
  beforeEach(() => {
    store = setupDefaultStore();
    setCurrent = jest.fn();
    setFarmValues = jest.fn();
    form = {
      validateFields: jest.fn(() => Promise.resolve()),
      getFieldsValue: jest.fn(() => ({})),
    };
  });

  test("should render the stepper with correct titles and icons", () => {
    renderWithProvider(
      <Stepper
        current={0}
        setCurrent={setCurrent}
        setFarmValues={setFarmValues}
        form={form}
      />,
      { store }
    );

    const farmSteps = screen.getAllByText(getTranslation("global.farm"));
    expect(farmSteps[0]).toBeInTheDocument();
    expect(farmSteps).toHaveLength(2);

    const reservoirStep = screen.getAllByText(
      getTranslation("global.reservoirs")
    );
    expect(reservoirStep[0]).toBeInTheDocument();
    expect(reservoirStep).toHaveLength(2);

    const polyhouseStep = screen.getAllByText(
      getTranslation("global.polyhouses")
    );
    expect(polyhouseStep[0]).toBeInTheDocument();
    expect(polyhouseStep).toHaveLength(2);
  });

  test("should navigate to the next step on valid form submission", async () => {
    renderWithProvider(
      <Stepper
        current={0}
        setCurrent={setCurrent}
        setFarmValues={setFarmValues}
        form={form}
      />,
      { store }
    );

    const reservoirStep = screen.getAllByText(
      getTranslation("global.reservoirs")
    );
    expect(reservoirStep[0]).toBeInTheDocument();

    fireEvent.click(reservoirStep[0]);
    await form.validateFields();
    expect(setCurrent).toHaveBeenCalledWith(1);
  });

  test("should not navigate to the next step on invalid form submission", async () => {
    form.validateFields = jest.fn(() => Promise.reject());
    renderWithProvider(
      <Stepper
        current={0}
        setCurrent={setCurrent}
        setFarmValues={setFarmValues}
        form={form}
      />,
      { store }
    );

    const reservoirStep = screen.getAllByText(
      getTranslation("global.reservoirs")
    );
    expect(reservoirStep[0]).toBeInTheDocument();

    fireEvent.click(reservoirStep[0]);
    await form.validateFields().catch(() => {});
    expect(setCurrent).not.toHaveBeenCalled();
  });

  test("should apply error colors based on error state", () => {
    const errorState = {
      [FarmActions.ADD_FARM_FINISHED]: {
        errors: [
          { location: ["reservoirs"], message: "Reservoir error" },
          { location: ["farm"], message: "Farm error" },
        ],
      },
    };

    store = setupDefaultStore({ error: errorState });

    renderWithProvider(
      <Stepper
        current={0}
        setCurrent={setCurrent}
        setFarmValues={setFarmValues}
        form={form}
      />,
      { store }
    );

    const farmSteps = screen.getAllByText(getTranslation("global.farm"));
    expect(farmSteps[0]).toBeInTheDocument();

    const reservoirStep = screen.getAllByText(
      getTranslation("global.reservoirs")
    );
    expect(reservoirStep[0]).toBeInTheDocument();

    expect(farmSteps[0]).toHaveStyle("color: red");
    expect(reservoirStep[0]).toHaveStyle("color: red");
  });

  test("should not directly navigate to the polyhouse when you are on reservoir step", async () => {
    form.validateFields = jest.fn(() => Promise.reject());
    renderWithProvider(
      <Stepper
        current={1}
        setCurrent={setCurrent}
        setFarmValues={setFarmValues}
        form={form}
      />,
      { store }
    );

    const polyhouseStep = screen.getAllByText(
      getTranslation("global.polyhouses")
    );
    expect(polyhouseStep[0]).toBeInTheDocument();

    fireEvent.click(polyhouseStep[0]);
    await form.validateFields().catch(() => {});
    expect(setCurrent).not.toHaveBeenCalled();
  });
});

const AddFarmWrapper = () => {
  const [form] = Form.useForm();
  return <AddFarm form={form} />;
};

describe("AddFarm component", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("should render the form fields correctly", () => {
    renderWithProvider(<AddFarmWrapper />, { store });

    expect(
      screen.getByLabelText(getTranslation("global.name"))
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        getTranslation("farm.createFarm.addFarm.namePlaceholder")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(getTranslation("farm.createFarm.addFarm.area"))
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        getTranslation("farm.createFarm.addFarm.areaPlaceholder")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.addFarm.nutrientType")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.addFarm.cultivableArea")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        getTranslation("farm.createFarm.addFarm.cultivableAreaPlaceholder")
      )
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.addFarm.nutrientDilutionRatio")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        getTranslation(
          "farm.createFarm.addFarm.nutrientDilutionRatioPlaceholder"
        )
      )
    ).toBeInTheDocument();
  });

  test("should display validation errors for required fields", async () => {
    renderWithProvider(<AddFarmWrapper />, { store });

    fireEvent.submit(screen.getByTestId("farm-form"));

    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.addFarm.nameMessage")
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.addFarm.areaMessage")
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.addFarm.nutrientTypeMessage")
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.addFarm.cultivableAreaMessage")
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.addFarm.nutrientDilutionRatioMessage")
      )
    ).toBeInTheDocument();
  });

  test("should apply regex validation errors", async () => {
    renderWithProvider(<AddFarmWrapper />, { store });
    await userEvent.type(
      screen.getByLabelText(getTranslation("farm.createFarm.addFarm.area")),
      "abc"
    );
    await userEvent.type(
      screen.getByLabelText(
        getTranslation("farm.createFarm.addFarm.cultivableArea")
      ),
      "xyz"
    );
    await userEvent.type(
      screen.getByLabelText(
        getTranslation("farm.createFarm.addFarm.nutrientDilutionRatio")
      ),
      "1:xyz"
    );

    await waitFor(async () => {
      expect(
        await screen.findByText(
          getTranslation("farm.createFarm.addFarm.areaRegexMessage")
        )
      ).toBeInTheDocument();
      expect(
        await screen.findByText(
          getTranslation("farm.createFarm.addFarm.cultivableAreaRegexMessage")
        )
      ).toBeInTheDocument();
      expect(
        await screen.findByText(
          getTranslation(
            "farm.createFarm.addFarm.nutrientDilutionRatioRegexMessage"
          )
        )
      ).toBeInTheDocument();
    });
  });

  test("should handle errors from the store and apply to form fields", async () => {
    const errorState = {
      [FarmActions.ADD_FARM_FINISHED]: {
        errors: [
          { location: "name", message: "Name error" },
          { location: "area" },
          {
            location: "nutrient.dilutionRatio",
          },
        ],
      },
    };

    store = setupDefaultStore({ error: errorState });

    renderWithProvider(<AddFarmWrapper />, { store });

    expect(await screen.findByText("Name error")).toBeInTheDocument();
    // expect(await screen.findByText("Area error")).toBeInTheDocument();
    const errorMessageArray = await screen.findAllByText(
      "Please enter valid value"
    );
    expect(errorMessageArray[0]).toBeInTheDocument();
  });

  test("should render the nutrient type options correctly", async () => {
    renderWithProvider(<AddFarmWrapper />, { store });

    fireEvent.mouseDown(
      screen.getByLabelText(
        getTranslation("farm.createFarm.addFarm.nutrientType")
      )
    );

    //  this came twice because lable and value are exactly same
    const nutrientType2PartMixSteps = screen.getAllByText(
      getTranslation("farm.createFarm.addFarm.nutrientType2PartMix")
    );
    expect(nutrientType2PartMixSteps[0]).toBeInTheDocument();
    expect(nutrientType2PartMixSteps).toHaveLength(2);

    const nutrientType3PartMixSteps = screen.getAllByText(
      getTranslation("farm.createFarm.addFarm.nutrientType3PartMix")
    );
    expect(nutrientType3PartMixSteps[0]).toBeInTheDocument();
    expect(nutrientType3PartMixSteps).toHaveLength(2);

    const nutrientTypeCustomNutrientMixSteps = screen.getAllByText(
      getTranslation("farm.createFarm.addFarm.nutrientType3PartMix")
    );
    expect(nutrientTypeCustomNutrientMixSteps[0]).toBeInTheDocument();
    expect(nutrientTypeCustomNutrientMixSteps).toHaveLength(2);
  });
});

const AddReservoirsWrapper = ({ reservoirs, setReservoirs }: any) => {
  const [form] = Form.useForm();

  return (
    <AddReservoirs
      form={form}
      reservoirs={reservoirs}
      setReservoirs={setReservoirs}
    />
  );
};

describe("AddReservoirs component", () => {
  let store: any;
  let reservoirs: any;
  let setReservoirs: any;

  beforeEach(() => {
    store = setupDefaultStore();
    reservoirs = [{ key: 0 }];
    setReservoirs = jest.fn();
  });

  test("should render the 'Add Reservoir' button", () => {
    renderWithProvider(
      <AddReservoirsWrapper
        reservoirs={reservoirs}
        setReservoirs={setReservoirs}
      />,
      { store }
    );

    const addReservoirButton = screen.getByText(
      getTranslation("farm.createFarm.addFarm.addReservoir")
    );
    expect(addReservoirButton).toBeInTheDocument();
  });

  test("should add a new reservoir", () => {
    renderWithProvider(
      <AddReservoirsWrapper
        reservoirs={reservoirs}
        setReservoirs={setReservoirs}
      />,
      {
        store,
      }
    );

    const addReservoirButton = screen.getByText(
      getTranslation("farm.createFarm.addFarm.addReservoir")
    );
    fireEvent.click(addReservoirButton);

    expect(setReservoirs).toHaveBeenCalledTimes(1);
    expect(setReservoirs).toHaveBeenCalledWith([...reservoirs, { key: 1 }]);
  });

  test("should delete a reservoir", () => {
    renderWithProvider(
      <AddReservoirsWrapper
        reservoirs={reservoirs}
        setReservoirs={setReservoirs}
      />,
      {
        store,
      }
    );

    const deleteButton = screen.getByTestId("deleteReserviour-0");
    fireEvent.click(deleteButton);

    expect(setReservoirs).toHaveBeenCalledTimes(1);
    expect(setReservoirs).toHaveBeenCalledWith([]);
  });

  test("should render form fields correctly for each reservoir", async () => {
    renderWithProvider(
      <AddReservoirsWrapper
        reservoirs={reservoirs}
        setReservoirs={setReservoirs}
      />,
      {
        store,
      }
    );

    expect(
      screen.getByLabelText(getTranslation("global.name"))
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.reservoir.reservoirCapacity")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.reservoir.phReservoirCapacity")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        getTranslation(
          "farm.createFarm.reservoir.nutrientWaterReservoirCapacity"
        )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        getTranslation(
          "farm.createFarm.reservoir.stockNutrientSolutionCapacity"
        )
      )
    ).toBeInTheDocument();

    const addReservoirButton = screen.getByText(
      getTranslation("farm.createFarm.addFarm.addReservoir")
    );
    fireEvent.click(addReservoirButton);

    expect(setReservoirs).toHaveBeenCalledTimes(1);
    expect(setReservoirs).toHaveBeenCalledWith([...reservoirs, { key: 1 }]);

    renderWithProvider(
      <AddReservoirsWrapper
        reservoirs={reservoirs}
        setReservoirs={setReservoirs}
      />,
      {
        store,
      }
    );

    expect(screen.getAllByText(getTranslation("global.name"))).toHaveLength(2);
    expect(
      screen.getAllByText(
        getTranslation("farm.createFarm.reservoir.reservoirCapacity")
      )
    ).toHaveLength(2);
    expect(
      screen.getAllByText(
        getTranslation("farm.createFarm.reservoir.phReservoirCapacity")
      )
    ).toHaveLength(2);
    expect(
      screen.getAllByText(
        getTranslation(
          "farm.createFarm.reservoir.nutrientWaterReservoirCapacity"
        )
      )
    ).toHaveLength(2);
    expect(
      screen.getAllByText(
        getTranslation(
          "farm.createFarm.reservoir.stockNutrientSolutionCapacity"
        )
      )
    ).toHaveLength(2);
  });

  test("should display validation errors for required fields", async () => {
    renderWithProvider(
      <AddReservoirsWrapper
        reservoirs={reservoirs}
        setReservoirs={setReservoirs}
      />,
      { store }
    );

    fireEvent.submit(screen.getByTestId("reservoir-form"));

    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.addFarm.nameMessage")
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.reservoir.reservoirCapacityMessage")
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.reservoir.phReservoirCapacityMessage")
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        getTranslation(
          "farm.createFarm.reservoir.nutrientWaterReservoirCapacityMessage"
        )
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        getTranslation(
          "farm.createFarm.reservoir.stockNutrientSolutionCapacityMessage"
        )
      )
    ).toBeInTheDocument();
  });

  test("should apply regex validation errors", async () => {
    renderWithProvider(
      <AddReservoirsWrapper
        reservoirs={reservoirs}
        setReservoirs={setReservoirs}
      />,
      { store }
    );

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
      "1:xyz"
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
    });
  });

  test("should handle errors from the store and apply to form fields", async () => {
    const errorState = {
      [FarmActions.ADD_FARM_FINISHED]: {
        errors: [
          { location: "reservoirs.0.phReservoirCapacity" },
          {
            location: "reservoirs.0.stockNutrientSolutionCapacity",
            message: "Stock nutrient solution capacity error",
          },
        ],
      },
    };

    store = setupDefaultStore({ error: errorState });

    renderWithProvider(
      <AddReservoirsWrapper
        reservoirs={reservoirs}
        setReservoirs={setReservoirs}
      />,
      { store }
    );

    expect(
      await screen.findByText("Please enter valid value")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Stock nutrient solution capacity error")
    ).toBeInTheDocument();
  });
});

const AddPolyhousesWrapper = ({ polyhouses, setPolyhouses }: any) => {
  const [form] = Form.useForm();

  return (
    <AddPolyhouses
      form={form}
      polyhouses={polyhouses}
      setPolyhouses={setPolyhouses}
    />
  );
};

describe("AddPolyhouses component", () => {
  let store: any;
  let polyhouses: any;
  let setPolyhouses: any;

  beforeEach(() => {
    store = setupDefaultStore();
    polyhouses = [{ key: 0, zones: [], nurseries: [] }];
    setPolyhouses = jest.fn();
  });

  test("should render the 'Add Polyhouse' button", () => {
    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );

    const addPolyhouseButton = screen.getByText(
      getTranslation("farm.createFarm.polyhouse.addPolyhouse")
    );
    expect(addPolyhouseButton).toBeInTheDocument();
  });

  test("should add a new polyhouse", () => {
    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );

    const addPolyhouseButton = screen.getByText(
      getTranslation("farm.createFarm.polyhouse.addPolyhouse")
    );
    fireEvent.click(addPolyhouseButton);

    expect(setPolyhouses).toHaveBeenCalledTimes(1);
    expect(setPolyhouses).toHaveBeenCalledWith([
      ...polyhouses,
      { key: 1, zones: [], nurseries: [] },
    ]);
  });

  test("should delete a polyhouse", () => {
    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );

    const deleteButton = screen.getByTestId("deletePolyhouse-0");
    fireEvent.click(deleteButton);

    expect(setPolyhouses).toHaveBeenCalledTimes(1);
    expect(setPolyhouses).toHaveBeenCalledWith([]);
  });

  test("should render form fields correctly for each polyhouse", async () => {
    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );

    expect(
      screen.getByLabelText(getTranslation("farm.createFarm.polyhouse.name"))
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.structureExpectedLife")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.plasticExpectedLife")
      )
    ).toBeInTheDocument();

    const addPolyhouseButton = screen.getByText(
      getTranslation("farm.createFarm.polyhouse.addPolyhouse")
    );
    fireEvent.click(addPolyhouseButton);

    expect(setPolyhouses).toHaveBeenCalledTimes(1);
    expect(setPolyhouses).toHaveBeenCalledWith([
      ...polyhouses,
      { key: 1, zones: [], nurseries: [] },
    ]);

    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );

    expect(
      screen.getAllByText(getTranslation("farm.createFarm.polyhouse.name"))
    ).toHaveLength(2);
    expect(
      screen.getAllByText(
        getTranslation("farm.createFarm.polyhouse.structureExpectedLife")
      )
    ).toHaveLength(2);
    expect(
      screen.getAllByText(
        getTranslation("farm.createFarm.polyhouse.plasticExpectedLife")
      )
    ).toHaveLength(2);
  });

  test("should display validation errors for required fields", async () => {
    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );

    fireEvent.submit(screen.getByTestId("polyhouse-form"));

    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.polyhouse.nameMessage")
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.polyhouse.structureExpectedLifeMessage")
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.polyhouse.plasticExpectedLifeMessage")
      )
    ).toBeInTheDocument();
  });

  test("should apply regex validation errors", async () => {
    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );

    await userEvent.type(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.structureExpectedLife")
      ),
      "abc"
    );
    await userEvent.type(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.plasticExpectedLife")
      ),
      "xyz"
    );

    await waitFor(async () => {
      expect(
        await screen.findByText(
          getTranslation(
            "farm.createFarm.polyhouse.structureExpectedLifeRegexMessage"
          )
        )
      ).toBeInTheDocument();
      expect(
        await screen.findByText(
          getTranslation(
            "farm.createFarm.polyhouse.plasticExpectedLifeRegexMessage"
          )
        )
      ).toBeInTheDocument();
    });
  });

  test("should handle errors from the store and apply to form fields", async () => {
    const errorState = {
      [FarmActions.ADD_POLYHOUSE_TO_FARM_FINISHED]: {
        errors: [
          {
            location: "0.structureExpectedLife",
            message: "Structure error",
          },
          {
            location: "0.plasticExpectedLife",
            message: "Plastic error",
          },
        ],
      },
    };

    store = setupDefaultStore({ error: errorState });

    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );

    expect(await screen.findByText("Structure error")).toBeInTheDocument();
    expect(await screen.findByText("Plastic error")).toBeInTheDocument();
  });

  test("should edit the added zones", async () => {
    polyhouses = [
      { key: 0, zones: mockZones, nurseries: [] },
      { key: 1, zones: [], nurseries: [] },
    ];
    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );
    expect(screen.getByText("Zone 1")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Zone 1"));

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.zone.zoneArea")
      ),
      { target: { value: 300 } }
    );

    expect(
      screen.getByText(getTranslation("global.update"))
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(getTranslation("global.update")));

    await waitFor(() => {
      expect(setPolyhouses).toHaveBeenCalledWith([
        {
          key: 0,
          zones: [
            {
              ...mockZones[0],
              area: 300,
            },
            {
              ...mockZones[1],
            },
          ],
          nurseries: [],
        },
        { key: 1, zones: [], nurseries: [] },
      ]);
    });
  });

  test("should edit the added nursery", async () => {
    polyhouses = [
      { key: 0, zones: [], nurseries: mockNurseries },
      { key: 1, zones: [], nurseries: [] },
    ];
    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );

    expect(
      screen.getByTestId("nusery-configureNurseries-0")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("nusery-configureNurseries-0"));

    expect(screen.getByText("Nursery 1")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Nursery 1"));

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.nursery.nurseryArea")
      ),
      { target: { value: 300 } }
    );

    expect(
      screen.getByText(getTranslation("global.update"))
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(getTranslation("global.update")));

    await waitFor(() => {
      expect(setPolyhouses).toHaveBeenCalledWith([
        {
          key: 0,
          zones: [],
          nurseries: [
            {
              ...mockNurseries[0],
              area: 300,
            },
            {
              ...mockNurseries[1],
            },
          ],
        },
        { key: 1, zones: [], nurseries: [] },
      ]);
    });
  });
  test("add a nursery successfully", async () => {
    polyhouses = [
      { key: 0, zones: [], nurseries: mockNurseries },
      { key: 1, zones: [], nurseries: [] },
    ];
    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );

    expect(
      screen.getByTestId("nusery-configureNurseries-0")
    ).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("nusery-configureNurseries-0"));

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

    const buttons = await screen.findAllByText("Add");
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(setPolyhouses).toHaveBeenCalledWith([
        {
          key: 0,
          zones: [],
          nurseries: [
            {
              ...mockNurseries[0],
            },
            {
              ...mockNurseries[1],
            },
            {
              name: "New nursery",
              type: "Open (no humidity control)",
              area: 100,
              germinationType: "Tray with coco peat",
              germinationArea: 50,
              seedCount: 5,
              wateringType: "Manual",
              wateringSchedule: "Daily",
              key: 2,
            },
          ],
        },
        { key: 1, zones: [], nurseries: [] },
      ]);
    });
  });

  test("add a zone successfully", async () => {
    polyhouses = [
      { key: 0, zones: mockZones, nurseries: [] },
      { key: 1, zones: [], nurseries: [] },
    ];
    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );

    const addZonesButtons = screen.getAllByText(
      getTranslation("farm.createFarm.polyhouse.zone.addZone")
    );

    fireEvent.click(addZonesButtons[0]);

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

    const buttons = await screen.findAllByText("Add");
    fireEvent.click(buttons[0]);

    await waitFor(() => {
      expect(setPolyhouses).toHaveBeenCalledWith([
        {
          key: 0,
          zones: [
            { ...mockZones[0] },
            { ...mockZones[1] },
            {
              name: "New Zone",
              systemType: "Raft system",
              area: 100,
              key: 2,
              growingArea: {
                area: 50,
                rowCount: 5,
                plantCountPerRow: 10,
                plantSpacing: 1,
                rowSpacing: 2,
                wateringType: "Manual",
                wateringSchedule: "Daily",
              },
            },
          ],
          nurseries: [
            // {
            //   ...mockNurseries[0],
            // },
            // {
            //   ...mockNurseries[1],
            // },
            // {
            //   name: "New nursery",
            //   type: "Open (no humidity control)",
            //   area: 100,
            //   germinationType: "Tray with coco peat",
            //   germinationArea: 50,
            //   seedCount: 5,
            //   wateringType: "Manual",
            //   wateringSchedule: "Daily",
            //   key: 2,
            // },
          ],
        },
        { key: 1, zones: [], nurseries: [] },
      ]);
    });
  });
});

// const handleOk = jest.fn();

describe("AddZones Component", () => {
  let store: any;
  let polyhouses: any;
  let setPolyhouses: any;

  beforeEach(() => {
    store = setupDefaultStore();
    polyhouses = [{ key: 0, zones: [], nurseries: [] }];
    setPolyhouses = jest.fn();
  });
  test("renders without errors", () => {
    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );
    expect(
      screen.getByText(getTranslation("farm.createFarm.polyhouse.zone.addZone"))
    ).toBeInTheDocument();
  });

  test("opens modal for adding a zone", () => {
    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );
    fireEvent.click(
      screen.getByText(getTranslation("farm.createFarm.polyhouse.zone.addZone"))
    );
    expect(
      screen.getByText(getTranslation("farm.createFarm.polyhouse.zone.name"))
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        getTranslation("farm.createFarm.polyhouse.zone.systemType")
      )
    ).toBeInTheDocument();
  });

  test("should delete the added zone", async () => {
    renderWithProvider(
      <AddZones
        polyhouseKey={1}
        zones={mockZones}
        addZone={addZone}
        updateZones={updateZones}
        errors={[]}
      />,
      { store }
    );

    expect(screen.getByText("Zone 1")).toBeInTheDocument();
    expect(screen.getByTestId("zone-card-delete-0")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("zone-card-delete-0"));

    await waitFor(() => {
      expect(updateZones).toHaveBeenCalledWith(1, mockZones);
    });
  });

  test("should close zone modal on cancel", async () => {
    renderWithProvider(
      <AddZones
        polyhouseKey={1}
        zones={mockZones}
        addZone={addZone}
        updateZones={updateZones}
        errors={[]}
      />,
      { store }
    );

    fireEvent.click(screen.getByTestId("zone-openModal-button"));
    expect(
      screen.getByText(getTranslation("farm.createFarm.polyhouse.zone.name"))
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Cancel" })
      ).not.toBeInTheDocument();
    });
  });

  test("displays validation errors on empty fields", async () => {
    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );
    fireEvent.click(
      screen.getByText(getTranslation("farm.createFarm.polyhouse.zone.addZone"))
    );
    fireEvent.click(screen.getByText(getTranslation("global.add")));

    await waitFor(() => {
      expect(
        screen.queryByText(
          getTranslation("farm.createFarm.polyhouse.zone.nameMessage")
        )
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          getTranslation("farm.createFarm.polyhouse.zone.systemTypeMessage")
        )
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          getTranslation("farm.createFarm.polyhouse.zone.zoneAreaMessage")
        )
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          getTranslation("farm.createFarm.polyhouse.zone.growAreaMessage")
        )
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          getTranslation("farm.createFarm.polyhouse.zone.rowCountMessage")
        )
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          getTranslation("farm.createFarm.polyhouse.zone.rowSpacingMessage")
        )
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          getTranslation("farm.createFarm.polyhouse.zone.plantSpacingMessage")
        )
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          getTranslation(
            "farm.createFarm.polyhouse.zone.plantCountPerRowMessage"
          )
        )
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          getTranslation("farm.createFarm.polyhouse.zone.wateringTypeMessage")
        )
      ).toBeInTheDocument();

      expect(
        screen.queryByText(
          getTranslation(
            "farm.createFarm.polyhouse.zone.wateringScheduleMessage"
          )
        )
      ).toBeInTheDocument();
    });
  });

  test("displays validation errors on invalid values", async () => {
    renderWithProvider(
      <AddPolyhousesWrapper
        polyhouses={polyhouses}
        setPolyhouses={setPolyhouses}
      />,
      { store }
    );

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

  // test("handles errors and should be displayed on modal", async () => {
  // renderWithProvider(
  //   <AddZones
  //     polyhouseKey={1}
  //     zones={mockZones}
  //     addZone={addZone}
  //     updateZones={updateZones}
  //     errors={[
  //       {
  //         error: "ERR_INVALID_FIELD_0.ZONES.0.GROWINGAREA.PLANTCOUNT",
  //         location: "0.zones.0.growingArea.plantCountPerRow",
  //         message: "plantCountPerRow error",
  //         type: "error",
  //       },
  //     ]}
  //   />,
  //   { store }
  // );

  //   fireEvent.click(screen.getByText("Zone 1"));

  //   // fireEvent.click(
  //   //   screen.getByText(getTranslation("farm.createFarm.polyhouse.zone.addZone"))
  //   // );

  //   await waitFor(() => {
  //     expect(screen.getByText("plantCountPerRow error")).toBeInTheDocument();
  //   });
  // });

  test("should apply errors to zones fields", async () => {
    const errorDetail: errorDetail[] = [
      {
        error: "error",
        type: "error",
        location: "0.zones.0.area",
        message: "area error",
      },
    ];
    renderWithProvider(
      <AddZones
        polyhouseKey={1}
        zones={mockZones}
        addZone={addZone}
        updateZones={updateZones}
        errors={errorDetail}
      />,
      { store }
    );

    fireEvent.click(screen.getByTestId("zone-card-0"));
    expect(
      screen.queryByText(getTranslation("farm.createFarm.polyhouse.zone.name"))
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("area error")).toBeInTheDocument();
    });
  });
  test("should apply errors in growing fields to zone fields", async () => {
    const errorDetail: errorDetail[] = [
      {
        error: "error",
        type: "error",
        location: "0.zones.0.growingArea.area",
        message: "area error",
      },
      {
        error: "error",
        type: "error",
        location: "0.zones.0.growingArea.plantSpacing",
      },
    ];
    renderWithProvider(
      <AddZones
        polyhouseKey={1}
        zones={mockZones}
        addZone={addZone}
        updateZones={updateZones}
        errors={errorDetail}
      />,
      { store }
    );

    fireEvent.click(screen.getByTestId("zone-card-0"));
    expect(
      screen.queryByText(getTranslation("farm.createFarm.polyhouse.zone.name"))
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("area error")).toBeInTheDocument();
      expect(
        screen.queryByText("Please enter valid value")
      ).toBeInTheDocument();
    });
  });
});

const onEdit = jest.fn();
const onDelete = jest.fn();
// const setIsModalOpen = jest.fn();
describe("ZoneCard Component", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
  });
  it("renders without errors", () => {
    renderWithProvider(
      <ZoneCard
        zones={mockZones}
        onEdit={onEdit}
        onDelete={onDelete}
        errors={[]}
      />,
      { store }
    );
    expect(screen.getByText("Zone 1")).toBeInTheDocument();
  });

  it("displays zones correctly", () => {
    renderWithProvider(
      <ZoneCard
        zones={mockZones}
        onEdit={onEdit}
        onDelete={onDelete}
        errors={[]}
      />,
      { store }
    );
    expect(screen.getByText("Zone 1")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("calls onEdit with the correct zone data", () => {
    renderWithProvider(
      <ZoneCard
        zones={mockZones}
        onEdit={onEdit}
        onDelete={onDelete}
        errors={[]}
      />,
      { store }
    );
    fireEvent.click(screen.getByText("Zone 1"));
    expect(onEdit).toHaveBeenCalledWith(mockZones[0]);
  });

  it("calls onDelete with the correct zone key", () => {
    renderWithProvider(
      <ZoneCard
        zones={mockZones}
        onEdit={onEdit}
        onDelete={onDelete}
        errors={[]}
      />,
      { store }
    );
    fireEvent.click(screen.getByText("Zone 1"));
    fireEvent.click(screen.getByTestId("zone-card-delete-0"));
    expect(onDelete).toHaveBeenCalledWith(String(mockZones[0].key));
  });

  it("displays no zones if none are passed", () => {
    renderWithProvider(
      <ZoneCard zones={[]} onEdit={onEdit} onDelete={onDelete} errors={[]} />,
      { store }
    );
    expect(screen.queryByText("Zone 1")).not.toBeInTheDocument();
  });
});

describe("AddNursery Component", () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
    store = setupDefaultStore();
  });

  test("should open modal when Add Nursery button is clicked", () => {
    renderWithProvider(
      <AddNursery
        polyhouseKey={1}
        nurseries={mockNurseries}
        addNursery={mockAddNursery}
        updateNurseries={mockUpdateNurseries}
        errors={[]}
      />,
      { store }
    );
    fireEvent.click(
      screen.getByText(
        getTranslation("farm.createFarm.polyhouse.nursery.addNursery")
      )
    );

    expect(screen.getByText(getTranslation("global.add"))).toBeInTheDocument();
    expect(
      screen.getByText(getTranslation("global.cancel"))
    ).toBeInTheDocument();
  });

  test("should delete the added nursery", async () => {
    renderWithProvider(
      <AddNursery
        polyhouseKey={1}
        nurseries={mockNurseries}
        addNursery={mockAddNursery}
        updateNurseries={mockUpdateNurseries}
        errors={[]}
      />,
      { store }
    );
    expect(screen.getByText("Nursery 1")).toBeInTheDocument();
    expect(screen.getByTestId("nusery-card-delete-0")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("nusery-card-delete-0"));

    await waitFor(() => {
      expect(mockUpdateNurseries).toHaveBeenCalledWith(1, mockNurseries);
    });
  });

  test("should close modal on cancel", async () => {
    renderWithProvider(
      <AddNursery
        polyhouseKey={1}
        nurseries={mockNurseries}
        addNursery={mockAddNursery}
        updateNurseries={mockUpdateNurseries}
        errors={[]}
      />,
      { store }
    );

    fireEvent.click(screen.getByTestId("nursery-openModal-button"));
    expect(
      screen.getByText(
        getTranslation("farm.createFarm.polyhouse.nursery.nurseryName")
      )
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Cancel" })
      ).not.toBeInTheDocument();
    });
  });

  // test("should validate and submit form with valid inputs", async () => {
  //   renderWithProvider(
  //     <AddNursery
  //       polyhouseKey={1}
  //       nurseries={mockNurseries}
  //       addNursery={mockAddNursery}
  //       updateNurseries={mockUpdateNurseries}
  //       errors={[]}
  //     />,
  //     { store }
  //   );
  //   fireEvent.click(
  //     screen.getByText(
  //       getTranslation("farm.createFarm.polyhouse.nursery.addNursery")
  //     )
  //   );

  //   fireEvent.change(
  //     screen.getByPlaceholderText(
  //       getTranslation(
  //         "farm.createFarm.polyhouse.nursery.nurseryNamePlaceholder"
  //       )
  //     ),
  //     { target: { value: "Nursery 1" } }
  //   );
  //   fireEvent.change(
  //     screen.getByPlaceholderText(
  //       getTranslation(
  //         "farm.createFarm.polyhouse.nursery.nurseryAreaPlaceholder"
  //       )
  //     ),
  //     { target: { value: "100" } }
  //   );
  //   fireEvent.change(
  //     screen.getByPlaceholderText(
  //       getTranslation("farm.createFarm.polyhouse.nursery.seedCountPlaceholder")
  //     ),
  //     { target: { value: "200" } }
  //   );
  //   fireEvent.change(
  //     screen.getByPlaceholderText(
  //       getTranslation(
  //         "farm.createFarm.polyhouse.nursery.germinationAreaPlaceholder"
  //       )
  //     ),
  //     { target: { value: "50" } }
  //   );

  //   fireEvent.click(screen.getByText(getTranslation("global.add")));

  //   expect(mockAddNursery).toHaveBeenCalled();
  // });

  test("should display validation errors for invalid inputs", async () => {
    renderWithProvider(
      <AddNursery
        polyhouseKey={1}
        nurseries={mockNurseries}
        addNursery={mockAddNursery}
        updateNurseries={mockUpdateNurseries}
        errors={[]}
      />,
      { store }
    );

    fireEvent.click(
      screen.getByText(
        getTranslation("farm.createFarm.polyhouse.nursery.addNursery")
      )
    );
    fireEvent.click(screen.getByText(getTranslation("global.add")));

    await waitFor(() => {
      expect(
        screen.getByText(
          getTranslation("farm.createFarm.polyhouse.nursery.nurseryNameMessage")
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          getTranslation("farm.createFarm.polyhouse.nursery.nurseryTypeMessage")
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          getTranslation("farm.createFarm.polyhouse.nursery.nurseryAreaMessage")
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          getTranslation(
            "farm.createFarm.polyhouse.nursery.germinationTypeMessage"
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          getTranslation(
            "farm.createFarm.polyhouse.nursery.germinationAreaMessage"
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          getTranslation("farm.createFarm.polyhouse.nursery.seedCountMessage")
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          getTranslation(
            "farm.createFarm.polyhouse.nursery.wateringTypeMessage"
          )
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          getTranslation(
            "farm.createFarm.polyhouse.nursery.wateringScheduleMessage"
          )
        )
      ).toBeInTheDocument();
    });
  });

  test("should apply errors to nursery fields", async () => {
    const errorDetail: errorDetail[] = [
      {
        error: "error",
        type: "error",
        location: "0.nurseries.0.area",
        message: "area error",
      },
      {
        error: "error",
        type: "error",
        location: "0.nurseries.0.seedCount",
      },
    ];
    renderWithProvider(
      <AddNursery
        polyhouseKey={1}
        nurseries={mockNurseries}
        addNursery={mockAddNursery}
        updateNurseries={mockUpdateNurseries}
        errors={errorDetail}
      />,
      { store }
    );

    fireEvent.click(screen.getByTestId("nusery-card-0"));
    expect(
      screen.queryByText(
        getTranslation("farm.createFarm.polyhouse.nursery.nurseryName")
      )
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("area error")).toBeInTheDocument();
      expect(
        screen.queryByText("Please enter valid value")
      ).toBeInTheDocument();
    });
  });
});

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe("NurseryCard Component", () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
    store = setupDefaultStore();
  });

  test("should render nursery cards", () => {
    renderWithProvider(
      <NuseryCard
        nurseries={mockNurseries}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        errors={[]}
      />,
      { store }
    );

    expect(screen.getByText("Nursery 1")).toBeInTheDocument();
  });

  test("should call onEdit when a nursery card is clicked", () => {
    renderWithProvider(
      <NuseryCard
        nurseries={mockNurseries}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        errors={[]}
      />,
      { store }
    );
    fireEvent.click(screen.getByText("Nursery 1"));
    expect(mockOnEdit).toHaveBeenCalledWith(mockNurseries[0]);
  });

  test("should call onDelete when delete icon is clicked", () => {
    renderWithProvider(
      <NuseryCard
        nurseries={mockNurseries}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        errors={[]}
      />,
      { store }
    );
    fireEvent.click(screen.getByText("Nursery 1"));
    fireEvent.click(screen.getByTestId("nusery-card-delete-0"));
    expect(mockOnDelete).toHaveBeenCalledWith(String(mockNurseries[0].key));
  });

  test("should not display error message when there are no errors", () => {
    renderWithProvider(
      <NuseryCard
        nurseries={mockNurseries}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        errors={[]}
      />,
      { store }
    );
    expect(
      screen.queryByText(getTranslation("global.errorOccured"))
    ).not.toBeInTheDocument();
  });
});

const mockForm = {
  validateFields: jest.fn(),
  getFieldsValue: jest.fn(),
};

const mockReservoirForm = {
  validateFields: jest.fn(),
  getFieldsValue: jest.fn(),
};

const stepperProps = {
  current: 0,
  setCurrent: jest.fn(),
  form: mockForm,
  reservoirForm: mockReservoirForm,
  reservoirs: [],
  polyhouses: [],
  farmValues: {},
  setFarmValues: jest.fn(),
};

describe("StepperNavigation Component", () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();
    store = setupDefaultStore();
  });

  test("should render StepperNavigation component", () => {
    renderWithProvider(<StepperNavigation {...stepperProps} />, { store });
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  test("should navigate to the next step on successful form validation", async () => {
    mockForm.validateFields.mockResolvedValue({});
    renderWithProvider(<StepperNavigation {...stepperProps} />, { store });

    fireEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(stepperProps.setCurrent).toHaveBeenCalledWith(
        stepperProps.current + 1
      );
    });
  });

  test("should not navigate to the next step on form validation failure", async () => {
    mockForm.validateFields.mockRejectedValue(new Error("Validation Error"));
    renderWithProvider(<StepperNavigation {...stepperProps} />, { store });

    fireEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(stepperProps.setCurrent).not.toHaveBeenCalled();
    });
  });

  test("should create farm and navigate to the next step", async () => {
    const payload = {
      name: "Farm",
      nutrientType: "2 mix type",
      nutrientDilutionRatio: "2:3",
    };

    const reserviourValue = {
      name_0: "reserviour",
      reservoirCapacity_0: "500",
      nutrientWaterReservoirCapacity_0: "200",
      stockNutrientSolutionCapacity_0: "233",
    };

    const mockReserviorForm = {
      validateFields: jest.fn(),
      getFieldsValue: jest.fn(() => reserviourValue),
    };

    mockReserviorForm.validateFields.mockResolvedValue({});
    mockForm.validateFields.mockResolvedValue({});

    const updatedProps = {
      ...stepperProps,
      current: 1,
      farmValues: payload,
      reservoirForm: mockReserviorForm,
      reservoirs: [{ key: 0 }],
    };

    renderWithProvider(<StepperNavigation {...updatedProps} />, {
      store,
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(stepperProps.setCurrent).toHaveBeenCalledWith(2);
    });
  });

  test("should create farm when reserviour values are NaN or undefined and navigate to the next step", async () => {
    const payload = {
      name: "Farm",
      nutrientType: "2 mix type",
      nutrientDilutionRatio: "2:3",
    };

    const reserviourValue = {
      name_0: NaN,
      reservoirCapacity_0: NaN,
      nutrientWaterReservoirCapacity_0: undefined,
      stockNutrientSolutionCapacity_0: NaN,
    };

    const mockReserviorForm = {
      validateFields: jest.fn(),
      getFieldsValue: jest.fn(() => reserviourValue),
    };

    mockReserviorForm.validateFields.mockResolvedValue({});
    mockForm.validateFields.mockResolvedValue({});

    const updatedProps = {
      ...stepperProps,
      current: 1,
      farmValues: payload,
      reservoirForm: mockReserviorForm,
      reservoirs: [{ key: 0 }],
    };

    renderWithProvider(<StepperNavigation {...updatedProps} />, {
      store,
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(stepperProps.setCurrent).toHaveBeenCalledWith(2);
    });
  });

  test("should show error toast on farm creation failure", async () => {
    mockForm.validateFields.mockResolvedValue({});
    mockReservoirForm.validateFields.mockRejectedValue(
      new Error("Validation Error")
    );
    stepperProps.current = 1;

    renderWithProvider(<StepperNavigation {...stepperProps} />, { store });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(stepperProps.setCurrent).not.toHaveBeenCalled();
    });
  });

  test("should add polyhouses to farm and navigate back to farm page", async () => {
    const payload = [
      {
        name: "Polyhouse",
        structureExpectedLife: 10,
        plasticExpectedLife: 20,
        key: 0,
      },
    ];

    const mockPolyhouseForm = {
      validateFields: jest.fn(),
      getFieldsValue: jest.fn(() => payload),
    };

    mockPolyhouseForm.validateFields.mockResolvedValue({});

    const updatedProps = {
      ...stepperProps,
      current: 2,
      polyhouses: payload,
      form: mockPolyhouseForm,
    };

    renderWithProvider(<StepperNavigation {...updatedProps} />, { store });

    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(routePaths.farm);
    });
  });

  test("should add polyhouse with zones and nurseries to farm and navigate back to farm page", async () => {
    const payload = [
      {
        name: "Polyhouse",
        structureExpectedLife: 10,
        plasticExpectedLife: 20,
        zones: mockZones,
        nurseries: mockNurseries,
        key: 0,
      },
    ];

    const mockPolyhouseForm = {
      validateFields: jest.fn(),
      getFieldsValue: jest.fn(() => payload),
    };

    mockPolyhouseForm.validateFields.mockResolvedValue({});

    const updatedProps = {
      ...stepperProps,
      current: 2,
      polyhouses: payload,
      form: mockPolyhouseForm,
    };

    renderWithProvider(<StepperNavigation {...updatedProps} />, { store });

    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(routePaths.farm);
    });
  });

  test("should show error toast on polyhouse addition failure", async () => {
    mockForm.validateFields.mockRejectedValue(new Error("Validation Error"));
    stepperProps.current = 2;

    renderWithProvider(<StepperNavigation {...stepperProps} />, { store });

    fireEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(stepperProps.setCurrent).not.toHaveBeenCalled();
    });
  });

  test("should navigate back to the previous step", () => {
    stepperProps.current = 1;
    renderWithProvider(<StepperNavigation {...stepperProps} />, { store });

    fireEvent.click(screen.getByText("Back"));

    expect(stepperProps.setCurrent).toHaveBeenCalledWith(
      stepperProps.current - 1
    );
  });

  test("should navigate back to the farm page on cancel", () => {
    renderWithProvider(<StepperNavigation {...stepperProps} current={2} />, {
      store,
    });

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockNavigate).toHaveBeenCalledWith("/farm");
  });
});
