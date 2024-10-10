import UserManagement from "@/pages/userManagement";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import UserActions from "@/redux/user/actions";
import userEvent from "@testing-library/user-event";

describe("User Management", () => {
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
      users: {
        users: {},
        selectedUser: null,
        filter:{
          search: "",
        }
      },
    });
  });
  test("should render the user management page", () => {
    renderWithProvider(<UserManagement />, { store });
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search user")).toBeInTheDocument();
    expect(screen.getByText("Add User")).toBeInTheDocument();
  });

  test("should diplay in table loader when fetching users", async () => {
    store = setupDefaultStore({
      requesting: {
        [UserActions.FETCH_USERS]: true,
      },
      users: {
        users: {},
        selectedUser: null,
        filter:{
          search: "",
        }
      },
    });
    renderWithProvider(<UserManagement />, { store });
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });
  test("should render table with users", async () => {
    store = setupDefaultStore({
      users: {
        users: {
          entities: {
            users: {
              "61530dca-7031-70da-b1d5-db5d1ecf29c2": {
                userId: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                firstName: "kamal",
                lastName: "kishor",
                phone: "+917070970050",
                roles: [
                  "OWNER",
                  "ADMIN",
                  "FARM_MANAGER",
                  "AGRONOMIST",
                  "VIEWER",
                ],
                role: "OWNER",
                organisationId: null,
                createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                updatedBy: null,
                createdDate: "2024-04-26T09:00:51.818Z",
                updatedDate: 0,
              },
              "f183bd4a-e0b1-7023-ea73-efa364453725": {
                userId: "f183bd4a-e0b1-7023-ea73-efa364453725",
                firstName: "kamalA",
                lastName: "kishor",
                phone: "+917070970051",
                roles: [
                  "OWNER",
                  "ADMIN",
                  "FARM_MANAGER",
                  "AGRONOMIST",
                  "VIEWER",
                ],
                role: "ADMIN",
                organisationId: null,
                createdBy: "f183bd4a-e0b1-7023-ea73-efa364453725",
                updatedBy: null,
                createdDate: "2024-06-04T14:39:12.975Z",
                updatedDate: 0,
              },
              "51a3cd3a-3061-70d0-2b73-035c18fb2196": {
                userId: "51a3cd3a-3061-70d0-2b73-035c18fb2196",
                firstName: "Iphone",
                lastName: "Apple",
                phone: "+919279829234",
                roles: [
                  "OWNER",
                  "ADMIN",
                  "FARM_MANAGER",
                  "AGRONOMIST",
                  "VIEWER",
                ],
                role: "ADMIN",
                organisationId: null,
                createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                updatedBy: null,
                createdDate: "2024-06-24T10:50:50.459Z",
                updatedDate: 0,
              },
            },
          },
          result: [
            "61530dca-7031-70da-b1d5-db5d1ecf29c2",
            "f183bd4a-e0b1-7023-ea73-efa364453725",
            "51a3cd3a-3061-70d0-2b73-035c18fb2196",
          ],
        },
        passwordResetOTPSent: null,
        selectedUser: null,
        updatedUser: {},
        filter:{
          search: "",
        }
      },
    });
    renderWithProvider(<UserManagement />, { store });

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Contact Number")).toBeInTheDocument();
    expect(screen.getByText("Roles")).toBeInTheDocument();

    expect(screen.getByText("kamal kishor")).toBeInTheDocument();
    expect(screen.getByText("+917070970050")).toBeInTheDocument();
    expect(screen.getAllByText("Owner")[0]).toBeInTheDocument();
    expect(screen.getByText("kamalA kishor")).toBeInTheDocument();
    expect(screen.getByText("+917070970051")).toBeInTheDocument();
    expect(screen.getByText("Iphone Apple")).toBeInTheDocument();
    expect(screen.getByText("+919279829234")).toBeInTheDocument();

  });

  test("should display error message on error", async () => {
    store = setupDefaultStore({
      users: {
        users: {},
        selectedUser: null,
        filter:{
          search: "",
        }
      },
      error: {
        [UserActions.FETCH_USERS_FINISHED]: {
          errors: [
            {
              error: "Undefined",
              message: "Unauthorized",
              type: "error",
              location: "",
            },
          ],
          exception: "UnauthorizedException",
          path: "/v2/users",
          code: 401,
          timestamp: 1719331473887,
          actionType: "FETCH_USERS_FINISHED",
        },
      },
    });
    renderWithProvider(<UserManagement />, { store });
    expect(screen.getByText("Undefined")).toBeInTheDocument();
    expect(screen.getByText("Unauthorized")).toBeInTheDocument();
    expect(screen.getByText("UnauthorizedException")).toBeInTheDocument();
    expect(screen.getByText("401")).toBeInTheDocument();
  });

  test("should call select user on row click", async () => {
    store = setupDefaultStore({
      users: {
        users: {
          entities: {
            users: {
              "61530dca-7031-70da-b1d5-db5d1ecf29c2": {
                userId: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                firstName: "kamal",
                lastName: "kishor",
                phone: "+917070970050",
                roles: [
                  "OWNER",
                  "ADMIN",
                  "FARM_MANAGER",
                  "AGRONOMIST",
                  "VIEWER",
                ],
                role: "OWNER",
                organisationId: null,
                createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                updatedBy: null,
                createdDate: "2024-04-26T09:00:51.818Z",
                updatedDate: 0,
              },
              "f183bd4a-e0b1-7023-ea73-efa364453725": {
                userId: "f183bd4a-e0b1-7023-ea73-efa364453725",
                firstName: "kamalA",
                lastName: "kishor",
                phone: "+917070970051",
                roles: [
                  "OWNER",
                  "ADMIN",
                  "FARM_MANAGER",
                  "AGRONOMIST",
                  "VIEWER",
                ],
                role: "ADMIN",
                organisationId: null,
                createdBy: "f183bd4a-e0b1-7023-ea73-efa364453725",
                updatedBy: null,
                createdDate: "2024-06-04T14:39:12.975Z",
                updatedDate: 0,
              },
              "51a3cd3a-3061-70d0-2b73-035c18fb2196": {
                userId: "51a3cd3a-3061-70d0-2b73-035c18fb2196",
                firstName: "Iphone",
                lastName: "Apple",
                phone: "+919279829234",
                roles: [
                  "OWNER",
                  "ADMIN",
                  "FARM_MANAGER",
                  "AGRONOMIST",
                  "VIEWER",
                ],
                role: "ADMIN",
                organisationId: null,
                createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                updatedBy: null,
                createdDate: "2024-06-24T10:50:50.459Z",
                updatedDate: 0,
              },
            },
          },
          result: [
            "61530dca-7031-70da-b1d5-db5d1ecf29c2",
            "f183bd4a-e0b1-7023-ea73-efa364453725",
            "51a3cd3a-3061-70d0-2b73-035c18fb2196",
          ],
        },
        passwordResetOTPSent: null,
        selectedUser: null,
        updatedUser: {},
        filter:{
          search: "",
        }
      },
    });
    renderWithProvider(<UserManagement />, { store });
    const row = screen.getAllByRole("row")[1];
    row.click();
    expect(store.dispatch).toHaveBeenCalledWith(
      UserActions.selectUser({
        userId: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
        firstName: "kamal",
        lastName: "kishor",
        phone: "+917070970050",
        roles: [
          "OWNER",
          "ADMIN",
          "FARM_MANAGER",
          "AGRONOMIST",
          "VIEWER",
        ],
        role: "OWNER",
        organisationId: null,
        createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
        createdDate: "2024-04-26T09:00:51.818Z",
        updatedBy: null,
        updatedDate: 0,
        key:0,
      })
    );
  });

  test("should call set filter on search", async () => {
    store = setupDefaultStore({
      users: {
        users: {
          entities: {
            users: {
              "61530dca-7031-70da-b1d5-db5d1ecf29c2": {
                userId: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                firstName: "kamal",
                lastName: "kishor",
                phone: "+917070970050",
                roles: [
                  "OWNER",
                  "ADMIN",
                  "FARM_MANAGER",
                  "AGRONOMIST",
                  "VIEWER",
                ],
                role: "OWNER",
                organisationId: null,
                createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                updatedBy: null,
                createdDate: "2024-04-26T09:00:51.818Z",
                updatedDate: 0,
              },
              "f183bd4a-e0b1-7023-ea73-efa364453725": {
                userId: "f183bd4a-e0b1-7023-ea73-efa364453725",
                firstName: "kamalA",
                lastName: "kishor",
                phone: "+917070970051",
                roles: [
                  "OWNER",
                  "ADMIN",
                  "FARM_MANAGER",
                  "AGRONOMIST",
                  "VIEWER",
                ],
                role: "ADMIN",
                organisationId: null,
                createdBy: "f183bd4a-e0b1-7023-ea73-efa364453725",
                updatedBy: null,
                createdDate: "2024-06-04T14:39:12.975Z",
                updatedDate: 0,
              },
              "51a3cd3a-3061-70d0-2b73-035c18fb2196": {
                userId: "51a3cd3a-3061-70d0-2b73-035c18fb2196",
                firstName: "Iphone",
                lastName: "Apple",
                phone: "+919279829234",
                roles: [
                  "OWNER",
                  "ADMIN",
                  "FARM_MANAGER",
                  "AGRONOMIST",
                  "VIEWER",
                ],
                role: "ADMIN",
                organisationId: null,
                createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                updatedBy: null,
                createdDate: "2024-06-24T10:50:50.459Z",
                updatedDate: 0,
              },
            },
          },
          result: [
            "61530dca-7031-70da-b1d5-db5d1ecf29c2",
            "f183bd4a-e0b1-7023-ea73-efa364453725",
            "51a3cd3a-3061-70d0-2b73-035c18fb2196",
          ],
        },
        passwordResetOTPSent: null,
        selectedUser: null,
        updatedUser: {},
        filter:{
          search: "",
        }
      },
    });
    renderWithProvider(<UserManagement />, { store });
    const searchInput = screen.getByPlaceholderText("Search user");
    await userEvent.type(searchInput, "kamal");
    expect(store.dispatch).toHaveBeenCalledWith(
      UserActions.setUserFilter({search:"kamal"})
    );

  });
});
