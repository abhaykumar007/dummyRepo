import Button from "@/components/common/button";
import Form, { FormItem, useForm } from "@/components/common/form";
import Input from "@/components/common/input";
import WorkflowDragAndDrop from "@/components/common/workflowDrag&Drop";
import Card from "@/components/ui/card";
import Modal from "@/components/ui/modal";
import Select from "@/components/ui/select";
import { WORKFLOW_STAGE_LIST } from "@/config/consts";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { SaveLifeCyclePayload } from "@/pages/polyhouse/types";
import { workflowStage } from "@/pages/workflow/types";
import FarmActions from "@/redux/farm/action";
import FarmSelectors from "@/redux/farm/farmSelectors";
import PolyhouseActions from "@/redux/polyhouse/action";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import requestingSelector, {
  makeRequestingSelector,
} from "@/redux/requesting/requestingSelector";
import WorkflowActions from "@/redux/workflow/actions";
import WorkflowSelectors from "@/redux/workflow/selectors";
import { getTranslation } from "@/translation/i18n";
import { DragUpdate, DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LifeCycleEditableField from "./LifeCycleEditableField";
import "./style.scss";
import StartLifeCycleModal from "./StartLifeCycleModal";
import routePaths from "@/config/routePaths";
import { IoClose } from "react-icons/io5";
import { Polyhouse } from "@/pages/farm/types";
import { v4 as uuidv4 } from "uuid";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import Dropdown from "@/components/ui/dropdown";
import { Popconfirm, Space, theme } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { BsThreeDots } from "react-icons/bs";

const isConfigureForNursery = (name: string | undefined) => {
  return name ? ["Germination", "Nursery"].includes(name) : false;
};

const LifeCycleStages = ({
  list,
  selectedStep,
  onClick,
}: {
  list: workflowStage[];
  selectedStep: string;
  onClick: (stage: workflowStage) => void;
}) => {
  return (
    <div className="card_list_container">
      <p className="heading2 card_title">
        {getTranslation("polyhouse.polyhouseDetails.lifecycle.lifeCycleStages")}
      </p>
      <div className="card_container">
        {list?.map((stage: workflowStage, index: number) => (
          <div
            className={`card final_stage_card ${
              selectedStep === stage.name ? "selected_card" : ""
            }`}
            key={stage.name}
            onClick={() => onClick(stage)}
          >
            <div className="final_stage_inside_card">
              <div className="stage_count_container">{index + 1}</div>
              <p className="heading2">{stage.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const selectError = makeSelectErrorModel();
const selectLoading = makeRequestingSelector();

const AddLifeCycle = () => {
  const [form] = useForm();
  const { polyhouseId, lifeCycleId } = useParams();
  const navigate = useNavigate();

  const { useToken } = theme;
  const { token } = useToken();

  const dispatch = useAppDispatch();

  const [isSelectWorkflowModalOpen, setIsSelectWorkflowModalOpen] = useState(
    lifeCycleId ? false : true
  );
  const [selectedWorkflowTemplate, setSelectedWorkflowTemplate] = useState("");
  const [stageList, setStageList] =
    useState<workflowStage[]>(WORKFLOW_STAGE_LIST);
  const [finalList, setFinalList] = useState<workflowStage[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(true);
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const [selectedStepConfigure, setSelectedStepConfigure] =
    useState<workflowStage>();
  const [isStartLifeCycleBtnVisible, setIsStartLifeCycleBtnVisible] =
    useState(false);
  const [isLifeCycleUpdateButtonDisable, setIsLifeCycleUpdateButtonDisable] =
    useState(false);
  const [fieldData, setFieldData] = useState({
    name: "New Life cycle",
    description: "",
  });

  const isConfigureNurseryType = isConfigureForNursery(
    selectedStepConfigure?.name
  );

  const workflowList = useAppSelector(WorkflowSelectors.SelectWorkflowOptions);
  const zoneList = useAppSelector(PolyhouseSelectors.SelectZoneOptions);
  const nurseryList = useAppSelector(PolyhouseSelectors.SelectNurseryOptions);
  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);
  const polyhouseLoading = useAppSelector((state) =>
    requestingSelector(state, [
      PolyhouseActions.REQUEST_POLYHOUSE,
      FarmActions.REQUEST_FARMS,
    ])
  );

  const lifeCycleCreateUpdateError = useAppSelector((state) =>
    selectError(
      state,
      lifeCycleId
        ? PolyhouseActions.UPDATE_LIFECYCLE_FINISHED
        : PolyhouseActions.ADD_LIFECYCLE_FINISHED
    )
  );

  const selectedFarm = useAppSelector((state) =>
    FarmSelectors.SelectFarmByFarmId(state, selectedFarmId || "")
  );

  const selectedPolyhouse = useAppSelector(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );

  const workflowLoading = useAppSelector((state) =>
    requestingSelector(state, [WorkflowActions.REQUEST_WORKFLOW])
  );

  const selectedWorkflow = useAppSelector((state) =>
    WorkflowSelectors.SelectWorkflowByWorkflowId(
      state,
      selectedWorkflowTemplate
    )
  );

  const selectedLifeCycle = useAppSelector((state) =>
    PolyhouseSelectors.SelectLifeCycleByInstanceId(state, lifeCycleId)
  );
  const selectedLifeCycleList = useAppSelector((state) =>
    PolyhouseSelectors.SelectLifeCycles(state)
  );

  const loading = useAppSelector((state) =>
    selectLoading(state, [PolyhouseActions.ADD_LIFECYCLE])
  );

  const handleInitWorkflowRequest = () => {
    dispatch(WorkflowActions.requestWorkflow());
  };

  const handleCloseWorkflowModal = () => {
    setIsSelectWorkflowModalOpen(false);
  };

  const handleSelectWorkflow = (value: string) => {
    setSelectedWorkflowTemplate(value);
  };

  const resetDragState = () => {
    setDraggedItem(null);
    setIsCorrect(true);
    setPlaceholderIndex(null);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

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

  const handleConfigureValueChange = (_: any, allValues: any) => {
    const tempFinalList: any[] = [...finalList];

    const stageIndex = tempFinalList.findIndex(
      (finalStep) => finalStep.sequence === selectedStepConfigure?.sequence
    );

    if (stageIndex !== -1) {
      const finalStep = { ...tempFinalList[stageIndex] };

      finalStep.duration = +allValues.duration;
      if (!isConfigureForNursery(selectedStepConfigure?.name)) {
        finalStep.zoneId = allValues.type;
        delete finalStep.nurseryId;
      } else {
        finalStep.nurseryId = allValues.type;
        delete finalStep.zoneId;
      }

      tempFinalList[stageIndex] = finalStep;
    }

    setFinalList(tempFinalList);
    setIsLifeCycleUpdateButtonDisable(true);
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
      {
        name: "type",
        value: stage.zoneId ? stage.zoneId : stage.nurseryId,
        errors: [],
      },
    ]);
  };

  const handleSubmitLifeCycle = () => {
    const workflowSteps: workflowStage[] = [];

    finalList.forEach((stage, index) => {
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

    const payload: SaveLifeCyclePayload = {
      name: fieldData.name,
      description: fieldData.description,
      farmId: selectedFarmId,
      polyhouseId: polyhouseId ?? "",
      workflowInstanceSteps: workflowSteps,
    };

    if (lifeCycleId) {
      dispatch(
        PolyhouseActions.updateLifeCycle({
          payload,
          workflowInstancesId: lifeCycleId,
          polyhouseId,
          isRedirect: true,
        })
      );
    } else {
      dispatch(PolyhouseActions.addLifeCycle(payload));
    }
  };

  const handleFieldDataChange = (value: string, name: string) => {
    setFieldData({ ...fieldData, [name]: value });
  };

  const handleSetLifeCycleData = () => {
    setFieldData({
      name: selectedLifeCycle?.name,
      description: selectedLifeCycle?.description,
    });

    setFinalList(selectedLifeCycle?.workflowInstanceSteps);
    setSelectedStepConfigure(selectedLifeCycle?.workflowInstanceSteps[0]);
    form.setFieldsValue({
      duration: selectedLifeCycle?.workflowInstanceSteps[0]?.duration,
      type: isConfigureForNursery(
        selectedLifeCycle?.workflowInstanceSteps[0]?.name
      )
        ? selectedLifeCycle?.workflowInstanceSteps[0]?.nurseryId
        : selectedLifeCycle?.workflowInstanceSteps[0]?.zoneId,
    });

    let isLifeCycleBtnVisible = true;

    selectedLifeCycle?.workflowInstanceSteps.forEach((step: workflowStage) => {
      if (step.duration && (step.nurseryId || step.zoneId)) {
        isLifeCycleBtnVisible = true;
      } else {
        isLifeCycleBtnVisible = false;
      }
    });

    setIsStartLifeCycleBtnVisible(isLifeCycleBtnVisible);
  };

  const deleteLifeCycle = () => {
    dispatch(
      PolyhouseActions.deleteLifeCycle({ workflowInstancesId: lifeCycleId })
    );
  };

  useEffect(() => {
    if (!selectedPolyhouse && polyhouseId && selectedFarmId)
      dispatch(PolyhouseActions.requestPolyhouse(polyhouseId));
  }, [selectedFarmId]);

  useEffect(() => {
    if (selectedPolyhouse) {
      const isPolyhousesAreOfSameFarmId = selectedFarm.polyhouses.find(
        (polyhouse: Polyhouse) =>
          polyhouse.polyhouseId === selectedPolyhouse.polyhouseId
      );
      if (!isPolyhousesAreOfSameFarmId) navigate(routePaths.polyhouse);
    }
  }, [selectedPolyhouse, selectedFarm]);

  useEffect(() => {
    if (workflowList.length === 0) {
      handleInitWorkflowRequest();
    }
  }, []);

  useEffect(() => {
    if (!lifeCycleId && selectedWorkflow && selectedWorkflow?.workflowSteps) {
      setFinalList(selectedWorkflow?.workflowSteps);
      setSelectedStepConfigure(selectedWorkflow?.workflowSteps[0]);

      form.setFieldsValue({
        duration: selectedWorkflow?.workflowSteps[0]?.duration,
      });
    }
  }, [selectedWorkflow]);

  useEffect(() => {
    if (lifeCycleId && selectedLifeCycleList.length === 0) {
      dispatch(PolyhouseActions.requestLifeCycleForPolyhouse(polyhouseId));
    }
  }, [lifeCycleId]);

  useEffect(() => {
    if (lifeCycleId && selectedLifeCycle?.workflowInstanceId) {
      handleSetLifeCycleData();

      if (selectedLifeCycle?.status !== "DRAFT") {
        navigate(
          routePaths.startLifeCycle
            .replace(":polyhouseId", polyhouseId ?? "")
            .replace(":lifeCycleId", lifeCycleId),
          { replace: true }
        );
      }
    }
  }, [selectedLifeCycle]);

  return (
    <div>
      <div className="lifecycle_main_container">
        <Card>
          <div className="lifecycle_header_container">
            <div>
              <p className="heading2">
                <LifeCycleEditableField
                  fieldName="name"
                  value={fieldData.name}
                  placeholder={getTranslation("global.namePlaceholder")}
                  errorMsg={getTranslation("global.nameError")}
                  stageList={finalList}
                  handleSubmit={handleFieldDataChange}
                  dataTestid="name-input"
                >
                  <p className="heading1">{fieldData?.name ?? "-"}</p>
                </LifeCycleEditableField>
              </p>
              <LifeCycleEditableField
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
                        "polyhouse.polyhouseDetails.lifecycle.enterLifeCycleDescription"
                      )}
                </p>
              </LifeCycleEditableField>
            </div>
            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
              }}
            >
              {lifeCycleId && (
                <Dropdown
                  trigger={["click"]}
                  open={isMenuOpen}
                  onOpenChange={setIsMenuOpen}
                  placement="bottomRight"
                  dropdownRender={() => (
                    <div style={contentStyle}>
                      <Space style={{ padding: 3 }}>
                        <Popconfirm
                          title={getTranslation("global.areYouSure")}
                          okText={getTranslation("global.yes")}
                          cancelText={getTranslation("global.cancel")}
                          onCancel={() => setIsMenuOpen(false)}
                          onConfirm={deleteLifeCycle}
                        >
                          <Button
                            icon={<DeleteOutlined />}
                            type="primary"
                            label={getTranslation("global.delete")}
                            loading={loading}
                            style={{ padding: "0px 15px" }}
                            danger
                            iconPosition="start"
                          />
                        </Popconfirm>
                      </Space>
                    </div>
                  )}
                  label={
                    <BsThreeDots
                      style={{
                        cursor: "pointer",
                        marginRight: "10px",
                        marginTop: "8px",
                      }}
                      data-testid="polyhouse-threeDots-icon"
                      fontSize={20}
                    />
                  }
                  isDownDropIconHide={true}
                />
              )}

              {lifeCycleId ? (
                isLifeCycleUpdateButtonDisable && (
                  <Button
                    label={getTranslation(
                      "polyhouse.polyhouseDetails.lifecycle.updateLifeCycle"
                    )}
                    onClick={handleSubmitLifeCycle}
                    style={{ padding: "18px" }}
                  />
                )
              ) : (
                <Button
                  disabled={finalList.length === 0 || loading}
                  label={getTranslation(
                    "polyhouse.polyhouseDetails.lifecycle.createLifeCycle"
                  )}
                  onClick={handleSubmitLifeCycle}
                  loading={loading}
                  style={{ padding: "18px" }}
                />
              )}

              <div style={{ height: "20px", width: "20px", marginTop: "-6px" }}>
                <IoClose
                  className="close-icon"
                  onClick={() => navigate(-1)}
                  size={24}
                />
              </div>
            </div>
          </div>
          <FullAlertError error={lifeCycleCreateUpdateError} />
        </Card>
        <div className="lifecycle_container">
          {lifeCycleId ? (
            <LifeCycleStages
              list={finalList}
              selectedStep={selectedStepConfigure?.name ?? ""}
              onClick={handleEditStepConfigure}
            />
          ) : selectedWorkflowTemplate ? (
            <LifeCycleStages
              list={finalList}
              selectedStep={selectedStepConfigure?.name ?? ""}
              onClick={handleEditStepConfigure}
            />
          ) : (
            <WorkflowDragAndDrop
              onDragEnd={onDragEnd}
              onDragUpdate={onDragUpdate}
              setDraggedItem={setDraggedItem}
              stageList={stageList}
              placeholderIndex={placeholderIndex}
              draggedItem={draggedItem}
              isCorrect={isCorrect}
              finalList={finalList}
              selectedStage={selectedStepConfigure?.name}
              handleSelectFinalStep={handleEditStepConfigure}
              isLifeCycle
            />
          )}

          {finalList.length > 0 && (
            <div className="card_list_container configure_container">
              <p className="heading2 card_title">
                {getTranslation(
                  "polyhouse.polyhouseDetails.lifecycle.configure"
                )}{" "}
                {selectedStepConfigure?.name}
              </p>

              <div className="workflow_step_configuration">
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

                  <div className="configure_type_container">
                    <FormItem
                      name="type"
                      label={
                        isConfigureNurseryType
                          ? getTranslation(
                              "polyhouse.polyhouseDetails.lifecycle.nursery"
                            )
                          : getTranslation(
                              "polyhouse.polyhouseDetails.lifecycle.zone"
                            )
                      }
                    >
                      <Select
                        loading={polyhouseLoading}
                        placeholder={
                          isConfigureNurseryType
                            ? getTranslation(
                                "polyhouse.polyhouseDetails.lifecycle.selectNursery"
                              )
                            : getTranslation(
                                "polyhouse.polyhouseDetails.lifecycle.selectZone"
                              )
                        }
                        options={
                          isConfigureNurseryType ? nurseryList : zoneList
                        }
                        style={{ width: "100%" }}
                        allowClear
                        data-testid="configure-select"
                      />
                    </FormItem>
                  </div>
                </Form>
              </div>
            </div>
          )}
          {isStartLifeCycleBtnVisible && (
            <div className="card_list_container configure_container">
              <p className="heading2 card_title">
                {getTranslation(
                  "polyhouse.polyhouseDetails.lifecycle.startLifeCycle"
                )}
              </p>

              <StartLifeCycleModal />
            </div>
          )}
        </div>

        <Modal
          open={isSelectWorkflowModalOpen}
          title={getTranslation(
            "polyhouse.polyhouseDetails.lifecycle.chooseWorkflowTemplate"
          )}
          footer={null}
          onCancel={handleCloseWorkflowModal}
        >
          <div className="choose_workflow_template_container">
            <Select
              loading={workflowLoading}
              placeholder={getTranslation(
                "polyhouse.polyhouseDetails.lifecycle.selectWorkflow"
              )}
              options={workflowList}
              style={{ width: "100%" }}
              allowClear
              onChange={handleSelectWorkflow}
              data-testid="workflow-select"
            />

            {selectedWorkflowTemplate ? (
              <Button
                label={getTranslation("global.confirm")}
                onClick={handleCloseWorkflowModal}
              />
            ) : (
              <>
                <p className="heading2">{getTranslation("global.or")}</p>

                <Button
                  label={getTranslation(
                    "polyhouse.polyhouseDetails.lifecycle.createNewTemplate"
                  )}
                  onClick={handleCloseWorkflowModal}
                />
              </>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AddLifeCycle;
