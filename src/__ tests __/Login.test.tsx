import { fireEvent, screen, waitFor } from "@testing-library/react";
import Login from "@/pages/auth/login";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "./utils/setupTests";
import { renderWithProvider } from "./utils/testUtils";
import SessionActions from "@/redux/session/actions";
import { getTranslation } from "@/translation/i18n";
import userEvent from "@testing-library/user-event";

jest.mock("@/utilities/toast", () => ({
  errorToast: jest.fn(),
}));

describe("Login Page", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("should render the login form", () => {
    renderWithProvider(<Login />, { store });

    expect(
      screen.getByText(getTranslation("login.welcomeBack"))
    ).toBeInTheDocument();

    expect(
      screen.getByText(getTranslation("global.phoneNumber"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(getTranslation("global.password"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(getTranslation("login.rememberMe"))
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: getTranslation("global.signIn") })
    ).toBeInTheDocument();
  });

  test("should display error messages when inputs are empty and form is submitted", async () => {
    renderWithProvider(<Login />, { store });

    await userEvent.click(screen.getByText(getTranslation("global.signIn")));
    await waitFor(() => {
      expect(
        screen.getByText(getTranslation("global.phoneNumberErrMsg"))
      ).toBeInTheDocument();
      expect(
        screen.getByText(getTranslation("global.passwordErrMsg"))
      ).toBeInTheDocument();
    });
  });

  test("should dispatch login action with valid inputs", async () => {
    renderWithProvider(<Login />, { store });

    fireEvent.change(screen.getByTestId("phone-number-input"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByText(getTranslation("global.signIn")));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        SessionActions.login({
          phoneNumber: "1234567890",
          password: "password",
        })
      );
    });
  });

  test("should show loading state when login is in progress", () => {
    store = setupDefaultStore({
      requesting: {
        [SessionActions.REQUEST_LOGIN]: true,
      },
    });

    renderWithProvider(<Login />, { store });
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
  });

  test("should display error toast on login error", async () => {
    store = setupDefaultStore({
      error: {
        [SessionActions.REQUEST_LOGIN_FINISHED]: {
          errors: [{ message: "Invalid credentials" }],
        },
      },
    });

    renderWithProvider(<Login />, { store });

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  test("should display account approval status error", () => {
    store = setupDefaultStore({
      session: {
        accountApprovalStatus: "Account not approved",
      },
    });

    renderWithProvider(<Login />, { store });

    expect(screen.getByText("Account not approved")).toBeInTheDocument();
  });
});
