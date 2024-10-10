import AlertError from "@/components/common/error/AlertError";
import { useAppSelector } from "@/hooks/redux";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import SessionActions from "@/redux/session/actions";
import SessionSelectors from "@/redux/session/selectors";
import { getTranslation } from "@/translation/i18n";
import Fields from "@/utilities/fields/field";
import { Card } from "antd";
import ProfileEditableField from "./ProfileEditableField";
import "./style.scss";
import { emailValidator } from "@/utilities/regex";

const selectError = makeSelectErrorModel();

const Profile = () => {
  const userDetails = useAppSelector(SessionSelectors.SelectUserDetails);
  const error = useAppSelector((state) =>
    selectError(state, SessionActions.UPDATE_USER_DETAILS_FINISHED)
  );

  const fileds = [
    {
      label: getTranslation("global.firstName"),
      value: (
        <ProfileEditableField
          fieldName="given_name"
          value={userDetails.given_name}
          placeholder={getTranslation("global.firstNamePlaceholder")}
          dataTestid="first-name"
          errorMsg={getTranslation("global.firstNameErrMsg")}
        >
          {userDetails.given_name}
        </ProfileEditableField>
      ),
    },
    {
      label: getTranslation("global.lastName"),
      value: (
        <ProfileEditableField
          fieldName="family_name"
          value={userDetails.family_name}
          placeholder={getTranslation("global.lastNamePlaceholder")}
          dataTestid="last-name"
          errorMsg={getTranslation("global.lastNameErrMsg")}
        >
          {userDetails.family_name}
        </ProfileEditableField>
      ),
    },
    {
      label: getTranslation("global.email"),
      value: (
        <ProfileEditableField
          fieldName="email"
          value={userDetails.email}
          placeholder={getTranslation("global.emailPlaceholder")}
          errorMsg={getTranslation("global.emailErrMsg")}
          dataTestid="email"
          customValidator={emailValidator}
        >
          {userDetails.email}
        </ProfileEditableField>
      ),
    },
    {
      label: getTranslation("global.address"),
      value: (
        <ProfileEditableField
          fieldName="address"
          value={userDetails.address?.formatted}
          placeholder={getTranslation("global.addressPlaceholder")}
          dataTestid="address"
          errorMsg={getTranslation("global.addressErrMsg")}
        >
          {userDetails.address?.formatted}
        </ProfileEditableField>
      ),
    },
    {
      label: getTranslation("global.phoneNumber"),
      value: userDetails.phone_number,
    },
  ];

  return (
    <Card bordered={false}>
      <AlertError error={error} />
      <Fields info={fileds} />
    </Card>
  );
};

export default Profile;
