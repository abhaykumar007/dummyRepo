import "@testing-library/jest-dom";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import UserSidebar from "@/pages/userManagement/sidebar";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import UserActions from "@/redux/user/actions";

describe("User Details", () => {
  let store: any;
  let consoleErrorMock: any;
  let consoleWarnMock: any;
  beforeAll(() => {
    consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation((message) => {
        if (JSON.stringify(message)?.includes("findDOMNode is deprecated")) {
          return;
        }
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
  beforeAll(() => {
    consoleErrorMock = jest.spyOn(console, "error").mockImplementation((message) => {
        if (message.includes("findDOMNode is deprecated")) {
          return;
        }
    });
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
  });
  beforeEach(() => {
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
                roles: null,
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

                organisationId: null,
                createdBy: "f183bd4a-e0b1-7023-ea73-efa364453725",
                updatedBy: null,
                createdDate: "2024-06-04T14:39:12.975Z",
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
        selectedUser: {
          userId: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
          firstName: "kamal",
          lastName: "kishor",
          phone: "+917070970050",
          roles: ["OWNER", "ADMIN", "FARM_MANAGER", "AGRONOMIST", "VIEWER"],
          role: "OWNER",
          organisationId: null,
          createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
          updatedBy: null,
          createdDate: "2024-04-26T09:00:51.818Z",
          updatedDate: 0,
        },
        filter:{
            search: "",
          }
      },
    });
  });

  it("should render user details", async () => {
    renderWithProvider(<UserSidebar />, { store });
    expect(screen.getByText("kamal")).toBeInTheDocument();
    expect(screen.getByText("kishor")).toBeInTheDocument();
    expect(screen.getByText("+917070970050")).toBeInTheDocument();
  });
  it("should call delete user", async () => {
    renderWithProvider(<UserSidebar />, { store });
    const threeDots = screen.getByTestId("user-sidebar-menu-three-dots");
    await userEvent.click(threeDots);
    const deleteUser = screen.getByTestId("user-sidebar-menu-delete");
    await userEvent.click(deleteUser);
    const confirm = screen.getByText("Yes");
    await userEvent.click(confirm);
    expect(store.dispatch).toHaveBeenCalledWith(
      UserActions.deleteUser("61530dca-7031-70da-b1d5-db5d1ecf29c2")
    );
  });

  it("should close sidebar", async () => {
    renderWithProvider(<UserSidebar />, { store });
    const close = screen.getByTestId("user-sidebar-close");
    await userEvent.click(close);
    expect(store.dispatch).toHaveBeenCalledWith(UserActions.unSelectUser());
  });

  it("should update first name", async () => {
    renderWithProvider(<UserSidebar />, { store });
    const firstName = screen.getByText("kamal");
    await userEvent.click(firstName);
    const input = screen.getByTestId("firstName-input");
    expect(input).toBeInTheDocument();
    await userEvent.type(input, "A");
    const save = screen.getByTestId("firstName-save");
    await userEvent.click(save);
    expect(store.dispatch).toHaveBeenCalledWith(
      UserActions.patchUser(
        {
          id: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
          data: {
            firstName: "kamalA",
            lastName: "kishor",
            roles: ["OWNER", "ADMIN", "FARM_MANAGER", "AGRONOMIST", "VIEWER"],
          },
        },
        "firstName"
      )
    );
  });
  it("should cancel update first name", async () => {
    renderWithProvider(<UserSidebar />, { store });
    const firstName = screen.getByText("kamal");
    await userEvent.click(firstName);
    const input = screen.getByTestId("firstName-input");
    expect(input).toBeInTheDocument();
    await userEvent.type(input, "A");
    const cancel = screen.getByTestId("firstName-cancel");
    await userEvent.click(cancel);
    expect(screen.queryByTestId("firstName-input")).not.toBeInTheDocument();
  },30000);
});
