import Form from "@/components/common/form";
import UserSelectors from "@/redux/user/selectors";
import { FormInstance } from "antd";
import { useSelector } from "react-redux";
import { roles, rolesToLabel } from "./utils";
import Fields from "@/utilities/fields/field";
import EditableUserField from "./editableUserField";
import { getTranslation } from "@/translation/i18n";
import { getUserFullName } from "@/utilities/getUserFullName";
import { getDateInStandardFormat } from "@/utilities/time";
import { nameValidator } from "@/utilities/customValidators";

interface userDetailsProps {
  form: FormInstance;
}

const UserDetails = ({ form }: userDetailsProps) => {
  const selectedUser = useSelector(UserSelectors.selectSelectedUser);

  return (
    <Form form={form}>
      <div className="user-details-sidebar" style={{ width: "100%" }}>
        <Fields
          info={[
            {
              label: getTranslation("global.firstName"),
              value: (
                <div style={{ minHeight: "40px" }}>
                  <EditableUserField
                    fieldName="firstName"
                    value={selectedUser?.firstName}
                    placeholder={getTranslation(
                      "userManagement.addUserModal.firstNamePlaceholder"
                    )}
                    customValidator={nameValidator}
                    form={form}
                    udf={{
                      inputDataTestId: "firstName-input",
                      userId: selectedUser?.userId,
                      initialValues: {
                        firstName: selectedUser?.firstName,
                        lastName: selectedUser?.lastName,
                        roles: selectedUser?.roles,
                      },
                      rules: [
                        {
                          required: true,
                          message: getTranslation(
                            "userManagement.addUserModal.firstNameError"
                          ),
                        },
                      ],
                    }}
                  >
                    {selectedUser?.firstName}
                  </EditableUserField>
                </div>
              ),
            },
            {
              label: getTranslation("global.lastName"),
              value: (
                <div style={{ minHeight: "40px" }}>
                  <EditableUserField
                    fieldName="lastName"
                    value={selectedUser?.lastName}
                    placeholder={getTranslation(
                      "userManagement.addUserModal.lastNamePlaceholder"
                    )}
                    customValidator={nameValidator}
                    form={form}
                    udf={{
                      userId: selectedUser?.userId,
                      initialValues: {
                        firstName: selectedUser?.firstName,
                        lastName: selectedUser?.lastName,
                        roles: selectedUser?.roles,
                      },
                      rules: [
                        {
                          required: true,
                          message: getTranslation(
                            "userManagement.addUserModal.lastNameError"
                          ),
                        },
                      ],
                    }}
                  >
                    {selectedUser?.lastName}
                  </EditableUserField>
                </div>
              ),
            },
            {
              label: getTranslation("global.contactNumber"),
              value: (
                <div style={{ height: "40px" }}>{selectedUser?.phone}</div>
              ),
            },
            {
              label: getTranslation("global.roles"),
              value: (
                <div style={{ minHeight: "40px" }}>
                  <EditableUserField
                    fieldName="roles"
                    value={selectedUser?.roles}
                    placeholder={getTranslation(
                      "userManagement.addUserModal.rolesPlaceholder"
                    )}
                    form={form}
                    udf={{
                      userId: selectedUser?.userId,
                      options: roles,
                      initialValues: {
                        firstName: selectedUser?.firstName,
                        lastName: selectedUser?.lastName,
                        roles: selectedUser?.roles,
                      },
                      rules: [
                        {
                          required: true,
                          message: getTranslation(
                            "userManagement.addUserModal.rolesError"
                          ),
                        },
                      ],
                    }}
                    type="multiple"
                  >
                    {selectedUser?.roles.map((role: string) => rolesToLabel[role]).join(", ")}
                  </EditableUserField>
                </div>
              ),
            },
            {
              label: getTranslation("global.createdBy"),
              value: (
                <div style={{ height: "40px" }}>{getUserFullName(selectedUser.createdBy)}</div>
              ),
            },
            {
              label: getTranslation("global.createdDate"),
              value: (
                <div style={{ height: "40px" }}>
                  {getDateInStandardFormat(selectedUser.createdDate)}
                </div>
              ),
            },
            
          ]}
        />
      </div>
    </Form>
  );
};

export default UserDetails;
