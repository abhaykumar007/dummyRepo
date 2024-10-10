import { useEffect, useState } from "react";
import CustomEdit from "@/components/common/CustomEditable/CustomEdit";
import Form, { useForm } from "@/components/common/form";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { applyErrorsToFields } from "@/utilities/formUtils";
import WorkflowActions from "@/redux/workflow/actions";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import WorkflowSelectors from "@/redux/workflow/selectors";
import { useParams } from "react-router-dom";
import { workflowPayload, workflowStage } from "./types";
import { AiOutlineEdit } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

interface WorkflowEditableFieldProps {
  fieldName: string;
  value: string;
  placeholder?: string;
  children?: React.ReactNode;
  errorMsg: string;
  dataTestid?: string;
  customValidator?: (context: object, value: string) => Promise<void>;
  stageList: workflowStage[];
  handleSubmit: (value: string, fieldName: string) => void;
}

const selectError = makeSelectErrorModel();

const WorkflowEditableField = ({
  fieldName,
  value,
  placeholder,
  children,
  errorMsg,
  customValidator,
  dataTestid,
  stageList,
  handleSubmit,
}: WorkflowEditableFieldProps) => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const { workflowId } = useParams();

  const loading = useAppSelector((state) =>
    requestingSelector(state, [WorkflowActions.UPDATE_WORKFLOW])
  );

  const error = useAppSelector((state) =>
    selectError(state, WorkflowActions.UPDATE_WORKFLOW_FINISHED)
  );

  const [isActive, setIsActive] = useState(false);
  const [isSubmitDisable, setIsSubmitDisable] = useState(false);

  const selectedWorkflow = useAppSelector((state) =>
    WorkflowSelectors.SelectWorkflowByWorkflowId(state, workflowId)
  );

  const updateWorkflow = (value: string) => {
    const error = {
      location: fieldName,
      message: errorMsg,
    };

    if (!value) {
      applyErrorsToFields(form, [error]);
      return;
    }

    const workflowSteps: workflowStage[] = [];

    stageList.forEach((stage: workflowStage, index: number) => {
      const previousStage: workflowStage = workflowSteps[index - 1];

      if (previousStage) {
        workflowSteps.push({
          name: stage.name,
          stepId: stage.stepId ? stage.stepId : uuidv4(),
          description: "",
          parentId: previousStage.stepId,
          sequence: stage.sequence,
        });
      } else {
        workflowSteps.push({
          name: stage.name,
          stepId: stage.stepId ? stage.stepId : uuidv4(),
          description: "",
          parentId: null,
          sequence: stage.sequence,
        });
      }
    });

    const payload: workflowPayload = {
      name: form.getFieldValue("name")
        ? form.getFieldValue("name")
        : selectedWorkflow.name,
      description: form.getFieldValue("description")
        ? form.getFieldValue("description")
        : selectedWorkflow.description,
      workflowSteps,
    };

    dispatch(
      WorkflowActions.updateWorkflow({
        payload,
        workflowId,
      })
    );
  };

  const handleCreateWorkflow = () => {
    handleSubmit(form.getFieldValue(fieldName), fieldName);
    setIsActive(false);
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
    <Form
      form={form}
      style={{
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <CustomEdit
        form={form}
        name={fieldName}
        // onSubmit={
        //   handleSubmit
        //     ? () => handleSubmit(form.getFieldValue(fieldName))
        //     : (value) => updateWorkflow(value)
        // }
        onSubmit={
          !workflowId
            ? () => handleCreateWorkflow()
            : (value) => updateWorkflow(value)
        }
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

      {!isActive && (
        <AiOutlineEdit
          style={{ fontSize: "20px", cursor: "pointer" }}
          onClick={() => setIsActive(true)}
        />
      )}
    </Form>
  );
};

export default WorkflowEditableField;
