import CustomEdit from "@/components/common/CustomEditable/CustomEdit";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import requestingSelector from "@/redux/requesting/requestingSelector";
import UserActions from "@/redux/user/actions";
import { EditableFieldProps } from "@/types/editableFieldProps";
import { applyErrorsToFields } from "@/utilities/formUtils";
import { FormInstance } from "antd/lib";
import { useEffect, useState } from "react";

const selectError = makeSelectErrorModel();
const EditableUserField = ({
  fieldName,
  value,
  placeholder,
  udf,
  children,
  type,
  form,
  customValidator,
}: EditableFieldProps) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) =>
    requestingSelector(state, [UserActions.PATCH_USER], fieldName)
  );

  const error = useAppSelector((state) =>
    selectError(state, UserActions.PATCH_USER_FINISHED, fieldName)
  );

  const [isActive, setIsActive] = useState(false);
  const [isSubmitDisable, setIsSubmitDisable] = useState(false);

  const patchUser = (value: string) => {
    udf.initialValues[fieldName] = value;
    dispatch(
      UserActions.patchUser(
        {
          id: udf.userId,
          data: udf.initialValues,
        },
        fieldName
      )
    );
  };

  useEffect(() => {
    if (!loading) {
      if (!error) {
        setIsActive(false);
      } else {
        setIsSubmitDisable(true);
        applyErrorsToFields(form as FormInstance, error.errors, fieldName);
      }
    }
  }, [loading, error]);

  return (
    <CustomEdit
      isHidden={false}
      onSubmit={patchUser}
      onCancel={() => setIsActive(false)}
      isActive={isActive}
      loading={loading}
      setActive={() => setIsActive(!isActive)}
      type={type}
      userDefineField={udf}
      preset={false}
      name={fieldName}
      isEmpty={false}
      value={value}
      form={form as FormInstance}
      placeholder={placeholder}
      isFullWidth={false}
      disabled={false}
      bottomMarginLevel={4}
      isSubmitDisable={isSubmitDisable}
      containerDataTestId={""}
      customValidator={customValidator}
      setSubmitDisable={setIsSubmitDisable}
    >
      {children}
    </CustomEdit>
  );
};

export default EditableUserField;
