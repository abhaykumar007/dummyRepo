import { useEffect } from "react";
import Button from "@/components/common/button";
import Checkbox from "@/components/common/checkbox";
import AlertError from "@/components/common/error/AlertError";
import Form, { useForm } from "@/components/common/form";
import Input from "@/components/common/input";
import PhoneInput from "@/components/common/input/phoneInput";
import routePaths from "@/config/routePaths";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { makeRequestingSelector } from "@/redux/requesting/requestingSelector";
import SessionActions from "@/redux/session/actions";
import SessionSelectors from "@/redux/session/selectors";
import { getTranslation } from "@/translation/i18n";
import { loginType } from "@/types/auth";
import { Images } from "@/utilities/imagesPath";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import "../style.scss";
import { removeByActionType } from "@/redux/error/errorAction";
import { getKeyForAction } from "@/utilities/actionUtility";
import { router } from "@/routes";
import OrganizationSelectors from "@/redux/organization/selectors";
import UserActions from "@/redux/user/actions";
import AccountActions from "@/redux/account/actions";

const selectLoading = makeRequestingSelector();
const selectError = makeSelectErrorModel();

const iconStyle = {
  fontSize: 22,
  cursor: "pointer",
};

const Login = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const error = useAppSelector((state) =>
    selectError(state, SessionActions.REQUEST_LOGIN_FINISHED)
  );
  const loading = useAppSelector((state) =>
    selectLoading(state, [SessionActions.REQUEST_LOGIN])
  );

  const selectedOrganizationId = useAppSelector(
    OrganizationSelectors.SelectSelectedOrganizationId
  );

  const token = useAppSelector(SessionSelectors.SelectToken);

  const accountApprovalStatus = useAppSelector(
    SessionSelectors.SelectAccountApprovalStatus
  );

  const onFinish = (payload: loginType) => {
    dispatch(SessionActions.login(payload));
  };

  function renderPasswordIcon() {
    return (visible: boolean) =>
      visible ? <IoEye style={iconStyle} /> : <IoEyeOff style={iconStyle} />;
  }

  useEffect(() => {
    if (token) {
      router.navigate(
        selectedOrganizationId ? routePaths.farm : routePaths.organization,
        { replace: true }
      );
    }
  }, [token]);

  useEffect(() => {
    if (error && error.exception === "UserNotConfirmedException") {
      const phoneNumber = form.getFieldValue("phoneNumber");
      dispatch(
        UserActions.sendResetPasswordOTP({
          phone: phoneNumber,
        })
      );
      dispatch(
        AccountActions.setRegisterUserInfo({
          phone: phoneNumber,
        })
      );
      dispatch(removeByActionType(SessionActions.REQUEST_LOGIN_FINISHED));
      navigate(routePaths.userVerfication);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      dispatch(SessionActions.setAccountApprovalStatus(""));
      if (error) {
        dispatch(removeByActionType(getKeyForAction(error?.actionType)));
      }
    };
  }, []);

  return (
    <div className="login_container">
      <div className="form_main_container">
        <div className="form_container">
          <div className="form_header_container">
            <div className="logo_container">
              <img src={Images.LOGO} />
            </div>
            <p className="heading1">
              {getTranslation("login.welcomeBack")}

              <span className="auth_title_border" />
            </p>
          </div>

          {accountApprovalStatus && (
            <AlertError message={accountApprovalStatus} />
          )}
          <AlertError error={error} />

          <Form form={form} onFinish={onFinish} layout="vertical">
            <PhoneInput
              label={getTranslation("global.phoneNumber")}
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: getTranslation("global.phoneNumberErrMsg"),
                },
              ]}
            />
            <Input
              label={getTranslation("global.password")}
              name="password"
              rules={[
                {
                  required: true,
                  message: getTranslation("global.passwordErrMsg"),
                },
              ]}
              iconRender={renderPasswordIcon()}
              isPasswordInput
              placeholder={getTranslation("global.passwordPlaceholder")}
              testId="password-input"
            />

            <div className="forget_password_container">
              <Checkbox label={getTranslation("login.rememberMe")} />
              <Link to={routePaths.forgotPassword}>
                <p className="heading4 forget_password_text">
                  {getTranslation("global.forgotPassword")}
                </p>
              </Link>
            </div>

            <Button
              loading={loading}
              htmlType="submit"
              label={getTranslation("global.signIn")}
              type="primary"
            />
          </Form>

          <Link to={routePaths.signUp}>
            <p className="not_a_memeber_text">
              {getTranslation("login.dontHaveAnAccount")}{" "}
              <span className="register_text">
                {getTranslation("global.signUp")}
              </span>
            </p>
          </Link>
        </div>
      </div>
      <div className="image_main_container">
        <div className="image_container">
          <img alt="not found" src={Images.LOGIN_BG} />
        </div>
      </div>
    </div>
  );
};

export default Login;
