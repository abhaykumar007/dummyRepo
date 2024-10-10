/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import { getTranslation } from "@/translation/i18n";
import AddPolyhouse from "@/pages/polyhouse/addPolyhouse.tsx";
import FarmActions from "@/redux/farm/action";
import { Zone, Nursery as NurseryType, Polyhouse } from "@/pages/farm/types";
import AddZones from "@/pages/farm/CreateFarm/Steps/addZones";
import userEvent from "@testing-library/user-event";
import AddNursery from "@/pages/farm/CreateFarm/Steps/addNursery";

jest.mock("@/utilities/toast", () => ({
  errorToast: jest.fn(),
  successToast: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockZones = [
  {
    key: 1,
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
];

const mockNurseries = [
  {
    key: 1,
    name: "New nursery 1",
    type: "Open (no humidity control)",
    area: 100,
    germinationType: "Tray with coco peat",
    germinationArea: 50,
    seedCount: 5,
    wateringType: "Manual",
    wateringSchedule: "Daily",
  },
];

const mockAddfunction = jest.fn();
const mockUpdateFunction = jest.fn();

const addNursery = jest.fn();
const updateNursery = jest.fn();

describe("Add polyhouse page", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("should render the component correctly", () => {
    renderWithProvider(<AddPolyhouse />, { store });
    expect(
      screen.getByText(getTranslation("farm.createFarm.polyhouse.addPolyhouse"))
    ).toBeInTheDocument();

    expect(
      screen.getByText(getTranslation("global.cancel"))
    ).toBeInTheDocument();

    expect(screen.getByText(getTranslation("global.add"))).toBeInTheDocument();
  });

  test("should apply regex validation errors", async () => {
    renderWithProvider(<AddPolyhouse />, { store });

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

    renderWithProvider(<AddPolyhouse />, { store });

    expect(await screen.findByText("Structure error")).toBeInTheDocument();
    expect(await screen.findByText("Plastic error")).toBeInTheDocument();
  });

  test("should open modal when click on add zone button", async () => {
    renderWithProvider(<AddPolyhouse />, { store });

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
  });

  test("adds a zone successfully", async () => {
    renderWithProvider(
      <AddZones
        polyhouseKey={1}
        zones={mockZones}
        addZone={mockAddfunction}
        updateZones={mockUpdateFunction}
        errors={[]}
      />,
      { store }
    );

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
      const zone: Zone = {
        name: "New Zone",
        systemType: "Raft system",
        area: 100,
        key: 1,
        growingArea: {
          area: 50,
          rowCount: 5,
          plantCountPerRow: 10,
          plantSpacing: 1,
          rowSpacing: 2,
          wateringType: "Manual",
          wateringSchedule: "Daily",
        },
      };

      expect(mockAddfunction).toHaveBeenCalledWith(1, zone);
    });
  });

  test("displays validation errors on invalid values", async () => {
    renderWithProvider(<AddPolyhouse />, { store });

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

  test("should open modal when Add Nursery button is clicked", async () => {
    renderWithProvider(<AddPolyhouse />, { store });

    fireEvent.click(
      screen.getByText(
        getTranslation("farm.createFarm.polyhouse.configureNurseries")
      )
    );

    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.polyhouse.nursery.addNursery")
      )
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByText(
        getTranslation("farm.createFarm.polyhouse.nursery.addNursery")
      )
    );

    expect(
      screen.getByText(
        getTranslation("farm.createFarm.polyhouse.nursery.nurseryName")
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        getTranslation("farm.createFarm.polyhouse.nursery.nurseryType")
      )
    ).toBeInTheDocument();
  });

  test("should display validation errors for invalid inputs", async () => {
    renderWithProvider(<AddPolyhouse />, { store });

    fireEvent.click(
      screen.getByText(
        getTranslation("farm.createFarm.polyhouse.configureNurseries")
      )
    );

    expect(
      await screen.findByText(
        getTranslation("farm.createFarm.polyhouse.nursery.addNursery")
      )
    ).toBeInTheDocument();

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
    renderWithProvider(
      <AddNursery
        polyhouseKey={1}
        nurseries={mockNurseries}
        addNursery={addNursery}
        updateNurseries={updateNursery}
        errors={[]}
      />,
      { store }
    );

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
      const nursery: NurseryType = {
        name: "New nursery",
        type: "Open (no humidity control)",
        area: 100,
        germinationType: "Tray with coco peat",
        germinationArea: 50,
        seedCount: 5,
        wateringType: "Manual",
        wateringSchedule: "Daily",
        key: 1,
      };
      expect(addNursery).toHaveBeenCalledWith(1, nursery);
    });
  });

  test("should create polyhouse", async () => {
    renderWithProvider(<AddPolyhouse />, { store });

    fireEvent.change(
      screen.getByLabelText(getTranslation("farm.createFarm.polyhouse.name")),
      { target: { value: "polyhouse" } }
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.structureExpectedLife")
      ),
      { target: { value: "1234" } }
    );

    fireEvent.change(
      screen.getByLabelText(
        getTranslation("farm.createFarm.polyhouse.plasticExpectedLife")
      ),
      { target: { value: "2345" } }
    );

    const buttons = await screen.findAllByText("Add");
    fireEvent.click(buttons[0]);

    const polyhouse: Polyhouse = {
      name: "polyhouse",
      structureExpectedLife: 1234,
      plasticExpectedLife: 2345,
    };

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        FarmActions.addPolyhousesToFarm([polyhouse])
      );
    });
  });
});
