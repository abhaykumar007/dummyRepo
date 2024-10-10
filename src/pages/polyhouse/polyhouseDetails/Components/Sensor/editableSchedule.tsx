import { useEffect, useState } from "react";
import { Form as AntdForm } from "antd";
import Form from "@/components/common/form";
import CustomEdit from "@/components/common/CustomEditable/CustomEdit";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import PolyhouseActions from "@/redux/polyhouse/action";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { applyErrorsToFields } from "@/utilities/formUtils";
import dayjs from "dayjs";
import { Schedule } from "@/pages/polyhouse/types";

interface EditableScheduleFieldProps {
  fieldName: string;
  value: dayjs.Dayjs;
  placeholder?: string;
  isParseField?: boolean;
  customValidator?: (context: object, value: string) => Promise<void>;
  udf?: object;
  children?: React.ReactNode;
  type?: string;
  schedule: Schedule;
  sensorId: string;
  parameterId: string;
  sensorName: string;
}

const convertTimeToServerFormat = (time: string): number => {
  const parsedTime = dayjs(time, "h:mm A");

  const hours = parsedTime.format("HH");
  const minutes = parsedTime.format("mm");

  return parseFloat(`${hours}.${minutes}`);
};

const selectError = makeSelectErrorModel();
const EditableScheduleField = ({
  fieldName,
  value,
  placeholder,
  customValidator,
  udf,
  children,
  type,
  schedule,
  sensorId,
  parameterId,
  sensorName,
}: EditableScheduleFieldProps) => {
  const dispatch = useAppDispatch();
  const [form] = AntdForm.useForm();

  const loading = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.UPADTE_SCHEDULE], fieldName)
  );

  const error = useAppSelector((state) =>
    selectError(state, PolyhouseActions.UPADTE_SCHEDULE_FINISHED, fieldName)
  );

  const [isActive, setIsActive] = useState(false);
  const [isSubmitDisable, setIsSubmitDisable] = useState(false);

  useEffect(() => {
    if (error && isActive) {
      applyErrorsToFields(form, error.errors, fieldName);
    }
  }, [error, isActive]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatePolyhouse = <T extends { [key: string]: any }>(value: T) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { duration, ...rest } = schedule;
    dispatch(
      PolyhouseActions.updateSchedule(
        sensorName,
        fieldName,
        sensorId,
        parameterId,
        {
          schedule: {
            ...rest,
            id:
              typeof schedule.id === "string"
                ? parseInt(schedule.id)
                : schedule.id,
            ...value,
          },
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

  const ispaddingEnable = fieldName === "name" && isActive;

  return (
    <Form
      form={form}
      style={{
        paddingTop: ispaddingEnable ? "15px" : "",
        position: isActive ? "absolute" : "relative",
        top: isActive ? "0" : "",
        zIndex: isActive ? 2 : 1,
      }}
    >
      <CustomEdit
        form={form}
        name={fieldName}
        onSubmit={(value) =>
          updatePolyhouse({
            [fieldName]: convertTimeToServerFormat(value.format("h:mm A")),
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

export default EditableScheduleField;
