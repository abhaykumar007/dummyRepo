/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "./utils/setupTests";
import { renderWithProvider } from "./utils/testUtils";
import { getTranslation } from "@/translation/i18n";
import OtpVerification from "@/pages/auth/otpVerification/otpVerification";
import userEvent from "@testing-library/user-event";
import SessionActions from "@/redux/session/actions";
import UserActions from "@/redux/user/actions";

describe("OtpVerification Component", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("should render the OTP verification form", () => {
    renderWithProvider(<OtpVerification />, { store });

    expect(screen.getByTestId("otp")).toBeInTheDocument();
    expect(
      screen.getByText(getTranslation("login.userVerfication"))
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: getTranslation("login.submitOtp") })
    ).toBeInTheDocument();
  });

  test("should display error messages when inputs are empty and form is submitted", async () => {
    renderWithProvider(<OtpVerification />, { store });

    await userEvent.click(screen.getByText(getTranslation("login.submitOtp")));
    await waitFor(() => {
      expect(
        screen.getByText(getTranslation("global.otpErrMsg"))
      ).toBeInTheDocument();
    });
  });

  test("should not submit with non-numeric OTP", async () => {
    renderWithProvider(<OtpVerification />, { store });

    fireEvent.change(screen.getByTestId("otp"), {
      target: { value: "abc123" },
    });
    fireEvent.click(screen.getByText(getTranslation("login.submitOtp")));

    await waitFor(() => {
      expect(
        screen.getByText(getTranslation("global.otpHaveNumberErrMsg"))
      ).toBeInTheDocument();
    });
  });

  test("should trigger onSubmitOtp when form is submitted with valid OTP", async () => {
    store = setupDefaultStore({
      account: { userInfo: { phone: "1234567890" } },
    });
    renderWithProvider(<OtpVerification />, { store });

    fireEvent.change(screen.getByTestId("otp"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText(getTranslation("login.submitOtp")));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        SessionActions.requestUserVerfication("1234567890", "123456")
      );
    });
  });

  test("should show loading state when OTP verification is in progress", () => {
    store = setupDefaultStore({
      requesting: {
        [SessionActions.REQUEST_USER_VERIFICATION]: true,
      },
    });

    renderWithProvider(<OtpVerification />, { store });
    expect(screen.getByRole("button", { name: /submit otp/i })).toBeDisabled();
  });

  test("should not trigger onResendOtp before the timer ends", async () => {
    store = setupDefaultStore();

    renderWithProvider(<OtpVerification />, { store });

    expect(
      screen.queryByText(getTranslation("forgotPassword.resendOtp"))
    ).toBeNull();
  });

  test("should display error messages if sentOTPError or submitOTPError exist", async () => {
    store = setupDefaultStore({
      error: {
        [UserActions.REQUEST_RESET_PASSWORD_OTP_FINISHED]: {
          errors: [{ message: "Failed to send OTP" }],
        },
        [SessionActions.REQUEST_USER_VERIFICATION_FINISHED]: {
          errors: [{ message: "Invalid OTP" }],
        },
      },
    });

    renderWithProvider(<OtpVerification />, { store });

    await waitFor(() => {
      expect(screen.getByText("Failed to send OTP")).toBeInTheDocument();
      expect(screen.getByText("Invalid OTP")).toBeInTheDocument();
    });
  });
});
