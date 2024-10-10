import Button from "@/components/common/button";
import AlertError from "@/components/common/error/AlertError";
import Form, { useForm } from "@/components/common/form";
import Input from "@/components/common/input";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import AccountSelectors from "@/redux/account/selectors";
import { removeByActionType } from "@/redux/error/errorAction";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { makeRequestingSelector } from "@/redux/requesting/requestingSelector";
import SessionActions from "@/redux/session/actions";
import UserActions from "@/redux/user/actions";
import { getTranslation } from "@/translation/i18n";
import { forgotPasswordType } from "@/types/auth";
import { Images } from "@/utilities/imagesPath";
import { REGEX } from "@/utilities/regex";
import { useEffect, useState } from "react";

const selectLoading = makeRequestingSelector();
const selectError = makeSelectErrorModel();

const OtpVerification = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();

  const userInfo = useAppSelector(AccountSelectors.SelectRegisterUserInfo);
  const [remainingTime, setRemainingTime] = useState(0);

  const submitOTPError = useAppSelector((state) =>
    selectError(state, SessionActions.REQUEST_USER_VERIFICATION_FINISHED)
  );

  const sentOTPError = useAppSelector((state) =>
    selectError(state, UserActions.REQUEST_RESET_PASSWORD_OTP_FINISHED)
  );

  const loading = useAppSelector((state) =>
    selectLoading(state, [SessionActions.REQUEST_USER_VERIFICATION])
  );

  const onSubmitOtp = (values: forgotPasswordType) => {
    dispatch(SessionActions.requestUserVerfication(userInfo.phone, values.otp));
  };

  useEffect(() => {
    setRemainingTime(30);
  }, []);

  const resetFields = () => {
    form.resetFields();
    dispatch(
      removeByActionType(SessionActions.REQUEST_USER_VERIFICATION_FINISHED)
    );
  };

  const onResendOtp = () => {
    resetFields();
    dispatch(UserActions.sendResetPasswordOTP({ phone: userInfo.phone }));
  };

  useEffect(() => {
    resetFields();
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
                {getTranslation("login.userVerfication")}
              </p>
            </div>
          </div>

          <AlertError error={sentOTPError} />
          <AlertError error={submitOTPError} />
          <Form form={form} onFinish={onSubmitOtp}>
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
                  onClick={() => onResendOtp()}
                >
                  {getTranslation("forgotPassword.resendOtp")}
                </span>
              </p>
            )}

            <Button
              loading={loading}
              label={getTranslation("login.submitOtp")}
              htmlType="submit"
              type="primary"
              className="submit_btn"
            />
          </Form>
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

export default OtpVerification;
