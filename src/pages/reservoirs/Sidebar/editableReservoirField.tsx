import { useEffect, useState } from "react";
import { Form as AntdForm } from "antd";
import Form from "@/components/common/form";
import CustomEdit from "@/components/common/CustomEditable/CustomEdit";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import ReservoirActions from "@/redux/reservoir/action";
import ReservoirSelectors from "@/redux/reservoir/reservoirSelectors";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { applyErrorsToFields } from "@/utilities/formUtils";

interface EditableReservoirFieldProps {
  fieldName: string;
  value: string;
  placeholder?: string;
  isParseField?: boolean;
  customValidator?: (context: object, value: string) => Promise<void>;
  udf?: object;
  children?: React.ReactNode;
  type?: string;
}

const selectError = makeSelectErrorModel();
const EditableReservoirField = ({
  fieldName,
  value,
  placeholder,
  isParseField,
  customValidator,
  udf,
  children,
  type,
}: EditableReservoirFieldProps) => {
  const dispatch = useAppDispatch();
  const [form] = AntdForm.useForm();

  const selectedReservoir = useAppSelector(
    ReservoirSelectors.SelectSelectedReservoir
  );

  const loading = useAppSelector((state) =>
    requestingSelector(state, [ReservoirActions.UPDATE_RESERVOIR], fieldName)
  );

  const error = useAppSelector((state) =>
    selectError(state, ReservoirActions.UPDATE_RESERVOIR_FINISHED, fieldName)
  );

  const [isActive, setIsActive] = useState(false);
  const [isSubmitDisable, setIsSubmitDisable] = useState(false);

  useEffect(() => {
    if (error && isActive) {
      applyErrorsToFields(form, error.errors, fieldName);
    }
  }, [error, isActive]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateReservoir = <T extends { [key: string]: any }>(value: T) => {
    dispatch(
      ReservoirActions.updateReservoir(
        fieldName,
        selectedReservoir?.reservoirId,
        {
          ...value,
        }
      )
    );
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
    <Form form={form}>
      <CustomEdit
        form={form}
        name={fieldName}
        onSubmit={(value) =>
          updateReservoir({
            [fieldName]: isParseField ? parseFloat(value) : value,
          })
        }
        isActive={isActive}
        loading={loading}
        value={value}
        placeholder={placeholder}
        setSubmitDisable={setIsSubmitDisable}
        onCancel={() => setIsActive(false)}
        setActive={() => setIsActive(!isActive)}
        userDefineField={{
          ...udf,
          inputDataTestId: `${fieldName}-input`,
        }}
        isSubmitDisable={isSubmitDisable}
        customValidator={customValidator}
        containerDataTestId={`${fieldName}-container`}
        type={type}
      >
        {children}
      </CustomEdit>
    </Form>
  );
};

export default EditableReservoirField;
