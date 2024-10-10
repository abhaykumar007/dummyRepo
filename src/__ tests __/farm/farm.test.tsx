/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import { getTranslation } from "@/translation/i18n";
import Farm from "@/pages/farm";
import FarmActions from "@/redux/farm/action";
import FarmSideBar from "@/pages/farm/SideBar";
import FarmCard from "@/pages/farm/farmCard";
import userEvent from "@testing-library/user-event";

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
          polyhouses: [],
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
        fma5a3555d: {
          farmId: "fma5a3555d",
          id: "6596b8772eeef39d4114d1f6",
          organisationId: "or5c4b170e",
          name: "CoE for Hydroponics KVK Baramati",
          area: 1000,
          cultivableArea: 1000,
          location: {
            address: "Pune",
            lat: 1.24,
            long: 1.24,
          },
          polyhouses: [],
          reservoirs: [],
          nutrient: {
            type: "2 Part mix",
            dilutionRatio: {
              numerator: 1,
              denominator: 5,
            },
          },
          device: {
            deviceId: "dvfa398532",
            name: "Device",
            description: "Test device",
            status: "down",
            lastPingPacketReceived: "2024-08-18T12:26:41.811Z",
            state: "DRAFT",
          },
          state: "DRAFT",
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          createdDate: "2024-06-18T08:26:15.093Z",
          updatedDate: "2024-07-02T10:43:30.291Z",
        },
        fma5a3555e: {
          farmId: "fma5a3555e",
          id: "6596b8772eeef39d4114d1f6",
          organisationId: "or5c4b170e",
          name: "CoE for Hydroponics KVK Baramati",
          area: 1000,
          cultivableArea: 1000,
          location: {
            address: "Pune",
            lat: 1.24,
            long: 1.24,
          },
          polyhouses: [],
          reservoirs: [],
          nutrient: {
            type: "2 Part mix",
            dilutionRatio: {
              numerator: 1,
              denominator: 5,
            },
          },
          device: {
            deviceId: "dvfa398532",
            name: "Device",
            description: "Test device",
            status: "up",
            lastPingPacketReceived: "2024-08-18T12:26:41.811Z",
            state: "DRAFT",
          },
          state: "DRAFT",
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          createdDate: "2024-06-18T08:26:15.093Z",
          updatedDate: "2024-07-02T10:43:30.291Z",
        },
        fma5a3555f: {
          farmId: "fma5a3555f",
          id: "6596b8772eeef39d4114d1f6",
          organisationId: "or5c4b170e",
          name: "CoE for Hydroponics KVK Baramati",
          area: 1000,
          cultivableArea: 1000,
          location: {
            address: "Pune",
            lat: 1.24,
            long: 1.24,
          },
          polyhouses: [],
          reservoirs: [],
          nutrient: {
            type: "2 Part mix",
            dilutionRatio: {
              numerator: 1,
              denominator: 5,
            },
          },
          device: {
            deviceId: "dvfa398532",
            name: "Device",
            description: "Test device",
            status: "",
            lastPingPacketReceived: "2024-08-18T12:26:41.811Z",
            state: "DRAFT",
          },
          state: "DRAFT",
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          createdDate: "2024-06-18T08:26:15.093Z",
          updatedDate: "2024-07-02T10:43:30.291Z",
        },
      },
    },
    result: ["fm5e2d43ef", "fma5a3555d", "fma5a3555e", "fma5a3555f"],
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

const dummySelectedForm = {
  farmId: "fmc999c4e1",
  id: "667bff8a75c34842b7e7e261",
  organisationId: "or63bcc3a4",
  name: "ABCD1",
  area: 5647,
  cultivableArea: 5467,
  location: {
    address: "Pune",
    lat: 1.24,
    long: 1.24,
  },
  polyhouses: [],
  reservoirs: [
    {
      reservoirId: "re710d7483",
      name: "Reserviour1",
      reservoirCapacity: 567,
      nutrientWaterReservoirCapacity: 43,
      phReservoirCapacity: 65,
      stockNutrientSolutionCapacity: 67,
      createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
      updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
      createdDate: "2024-06-26T11:46:18.381Z",
      updatedDate: "2024-06-26T11:46:18.381Z",
    },
  ],
  nutrient: {
    type: "3 part mix",
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
};

const dummyFarm = {
  farmId: "fmc999c4e1",
  id: "667bff8a75c34842b7e7e261",
  organisationId: "or63bcc3a4",
  name: "ABCD1",
  area: 5647,
  cultivableArea: 5467,
  location: {
    address: "Pune",
    lat: 1.24,
    long: 1.24,
  },
  polyhouses: [],
  reservoirs: [
    {
      reservoirId: "re710d7483",
      name: "Reserviour1",
      reservoirCapacity: 567,
      nutrientWaterReservoirCapacity: 43,
      phReservoirCapacity: 65,
      stockNutrientSolutionCapacity: 67,
      createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
      updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
      createdDate: "2024-06-26T11:46:18.381Z",
      updatedDate: "2024-06-26T11:46:18.381Z",
    },
  ],
  nutrient: {
    type: "3 part mix",
    dilutionRatio: null,
  },
  device: null,
  state: "DRAFT",
  createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
  updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
  createdDate: null,
  updatedDate: null,
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

describe("Farm page", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("should render the farm cards", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
    });
    renderWithProvider(<Farm />, { store });

    const farmAreaDivArray = screen.getAllByText(
      `${getTranslation("farm.farmArea")}:`
    );
    const cultivableAreaDivArray = screen.getAllByText(
      `${getTranslation("farm.cultivableArea")}:`
    );
    const deviceStatusDivArray = screen.getAllByText(
      `${getTranslation("farm.deviceStatus")}:`
    );
    expect(farmAreaDivArray[0]).toBeInTheDocument();
    expect(cultivableAreaDivArray[0]).toBeInTheDocument();
    expect(deviceStatusDivArray[0]).toBeInTheDocument();
  });

  test("should render no farms when there is no forms present", () => {
    store = setupDefaultStore({
      farms: {},
      users: { ...dummyUser },
    });
    renderWithProvider(<Farm />, { store });

    expect(
      screen.getByText(getTranslation("farm.noFarms"))
    ).toBeInTheDocument();
  });

  test("should dispatch setSelectedFarm action when farm card is clicked", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
    });
    renderWithProvider(<Farm />, { store });

    const farmCard = screen.getByText("Dummy Farm 123");
    fireEvent.click(farmCard);

    expect(store.dispatch).toHaveBeenCalledWith(
      FarmActions.setSelectedFarm(dummyFarms.farms.entities.farms.fm5e2d43ef)
    );

    store.clearActions();
    store = setupDefaultStore({
      farms: { ...dummyFarms, selectedFarm: dummySelectedForm },
      users: { ...dummyUser },
    });
    renderWithProvider(<Farm />, { store });

    expect(
      screen.queryByText(getTranslation("farm.farmDetails"))
    ).toBeInTheDocument();
  });

  test("should navigate to farm creation page when 'Add Farm' button is clicked", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
    });
    renderWithProvider(<Farm />, { store });

    const addFarmButton = screen.getByText(getTranslation("farm.addFarm"));
    fireEvent.click(addFarmButton);

    expect(mockNavigate).toHaveBeenCalledWith("/farm/create");
  });

  test("should fetch farms data again when refresh button is clicked", () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms },
      users: { ...dummyUser },
    });
    renderWithProvider(<Farm />, { store });

    const refreshButton = screen.getByTestId("refresh-button");
    fireEvent.click(refreshButton);

    expect(store.dispatch).toHaveBeenCalledWith(FarmActions.fetchFarms(true));
  });

  test("Displays error message when Request farm api fails", () => {
    store = setupDefaultStore({
      users: { ...dummyUser },
      error: {
        [FarmActions.REQUEST_FARMS_FINISHED]: {
          errors: [{ message: "Error occurred" }],
        },
      },
    });

    renderWithProvider(<Farm />, { store });

    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });
  test("should render loader when api request is send", async () => {
    store = setupDefaultStore({
      farms: { ...dummyFarms, farms: null, selectedFarmId: null },
      users: { ...dummyUser },
      requesting: {
        [FarmActions.REQUEST_FARMS]: true,
      },
    });

    renderWithProvider(<FarmCard />, { store });

    const loader = screen.getByRole("img", { name: "loading" });
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass("anticon-loading");
  });
});

describe("Farm Sidebar", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("should render the farm side bar", () => {
    store = setupDefaultStore({
      farms: {
        farms: {},
        selectedFarm: { ...dummyFarm },
      },
      users: { ...dummyUser },
    });
    renderWithProvider(<FarmSideBar />, { store });

    expect(
      screen.getByText(`${getTranslation("global.name")}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("farm.farmArea")}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("farm.cultivableArea")}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("farm.nutrientType")}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("farm.dilutionRatio")}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("global.reservoirs")}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("global.polyhouses")}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("farm.deviceStatus")}:`)
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

  test("should close sidebar when close icon is clicked", () => {
    store = setupDefaultStore({
      farms: {
        farms: {},
        selectedFarm: { ...dummySelectedForm },
      },
      users: { ...dummyUser },
    });

    renderWithProvider(<Farm />, { store });

    expect(
      screen.queryByText(getTranslation("farm.farmDetails"))
    ).toBeInTheDocument();

    const closeIcon = screen.getByTestId("farm-sidebar-close-btn");
    fireEvent.click(closeIcon);

    expect(store.dispatch).toHaveBeenCalledWith(
      FarmActions.setSelectedFarm(null)
    );
  });

  test("should not render the sidebar when selectedFarm is null", () => {
    store = setupDefaultStore({
      farms: {
        farms: {},
        selectedFarm: null,
      },
      users: { ...dummyUser },
    });

    renderWithProvider(<Farm />, { store });

    expect(
      screen.queryByText(getTranslation("farm.farmDetails"))
    ).not.toBeInTheDocument();
  });

  test("should render farm details correctly with selected farm", () => {
    store = setupDefaultStore({
      farms: {
        farms: {},
        selectedFarm: { ...dummySelectedForm },
      },
      users: { ...dummyUser },
    });

    renderWithProvider(<FarmSideBar />, { store });

    expect(screen.getByText(dummySelectedForm.name)).toBeInTheDocument();
    expect(
      screen.getByText(dummySelectedForm.area.toString())
    ).toBeInTheDocument();
    expect(
      screen.getByText(dummySelectedForm.cultivableArea.toString())
    ).toBeInTheDocument();
    expect(
      screen.getByText(dummySelectedForm.nutrient.type)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${dummySelectedForm.nutrient.dilutionRatio.numerator}:${dummySelectedForm.nutrient.dilutionRatio.denominator}`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("global.polyhouses")}:`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${getTranslation("farm.deviceStatus")}:`)
    ).toBeInTheDocument();
    expect(screen.getByText("18-06-2024")).toBeInTheDocument();
    expect(screen.getByText("02-07-2024")).toBeInTheDocument();
  });

  test("should render input field when EditableFarmField is clicked", () => {
    store = setupDefaultStore({
      farms: {
        farms: {},
        selectedFarm: { ...dummySelectedForm },
      },
      users: { ...dummyUser },
    });
    renderWithProvider(<FarmSideBar />, { store });

    // name
    const editableNameField = screen.getByTestId("name-container");
    fireEvent.click(editableNameField);

    expect(screen.getByTestId("name-input")).toHaveValue("ABCD1");

    // area
    const editableAreaField = screen.getByTestId("area-container");
    fireEvent.click(editableAreaField);

    expect(screen.getByTestId("area-input")).toHaveValue("5647");

    // cultivable area
    const editableCultivableAreaField = screen.getByTestId(
      "cultivableArea-container"
    );
    fireEvent.click(editableCultivableAreaField);

    expect(screen.getByTestId("cultivableArea-input")).toHaveValue("5467");

    // nutrient type
    const editableNurientTypeField = screen.getByTestId(
      "nutrient.type-container"
    );
    fireEvent.click(editableNurientTypeField);

    expect(editableNurientTypeField).toHaveTextContent("3 part mix");

    // dilution ratio
    const editableDilutionRatioField = screen.getByTestId(
      "nutrient.dilutionRatio-container"
    );
    fireEvent.click(editableDilutionRatioField);

    expect(screen.getByTestId("nutrient.dilutionRatio-input")).toHaveValue(
      "2:3"
    );
  });

  test("should edit the editable field and dispatch it with updated data by clicking on save button", async () => {
    store = setupDefaultStore({
      farms: {
        farms: {},
        selectedFarm: { ...dummySelectedForm },
      },
      users: { ...dummyUser },
    });
    renderWithProvider(<FarmSideBar />, { store });

    // name
    const editableNameField = screen.getByTestId("name-container");
    fireEvent.click(editableNameField);
    const nameInput = screen.getByTestId("name-input");
    fireEvent.change(nameInput, { target: { value: "Updated Farm Name" } });
    expect(nameInput).toHaveValue("Updated Farm Name");

    const nameSaveButton = screen.getByTestId("name-save");
    fireEvent.click(nameSaveButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      FarmActions.updateFarm("name", { name: "Updated Farm Name" })
    );

    // area
    const editableAreaField = screen.getByTestId("area-container");
    fireEvent.click(editableAreaField);
    const areaInput = screen.getByTestId("area-input");
    fireEvent.change(areaInput, { target: { value: 7000 } });
    expect(areaInput).toHaveValue("7000");

    const areaSaveButton = screen.getByTestId("area-save");
    fireEvent.click(areaSaveButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      FarmActions.updateFarm("area", { area: 7000 })
    );

    // cultivable area
    const editableCultivableAreaField = screen.getByTestId(
      "cultivableArea-container"
    );
    fireEvent.click(editableCultivableAreaField);
    const cultivableAreaInput = screen.getByTestId("cultivableArea-input");
    fireEvent.change(cultivableAreaInput, { target: { value: 6500 } });
    expect(cultivableAreaInput).toHaveValue("6500");

    const cultivableAreaSaveButton = screen.getByTestId("cultivableArea-save");
    fireEvent.click(cultivableAreaSaveButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      FarmActions.updateFarm("cultivableArea", { cultivableArea: 6500 })
    );

    // // nutrient type
    // const editableNutrientTypeField = screen.getByTestId(
    //   "nutrient.type-container"
    // );
    // fireEvent.click(editableNutrientTypeField);
    // expect(editableNutrientTypeField).toHaveTextContent("3 part mix");
    // let nutrientTypeInput = screen.getByTestId("nutrient.type-input");
    // const select = nutrientTypeInput.firstElementChild;
    // if (select) {
    //   userEvent.click(select);
    // }

    // const typeOption = await screen.findAllByText("2 part mix");
    // userEvent.click(typeOption[0]);
    // await waitFor(() => {
    //   nutrientTypeInput = screen.getByTestId("nutrient.type-input");

    //   expect(nutrientTypeInput).toHaveTextContent("2 part mix");

    //   const nutrientTypeAreaSaveButton =
    //     screen.getByTestId("nutrient.type-save");
    //   fireEvent.click(nutrientTypeAreaSaveButton);

    //   expect(store.dispatch).toHaveBeenCalledWith(
    //     FarmActions.updateFarm("nutrient.type", {
    //       nutrient: {
    //         type: "2 part mix",
    //         dilutionRatio: {
    //           numerator: 2,
    //           denominator: 3,
    //         },
    //       },
    //     })
    //   );
    // });

    // dilution ratio
    const editableDilutionRatioField = screen.getByTestId(
      "nutrient.dilutionRatio-container"
    );
    fireEvent.click(editableDilutionRatioField);
    const dilutionRatioInput = screen.getByTestId(
      "nutrient.dilutionRatio-input"
    );
    fireEvent.change(dilutionRatioInput, { target: { value: "3:4" } });
    expect(dilutionRatioInput).toHaveValue("3:4");

    const dilutionRatioSaveButton = screen.getByTestId(
      "nutrient.dilutionRatio-save"
    );
    fireEvent.click(dilutionRatioSaveButton);

    expect(store.dispatch).toHaveBeenCalledWith(
      FarmActions.updateFarm("nutrient.dilutionRatio", {
        nutrient: {
          type: "3 part mix",
          dilutionRatio: { numerator: 3, denominator: 4 },
        },
      })
    );
  });

  test("should revert to previous value when cancel button is clicked", async () => {
    store = setupDefaultStore({
      farms: {
        farms: {},
        selectedFarm: { ...dummySelectedForm },
      },
      users: { ...dummyUser },
    });
    renderWithProvider(<FarmSideBar />, { store });

    // name
    let editableNameField = screen.getByTestId("name-container");
    fireEvent.click(editableNameField);
    const nameInput = screen.getByTestId("name-input");
    fireEvent.change(nameInput, { target: { value: "Updated Farm Name" } });
    expect(nameInput).toHaveValue("Updated Farm Name");

    const nameCancelButton = screen.getByTestId("name-cancel");
    fireEvent.click(nameCancelButton);

    await waitFor(() => {
      editableNameField = screen.getByTestId("name-container");
      expect(editableNameField).toHaveTextContent("ABCD1");
    });

    // area
    let editableAreaField = screen.getByTestId("area-container");
    fireEvent.click(editableAreaField);
    const areaInput = screen.getByTestId("area-input");
    fireEvent.change(areaInput, { target: { value: 7000 } });
    expect(areaInput).toHaveValue("7000");

    const areaCancelButton = screen.getByTestId("area-cancel");
    fireEvent.click(areaCancelButton);

    await waitFor(() => {
      editableAreaField = screen.getByTestId("area-container");
      expect(editableAreaField).toHaveTextContent("5647");
    });

    // cultivable area
    let editableCultivableAreaField = screen.getByTestId(
      "cultivableArea-container"
    );
    fireEvent.click(editableCultivableAreaField);
    const cultivableAreaInput = screen.getByTestId("cultivableArea-input");
    fireEvent.change(cultivableAreaInput, { target: { value: 6500 } });
    expect(cultivableAreaInput).toHaveValue("6500");

    const cultivableAreaCancelButton = screen.getByTestId(
      "cultivableArea-cancel"
    );
    fireEvent.click(cultivableAreaCancelButton);

    await waitFor(() => {
      editableCultivableAreaField = screen.getByTestId(
        "cultivableArea-container"
      );
      expect(editableCultivableAreaField).toHaveTextContent("5467");
    });

    // // nutrient type
    // let editableNutrientTypeField = screen.getByTestId(
    //   "nutrient.type-container"
    // );
    // fireEvent.click(editableNutrientTypeField);
    // expect(editableNutrientTypeField).toHaveTextContent("3 part mix");
    // let nutrientTypeInput = screen.getByTestId("nutrient.type-input");
    // const select = nutrientTypeInput.firstElementChild;
    // if (select) {
    //   userEvent.click(select);
    // }

    // const typeOption = await screen.findByText("Custom nutrient mix");
    // userEvent.click(typeOption);
    // await waitFor(() => {
    //   nutrientTypeInput = screen.getByTestId("nutrient.type-input");
    //   expect(nutrientTypeInput).toHaveTextContent("Custom nutrient mix");
    // });

    // const nutrientTypeCancelButton = screen.getByTestId("nutrient.type-cancel");
    // fireEvent.click(nutrientTypeCancelButton);

    // await waitFor(() => {
    //   editableNutrientTypeField = screen.getByTestId("nutrient.type-container");
    //   expect(editableNutrientTypeField).toHaveTextContent(
    //     "Custom nutrient mix"
    //   );
    // });

    // dilution ratio
    let editableDilutionRatioField = screen.getByTestId(
      "nutrient.dilutionRatio-container"
    );
    fireEvent.click(editableDilutionRatioField);
    const dilutionRatioInput = screen.getByTestId(
      "nutrient.dilutionRatio-input"
    );
    fireEvent.change(dilutionRatioInput, { target: { value: "3:4" } });
    expect(dilutionRatioInput).toHaveValue("3:4");

    const dilutionRatioCancelButton = screen.getByTestId(
      "nutrient.dilutionRatio-cancel"
    );
    fireEvent.click(dilutionRatioCancelButton);

    await waitFor(() => {
      editableDilutionRatioField = screen.getByTestId(
        "nutrient.dilutionRatio-container"
      );
      expect(editableDilutionRatioField).toHaveTextContent("2:3");
    });
  });

  test("should validate area field", async () => {
    store = setupDefaultStore({
      farms: {
        farms: {},
        selectedFarm: { ...dummyFarm },
      },
      users: { ...dummyUser },
    });
    renderWithProvider(<FarmSideBar />, { store });

    const editableAreaField = screen.getByTestId("area-container");
    fireEvent.click(editableAreaField);
    const areaInput = screen.getByTestId("area-input");

    // as a validator function takes string, so it will fail when you pass number in string. eg("876")
    fireEvent.change(areaInput, { target: { value: "jdbksd" } });
    const areaSaveButton = screen.getByTestId("area-save");
    fireEvent.click(areaSaveButton);

    await waitFor(() => {
      expect(
        screen.getByText(getTranslation("farm.numberValidator"))
      ).toBeInTheDocument();
    });
  });

  test("should validate Cultivable area field", async () => {
    store = setupDefaultStore({
      farms: {
        farms: {},
        selectedFarm: { ...dummySelectedForm },
      },
      users: { ...dummyUser },
    });
    renderWithProvider(<FarmSideBar />, { store });

    const editableCultivableAreaField = screen.getByTestId(
      "cultivableArea-container"
    );
    fireEvent.click(editableCultivableAreaField);
    const cultivableAreaInput = screen.getByTestId("cultivableArea-input");

    // as a validator function takes string, so it will fail when you pass number in string. eg("876")
    // fireEvent.change(cultivableAreaInput, { target: { value: "jbjhb" } });
    await userEvent.type(cultivableAreaInput, "jbjhb");
    fireEvent.blur(cultivableAreaInput);

    await waitFor(() => {
      expect(
        screen.getByText(getTranslation("farm.numberValidator"))
      ).toBeInTheDocument();
    });
  });

  test("should validate dilution ratio field", async () => {
    store = setupDefaultStore({
      farms: {
        farms: {},
        selectedFarm: { ...dummySelectedForm },
      },
      users: { ...dummyUser },
    });
    renderWithProvider(<FarmSideBar />, { store });

    const editableDilutionRatioField = screen.getByTestId(
      "nutrient.dilutionRatio-container"
    );
    fireEvent.click(editableDilutionRatioField);
    const dilutionRatioInput = screen.getByTestId(
      "nutrient.dilutionRatio-input"
    );

    fireEvent.change(dilutionRatioInput, { target: { value: "3-4" } });
    // fireEvent.blur(dilutionRatioInput);

    await waitFor(() => {
      expect(
        screen.getByText(getTranslation("farm.ratioValidator"))
      ).toBeInTheDocument();
    });
  });

  test("should display error on fields", async () => {
    store = setupDefaultStore({
      farms: {
        farms: {},
        selectedFarm: { ...dummySelectedForm },
      },
      users: { ...dummyUser },
      error: {
        "[scope:nutrient.dilutionRatio]farms/UPDATE_FARM_FINISHED": {
          errors: [
            {
              error: "ERR_INVALID_FIELD_NUTRIENT.DILUTIONRATIO.DENOMINATOR",
              type: "error",
              location: "nutrient.dilutionRatio.denominator",
            },
          ],
        },
      },
    });

    renderWithProvider(<FarmSideBar />, { store });

    const editableDilutionRatioField = screen.getByTestId(
      "nutrient.dilutionRatio-container"
    );
    fireEvent.click(editableDilutionRatioField);

    await waitFor(() => {
      expect(
        screen.queryByText("Please enter valid value")
      ).toBeInTheDocument();
    });
  });

  test("should delete the farm", async () => {
    store = setupDefaultStore({
      farms: {
        farms: {},
        selectedFarm: { ...dummySelectedForm },
      },
      users: { ...dummyUser },
    });

    renderWithProvider(<FarmSideBar />, { store });

    fireEvent.click(screen.getByTestId("farm-sidebar-threeDots-icon"));
    expect(
      await screen.findByText(getTranslation("global.delete"))
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText(getTranslation("global.delete")));

    expect(
      await screen.findByText(getTranslation("global.yes"))
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText(getTranslation("global.yes")));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(FarmActions.deleteFarm());
    });
  });
});
