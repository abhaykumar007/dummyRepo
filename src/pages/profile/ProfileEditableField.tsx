import CustomEdit from "@/components/common/CustomEditable/CustomEdit";
import Form, { useForm } from "@/components/common/form";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SessionActions from "@/redux/session/actions";
import { applyErrorsToFields } from "@/utilities/formUtils";

interface ProfileEditableFieldProps {
  fieldName: string;
  value: string;
  placeholder?: string;
  children?: React.ReactNode;
  errorMsg: string;
  dataTestid?: string;
  customValidator?: (context: object, value: string) => Promise<void>;
}

const selectError = makeSelectErrorModel();

const ProfileEditableField = ({
  fieldName,
  value,
  placeholder,
  children,
  errorMsg,
  customValidator,
  dataTestid,
}: ProfileEditableFieldProps) => {
  const dispatch = useDispatch();
  const [form] = useForm();

  const loading = useSelector((state) =>
    requestingSelector(state, [SessionActions.UPDATE_USER_DETAILS])
  );

  const error = useSelector((state) =>
    selectError(state, SessionActions.UPDATE_USER_DETAILS_FINISHED)
  );

  const [isActive, setIsActive] = useState(false);
  const [isSubmitDisable, setIsSubmitDisable] = useState(false);

  const updateUserDetails = (value: string) => {
    const error = {
      location: fieldName,
      message: errorMsg,
    };

    if (!value) {
      applyErrorsToFields(form, [error]);
      return;
    }

    const payload = [
      {
        Name: fieldName,
        Value: value,
      },
    ];

    dispatch(SessionActions.updateUserDetails(payload));
  };

  useEffect(() => {
    if (!loading) {
      if (!error) {
        setIsActive(false);
      } else {
        setIsSubmitDisable(true);
      }
    }
  }, [loading, error]);

  return (
    <Form form={form} style={{ marginBottom: isActive ? "10px" : "20px" }}>
      <CustomEdit
        form={form}
        name={fieldName}
        onSubmit={updateUserDetails}
        isActive={isActive}
        loading={loading}
        value={value}
        placeholder={placeholder}
        setSubmitDisable={setIsSubmitDisable}
        onCancel={() => setIsActive(false)}
        setActive={() => setIsActive(!isActive)}
        userDefineField={{
          inputDataTestId: dataTestid,
        }}
        isSubmitDisable={isSubmitDisable}
        containerDataTestId={`${dataTestid}-container`}
        customValidator={customValidator}
      >
        {children}
      </CustomEdit>
    </Form>
  );
};

export default ProfileEditableField;
