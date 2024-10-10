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
import AccountActions from "@/redux/account/actions";
import AccountSelectors from "@/redux/account/selectors";
import { removeByActionType } from "@/redux/error/errorAction";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { makeRequestingSelector } from "@/redux/requesting/requestingSelector";
import { getTranslation } from "@/translation/i18n";
import { registerType } from "@/types/auth";
import { getKeyForAction } from "@/utilities/actionUtility";
import { applyFieldErrorsToForm, hasFieldErrors } from "@/utilities/formUtils";
import { Images } from "@/utilities/imagesPath";
import { useEffect, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Link } from "react-router-dom";

const selectLoading = makeRequestingSelector();
const selectError = makeSelectErrorModel();

const iconStyle = {
  fontSize: 22,
  cursor: "pointer",
};

export const fieldMap = {
  email: {
    field: "email",
  },
  address: {
    field: "address",
  },
  firstName: {
    field: "firstName",
  },
  lastName: {
    field: "lastName",
  },
};

const SignUp = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();

  const [policiesStatus, setPolicyStatus] = useState(
    getInitialPolicyStatus(passwordPolicy)
  );
  const [isPasswordHintActive, setPasswordHintActive] = useState(false);
  const [password, setPassword] = useState("");

  const error = useAppSelector((state) =>
    selectError(state, AccountActions.REQUEST_REGISTER_FINISHED)
  );
  const fieldsError = useAppSelector((state) =>
    AccountSelectors.SelectCreateUserFieldErrors(state, [
      AccountActions.REQUEST_REGISTER_FINISHED,
    ])
  );

  const loading = useAppSelector((state) =>
    selectLoading(state, [AccountActions.REQUEST_REGISTER])
  );

  const onFinish = (values: registerType) => {
    const payload = {
      ...values,
      email: "dummy@gmail.com",
      address: "pune,maharashtra",
    };
    payload.phone = `+${payload.phone}`;
    delete payload.confirmPassword;

    dispatch(AccountActions.register(payload));
  };

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

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(removeByActionType(getKeyForAction(error?.actionType)));
      }
    };
  }, []);

  useEffect(() => {
    if (hasFieldErrors(fieldsError)) {
      applyFieldErrorsToForm(
        form,
        fieldMap,
        ["firstName", "lastName", "phone", "organisationName", "password"],
        fieldsError
      );
    }
  }, [fieldsError]);

  return (
    <div className="signUp_container">
      <div className="form_main_container">
        <div className="form_container signUp_form_container">
          <div className="form_header_container">
            <div className="logo_container">
              <img src={Images.LOGO} />
            </div>
            <div className="form_header_content">
              <p className="heading1">
                {getTranslation("signUp.createYourAccount")}
              </p>
              <p className="description">
                {getTranslation("signUp.createYourAccountTagLine")}
              </p>
            </div>
          </div>

          <AlertError error={error} />

          <Form form={form} onFinish={onFinish} layout="vertical">
            <div className="input_row">
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

              <Input
                label={getTranslation("signUp.organizationName")}
                name="organisationName"
                testId="organisation-name"
                rules={[
                  {
                    required: true,
                    message: getTranslation("signUp.organizationNameErrMsg"),
                  },
                ]}
                placeholder={getTranslation(
                  "signUp.organizationNamePlaceholder"
                )}
              />

              <Input
                label={getTranslation("global.firstName")}
                name="firstName"
                testId="first-name"
                rules={[
                  {
                    required: true,
                    message: getTranslation("global.firstNameErrMsg"),
                  },
                ]}
                placeholder={getTranslation("global.firstNamePlaceholder")}
              />
              <Input
                label={getTranslation("global.lastName")}
                name="lastName"
                testId="last-name"
                rules={[
                  {
                    required: true,
                    message: getTranslation("global.lastNameErrMsg"),
                  },
                ]}
                placeholder={getTranslation("global.lastNamePlaceholder")}
              />

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
            </div>

            <Button
              loading={loading}
              htmlType="submit"
              label={getTranslation("global.signUp")}
              type="primary"
              className="submit_btn"
            />
          </Form>

          <Link to={routePaths.login}>
            <p className="not_a_memeber_text">
              {getTranslation("signUp.alreadyHaveAnAccount")}{" "}
              <span className="register_text">
                {getTranslation("global.signIn")}
              </span>
            </p>
          </Link>
        </div>
      </div>
      <div className="image_main_container">
        <div className="image_container">
          <img alt="not found" src={Images.SIGN_UP_BG} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
