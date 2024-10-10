import "@testing-library/jest-dom";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import InventorySidebar from "@/pages/inventory/sideBar";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import InventoryActions from "@/redux/inventory/actions";
describe("Inventory Management", () => {
  let store: any;
  let consoleErrorMock: any;
  let consoleWarnMock: any;
  beforeAll(() => {
    consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {
        return
        // if (JSON.stringify(message)?.includes("findDOMNode is deprecated")) {
        //   return;
        // }
      });
    consoleWarnMock = jest
      .spyOn(console, "warn")
      .mockImplementation(() => {
        return;
      });
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
    consoleWarnMock.mockRestore();
  });
  beforeEach(() => {
    store = setupDefaultStore({
      inventories: {
        inventories: {
          entities: {
            inventories: {
              "66b1bb23e33955b963f179a1": {
                inventoryId: "66b1bb23e33955b963f179a1",
                productId: "6626234c3c4db8c98290828e",
                name: "NPK",
                farmId: "fm1a215ac2",
                description: null,
                provider: "provider1",
                quantity: 5,
                unit: "L",
                used: 0,
                wastage: 0,
                createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                updatedBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                createdDate: "2024-08-06T05:56:51.325Z",
                updatedDate: "2024-08-06T05:56:51.325Z",
                key: 0,
              },
              "66a33a881db0e24a4d96e375": {
                inventoryId: "66a33a881db0e24a4d96e375",
                productId: "6578b9f2ade8930415fc0484",
                name: "Basil",
                farmId: "fm1a215ac2",
                description: "desc",
                provider: "proev",
                quantity: 45,
                unit: "nos",
                used: 0,
                wastage: 0,
                createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdDate: "2024-07-26T05:56:24.417Z",
                updatedDate: "2024-07-26T05:56:24.417Z",
                key: 1,
              },
            },
          },
          result: ["66b1bb23e33955b963f179a1", "66a33a881db0e24a4d96e375"],
        },
        selectedInventory: {
          inventoryId: "66b1bb23e33955b963f179a1",
          productId: "6626234c3c4db8c98290828e",
          name: "NPK",
          farmId: "fm1a215ac2",
          description: null,
          provider: "provider1",
          quantity: 5,
          unit: "L",
          used: 0,
          wastage: 0,
          createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
          updatedBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
          createdDate: "2024-08-06T05:56:51.325Z",
          updatedDate: "2024-08-06T05:56:51.325Z",
          key: 0,
        },
        subCategories: {
          entities: {
            subCategories: {
              "65dcc0591e82ab3fc6d9d768": {
                productCategoryId: "6578b98aade8930415fc0483",
                subCategoryId: "65dcc0591e82ab3fc6d9d768",
                name: "Seeds",
                units: ["Nos"],
                products: [
                  {
                    id: "6578b9f2ade8930415fc0484",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Basil",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-12T19:52:18.660Z",
                    updatedDate: "2023-12-12T19:52:18.660Z",
                  },
                  {
                    id: "6579d3b4026c967a135f49c6",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Broccoli",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T15:54:28.375Z",
                    updatedDate: "2023-12-13T15:54:28.375Z",
                  },
                  {
                    id: "6579d7f5026c967a135f49c7",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Bell pepper",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:12:37.319Z",
                    updatedDate: "2023-12-13T16:12:37.319Z",
                  },
                  {
                    id: "6579d816026c967a135f49c8",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Cherry Tomato",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:13:10.065Z",
                    updatedDate: "2023-12-13T16:13:10.065Z",
                  },
                  {
                    id: "6579d836026c967a135f49c9",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Beef Steak Tomato",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:13:42.413Z",
                    updatedDate: "2023-12-13T16:13:42.413Z",
                  },
                  {
                    id: "6579d855026c967a135f49ca",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Cucumber",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:14:13.862Z",
                    updatedDate: "2023-12-13T16:14:13.862Z",
                  },
                  {
                    id: "6579d883026c967a135f49cb",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Red Amaranth",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:14:59.853Z",
                    updatedDate: "2023-12-13T16:14:59.853Z",
                  },
                  {
                    id: "6579d8a0026c967a135f49cc",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Rosemary",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:15:28.538Z",
                    updatedDate: "2023-12-13T16:15:28.538Z",
                  },
                  {
                    id: "6579d8bc026c967a135f49cd",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Baby Spinach",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:15:56.339Z",
                    updatedDate: "2023-12-13T16:15:56.339Z",
                  },
                  {
                    id: "6579d8f6026c967a135f49ce",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Romaine lettuce",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:16:54.369Z",
                    updatedDate: "2023-12-13T16:16:54.369Z",
                  },
                  {
                    id: "6579d914026c967a135f49cf",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Lollo Bionda lettuce",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:17:24.363Z",
                    updatedDate: "2023-12-13T16:17:24.363Z",
                  },
                  {
                    id: "6579d92d026c967a135f49d0",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Butterhead Lettuce",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:17:49.874Z",
                    updatedDate: "2023-12-13T16:17:49.874Z",
                  },
                  {
                    id: "6579d948026c967a135f49d1",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Snacky Peppers",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:18:16.711Z",
                    updatedDate: "2023-12-13T16:18:16.711Z",
                  },
                  {
                    id: "6579d969026c967a135f49d2",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Thyme",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:18:49.005Z",
                    updatedDate: "2023-12-13T16:18:49.005Z",
                  },
                  {
                    id: "66503c2c5be999b675d97822",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Oakleaf Red",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-05-24T07:05:16.339Z",
                    updatedDate: "2024-05-24T07:05:16.339Z",
                  },
                  {
                    id: "665463b5362badddc9699282",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Lollo Rosso",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-05-27T10:43:01.800Z",
                    updatedDate: "2024-05-27T10:43:01.800Z",
                  },
                  {
                    id: "6656b5f8b36315c607873a82",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Oakleaf Green",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-05-29T04:58:32.874Z",
                    updatedDate: "2024-05-29T04:58:32.874Z",
                  },
                  {
                    id: "665da361f355975992cf530c",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Coriander",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-06-03T11:05:05.327Z",
                    updatedDate: "2024-06-03T11:05:05.327Z",
                  },
                  {
                    id: "665f2c52f355975992cf7a44",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Normal Spinach",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-06-04T15:01:38.532Z",
                    updatedDate: "2024-06-04T15:01:38.532Z",
                  },
                ],
                createdBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                updatedBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                createdDate: "2024-02-26T16:46:15.674Z",
                updatedDate: "2024-02-26T16:46:15.674Z",
              },
              "65dcc1001e82ab3fc6d9d769": {
                productCategoryId: "6578b98aade8930415fc0483",
                subCategoryId: "65dcc1001e82ab3fc6d9d769",
                name: "Nutrients",
                units: ["ml", "L", "gms", "Kg"],
                products: [],
                createdBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                updatedBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                createdDate: "2024-02-26T16:49:04.143Z",
                updatedDate: "2024-02-26T16:49:04.143Z",
              },
            },
          },
          result: ["65dcc0591e82ab3fc6d9d768", "65dcc1001e82ab3fc6d9d769"],
        },
      },
      farms:{
        selectedFarmId: "fm1a215ac2",
      }
    });
  });

  it("should render InventoryDetails component", () => {
    renderWithProvider(<InventorySidebar />, { store });
    expect(screen.getByText("NPK")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("provider1")).toBeInTheDocument();
    expect(screen.getByText("No description")).toBeInTheDocument();
  });

  it("should call delete inventory on delete button click", async () => {
    renderWithProvider(<InventorySidebar />, { store });
    const threeDots = screen.getByTestId("inventory-sidebar-three-dots");
    expect(threeDots).toBeInTheDocument();
    await userEvent.click(threeDots);
    const deleteOption = screen.getByText("Delete");
    expect(deleteOption).toBeInTheDocument();
    await userEvent.click(deleteOption);
    expect(screen.getByText("Are you sure")).toBeInTheDocument();
    const confirmButton = screen.getByText("Yes");
    expect(confirmButton).toBeInTheDocument();
    await userEvent.click(confirmButton);
    expect(store.dispatch).toHaveBeenLastCalledWith(
      InventoryActions.deleteInventory("66b1bb23e33955b963f179a1")
    );
  });

  it("should click and update the provider", async () => {
    renderWithProvider(<InventorySidebar />, { store });
    const provider = screen.getByText("provider1");
    await userEvent.click(provider);
    const input = screen.getByTestId("provider-input");
    await userEvent.type(input, "provider2");
    const saveButton = screen.getByTestId("provider-save");
    await userEvent.click(saveButton);
    expect(store.dispatch).toHaveBeenLastCalledWith(
      InventoryActions.patchInventory(
        {
          data: {
            description: null,
            provider: "provider1provider2",
            quantity: 5,
            wastage: 0,
          },
          id: "66b1bb23e33955b963f179a1",
        },
        "provider"
      )
    );
  });

  it("should click and update the quantity", async () => {
    
    renderWithProvider(<InventorySidebar />, { store });
    const quantity = screen.getByText("5");
    await userEvent.click(quantity);
    const input = screen.getByTestId("quantity-input");
    await userEvent.type(input, "0");
    const saveButton = screen.getByTestId("quantity-save");
    await userEvent.click(saveButton);
    expect(store.dispatch).toHaveBeenLastCalledWith(
      InventoryActions.patchInventory(
        {
          data: {
            description: null,
            provider: "provider1",
            quantity: 50,
            wastage: 0,
          },
          id: "66b1bb23e33955b963f179a1",
        },
        "quantity"
      )
    );
  });
  it("should set submit disable on error", async () => {
    store = setupDefaultStore({
      inventories: {
        inventories: {
          entities: {
            inventories: {
              "66b1bb23e33955b963f179a1": {
                inventoryId: "66b1bb23e33955b963f179a1",
                productId: "6626234c3c4db8c98290828e",
                name: "NPK",
                farmId: "fm1a215ac2",
                description: null,
                provider: "provider1",
                quantity: 5,
                unit: "L",
                used: 0,
                wastage: 0,
                createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                updatedBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                createdDate: "2024-08-06T05:56:51.325Z",
                updatedDate: "2024-08-06T05:56:51.325Z",
                key: 0,
              },
              "66a33a881db0e24a4d96e375": {
                inventoryId: "66a33a881db0e24a4d96e375",
                productId: "6578b9f2ade8930415fc0484",
                name: "Basil",
                farmId: "fm1a215ac2",
                description: "desc",
                provider: "proev",
                quantity: 45,
                unit: "nos",
                used: 0,
                wastage: 0,
                createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdDate: "2024-07-26T05:56:24.417Z",
                updatedDate: "2024-07-26T05:56:24.417Z",
                key: 1,
              },
            },
          },
          result: ["66b1bb23e33955b963f179a1", "66a33a881db0e24a4d96e375"],
        },
        selectedInventory: {
          inventoryId: "66b1bb23e33955b963f179a1",
          productId: "6626234c3c4db8c98290828e",
          name: "NPK",
          farmId: "fm1a215ac2",
          description: null,
          provider: "provider1",
          quantity: 5,
          unit: "L",
          used: 0,
          wastage: 0,
          createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
          updatedBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
          createdDate: "2024-08-06T05:56:51.325Z",
          updatedDate: "2024-08-06T05:56:51.325Z",
          key: 0,
        },
        subCategories: {
          entities: {
            subCategories: {
              "65dcc0591e82ab3fc6d9d768": {
                productCategoryId: "6578b98aade8930415fc0483",
                subCategoryId: "65dcc0591e82ab3fc6d9d768",
                name: "Seeds",
                units: ["Nos"],
                products: [
                  {
                    id: "6578b9f2ade8930415fc0484",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Basil",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-12T19:52:18.660Z",
                    updatedDate: "2023-12-12T19:52:18.660Z",
                  },
                  {
                    id: "6579d3b4026c967a135f49c6",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Broccoli",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T15:54:28.375Z",
                    updatedDate: "2023-12-13T15:54:28.375Z",
                  },
                  {
                    id: "6579d7f5026c967a135f49c7",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Bell pepper",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:12:37.319Z",
                    updatedDate: "2023-12-13T16:12:37.319Z",
                  },
                  {
                    id: "6579d816026c967a135f49c8",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Cherry Tomato",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:13:10.065Z",
                    updatedDate: "2023-12-13T16:13:10.065Z",
                  },
                  {
                    id: "6579d836026c967a135f49c9",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Beef Steak Tomato",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:13:42.413Z",
                    updatedDate: "2023-12-13T16:13:42.413Z",
                  },
                  {
                    id: "6579d855026c967a135f49ca",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Cucumber",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:14:13.862Z",
                    updatedDate: "2023-12-13T16:14:13.862Z",
                  },
                  {
                    id: "6579d883026c967a135f49cb",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Red Amaranth",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:14:59.853Z",
                    updatedDate: "2023-12-13T16:14:59.853Z",
                  },
                  {
                    id: "6579d8a0026c967a135f49cc",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Rosemary",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:15:28.538Z",
                    updatedDate: "2023-12-13T16:15:28.538Z",
                  },
                  {
                    id: "6579d8bc026c967a135f49cd",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Baby Spinach",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:15:56.339Z",
                    updatedDate: "2023-12-13T16:15:56.339Z",
                  },
                  {
                    id: "6579d8f6026c967a135f49ce",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Romaine lettuce",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:16:54.369Z",
                    updatedDate: "2023-12-13T16:16:54.369Z",
                  },
                  {
                    id: "6579d914026c967a135f49cf",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Lollo Bionda lettuce",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:17:24.363Z",
                    updatedDate: "2023-12-13T16:17:24.363Z",
                  },
                  {
                    id: "6579d92d026c967a135f49d0",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Butterhead Lettuce",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:17:49.874Z",
                    updatedDate: "2023-12-13T16:17:49.874Z",
                  },
                  {
                    id: "6579d948026c967a135f49d1",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Snacky Peppers",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:18:16.711Z",
                    updatedDate: "2023-12-13T16:18:16.711Z",
                  },
                  {
                    id: "6579d969026c967a135f49d2",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Thyme",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:18:49.005Z",
                    updatedDate: "2023-12-13T16:18:49.005Z",
                  },
                  {
                    id: "66503c2c5be999b675d97822",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Oakleaf Red",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-05-24T07:05:16.339Z",
                    updatedDate: "2024-05-24T07:05:16.339Z",
                  },
                  {
                    id: "665463b5362badddc9699282",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Lollo Rosso",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-05-27T10:43:01.800Z",
                    updatedDate: "2024-05-27T10:43:01.800Z",
                  },
                  {
                    id: "6656b5f8b36315c607873a82",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Oakleaf Green",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-05-29T04:58:32.874Z",
                    updatedDate: "2024-05-29T04:58:32.874Z",
                  },
                  {
                    id: "665da361f355975992cf530c",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Coriander",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-06-03T11:05:05.327Z",
                    updatedDate: "2024-06-03T11:05:05.327Z",
                  },
                  {
                    id: "665f2c52f355975992cf7a44",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Normal Spinach",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-06-04T15:01:38.532Z",
                    updatedDate: "2024-06-04T15:01:38.532Z",
                  },
                ],
                createdBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                updatedBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                createdDate: "2024-02-26T16:46:15.674Z",
                updatedDate: "2024-02-26T16:46:15.674Z",
              },
              "65dcc1001e82ab3fc6d9d769": {
                productCategoryId: "6578b98aade8930415fc0483",
                subCategoryId: "65dcc1001e82ab3fc6d9d769",
                name: "Nutrients",
                units: ["ml", "L", "gms", "Kg"],
                products: [],
                createdBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                updatedBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                createdDate: "2024-02-26T16:49:04.143Z",
                updatedDate: "2024-02-26T16:49:04.143Z",
              },
            },
          },
          result: ["65dcc0591e82ab3fc6d9d768", "65dcc1001e82ab3fc6d9d769"],
        },
      },
      error:{
        "[scope:quantity]inventories/PATCH_INVENTORY_FINISHED":{
          errors: [
            {
              error: "Undefined",
              message: "Unauthorized",
              type: "error",
              location: "taskName",
            },
          ],
          exception: "UnauthorizedException",
          path: "/v2/inventories",
          code: 401,
          timestamp: 1719331473887,
          actionType: "PATCH_TASK_FINISHED",
        }
      },
    });
    renderWithProvider(<InventorySidebar />, { store });
    const quantity = screen.getByText("5");
    await userEvent.click(quantity);
    const saveButton = screen.getByTestId("quantity-save");
    expect(saveButton).toBeDisabled();

  });
  it("should click and update the wastage", async () => {
    renderWithProvider(<InventorySidebar />, { store });
    const wastage = screen.getByText("0");
    await userEvent.click(wastage);
    const input = screen.getByTestId("wastage-input");
    await userEvent.type(input, "5");
    const saveButton = screen.getByTestId("wastage-save");
    await userEvent.click(saveButton);
    expect(store.dispatch).toHaveBeenLastCalledWith(
      InventoryActions.patchInventory(
        {
          data: {
            description: null,
            provider: "provider1",
            quantity: 5,
            wastage: 5,
          },
          id: "66b1bb23e33955b963f179a1",
        },
        "wastage"
      )
    );
  });
  it("should close the sidebar", async () => {
    renderWithProvider(<InventorySidebar />, { store });
    const close = screen.getByTestId("inventory-sidebar-close");
    await userEvent.click(close);
    expect(store.dispatch).toHaveBeenLastCalledWith(
      InventoryActions.unselectInventory()
    );
  });

  it("should cancel the update on cancel button click", async () => {
    renderWithProvider(<InventorySidebar />, { store });
    const quantity = screen.getByText("5");
    await userEvent.click(quantity);
    const input = screen.getByTestId("quantity-input");
    await userEvent.type(input, "0");
    const cancelButton = screen.getByTestId("quantity-cancel");
    await userEvent.click(cancelButton);
    expect(screen.queryByTestId("quantity-input")).not.toBeInTheDocument();
  });
  it("should show description", async () => { 
    store = setupDefaultStore({
      inventories: {
        inventories: {
          entities: {
            inventories: {
              "66b1bb23e33955b963f179a1": {
                inventoryId: "66b1bb23e33955b963f179a1",
                productId: "6626234c3c4db8c98290828e",
                name: "NPK",
                farmId: "fm1a215ac2",
                description: null,
                provider: "provider1",
                quantity: 5,
                unit: "L",
                used: 0,
                wastage: 0,
                createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                updatedBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                createdDate: "2024-08-06T05:56:51.325Z",
                updatedDate: "2024-08-06T05:56:51.325Z",
                key: 0,
              },
              "66a33a881db0e24a4d96e375": {
                inventoryId: "66a33a881db0e24a4d96e375",
                productId: "6578b9f2ade8930415fc0484",
                name: "Basil",
                farmId: "fm1a215ac2",
                description: "desc",
                provider: "proev",
                quantity: 45,
                unit: "nos",
                used: 0,
                wastage: 0,
                createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdDate: "2024-07-26T05:56:24.417Z",
                updatedDate: "2024-07-26T05:56:24.417Z",
                key: 1,
              },
            },
          },
          result: ["66b1bb23e33955b963f179a1", "66a33a881db0e24a4d96e375"],
        },
        selectedInventory: {
          inventoryId: "66b1bb23e33955b963f179a1",
          productId: "6626234c3c4db8c98290828e",
          name: "NPK",
          farmId: "fm1a215ac2",
          description: "fighter",
          provider: "provider1",
          quantity: 5,
          unit: "L",
          used: 0,
          wastage: 0,
          createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
          updatedBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
          createdDate: "2024-08-06T05:56:51.325Z",
          updatedDate: "2024-08-06T05:56:51.325Z",
          key: 0,
        },
        subCategories: {
          entities: {
            subCategories: {
              "65dcc0591e82ab3fc6d9d768": {
                productCategoryId: "6578b98aade8930415fc0483",
                subCategoryId: "65dcc0591e82ab3fc6d9d768",
                name: "Seeds",
                units: ["Nos"],
                products: [
                  {
                    id: "6578b9f2ade8930415fc0484",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Basil",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-12T19:52:18.660Z",
                    updatedDate: "2023-12-12T19:52:18.660Z",
                  },
                  {
                    id: "6579d3b4026c967a135f49c6",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Broccoli",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T15:54:28.375Z",
                    updatedDate: "2023-12-13T15:54:28.375Z",
                  },
                  {
                    id: "6579d7f5026c967a135f49c7",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Bell pepper",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:12:37.319Z",
                    updatedDate: "2023-12-13T16:12:37.319Z",
                  },
                  {
                    id: "6579d816026c967a135f49c8",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Cherry Tomato",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:13:10.065Z",
                    updatedDate: "2023-12-13T16:13:10.065Z",
                  },
                  {
                    id: "6579d836026c967a135f49c9",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Beef Steak Tomato",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:13:42.413Z",
                    updatedDate: "2023-12-13T16:13:42.413Z",
                  },
                  {
                    id: "6579d855026c967a135f49ca",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Cucumber",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:14:13.862Z",
                    updatedDate: "2023-12-13T16:14:13.862Z",
                  },
                  {
                    id: "6579d883026c967a135f49cb",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Red Amaranth",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:14:59.853Z",
                    updatedDate: "2023-12-13T16:14:59.853Z",
                  },
                  {
                    id: "6579d8a0026c967a135f49cc",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Rosemary",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:15:28.538Z",
                    updatedDate: "2023-12-13T16:15:28.538Z",
                  },
                  {
                    id: "6579d8bc026c967a135f49cd",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Baby Spinach",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:15:56.339Z",
                    updatedDate: "2023-12-13T16:15:56.339Z",
                  },
                  {
                    id: "6579d8f6026c967a135f49ce",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Romaine lettuce",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:16:54.369Z",
                    updatedDate: "2023-12-13T16:16:54.369Z",
                  },
                  {
                    id: "6579d914026c967a135f49cf",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Lollo Bionda lettuce",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:17:24.363Z",
                    updatedDate: "2023-12-13T16:17:24.363Z",
                  },
                  {
                    id: "6579d92d026c967a135f49d0",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Butterhead Lettuce",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:17:49.874Z",
                    updatedDate: "2023-12-13T16:17:49.874Z",
                  },
                  {
                    id: "6579d948026c967a135f49d1",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Snacky Peppers",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:18:16.711Z",
                    updatedDate: "2023-12-13T16:18:16.711Z",
                  },
                  {
                    id: "6579d969026c967a135f49d2",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Thyme",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:18:49.005Z",
                    updatedDate: "2023-12-13T16:18:49.005Z",
                  },
                  {
                    id: "66503c2c5be999b675d97822",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Oakleaf Red",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-05-24T07:05:16.339Z",
                    updatedDate: "2024-05-24T07:05:16.339Z",
                  },
                  {
                    id: "665463b5362badddc9699282",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Lollo Rosso",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-05-27T10:43:01.800Z",
                    updatedDate: "2024-05-27T10:43:01.800Z",
                  },
                  {
                    id: "6656b5f8b36315c607873a82",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Oakleaf Green",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-05-29T04:58:32.874Z",
                    updatedDate: "2024-05-29T04:58:32.874Z",
                  },
                  {
                    id: "665da361f355975992cf530c",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Coriander",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-06-03T11:05:05.327Z",
                    updatedDate: "2024-06-03T11:05:05.327Z",
                  },
                  {
                    id: "665f2c52f355975992cf7a44",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Normal Spinach",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-06-04T15:01:38.532Z",
                    updatedDate: "2024-06-04T15:01:38.532Z",
                  },
                ],
                createdBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                updatedBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                createdDate: "2024-02-26T16:46:15.674Z",
                updatedDate: "2024-02-26T16:46:15.674Z",
              },
              "65dcc1001e82ab3fc6d9d769": {
                productCategoryId: "6578b98aade8930415fc0483",
                subCategoryId: "65dcc1001e82ab3fc6d9d769",
                name: "Nutrients",
                units: ["ml", "L", "gms", "Kg"],
                products: [],
                createdBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                updatedBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                createdDate: "2024-02-26T16:49:04.143Z",
                updatedDate: "2024-02-26T16:49:04.143Z",
              },
            },
          },
          result: ["65dcc0591e82ab3fc6d9d768", "65dcc1001e82ab3fc6d9d769"],
        },
      },
    });
    renderWithProvider(<InventorySidebar />, { store });
    const description = screen.getByText("fighter");
    expect(description).toBeInTheDocument();
  });

  it("should unselect inventory on change famrID", async () => {
    renderWithProvider(<InventorySidebar />, { store });
    expect(store.dispatch).toHaveBeenLastCalledWith(InventoryActions.unselectInventory());
  })
  it("should keep sidebar open and show error on delete inventory error", async () => {
    store = setupDefaultStore({
      inventories: {
        inventories: {
          entities: {
            inventories: {
              "66b1bb23e33955b963f179a1": {
                inventoryId: "66b1bb23e33955b963f179a1",
                productId: "6626234c3c4db8c98290828e",
                name: "NPK",
                farmId: "fm1a215ac2",
                description: null,
                provider: "provider1",
                quantity: 5,
                unit: "L",
                used: 0,
                wastage: 0,
                createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                updatedBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                createdDate: "2024-08-06T05:56:51.325Z",
                updatedDate: "2024-08-06T05:56:51.325Z",
                key: 0,
              },
              "66a33a881db0e24a4d96e375": {
                inventoryId: "66a33a881db0e24a4d96e375",
                productId: "6578b9f2ade8930415fc0484",
                name: "Basil",
                farmId: "fm1a215ac2",
                description: "desc",
                provider: "proev",
                quantity: 45,
                unit: "nos",
                used: 0,
                wastage: 0,
                createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdDate: "2024-07-26T05:56:24.417Z",
                updatedDate: "2024-07-26T05:56:24.417Z",
                key: 1,
              },
            },
          },
          result: ["66b1bb23e33955b963f179a1", "66a33a881db0e24a4d96e375"],
        },
        selectedInventory: {
          inventoryId: "66b1bb23e33955b963f179a1",
          productId: "6626234c3c4db8c98290828e",
          name: "NPK",
          farmId: "fm1a215ac2",
          description: null,
          provider: "provider1",
          quantity: 5,
          unit: "L",
          used: 0,
          wastage: 0,
          createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
          updatedBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
          createdDate: "2024-08-06T05:56:51.325Z",
          updatedDate: "2024-08-06T05:56:51.325Z",
          key: 0,
        },
        subCategories: {
          entities: {
            subCategories: {
              "65dcc0591e82ab3fc6d9d768": {
                productCategoryId: "6578b98aade8930415fc0483",
                subCategoryId: "65dcc0591e82ab3fc6d9d768",
                name: "Seeds",
                units: ["Nos"],
                products: [
                  {
                    id: "6578b9f2ade8930415fc0484",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Basil",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-12T19:52:18.660Z",
                    updatedDate: "2023-12-12T19:52:18.660Z",
                  },
                  {
                    id: "6579d3b4026c967a135f49c6",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Broccoli",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T15:54:28.375Z",
                    updatedDate: "2023-12-13T15:54:28.375Z",
                  },
                  {
                    id: "6579d7f5026c967a135f49c7",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Bell pepper",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:12:37.319Z",
                    updatedDate: "2023-12-13T16:12:37.319Z",
                  },
                  {
                    id: "6579d816026c967a135f49c8",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Cherry Tomato",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:13:10.065Z",
                    updatedDate: "2023-12-13T16:13:10.065Z",
                  },
                  {
                    id: "6579d836026c967a135f49c9",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Beef Steak Tomato",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:13:42.413Z",
                    updatedDate: "2023-12-13T16:13:42.413Z",
                  },
                  {
                    id: "6579d855026c967a135f49ca",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Cucumber",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:14:13.862Z",
                    updatedDate: "2023-12-13T16:14:13.862Z",
                  },
                  {
                    id: "6579d883026c967a135f49cb",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Red Amaranth",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:14:59.853Z",
                    updatedDate: "2023-12-13T16:14:59.853Z",
                  },
                  {
                    id: "6579d8a0026c967a135f49cc",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Rosemary",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:15:28.538Z",
                    updatedDate: "2023-12-13T16:15:28.538Z",
                  },
                  {
                    id: "6579d8bc026c967a135f49cd",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Baby Spinach",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:15:56.339Z",
                    updatedDate: "2023-12-13T16:15:56.339Z",
                  },
                  {
                    id: "6579d8f6026c967a135f49ce",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Romaine lettuce",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:16:54.369Z",
                    updatedDate: "2023-12-13T16:16:54.369Z",
                  },
                  {
                    id: "6579d914026c967a135f49cf",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Lollo Bionda lettuce",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:17:24.363Z",
                    updatedDate: "2023-12-13T16:17:24.363Z",
                  },
                  {
                    id: "6579d92d026c967a135f49d0",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Butterhead Lettuce",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:17:49.874Z",
                    updatedDate: "2023-12-13T16:17:49.874Z",
                  },
                  {
                    id: "6579d948026c967a135f49d1",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Snacky Peppers",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:18:16.711Z",
                    updatedDate: "2023-12-13T16:18:16.711Z",
                  },
                  {
                    id: "6579d969026c967a135f49d2",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Thyme",
                    unit: "nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "+918530484193",
                    updatedBy: "+918530484193",
                    createdDate: "2023-12-13T16:18:49.005Z",
                    updatedDate: "2023-12-13T16:18:49.005Z",
                  },
                  {
                    id: "66503c2c5be999b675d97822",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Oakleaf Red",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-05-24T07:05:16.339Z",
                    updatedDate: "2024-05-24T07:05:16.339Z",
                  },
                  {
                    id: "665463b5362badddc9699282",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Lollo Rosso",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-05-27T10:43:01.800Z",
                    updatedDate: "2024-05-27T10:43:01.800Z",
                  },
                  {
                    id: "6656b5f8b36315c607873a82",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Oakleaf Green",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-05-29T04:58:32.874Z",
                    updatedDate: "2024-05-29T04:58:32.874Z",
                  },
                  {
                    id: "665da361f355975992cf530c",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Coriander",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-06-03T11:05:05.327Z",
                    updatedDate: "2024-06-03T11:05:05.327Z",
                  },
                  {
                    id: "665f2c52f355975992cf7a44",
                    subCategoryId: "65dcc0591e82ab3fc6d9d768",
                    name: "Normal Spinach",
                    unit: "Nos",
                    properties: null,
                    isAdminApproved: true,
                    createdBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    updatedBy: "c1b3fd4a-3001-70a5-150b-3dba8372b253",
                    createdDate: "2024-06-04T15:01:38.532Z",
                    updatedDate: "2024-06-04T15:01:38.532Z",
                  },
                ],
                createdBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                updatedBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                createdDate: "2024-02-26T16:46:15.674Z",
                updatedDate: "2024-02-26T16:46:15.674Z",
              },
              "65dcc1001e82ab3fc6d9d769": {
                productCategoryId: "6578b98aade8930415fc0483",
                subCategoryId: "65dcc1001e82ab3fc6d9d769",
                name: "Nutrients",
                units: ["ml", "L", "gms", "Kg"],
                products: [],
                createdBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                updatedBy: "31d3fd1a-20f1-703f-9787-fbb713cf7b5f",
                createdDate: "2024-02-26T16:49:04.143Z",
                updatedDate: "2024-02-26T16:49:04.143Z",
              },
            },
          },
          result: ["65dcc0591e82ab3fc6d9d768", "65dcc1001e82ab3fc6d9d769"],
        },
      },
      farms:{
        selectedFarmId: "fm1a215ac2",
      },
      error:{
        [InventoryActions.DELETE_INVENTORY_FINISHED]: {
          errors: [
            {
              error: "Undefined",
              message: "Unauthorized",
              type: "error",
              location: "taskName",
            },
          ],
          exception: "UnauthorizedException",
          path: "/v2/inventories",
          code: 401,
          timestamp: 1719331473887,
          actionType: "PATCH_TASK_FINISHED",
        }
      }
    });
    renderWithProvider(<InventorySidebar />, { store });
    const error = screen.getByText("Unauthorized");
    expect(error).toBeInTheDocument();
  })

  it("should close delete menu on delete cancel", async () => {
    renderWithProvider(<InventorySidebar />, { store });
    const threeDots = screen.getByTestId("inventory-sidebar-three-dots");
    expect(threeDots).toBeInTheDocument();
    await userEvent.click(threeDots);
    const deleteButton = screen.getByText("Delete");
    await userEvent.click(deleteButton);
    const cancelButton = screen.getByText("Cancel");
    await userEvent.click(cancelButton);
    expect(screen.queryByText("Delete")).not.toBeVisible();
  });
});
