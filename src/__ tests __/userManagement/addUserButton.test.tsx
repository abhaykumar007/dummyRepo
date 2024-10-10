import AddUserButton from "@/pages/userManagement/addUserButton";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";

import UserActions from "@/redux/user/actions";
import userEvent from "@testing-library/user-event";

describe("Add User Button", () => {
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
  beforeEach(() => {
    store = setupDefaultStore({
      users: {
        users: {},
        selectedUser: null,
        filter: {
          search: "",
        },
      },
    });
  });
  it("should render modal on button click", () => {
    renderWithProvider(<AddUserButton />, { store });
    const button = screen.getByRole("button", { name: /Add User/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByTestId("add-user-modal")).toBeInTheDocument();
  });
  it("should close modal on cancel", () => {
    renderWithProvider(<AddUserButton />, { store });
    const button = screen.getByRole("button", { name: /Add User/i });
    fireEvent.click(button);
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(screen.queryByTestId("add-user-modal")).not.toBeInTheDocument();
  });
  it("should display error message on clicking ok without filling form", async () => {
    renderWithProvider(<AddUserButton />, { store });
    const button = screen.getByRole("button", { name: /Add User/i });
    fireEvent.click(button);

    const okButton = screen.getByRole("button", { name: "Add" });
    fireEvent.click(okButton);

    expect(
      await screen.findByText("Please input first name")
    ).toBeInTheDocument();
  });

  it("Add button should be disabled on loading", async () => {
    store = setupDefaultStore({
      users: {
        users: {},
        selectedUser: null,
        filter: {
          search: "",
        },
      },
      requesting: {
        [UserActions.CREATE_USER]: true,
      },
    });
    renderWithProvider(<AddUserButton />, { store });
    const button = screen.getByRole("button", { name: /Add User/i });
    fireEvent.click(button);
    expect(screen.getByRole("img", { name: "loading" })).toBeInTheDocument();
  });
  it("dispatches create user action on clicking ok", async () => {
    renderWithProvider(<AddUserButton />, { store });
    const button = screen.getByRole("button", { name: /Add User/i });

    await userEvent.click(button);

    fireEvent.change(screen.getByLabelText("First name"), {
      target: { value: "John" },
    });

    fireEvent.change(screen.getByLabelText("Last name"), {
      target: { value: "Doe" },
    });

    fireEvent.change(screen.getByTestId("phone-number-input"), {
      target: { value: "1234567890" },
    });

    const select = screen.getByTestId("roles-select").firstElementChild;
    if (select) {
      await userEvent.click(select);
    }

    const adminOption = await screen.findByText("Admin");
    await userEvent.click(adminOption);
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        UserActions.createUser({
          firstName: "John",
          lastName: "Doe",
          phone: "+1234567890",
          roles: ["ADMIN"],
        })
      );
    });
  });
});
