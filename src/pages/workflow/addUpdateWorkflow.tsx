import Button from "@/components/common/button";
import FullAlertError from "@/components/common/error/FullAlertError";
import Form, { useForm } from "@/components/common/form";
import Input from "@/components/common/input";
import Card from "@/components/ui/card";
import { WORKFLOW_STAGE_LIST } from "@/config/consts";
import routePaths from "@/config/routePaths";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { makeRequestingSelector } from "@/redux/requesting/requestingSelector";
import WorkflowActions from "@/redux/workflow/actions";
import WorkflowSelectors from "@/redux/workflow/selectors";
import { getTranslation } from "@/translation/i18n";
import {
  DragDropContext,
  Draggable,
  DragUpdate,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Empty } from "antd";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./style.scss";
import { workflowPayload, workflowStage } from "./types";
import WorkflowEditableField from "./WorkflowEditableField";

export const fieldMap = {
  name: {
    field: "name",
  },
  description: {
    field: "description",
  },
};

const selectLoading = makeRequestingSelector();
const selectError = makeSelectErrorModel();

const AddUpdateWorkflow = () => {
  const dispatch = useAppDispatch();
  const [form] = useForm();
  const navigate = useNavigate();

  const { workflowId } = useParams();

  const [isCorrect, setIsCorrect] = useState(true);
  const [updateButtonDisable, setUpdateButtonDisable] = useState(true);
  const [stageList, setStageList] =
    useState<workflowStage[]>(WORKFLOW_STAGE_LIST);
  const [finalList, setFinalList] = useState<workflowStage[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const [fieldData, setFieldData] = useState({
    name: "New Template",
    description: "",
  });
  const [selectedStepConfigure, setSelectedStepConfigure] =
    useState<workflowStage>();

  const error = useAppSelector((state) =>
    selectError(
      state,
      workflowId
        ? WorkflowActions.UPDATE_WORKFLOW_FINISHED
        : WorkflowActions.CREATE_WORKFLOW_FINISHED
    )
  );

  const loading = useAppSelector((state) =>
    selectLoading(state, [WorkflowActions.CREATE_WORKFLOW])
  );

  const selectedWorkflow = useAppSelector((state) =>
    WorkflowSelectors.SelectWorkflowByWorkflowId(state, workflowId)
  );

  const reorder = (
    list: workflowStage[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result.sort((a, b) => a.sequence - b.sequence);
  };

  const move = (
    source: workflowStage[],
    destination: workflowStage[],
    droppableSource: { index: number; droppableId: string },
    droppableDestination: { index: number; droppableId: string }
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    sourceClone.sort((a, b) => a.sequence - b.sequence);
    destClone.sort((a, b) => a.sequence - b.sequence);

    return {
      stageList:
        droppableSource.droppableId === "stageList" ? sourceClone : destClone,
      finalList:
        droppableSource.droppableId === "stageList" ? destClone : sourceClone,
      newStepAdded: removed,
    };
  };

  const resetDragState = () => {
    setDraggedItem(null);
    setIsCorrect(true);
    setPlaceholderIndex(null);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const reorderedList = reorder(
        source.droppableId === "stageList" ? stageList : finalList,
        source.index,
        destination.index
      );
      if (source.droppableId === "stageList") {
        setStageList(reorderedList);
      } else {
        setFinalList(reorderedList);
      }
    } else {
      const result = move(
        source.droppableId === "stageList" ? stageList : finalList,
        source.droppableId === "stageList" ? finalList : stageList,
        source,
        destination
      );

      setStageList(result.stageList);
      setFinalList(result.finalList);
      setUpdateButtonDisable(false);

      if (destination.droppableId === "finalList") {
        form.resetFields();
        setSelectedStepConfigure(result.newStepAdded);
      }
    }

    resetDragState();
  };

  const onDragUpdate = (update: DragUpdate) => {
    const { destination, draggableId } = update;

    if (!destination) {
      setIsCorrect(true);
      setPlaceholderIndex(null);
      return;
    }

    const list =
      destination.droppableId === "stageList" ? stageList : finalList;

    const nextSequence = list[destination.index]?.sequence || Infinity;

    setIsCorrect(+draggableId - nextSequence === 0);
    setPlaceholderIndex(destination.index);
  };

  const handleSubmit = () => {
    const workflowSteps: workflowStage[] = [];

    finalList.forEach((stage, index) => {
      const previousStage: workflowStage = workflowSteps[index - 1];

      if (previousStage) {
        workflowSteps.push({
          name: stage.name,
          stepId: stage.stepId ? stage.stepId : uuidv4(),
          description: "",
          parentId: previousStage.stepId,
          sequence: stage.sequence,
          duration: stage.duration ? stage.duration : 1,
        });
      } else {
        workflowSteps.push({
          name: stage.name,
          stepId: stage.stepId ? stage.stepId : uuidv4(),
          description: "",
          parentId: null,
          sequence: stage.sequence,
          duration: stage.duration ? stage.duration : 1,
        });
      }
    });

    const payload: workflowPayload = {
      name: fieldData.name,
      description: fieldData.description,
      workflowSteps,
    };

    if (workflowId) {
      dispatch(
        WorkflowActions.updateWorkflow({
          payload,
          workflowId,
          isRedirect: true,
        })
      );
    } else {
      dispatch(
        WorkflowActions.createWorkflow({
          payload,
        })
      );
    }
  };

  const handleSetUpdateData = () => {
    const unSelectStags: workflowStage[] = [];
    const selectedStags: workflowStage[] = [];

    setFieldData({
      name: selectedWorkflow?.name,
      description: selectedWorkflow?.description,
    });

    setSelectedStepConfigure(selectedWorkflow?.workflowSteps[0]);

    form.setFieldsValue({
      duration: selectedWorkflow?.workflowSteps[0]?.duration,
    });

    WORKFLOW_STAGE_LIST.forEach((stage) => {
      const findStagePresent = selectedWorkflow.workflowSteps.find(
        (step: workflowStage) => step.name === stage.name
      );

      if (findStagePresent) {
        selectedStags.push({
          ...findStagePresent,
          id: findStagePresent.sequence,
        });
      } else {
        unSelectStags.push(stage);
      }
    });

    setStageList(unSelectStags);
    setFinalList(selectedStags);
  };

  const handleFieldDataChange = (value: string, name: string) => {
    setFieldData({ ...fieldData, [name]: value });
  };

  const handleConfigureValueChange = (_: any, allValues: any) => {
    const tempFinalList: any[] = [...finalList];

    const stageIndex = tempFinalList.findIndex(
      (finalStep) => finalStep.sequence === selectedStepConfigure?.sequence
    );

    if (stageIndex !== -1) {
      const finalStep = { ...tempFinalList[stageIndex] };

      finalStep.duration = +allValues.duration;
      tempFinalList[stageIndex] = finalStep;
    }

    setFinalList(tempFinalList);
    setUpdateButtonDisable(false);
  };

  const handleEditStepConfigure = (stage: workflowStage) => {
    form.resetFields();
    setSelectedStepConfigure(stage);

    form.setFields([
      {
        name: "duration",
        value: stage.duration,
        errors: [],
      },
    ]);
  };

  useEffect(() => {
    if (workflowId && !selectedWorkflow) {
      dispatch(WorkflowActions.requestWorkflow());
    }
  }, [workflowId, selectedWorkflow]);

  useEffect(() => {
    if (workflowId && selectedWorkflow) {
      handleSetUpdateData();
    }
  }, [workflowId, selectedWorkflow]);

  return (
    <Card style={{ padding: 0 }}>
      <div className="workflow_main_container">
        <div>
          <div className="worflow_header">
            <p className="heading2">
              <WorkflowEditableField
                fieldName="name"
                value={fieldData.name}
                placeholder={getTranslation("global.namePlaceholder")}
                errorMsg={getTranslation("global.nameError")}
                stageList={finalList}
                handleSubmit={handleFieldDataChange}
                dataTestid="name-input"
              >
                <p className="heading1">{fieldData?.name ?? "-"}</p>
              </WorkflowEditableField>
            </p>

            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
              }}
            >
              {finalList.length > 0 && (
                <div>
                  {workflowId ? (
                    !updateButtonDisable && (
                      <Button
                        disabled={updateButtonDisable}
                        label={`${getTranslation(
                          "global.update"
                        )} ${getTranslation("global.templates")}`}
                        onClick={handleSubmit}
                        data-testid="update-btn"
                      />
                    )
                  ) : (
                    <Button
                      loading={loading}
                      label={`${getTranslation("global.add")} ${getTranslation(
                        "global.templates"
                      )}`}
                      onClick={handleSubmit}
                    />
                  )}
                </div>
              )}

              <IoClose
                className="close-icon"
                onClick={() => navigate(routePaths.template)}
                data-testid="lifeCycle-close-icon"
              />
            </div>
          </div>

          <WorkflowEditableField
            fieldName="description"
            value={fieldData?.description}
            placeholder={getTranslation("global.descriptionPlaceholder")}
            errorMsg={getTranslation("global.descriptionError")}
            stageList={finalList}
            handleSubmit={handleFieldDataChange}
            dataTestid="description-input"
          >
            <p className="bodyText">
              {fieldData?.description
                ? fieldData.description
                : getTranslation(
                    "polyhouse.polyhouseDetails.lifecycle.templateDescriptionPlaceholder"
                  )}
            </p>
          </WorkflowEditableField>
        </div>

        <FullAlertError error={error} />

        <div style={{ display: "flex", gap: "40px", overflow: "auto" }}>
          <DragDropContext
            onDragEnd={onDragEnd}
            onDragUpdate={onDragUpdate}
            onDragStart={(start) => setDraggedItem(start.draggableId)}
          >
            <div className="workflow_container">
              <Droppable droppableId="stageList">
                {(provided, snapshot) => (
                  <div
                    className="card_list_container"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <p className="heading2 card_title">
                      {getTranslation("workflow.selectStage")}
                    </p>
                    <div className="card_container">
                      {stageList.length > 0 ? (
                        stageList.map((stage, index) => (
                          <React.Fragment key={stage.id}>
                            {index === placeholderIndex &&
                              snapshot.draggingOverWith === draggedItem && (
                                <div
                                  className={`dropzone ${
                                    isCorrect ? "correct" : "wrong"
                                  }`}
                                >
                                  {isCorrect
                                    ? getTranslation("workflow.correctPosition")
                                    : getTranslation("workflow.wrongPosition")}
                                </div>
                              )}

                            <Draggable
                              draggableId={`${stage.id}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  className={`card single_stage_card heading2 ${
                                    snapshot.isDragging ? "dragging" : ""
                                  }`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {stage.name}
                                </div>
                              )}
                            </Draggable>
                          </React.Fragment>
                        ))
                      ) : (
                        <div className="empty_container">
                          <Empty />
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>

              <Droppable droppableId="finalList">
                {(provided, snapshot) => (
                  <div
                    className="card_list_container"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <p className="heading2 card_title">
                      {getTranslation("workflow.finalStage")}
                    </p>
                    <div className="card_container">
                      {finalList.length > 0 ? (
                        finalList.map((stage, index) => (
                          <React.Fragment key={stage.id}>
                            {index === placeholderIndex &&
                              snapshot.draggingOverWith === draggedItem && (
                                <div
                                  className={`dropzone ${
                                    isCorrect ? "correct" : "wrong"
                                  }`}
                                >
                                  {isCorrect
                                    ? getTranslation("workflow.correctPosition")
                                    : getTranslation("workflow.wrongPosition")}
                                </div>
                              )}

                            <Draggable
                              draggableId={`${stage.id}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  className={`card final_stage_card ${
                                    snapshot.isDragging ? "dragging" : ""
                                  }`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => handleEditStepConfigure(stage)}
                                >
                                  <div className="stage_count_container">
                                    {index + 1}
                                  </div>
                                  <p className="heading2">{stage.name}</p>
                                </div>
                              )}
                            </Draggable>
                          </React.Fragment>
                        ))
                      ) : (
                        <div className="empty_container">
                          <Empty />
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>

          {finalList.length > 0 && (
            <div className="card_list_container configure_container">
              <p className="heading2 card_title">
                {getTranslation(
                  "polyhouse.polyhouseDetails.lifecycle.configure"
                )}{" "}
                {selectedStepConfigure?.name}
              </p>

              <div className="card_container">
                <Form
                  form={form}
                  layout="vertical"
                  onValuesChange={handleConfigureValueChange}
                >
                  <Input
                    label={getTranslation(
                      "polyhouse.polyhouseDetails.lifecycle.duration"
                    )}
                    type="number"
                    name="duration"
                    placeholder={getTranslation(
                      "polyhouse.polyhouseDetails.lifecycle.enterDuration"
                    )}
                    style={{ width: "100%" }}
                    testId="duration-input"
                    suffix={
                      <span className="suffix">
                        {getTranslation("global.days")}
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: getTranslation("global.quantityErrorMsg"),
                      },
                      () => ({
                        validator(_, value) {
                          const quantity = value !== "" ? +value : 0;

                          if (!value || quantity >= 1) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              getTranslation(
                                "polyhouse.polyhouseDetails.lifecycle.noOfDurationGreaterThanAndEqualToOneErrorMsg"
                              )
                            )
                          );
                        },
                      }),
                    ]}
                  />
                </Form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AddUpdateWorkflow;
