import CustomEdit from "@/components/common/CustomEditable/CustomEdit";
import Form, { useForm } from "@/components/common/form";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { workflowStage } from "@/pages/workflow/types";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import PolyhouseActions from "@/redux/polyhouse/action";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { applyErrorsToFields } from "@/utilities/formUtils";
import { useEffect, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

interface LifeCycleEditableFieldProps {
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

const isConfigureForNursery = (name: string | undefined) => {
  return name ? ["Germination", "Nursery"].includes(name) : false;
};

const LifeCycleEditableField = ({
  fieldName,
  value,
  placeholder,
  children,
  errorMsg,
  customValidator,
  dataTestid,
  stageList,
  handleSubmit,
}: LifeCycleEditableFieldProps) => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const { lifeCycleId, polyhouseId } = useParams();

  const loading = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.UPDATE_LIFECYCLE])
  );

  const error = useAppSelector((state) =>
    selectError(state, PolyhouseActions.UPDATE_LIFECYCLE_FINISHED)
  );

  const selectedLifeCycle = useAppSelector((state) =>
    PolyhouseSelectors.SelectLifeCycleByInstanceId(state, lifeCycleId)
  );

  const [isActive, setIsActive] = useState(false);
  const [isSubmitDisable, setIsSubmitDisable] = useState(false);

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

    stageList.forEach((stage: workflowStage, index) => {
      const previousStage: workflowStage = workflowSteps[index - 1];

      if (previousStage) {
        const stageObj: workflowStage = {
          name: stage.name,
          stepId: stage.stepId ? stage.stepId : uuidv4(),
          parentId: previousStage.stepId,
          sequence: stage.sequence,
          duration: stage?.duration ? stage.duration : 1,
        };
        if (isConfigureForNursery(stage?.name)) {
          stageObj.nurseryId = stage.nurseryId;
        } else {
          stageObj.zoneId = stage.zoneId;
        }
        workflowSteps.push(stageObj);
      } else {
        const stageObj: workflowStage = {
          name: stage.name,
          stepId: stage.stepId ? stage.stepId : uuidv4(),
          parentId: null,
          sequence: stage.sequence,
          duration: stage?.duration ? stage.duration : 1,
        };

        if (isConfigureForNursery(stage?.name)) {
          stageObj.nurseryId = stage.nurseryId;
        } else {
          stageObj.zoneId = stage.zoneId;
        }

        workflowSteps.push(stageObj);
      }
    });

    const payload: any = {
      name: selectedLifeCycle.name,
      description: selectedLifeCycle.description,
      workflowInstanceSteps: workflowSteps,
    };

    payload[fieldName] = form.getFieldValue(fieldName);

    dispatch(
      PolyhouseActions.updateLifeCycle({
        payload,
        workflowInstancesId: lifeCycleId,
        polyhouseId,
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
        onSubmit={
          !lifeCycleId
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

export default LifeCycleEditableField;
