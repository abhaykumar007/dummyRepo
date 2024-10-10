import CustomEdit from "@/components/common/CustomEditable/CustomEdit";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import requestingSelector from "@/redux/requesting/requestingSelector";
import TaskActions from "@/redux/task/actions";
import { EditableFieldProps } from "@/types/editableFieldProps";
import { applyErrorsToFields } from "@/utilities/formUtils";
import { FormInstance } from "antd/lib";
import { Dayjs } from "dayjs";
import { useEffect, useRef, useState } from "react";

const selectError = makeSelectErrorModel();
const EditableTaskField = ({
  fieldName,
  value,
  placeholder,
  udf,
  children,
  type,
  form,
}: EditableFieldProps) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement | null>(null);
  const loading = useAppSelector((state) =>
    requestingSelector(state, [TaskActions.PATCH_TASK], fieldName)
  );

  const error = useAppSelector((state) =>
    selectError(state, TaskActions.PATCH_TASK_FINISHED, fieldName)
  );

  const [isActive, setIsActive] = useState(false);
  const [isSubmitDisable, setIsSubmitDisable] = useState(false);

  const patchTask = (value: string | Dayjs) => {
    udf.initialValues[fieldName] = value;
    dispatch(
      TaskActions.patchTask(
        {
          id: udf.taskId,
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

  useEffect(() => {
    if (!isActive) {
      const element = ref.current;
      if (element) {
        element.innerHTML = value;
      }
    }
  }, [isActive]);

  const onCancel = () => {
    setIsActive(false);
  };

  return (
    <CustomEdit
      isHidden={false}
      onSubmit={patchTask}
      onCancel={onCancel}
      isActive={isActive}
      loading={loading}
      setActive={() => {
        setIsActive(!isActive);
      }}
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
      containerDataTestId={udf?.containerDataTestId}
      inputDataTestId={udf?.inputDataTestId}
      setSubmitDisable={setIsSubmitDisable}
    >
      {type === "text-editor" ? <div ref={ref} /> : children}
    </CustomEdit>
  );
};

export default EditableTaskField;
