import Modal from "@/components/ui/modal";
import Select from "@/components/ui/select";
import { Col, Row, Form as AntdForm } from "antd";
import { useEffect, useState } from "react";
import UserActions from "@/redux/user/actions";
import { roles } from "./utils";
import { CreateUser } from "./types";
import requestingSelector from "@/redux/requesting/requestingSelector";
import Button from "@/components/common/button";
import Form, { useForm } from "@/components/common/form";
import Input from "@/components/common/input";
import PhoneInput from "@/components/common/input/phoneInput";
import { getTranslation } from "@/translation/i18n";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { FIELD_LEVEL_EXCEPTION } from "@/utilities/errorExceptions";
import { applyErrorsToFields } from "@/utilities/formUtils";
import { removeByActionType } from "@/redux/error/errorAction";

const selectError = makeSelectErrorModel();
const AddUserButton = () => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerError, setBannerError] = useState(null);
  const [form] = useForm();
  const loading = useAppSelector((state) =>
    requestingSelector(state, [UserActions.CREATE_USER])
  );
  const error = useAppSelector((state) =>
    selectError(state, UserActions.CREATE_USER_FINISHED)
  );
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values: CreateUser) => {
        values.phone = `+${values.phone}`;
        dispatch(UserActions.createUser(values));
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    dispatch(removeByActionType(UserActions.CREATE_USER_FINISHED));
  };

  useEffect(() => {
    if (!loading && !error && !bannerError) handleCancel();
    else if (!loading && error) {
      if (error.exception === FIELD_LEVEL_EXCEPTION) {
        applyErrorsToFields(form, error.errors);
      } else {
        setBannerError(error);
      }
    } else {
      setBannerError(null);
    }
  }, [loading]);

  return (
    <>
      <Button
        label={getTranslation("userManagement.addUser")}
        style={{ padding: "0 0", minWidth: "100x" }}
        onClick={showModal}
      />
      <Modal
        data-testid="add-user-modal"
        destroyOnClose={true}
        style={{ padding: "20px 30px" }}
        title={getTranslation("userManagement.addUser")}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={loading}
        okText={getTranslation("global.add")}
        onClose={handleCancel}
      >
        {bannerError && <FullAlertError error={error} />}
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col span={24}>
              <Input
                label={getTranslation("global.firstName")}
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: getTranslation(
                      "userManagement.addUserModal.firstNameError"
                    ),
                  },
                  {
                    pattern: /^[a-zA-Z]*$/,
                    message: getTranslation("global.nameValidationError"),
                  },
                  {
                    max: 50,
                    message: getTranslation("global.nameMaxLengthError"),
                  },
                ]}
                placeholder={getTranslation(
                  "userManagement.addUserModal.firstNamePlaceholder"
                )}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Input
                label={getTranslation("global.lastName")}
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: getTranslation(
                      "userManagement.addUserModal.lastNameError"
                    ),
                  },
                  {
                    pattern: /^[a-zA-Z\s]*$/,
                    message: getTranslation("global.nameValidationError"),
                  },
                  {
                    max: 50,
                    message: getTranslation("global.nameMaxLengthError"),
                  },
                ]}
                placeholder={getTranslation(
                  "userManagement.addUserModal.lastNamePlaceholder"
                )}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <PhoneInput
                label={getTranslation("global.contactNumber")}
                name="phone"
                rules={[
                  {
                    required: true,
                    message: getTranslation(
                      "userManagement.addUserModal.phoneError"
                    ),
                  },
                ]}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <AntdForm.Item
                label={getTranslation("global.roles")}
                name="roles"
                rules={[
                  {
                    required: true,
                    message: getTranslation(
                      "userManagement.addUserModal.rolesError"
                    ),
                  },
                ]}
              >
                <Select
                  placeholder={getTranslation(
                    "userManagement.addUserModal.rolesPlaceholder"
                  )}
                  options={roles}
                  mode="multiple"
                  data-testid="roles-select"
                />
              </AntdForm.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default AddUserButton;
