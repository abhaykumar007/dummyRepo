import Button from "@/components/common/button";
import AlertError from "@/components/common/error/AlertError";
import Form, { useForm } from "@/components/common/form";
import Input from "@/components/common/input";
import PhoneInput from "@/components/common/input/phoneInput";
import PasswordPolicyChecker, {
  checkPolicyStatus,
  getInitialPolicyStatus,
} from "@/components/common/passwordPolicyChecker";
import Tooltip from "@/components/common/tooltip";
import { passwordPolicy } from "@/config/consts";
import routePaths from "@/config/routePaths";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { makeRequestingSelector } from "@/redux/requesting/requestingSelector";
import UserActions from "@/redux/user/actions";
import UserSelectors from "@/redux/user/selectors";
import { getTranslation } from "@/translation/i18n";
import { forgotPasswordType, sendOTPType } from "@/types/auth";
import { createAction } from "@/utilities/actionUtility";
import { Images } from "@/utilities/imagesPath";
import { REGEX } from "@/utilities/regex";
import { useEffect, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link } from "react-router-dom";

const selectLoading = makeRequestingSelector();
const selectError = makeSelectErrorModel();

const iconStyle = {
  fontSize: 22,
  cursor: "pointer",
};

const ForgotPassword = () => {
  const [phoneInputForm] = useForm();
  const [newPasswordForm] = useForm();
  const dispatch = useAppDispatch();

  const [policiesStatus, setPolicyStatus] = useState(
    getInitialPolicyStatus(passwordPolicy)
  );
  const [isPasswordHintActive, setPasswordHintActive] = useState(false);
  const [password, setPassword] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);

  const isOTPSent = useAppSelector(UserSelectors.SelectResetOTPSent);
  const sentOTPError = useAppSelector((state) =>
    selectError(state, UserActions.REQUEST_RESET_PASSWORD_OTP_FINISHED)
  );
  const passwordResetError = useAppSelector((state) =>
    selectError(state, UserActions.RESET_PASSWORD_FINISHED)
  );
  const sentOTPLoading = useAppSelector((state) =>
    selectLoading(state, [UserActions.REQUEST_RESET_PASSWORD_OTP])
  );
  const passwordResetLoading = useAppSelector((state) =>
    selectLoading(state, [UserActions.RESET_PASSWORD])
  );

  const validatePassword = (value: string): Promise<void> => {
    const status = checkPolicyStatus(policiesStatus, password, passwordPolicy);
    const isPasswordValid = Object.values(status).every((val) => val);
    setPolicyStatus(status);
    return new Promise((resolve, reject) => {
      if (!value || value.length === 0 || isPasswordValid) {
        resolve();
      } else {
        reject(new Error(getTranslation("global.passwordPolicyNotAgree")));
      }
    });
  };

  function renderPasswordIcon() {
    return (visible: boolean) =>
      visible ? <IoEye style={iconStyle} /> : <IoEyeOff style={iconStyle} />;
  }

  const onPhoneInputFinish = (payload: sendOTPType) => {
    dispatch(UserActions.sendResetPasswordOTP(payload));
  };

  const onNewPasswordFinish = (values: forgotPasswordType) => {
    const payload = {
      ...values,
      phoneNumber: phoneInputForm.getFieldValue("phone"),
    };

    dispatch(UserActions.resetPasswordWithOTP(payload));
  };

  useEffect(() => {
    if (isOTPSent && !sentOTPError) {
      setRemainingTime(30);
    }
  }, [isOTPSent, sentOTPError]);

  useEffect(() => {
    return () => {
      dispatch(
        createAction(UserActions.REQUEST_RESET_PASSWORD_OTP_FINISHED, false)
      );
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [remainingTime]);

  return (
    <div className="login_container">
      <div className="form_main_container">
        <div className="form_container">
          <div className="form_header_container">
            <div className="logo_container">
              <img src={Images.LOGO} />
            </div>
            <div className="form_header_content">
              <p className="heading1">
                {getTranslation("global.forgotPassword")}
              </p>
              <p className="description">
                {getTranslation(
                  "forgotPassword.enterPhoneNumberToResetPassword"
                )}
              </p>
            </div>
          </div>

          <AlertError error={sentOTPError} />
          <AlertError error={passwordResetError} />

          {!isOTPSent || sentOTPError ? (
            <Form form={phoneInputForm} onFinish={onPhoneInputFinish}>
              <PhoneInput
                label={getTranslation("global.phoneNumber")}
                name="phone"
                rules={[
                  {
                    required: true,
                    message: getTranslation("global.phoneNumberErrMsg"),
                  },
                ]}
              />

              <Button
                label={getTranslation("forgotPassword.resetPassword")}
                loading={sentOTPLoading}
                htmlType="submit"
                type="primary"
                className="submit_btn"
              />
            </Form>
          ) : (
            <Form form={newPasswordForm} onFinish={onNewPasswordFinish}>
              <Input
                label={getTranslation("global.otp")}
                name="otp"
                maxLength={6}
                testId="otp"
                rules={[
                  {
                    required: true,
                    message: getTranslation("global.otpErrMsg"),
                  },
                  {
                    pattern: REGEX.VALID_NUMBER_VALIDATION,
                    message: getTranslation("global.otpHaveNumberErrMsg"),
                  },
                ]}
                placeholder={getTranslation("global.otpPlaceholder")}
              />

              {remainingTime !== 0 ? (
                <p className="not_a_memeber_text resend_otp_container">
                  {getTranslation("forgotPassword.resetOtpIn")}{" "}
                  <span className="register_text">
                    {remainingTime} {getTranslation("forgotPassword.seconds")}
                  </span>
                </p>
              ) : (
                <p className="not_a_memeber_text resend_otp_container">
                  {getTranslation("forgotPassword.dontReceiveOtp")}{" "}
                  <span
                    className="register_text cursor_pointer"
                    onClick={() =>
                      onPhoneInputFinish({
                        phone: phoneInputForm.getFieldValue("phone"),
                      })
                    }
                  >
                    {getTranslation("forgotPassword.resendOtp")}
                  </span>
                </p>
              )}

              <Tooltip
                overlayInnerStyle={{ backgroundColor: "white", width: "250px" }}
                destroyTooltipOnHide={false}
                open={isPasswordHintActive}
                onOpenChange={setPasswordHintActive}
                title={
                  <PasswordPolicyChecker
                    password={password}
                    policy={passwordPolicy}
                  />
                }
                placement="top"
              >
                <Input
                  label={getTranslation("global.password")}
                  name="password"
                  testId="password"
                  rules={[
                    {
                      required: true,
                      message: getTranslation("global.passwordErrMsg"),
                    },
                    { validator: (_, value) => validatePassword(value) },
                  ]}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  onFocus={() => {
                    setPasswordHintActive(true);
                  }}
                  onBlur={() => {
                    setPasswordHintActive(false);
                  }}
                  iconRender={renderPasswordIcon()}
                  isPasswordInput
                  placeholder={getTranslation("global.passwordPlaceholder")}
                />
              </Tooltip>
              <Input
                label={getTranslation("global.confirmPassword")}
                name="confirmPassword"
                testId="confirm-password"
                rules={[
                  {
                    required: true,
                    message: getTranslation("global.confirmPasswordErrMsg"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        getTranslation("global.passwordDontMatch")
                      );
                    },
                  }),
                ]}
                iconRender={renderPasswordIcon()}
                isPasswordInput
                placeholder={getTranslation(
                  "global.confirmPasswordPlaceholder"
                )}
              />

              <Button
                loading={passwordResetLoading}
                label={getTranslation("forgotPassword.resetPassword")}
                htmlType="submit"
                type="primary"
                className="submit_btn"
              />
            </Form>
          )}
          <Link to={routePaths.login}>
            <p className="not_a_memeber_text">
              {getTranslation("forgotPassword.backTo")}{" "}
              <span className="register_text">
                {getTranslation("global.signIn")}
              </span>
            </p>
          </Link>
        </div>
      </div>
      <div className="image_main_container">
        <div className="image_container">
          <img alt="not found" src={Images.FORGOT_PASSWORD_BG} />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
