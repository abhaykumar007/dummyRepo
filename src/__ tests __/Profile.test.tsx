import Profile from "@/pages/profile";
import SessionActions from "@/redux/session/actions";
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { iconRenderError } from "./__ mocks __/errorMock";
import { setupDefaultStore } from "./utils/setupTests";
import { renderWithProvider } from "./utils/testUtils";
import { getTranslation } from "@/translation/i18n";
import userEvent from "@testing-library/user-event";

describe("Profile Component", () => {
  let store: any;
  let consoleErrorMock: any;

  beforeAll(() => {
    consoleErrorMock = iconRenderError;
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
  });

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("should render the form fields with initial values", () => {
    store = setupDefaultStore({
      session: {
        details: {
          given_name: "John",
          family_name: "Doe",
          email: "john.doe@example.com",
          phone_number: "1234567890",
          address: {
            formatted: "123 Main St",
          },
        },
      },
    });

    renderWithProvider(<Profile />, { store });

    fireEvent.click(screen.getByTestId("first-name-container"));
    expect(screen.getByTestId("first-name")).toHaveValue("John");

    fireEvent.click(screen.getByTestId("last-name-container"));
    expect(screen.getByTestId("last-name")).toHaveValue("Doe");

    fireEvent.click(screen.getByTestId("email-container"));
    expect(screen.getByTestId("email")).toHaveValue("john.doe@example.com");

    fireEvent.click(screen.getByTestId("address-container"));
    expect(screen.getByTestId("address")).toHaveValue("123 Main St");

    expect(screen.getByText("1234567890")).toBeInTheDocument();
  });

  test("should dispatch update user details action on form submit", async () => {
    renderWithProvider(<Profile />, { store });

    fireEvent.click(screen.getByTestId("first-name-container"));
    fireEvent.change(screen.getByTestId("first-name"), {
      target: { value: "Jane" },
    });

    fireEvent.click(screen.getByTestId("last-name-container"));
    fireEvent.change(screen.getByTestId("last-name"), {
      target: { value: "Smith" },
    });

    fireEvent.click(screen.getByTestId("email-container"));
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "jane.smith@example.com" },
    });

    fireEvent.click(screen.getByTestId("address-container"));
    fireEvent.change(screen.getByTestId("address"), {
      target: { value: "456 Elm St" },
    });

    fireEvent.click(screen.getByTestId("given_name-save"));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        SessionActions.updateUserDetails([
          { Name: "given_name", Value: "Jane" },
        ])
      );
    });
  });

  test("should show error message if email is invalid", async () => {
    renderWithProvider(<Profile />, { store });

    fireEvent.click(screen.getByTestId("email-container"));
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "Invalid Email" },
    });

    await userEvent.click(screen.getByTestId("email-save"));

    await waitFor(() => {
      expect(
        screen.getByText(getTranslation("global.invalidEmailErr"))
      ).toBeInTheDocument();
    });
  });

  test("should display error on update profile error", async () => {
    store = setupDefaultStore({
      error: {
        [SessionActions.UPDATE_USER_DETAILS_FINISHED]: {
          errors: [{ message: "Some error occurred" }],
        },
      },
    });

    renderWithProvider(<Profile />, { store });

    await waitFor(() => {
      expect(screen.getByText("Some error occurred")).toBeInTheDocument();
    });
  });
});
