import { useEffect, useState } from "react";
import { Form as AntdForm } from "antd";
import Form from "@/components/common/form";
import CustomEdit from "@/components/common/CustomEditable/CustomEdit";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import PolyhouseActions from "@/redux/polyhouse/action";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { applyErrorsToFields } from "@/utilities/formUtils";

interface EditableZoneFieldProps {
  fieldName: string;
  value: string;
  placeholder?: string;
  isParseField?: boolean;
  customValidator?: (context: object, value: string) => Promise<void>;
  udf?: object;
  children?: React.ReactNode;
  type?: string;
  zoneId: string;
  polyhouseId: string;
  isGrowing?: boolean;
}

const selectError = makeSelectErrorModel();
const EditableZoneField = ({
  fieldName,
  value,
  placeholder,
  customValidator,
  udf,
  children,
  isParseField,
  type,
  zoneId,
  polyhouseId,
  isGrowing,
}: EditableZoneFieldProps) => {
  const dispatch = useAppDispatch();
  const [form] = AntdForm.useForm();

  const selectedZone = useAppSelector(PolyhouseSelectors.SelectSelectedZone);

  const loading = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.UPDATE_ZONE], fieldName)
  );

  const error = useAppSelector((state) =>
    selectError(state, PolyhouseActions.UPDATE_ZONE_FINISHED, fieldName)
  );

  const [isActive, setIsActive] = useState(false);
  const [isSubmitDisable, setIsSubmitDisable] = useState(false);

  useEffect(() => {
    if (error && isActive) {
      applyErrorsToFields(form, error.errors, fieldName);
    }
  }, [error, isActive]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateNursery = <T extends { [key: string]: any }>(value: T) => {
    const updatedValues = isGrowing
      ? {
          ...selectedZone,
          growingArea: { ...selectedZone.growingArea, ...value },
        }
      : { ...value };
    dispatch(
      PolyhouseActions.updateZone(fieldName, polyhouseId, zoneId, updatedValues)
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

  const ispaddingEnable = fieldName === "name" && isActive;
  return (
    <Form form={form} style={{ paddingTop: ispaddingEnable ? "15px" : "" }}>
      <CustomEdit
        form={form}
        name={fieldName}
        onSubmit={(value) =>
          updateNursery({
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

export default EditableZoneField;
