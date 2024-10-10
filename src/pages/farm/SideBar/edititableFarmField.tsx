import { useEffect, useState } from "react";
import Form, { useForm } from "@/components/common/form";
import CustomEdit from "@/components/common/CustomEditable/CustomEdit";
import FarmActions from "@/redux/farm/action";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FarmSelectors from "@/redux/farm/farmSelectors";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { applyErrorsToFields } from "@/utilities/formUtils";

interface EditableFarmFieldProps {
  fieldName: string;
  value: string;
  placeholder?: string;
  farmId?: string;
  isParseField?: boolean;
  customValidator?: (context: object, value: string) => Promise<void>;
  udf?: object;
  children?: React.ReactNode;
  type?: string;
}

const selectError = makeSelectErrorModel();
const EditableFarmField = ({
  fieldName,
  value,
  placeholder,
  isParseField,
  customValidator,
  udf,
  children,
  type,
}: EditableFarmFieldProps) => {
  const dispatch = useAppDispatch();
  const [form] = useForm();

  const selectedFarm = useAppSelector(FarmSelectors.SelectSelectedFarm);

  const loading = useAppSelector((state) =>
    requestingSelector(state, [FarmActions.UPDATE_FARM], fieldName)
  );

  const error = useAppSelector((state) =>
    selectError(state, FarmActions.UPDATE_FARM_FINISHED, fieldName)
  );

  const [isActive, setIsActive] = useState(false);
  const [isSubmitDisable, setIsSubmitDisable] = useState(false);

  useEffect(() => {
    if (error && isActive) {
      applyErrorsToFields(form, error.errors, fieldName);
    }
  }, [error, isActive]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFarm = <T extends { [key: string]: any }>(value: T) => {
    if (fieldName.includes("nutrient")) {
      const fieldArray = fieldName.split(".");
      let updatedValue = {
        nutrient: {
          ...selectedFarm.nutrient,
          [fieldArray[fieldArray.length - 1]]: value[fieldName],
        },
      };
      if (fieldName.includes("dilutionRatio")) {
        const [numerator, denominator] = value[fieldName]
          .split(":")
          .map(Number);
        updatedValue = {
          nutrient: {
            ...selectedFarm.nutrient,
            [fieldArray[fieldArray.length - 1]]: {
              numerator: parseInt(numerator),
              denominator: parseInt(denominator),
            },
          },
        };
      }
      dispatch(FarmActions.updateFarm(fieldName, updatedValue));
    } else dispatch(FarmActions.updateFarm(fieldName, value));
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
          updateFarm({ [fieldName]: isParseField ? parseFloat(value) : value })
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

export default EditableFarmField;
