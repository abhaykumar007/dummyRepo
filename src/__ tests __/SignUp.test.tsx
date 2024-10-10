import "@testing-library/jest-dom";
import { setupDefaultStore } from "./utils/setupTests";
import { renderWithProvider } from "./utils/testUtils";
import SignUp from "@/pages/auth/signUp";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import AccountActions from "@/redux/account/actions";
import { getTranslation } from "@/translation/i18n";
import { iconRenderError } from "./__ mocks __/errorMock";

describe("SignUp Page", () => {
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

  test("renders SignUp page with form elements", () => {
    renderWithProvider(<SignUp />, { store });

    expect(
      screen.getByText(getTranslation("signUp.createYourAccount"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(getTranslation("signUp.createYourAccountTagLine"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(getTranslation("global.phoneNumber"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(getTranslation("signUp.organizationName"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(getTranslation("global.firstName"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(getTranslation("global.lastName"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(getTranslation("global.password"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(getTranslation("global.confirmPassword"))
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: getTranslation("global.signUp") })
    ).toBeInTheDocument();
  });

  test("displays validation errors on form submit with empty fields", async () => {
    renderWithProvider(<SignUp />, { store });

    fireEvent.click(
      screen.getByRole("button", { name: getTranslation("global.signUp") })
    );

    await waitFor(() => {
      expect(
        screen.getByText(getTranslation("global.phoneNumberErrMsg"))
      ).toBeInTheDocument();
      expect(
        screen.getByText(getTranslation("signUp.organizationNameErrMsg"))
      ).toBeInTheDocument();
      expect(
        screen.getByText(getTranslation("global.firstNameErrMsg"))
      ).toBeInTheDocument();
      expect(
        screen.getByText(getTranslation("global.lastNameErrMsg"))
      ).toBeInTheDocument();
      expect(
        screen.getByText(getTranslation("global.passwordErrMsg"))
      ).toBeInTheDocument();
      expect(
        screen.getByText(getTranslation("global.confirmPasswordErrMsg"))
      ).toBeInTheDocument();
    });
  });

  test("displays password mismatch error", async () => {
    renderWithProvider(<SignUp />, { store });

    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByTestId("confirm-password"), {
      target: { value: "Password2!" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: getTranslation("global.signUp") })
    );

    await waitFor(() => {
      expect(
        screen.getByText(getTranslation("global.passwordDontMatch"))
      ).toBeInTheDocument();
    });
  });

  test("displays password policy errors", async () => {
    renderWithProvider(<SignUp />, { store });

    const testCases = [
      {
        password: "short1!",
        error: getTranslation("global.passwordPolicyNotAgree"),
      },
      {
        password: "nouppercase1!",
        error: getTranslation("global.passwordPolicyNotAgree"),
      },
      {
        password: "NOLOWERCASE1!",
        error: getTranslation("global.passwordPolicyNotAgree"),
      },
      {
        password: "NoNumbers!",
        error: getTranslation("global.passwordPolicyNotAgree"),
      },
      {
        password: "NoSymbols1",
        error: getTranslation("global.passwordPolicyNotAgree"),
      },
    ];

    for (const { password, error } of testCases) {
      fireEvent.change(screen.getByTestId("password"), {
        target: { value: password },
      });
      fireEvent.blur(screen.getByTestId("password"));

      await waitFor(() => {
        expect(screen.getByText(error)).toBeInTheDocument();
      });
    }
  });

  test("calls register action on form submit with valid data", async () => {
    renderWithProvider(<SignUp />, { store });

    fireEvent.change(screen.getByTestId("phone-number-input"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByTestId("organisation-name"), {
      target: { value: "Test Organization" },
    });
    fireEvent.change(screen.getByTestId("first-name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByTestId("last-name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByTestId("password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByTestId("confirm-password"), {
      target: { value: "Password1!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: getTranslation("global.signUp") })
    );

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        AccountActions.register({
          phone: "+1234567890",
          organisationName: "Test Organization",
          firstName: "John",
          lastName: "Doe",
          password: "Password1!",
          address: "pune,maharashtra",
          email: "dummy@gmail.com",
        })
      );
    });
  });

  test("should show loading state when sign-up is in progress", async () => {
    store = setupDefaultStore({
      requesting: {
        [AccountActions.REQUEST_REGISTER]: true,
      },
    });

    renderWithProvider(<SignUp />, { store });

    expect(screen.getByRole("button", { name: /sign up/i })).toBeDisabled();
  });

  test("should display error on sign-up error", async () => {
    store = setupDefaultStore({
      error: {
        [AccountActions.REQUEST_REGISTER_FINISHED]: {
          errors: [{ message: "Registration failed!" }],
        },
      },
    });

    renderWithProvider(<SignUp />, { store });

    await waitFor(() => {
      expect(screen.getByText("Registration failed!")).toBeInTheDocument();
    });
  });
});
