import Button from "@/components/common/button";
import Form, { FormItem, useForm } from "@/components/common/form";
import Input from "@/components/common/input";
import PageLoading from "@/components/common/loading/PageLoading";
import Card from "@/components/ui/card";
import Table from "@/components/ui/table";
import routePaths from "@/config/routePaths";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  HarvestCropsInLifeCyclePayload,
  MoveCropsInLifeCyclePayload,
  WorkflowInstanceStep,
} from "@/pages/polyhouse/types";
import PolyhouseActions from "@/redux/polyhouse/action";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import requestingSelector from "@/redux/requesting/requestingSelector";
import Fields from "@/utilities/fields/field";
import { Collapse, Modal, Steps, TableProps, theme } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { MdError, MdKeyboardArrowRight } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./style.scss";
import FullAlertError from "@/components/common/error/FullAlertError";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { applyFieldErrorsToForm, hasFieldErrors } from "@/utilities/formUtils";
import { IoClose } from "react-icons/io5";
import FarmSelectors from "@/redux/farm/farmSelectors";
import { Polyhouse, Zone } from "@/pages/farm/types";
import { getTranslation } from "@/translation/i18n";
import {
  get30DaysBack,
  isDateLessThan30Days,
  isWithinTenPercent,
} from "@/utilities/time";
import { cloneDeep } from "lodash";
import { Nursery as NurseryType } from "@/pages/farm/types";
import DatePicker from "@/components/common/DatePicker";
import dayjs from "dayjs";

export const cropHarvestFieldMap = {
  outboundQty: {
    field: "outboundQty",
  },
  mortalityQty: {
    field: "mortalityQty",
  },
  qty: {
    field: "qty",
  },
};

export const cropMoveFieldMap = {
  outboundQty: {
    field: "outboundQty",
  },
  mortalityQty: {
    field: "mortalityQty",
  },
};

export const findCurrentStepIndex = (list: WorkflowInstanceStep[]) => {
  const firstIndexOfStep = [...list]
    .reverse()
    .findIndex((item) => item.qty >= 1);

  const selectedStepIndex =
    firstIndexOfStep === -1 ? 0 : list.length - 1 - firstIndexOfStep;

  return selectedStepIndex;
};

const selectError = makeSelectErrorModel();

const StartLifeCycle = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { polyhouseId, lifeCycleId: workflowInstancesId } = useParams();
  const [moveCropsForm] = useForm();
  const [harvestCropsForm] = useForm();

  const [currentCompletedStep, setCurrentCompletedStep] = useState<any>(null);
  const [lifeCycleStageList, setLifeCycleStageList] = useState<any[]>([]);
  const [currentStage, setCurrentStage] = useState<WorkflowInstanceStep>();
  const [isCompletedLifeCycleModalOpen, setIsCompletedLifeCycleModalOpen] =
    useState(false);
  const [isCropMoveModalOpen, setIsCropMoveModalOpen] = useState(false);
  const [isCropHarvestModalOpen, setIsCropHarvestModalOpen] = useState(false);

  const selectedLifeCycle = useAppSelector((state) =>
    PolyhouseSelectors.SelectLifeCycleByInstanceId(state, workflowInstancesId)
  );

  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);

  const selectedFarm = useAppSelector((state) =>
    FarmSelectors.SelectFarmByFarmId(state, selectedFarmId || "")
  );

  const selectedPolyhouse = useAppSelector(
    PolyhouseSelectors.SelectSelectedPolyhouse
  );

  const loadingLifeCycle = useAppSelector((state) =>
    requestingSelector(state, [
      PolyhouseActions.REQUEST_LIFE_CYCLE_FOR_POLYHOUSE,
    ])
  );

  const loadingLifeCycleCompleted = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.LIFECYCLE_COMPLETED])
  );
  const loadingCropHarvested = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.HARVEST_CROPS_IN_LIFECYCLE])
  );

  const loadingCropMove = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.MOVE_CROPS_IN_LIFECYCLE])
  );

  const errorRequestLifeCycle = useAppSelector((state) =>
    selectError(
      state,
      PolyhouseActions.REQUEST_LIFE_CYCLE_FOR_POLYHOUSE_FINISHED
    )
  );

  const errorHarvestCrop = useAppSelector((state) =>
    selectError(state, PolyhouseActions.HARVEST_CROPS_IN_LIFECYCLE_FINISHED)
  );

  const errorMoveCrop = useAppSelector((state) =>
    selectError(state, PolyhouseActions.MOVE_CROPS_IN_LIFECYCLE_FINISHED)
  );

  const errorLifeCycleCompleted = useAppSelector((state) =>
    selectError(state, PolyhouseActions.LIFECYCLE_COMPLETED_FINISHED)
  );

  const harvestCropfieldsError = useAppSelector((state) =>
    PolyhouseSelectors.SelectFieldErrors(state, [
      PolyhouseActions.HARVEST_CROPS_IN_LIFECYCLE_FINISHED,
    ])
  );

  const moveCropfieldsError = useAppSelector((state) =>
    PolyhouseSelectors.SelectFieldErrors(state, [
      PolyhouseActions.MOVE_CROPS_IN_LIFECYCLE_FINISHED,
    ])
  );

  const childStep =
    selectedLifeCycle?.workflowInstanceSteps && currentStage?.stepId
      ? selectedLifeCycle?.workflowInstanceSteps.find(
          (step: WorkflowInstanceStep) => step.parentId === currentStage.stepId
        )
      : null;

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const getSelectedNursery = (nurseryId: string) => {
    if (!selectedPolyhouse?.nurseries || !nurseryId) return "-";

    const nursery = selectedPolyhouse.nurseries.find(
      (nursery: NurseryType) => nursery.nurseryId === nurseryId
    );

    return nursery?.name ?? "-";
  };
  const getSelectedZone = (zoneId: string | undefined | null) => {
    if (!selectedPolyhouse?.zones || !zoneId) return "-";

    const zone = selectedPolyhouse.zones.find(
      (zone: Zone) => zone.zoneId === zoneId
    );

    return zone?.name ?? "-";
  };

  const stageHistoryColumns: TableProps["columns"] = [
    {
      title: getTranslation("global.date"),
      dataIndex: "date",
      render: (_, record) => {
        return record.date
          ? moment(record.date || "-").format("MMMM Do YYYY")
          : "-";
      },
    },
    {
      title: getTranslation("global.units"),
      dataIndex: "qty",
    },
    {
      title: getTranslation("global.description"),
      dataIndex: "description",
      render: (_, record) => {
        return (
          <>
            {record.qty}{" "}
            {getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.unitsWereMoved"
            )}{" "}
            {record.movement == 1
              ? `${getTranslation("global.inTo")} `
              : record.movement == -1
              ? `${getTranslation("global.outFrom")} `
              : ` ${getTranslation("global.toMortalityFrom")} `}
            {currentStage?.name ?? "-"}
          </>
        );
      },
    },
  ];

  const harvestedBatchesColumns: TableProps["columns"] = [
    {
      title: getTranslation("polyhouse.polyhouseDetails.lifecycle.batchName"),
      dataIndex: "batchNo",
    },
    {
      title: getTranslation(
        "polyhouse.polyhouseDetails.lifecycle.harvestedUnits"
      ),
      dataIndex: "qty",
      render: (_, record) => {
        return (
          <span style={{ textTransform: "capitalize" }}>
            {record.qty}{" "}
            {selectedLifeCycle?.unit
              ? selectedLifeCycle?.unit?.toLowerCase()
              : ""}
          </span>
        );
      },
    },
    {
      title: getTranslation("polyhouse.polyhouseDetails.lifecycle.cropUsed"),
      dataIndex: "outboundQty",
      render: (_, record) => {
        return `${record.outboundQty} ${getTranslation("global.units")}`;
      },
    },
    {
      title: getTranslation(
        "polyhouse.polyhouseDetails.lifecycle.harvestedDate"
      ),
      dataIndex: "harvestDate",
      render: (_, record) => {
        return moment(record.harvestDate).format("MMMM Do YYYY");
      },
    },
    {
      title: getTranslation(
        "polyhouse.polyhouseDetails.lifecycle.cropMortality"
      ),
      dataIndex: "mortalityQty",
      render: (_, record) => {
        return `${record.mortalityQty} ${getTranslation("global.units")}`;
      },
    },
  ];

  const onChangeStep = (value: number) => {
    setCurrentCompletedStep(value);
    setCurrentStage(lifeCycleStageList[value]);
  };

  const handleSetData = () => {
    const stageList: any[] = [];

    selectedLifeCycle.workflowInstanceSteps.forEach(
      (step: WorkflowInstanceStep) => {
        stageList.push({
          ...step,
          title: step.name,
          description: (
            <div>
              <p>
                {getTranslation("global.quantity")}: {step.qty}
              </p>
              {step?.nurseryId && (
                <p>
                  {getTranslation(
                    "polyhouse.polyhouseDetails.lifecycle.nursery"
                  )}
                  : {getSelectedNursery(step?.nurseryId)}
                </p>
              )}
              {step?.zoneId && (
                <p>
                  {getTranslation("polyhouse.polyhouseDetails.lifecycle.zone")}:{" "}
                  {getSelectedZone(step?.zoneId)}
                </p>
              )}
            </div>
          ),
        });
      }
    );

    setCurrentCompletedStep(
      findCurrentStepIndex(selectedLifeCycle.workflowInstanceSteps)
    );

    setCurrentStage(
      selectedLifeCycle.workflowInstanceSteps[
        findCurrentStepIndex(selectedLifeCycle.workflowInstanceSteps)
      ]
    );
    setLifeCycleStageList(stageList);
  };

  const handleCloseLifeCycleModal = () => {
    setIsCompletedLifeCycleModalOpen(false);
  };
  const handleOpenLifeCycleModal = () => {
    setIsCompletedLifeCycleModalOpen(true);
  };

  const handleCloseMovesCropModal = () => {
    moveCropsForm.resetFields();
    setIsCropMoveModalOpen(false);
  };

  const handleOpenCropHarvestModal = () => {
    setIsCropHarvestModalOpen(true);
  };

  const handleCloseCropHarvestModal = () => {
    harvestCropsForm.resetFields();
    setIsCropHarvestModalOpen(false);
  };

  const handleOpenMoveCropsModal = () => {
    setIsCropMoveModalOpen(true);
  };

  const handleLifeCycleCompleted = () => {
    dispatch(
      PolyhouseActions.lifeCycleCompleted({
        polyhouseId: polyhouseId ?? "",
        workflowInstancesId: workflowInstancesId ?? "",
        handleModalClose: handleCloseLifeCycleModal,
      })
    );
  };

  const handleMoveCrops = (values: MoveCropsInLifeCyclePayload) => {
    const payload: MoveCropsInLifeCyclePayload = {
      mortalityQty: +values?.mortalityQty,
      outboundQty: +values?.outboundQty,
      moveDate: dayjs(values.moveDate).toISOString(),
    };

    dispatch(
      PolyhouseActions.moveCropStepInLifeCycle({
        polyhouseId: polyhouseId ?? "",
        workflowInstancesId: workflowInstancesId ?? "",
        handleModalClose: handleCloseMovesCropModal,
        stepId: currentStage?.stepId ?? "",
        payload,
      })
    );
  };

  const handleHarvestCrops = (values: HarvestCropsInLifeCyclePayload) => {
    const payload: HarvestCropsInLifeCyclePayload = {
      mortalityQty: +values?.mortalityQty,
      outboundQty: +values?.outboundQty,
      qty: +values?.qty,
      harvestDate: dayjs(values.harvestDate).toISOString(),
      pricePerUnit: 0,
    };

    dispatch(
      PolyhouseActions.harvestCropsInLifeCycle({
        polyhouseId: polyhouseId ?? "",
        workflowInstancesId: workflowInstancesId ?? "",
        handleModalClose: handleCloseCropHarvestModal,
        stepId: currentStage?.stepId ?? "",
        payload,
      })
    );
  };

  const handleDisableDatePicker = () => {
    return currentStage?.actualStartDate &&
      !isDateLessThan30Days(currentStage?.actualStartDate)
      ? get30DaysBack()
      : dayjs(
          moment(currentStage?.actualStartDate).format("YYYY-MM-DD"),
          "YYYY-MM-DD"
        );
  };

  useEffect(() => {
    if (selectedLifeCycle && Object.keys(selectedLifeCycle).length === 0) {
      dispatch(PolyhouseActions.requestLifeCycleForPolyhouse(polyhouseId));
    }
  }, []);

  useEffect(() => {
    if (
      selectedLifeCycle &&
      Object.keys(selectedLifeCycle).length > 0 &&
      selectedPolyhouse?.polyhouseId
    ) {
      handleSetData();
    }
  }, [selectedLifeCycle, selectedPolyhouse]);

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
    if (!selectedPolyhouse && polyhouseId && selectedFarmId)
      dispatch(PolyhouseActions.requestPolyhouse(polyhouseId));
  }, [selectedFarmId]);

  useEffect(() => {
    if (hasFieldErrors(harvestCropfieldsError)) {
      applyFieldErrorsToForm(
        harvestCropsForm,
        cropHarvestFieldMap,
        Object.keys(cropHarvestFieldMap),
        harvestCropfieldsError
      );
    }
  }, [harvestCropfieldsError]);

  useEffect(() => {
    if (hasFieldErrors(moveCropfieldsError)) {
      applyFieldErrorsToForm(
        moveCropsForm,
        cropMoveFieldMap,
        Object.keys(cropMoveFieldMap),
        moveCropfieldsError
      );
    }
  }, [moveCropfieldsError]);

  if (loadingLifeCycle) {
    return <PageLoading />;
  }

  const stageInformation = {
    key: "1",
    label: getTranslation("polyhouse.polyhouseDetails.lifecycle.stageDetails"),
    children: (
      <Fields
        className="stage_details_container"
        info={[
          {
            label: getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.reamainingUnits"
            ),
            value: currentStage?.qty ?? "-",
          },
          {
            label: getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.totalInboundUnits"
            ),
            value: currentStage?.inboundQty ?? "-",
          },
          {
            label: getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.totalOutboundUnits"
            ),
            value: currentStage?.outboundQty ?? "-",
          },
          {
            label: getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.totalMoratlity"
            ),
            value: currentStage?.mortalityQty ?? "-",
          },
          {
            label: currentStage?.nurseryId
              ? getTranslation("polyhouse.polyhouseDetails.lifecycle.nursery")
              : getTranslation("polyhouse.polyhouseDetails.lifecycle.zone"),
            value: currentStage?.nurseryId
              ? getSelectedNursery(currentStage?.nurseryId)
              : getSelectedZone(currentStage?.zoneId),
          },
          {
            label: getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.expectedStartDate"
            ),
            value: currentStage?.startDate
              ? moment(currentStage?.startDate).format("MMMM Do YYYY")
              : 0,
          },
          {
            label: getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.actualStartDate"
            ),
            value: currentStage?.actualStartDate
              ? moment(currentStage.actualStartDate).format("MMMM Do YYYY")
              : getTranslation(
                  "polyhouse.polyhouseDetails.lifecycle.notYetStarted"
                ),
          },
          {
            label: getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.expectedStagePeriod"
            ),
            value: currentStage?.duration
              ? `${currentStage?.duration} ${getTranslation("global.days")}`
              : `0 ${getTranslation("global.days")}`,
          },
          {
            label: getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.expectedEndDate"
            ),
            value: currentStage?.endDate ? (
              <span
                style={{
                  color: isWithinTenPercent(
                    currentStage?.startDate,
                    currentStage?.endDate
                  )
                    ? "red"
                    : "black",
                }}
              >
                {moment(currentStage?.endDate).format("MMMM Do YYYY")}
              </span>
            ) : (
              "-"
            ),
          },
          {
            label: getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.actualEndDate"
            ),
            value: currentStage?.actualEndDate
              ? moment(currentStage?.actualEndDate).format("MMMM Do YYYY")
              : "-",
          },
        ]}
      />
    ),
    style: panelStyle,
  };

  const stageHistory = {
    key: "2",
    label: getTranslation("polyhouse.polyhouseDetails.lifecycle.stageHistory"),
    children: (
      <Table
        columns={stageHistoryColumns}
        dataSource={
          currentStage?.workflowInstanceStepLogs
            ? cloneDeep(currentStage?.workflowInstanceStepLogs)
            : []
        }
        className="ant-border-space stage_details_container"
      />
    ),
    style: panelStyle,
  };

  const harvestedBatches = {
    key: "3",
    label: getTranslation(
      "polyhouse.polyhouseDetails.lifecycle.harvestedBatches"
    ),
    children: (
      <Table
        loading={loadingCropHarvested}
        columns={harvestedBatchesColumns}
        dataSource={
          selectedLifeCycle?.batches
            ? cloneDeep(selectedLifeCycle?.batches)
            : []
        }
        className="ant-border-space stage_details_container"
      />
    ),
    style: panelStyle,
  };

  return (
    <div>
      <Card
        className="start_lifecycle_main_container"
        title={<p className="heading2">{selectedLifeCycle?.name ?? "-"}</p>}
        extra={
          <div className="stage_detail_header_btn_container">
            {!selectedLifeCycle?.isCompleted && (
              <>
                <Button
                  label={getTranslation(
                    "polyhouse.polyhouseDetails.lifecycle.lifeCycleComplete"
                  )}
                  onClick={handleOpenLifeCycleModal}
                  style={{ padding: "none" }}
                />

                {currentStage && currentStage?.qty > 0 && (
                  <>
                    {childStep ? (
                      <Button
                        label={`${getTranslation(
                          "polyhouse.polyhouseDetails.lifecycle.moveTo"
                        )} ${childStep?.name}`}
                        onClick={handleOpenMoveCropsModal}
                        style={{ padding: "none" }}
                      />
                    ) : (
                      <Button
                        style={{ padding: "none" }}
                        label={getTranslation(
                          "polyhouse.polyhouseDetails.lifecycle.harvestBatch"
                        )}
                        onClick={handleOpenCropHarvestModal}
                      />
                    )}
                  </>
                )}
              </>
            )}

            <Link
              to={routePaths.lifeCycle.replace(
                ":polyhouseId",
                polyhouseId ?? ""
              )}
            >
              <IoClose
                data-testid="lifeCycle-close-icon"
                className="close-icon"
                onClick={() => navigate(-1)}
                style={{ marginTop: "6px" }}
                size={22}
              />
            </Link>
          </div>
        }
      >
        <div className="start_lifecycle_container">
          <div className="lifeCycle_stages_container">
            <p className="heading2 divider">
              {getTranslation("polyhouse.polyhouseDetails.lifecycle.stages")}
            </p>

            <Steps
              current={currentCompletedStep ? currentCompletedStep : 0}
              onChange={onChangeStep}
              className="lifecycle_stepper desktop_lifecycle_stepper"
              direction="vertical"
              items={lifeCycleStageList}
              style={{
                gridTemplateColumns: `repeat(${lifeCycleStageList.length},1fr)`,
              }}
            />
            <Steps
              current={currentCompletedStep ? currentCompletedStep : 0}
              onChange={onChangeStep}
              className="lifecycle_stepper mobile_lifecycle_stepper"
              direction="vertical"
              items={lifeCycleStageList}
              style={{
                gridTemplateColumns: `repeat(${lifeCycleStageList.length},1fr)`,
              }}
            />
          </div>

          <div className="stage_detail_container">
            <div className="lifeCycle_stage_content_container">
              {errorRequestLifeCycle && (
                <FullAlertError error={errorRequestLifeCycle} />
              )}

              <Collapse
                bordered={false}
                defaultActiveKey={["1"]}
                expandIcon={({ isActive }) => (
                  <MdKeyboardArrowRight
                    style={{
                      rotate: isActive ? "90deg" : "0deg",
                      fontSize: "20px",
                    }}
                  />
                )}
                style={{ background: token.colorBgContainer }}
                items={
                  selectedLifeCycle?.batches?.length > 0
                    ? [stageInformation, stageHistory, harvestedBatches]
                    : [stageInformation, stageHistory]
                }
              />
            </div>
          </div>
        </div>
      </Card>

      <Modal
        open={isCompletedLifeCycleModalOpen}
        confirmLoading={loadingLifeCycleCompleted}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <MdError
              style={{
                color: "#faad14",
                fontSize: "22px",
                marginTop: "-5px",
              }}
            />
            <p>{getTranslation("global.areYouSure")}</p>
          </div>
        }
        onOk={handleLifeCycleCompleted}
        onCancel={handleCloseLifeCycleModal}
      >
        {errorLifeCycleCompleted && (
          <FullAlertError error={errorLifeCycleCompleted} />
        )}

        <p style={{ marginLeft: "31px" }}>
          {getTranslation(
            "polyhouse.polyhouseDetails.lifecycle.lifeCycleCompleteMsg"
          )}
        </p>
      </Modal>

      <Modal
        open={isCropMoveModalOpen}
        confirmLoading={loadingCropMove}
        title={`${getTranslation(
          "polyhouse.polyhouseDetails.lifecycle.moveCropsFrom"
        )} ${currentStage?.name} ${getTranslation("global.to")} ${
          childStep?.name
        }`}
        onOk={() => moveCropsForm.submit()}
        onCancel={handleCloseMovesCropModal}
      >
        <Form
          form={moveCropsForm}
          onFinish={handleMoveCrops}
          initialValues={{
            mortalityQty: 0,
            outboundQty: 1,
            moveDate: dayjs(),
          }}
          style={{ marginTop: "15px" }}
        >
          {errorMoveCrop && !hasFieldErrors(moveCropfieldsError) && (
            <FullAlertError error={errorMoveCrop} />
          )}

          <Input
            testId="outbound-qty"
            name="outboundQty"
            label={getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.noOfUnits"
            )}
            placeholder={getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.noOfUnitsPlaceholder"
            )}
            rules={[
              {
                required: true,
                message: getTranslation(
                  "polyhouse.polyhouseDetails.lifecycle.noOfUnitsErrorMsg"
                ),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const mortalityQty = getFieldValue("mortalityQty") || 0;
                  const quantity = value !== "" ? +value : 0;
                  const totalQty = currentStage?.qty ?? 0;

                  if (quantity >= 1 && quantity + +mortalityQty <= totalQty) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      quantity < 1
                        ? getTranslation(
                            "polyhouse.polyhouseDetails.lifecycle.unitGreaterOrEqualOneErrorMsg"
                          )
                        : `${getTranslation(
                            "polyhouse.polyhouseDetails.lifecycle.totaQuantityErrorMsg"
                          )} ${totalQty}`
                    )
                  );
                },
              }),
            ]}
          />
          <Input
            testId="mortality-qty"
            name="mortalityQty"
            label={getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.noOfMortalityUnits"
            )}
            placeholder={getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.noOfMortalityUnitsPlaceholder"
            )}
            rules={[
              {
                required: true,
                message: getTranslation(
                  "polyhouse.polyhouseDetails.lifecycle.noOfMortalityUnitsErrorMsg"
                ),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const outboundQty = getFieldValue("outboundQty") || 1;
                  const quantity = value !== "" ? +value : 0;
                  const totalQty = currentStage?.qty ?? 0;

                  if (quantity >= 0 && quantity + +outboundQty <= totalQty) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      quantity < 0
                        ? getTranslation(
                            "polyhouse.polyhouseDetails.lifecycle.mortalityUnitGreaterOrEqualOneErrorMsg"
                          )
                        : `${getTranslation(
                            "polyhouse.polyhouseDetails.lifecycle.totaQuantityErrorMsg"
                          )} ${totalQty}`
                    )
                  );
                },
              }),
            ]}
          />
          <FormItem
            label={getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.cropMoveDate"
            )}
            name="moveDate"
            rules={[
              {
                required: true,
                message: getTranslation(
                  "polyhouse.polyhouseDetails.lifecycle.cropMoveDateError"
                ),
              },
            ]}
          >
            <DatePicker
              placeholder={`e.g: ${moment().format("DD MMM YYYY")}`}
              style={{ width: "100%", height: "45px" }}
              format="DD MMM YYYY"
              maxDate={dayjs()}
              minDate={handleDisableDatePicker()}
            />
          </FormItem>
        </Form>
      </Modal>

      <Modal
        open={isCropHarvestModalOpen}
        confirmLoading={loadingCropHarvested}
        title={getTranslation(
          "polyhouse.polyhouseDetails.lifecycle.createANewBatch"
        )}
        onOk={() => harvestCropsForm.submit()}
        onCancel={handleCloseCropHarvestModal}
      >
        <Form
          form={harvestCropsForm}
          onFinish={handleHarvestCrops}
          style={{ marginTop: "15px" }}
          initialValues={{
            mortalityQty: 0,
            outboundQty: 1,
            qty: 1,
            harvestDate: dayjs(),
          }}
        >
          {errorHarvestCrop && !hasFieldErrors(harvestCropfieldsError) && (
            <FullAlertError error={errorHarvestCrop} />
          )}
          <Input
            testId="harvest-outbound-qty"
            name="outboundQty"
            label={getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.noOfPlants"
            )}
            placeholder={getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.noOfPlantsPlaceholder"
            )}
            rules={[
              {
                required: true,
                message: getTranslation(
                  "polyhouse.polyhouseDetails.lifecycle.noOfPlantsPlaceholderErrorMsg"
                ),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const mortalityQty = getFieldValue("mortalityQty") || 0;
                  const quantity = value !== "" ? +value : 0;
                  const totalQty = currentStage?.qty ?? 0;

                  if (quantity >= 0 && quantity + +mortalityQty <= totalQty) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      `${getTranslation(
                        "polyhouse.polyhouseDetails.lifecycle.totaQuantityErrorMsg"
                      )} ${totalQty}`
                    )
                  );
                },
              }),
            ]}
          />

          <Input
            testId="harvest-mortality-qty"
            name="mortalityQty"
            label={getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.noOfMortalityUnits"
            )}
            placeholder={getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.noOfMortalityUnitsPlaceholder"
            )}
            rules={[
              {
                required: true,
                message: getTranslation(
                  "polyhouse.polyhouseDetails.lifecycle.noOfMortalityUnitsErrorMsg"
                ),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const outboundQty = getFieldValue("outboundQty") || 1;
                  const quantity = value !== "" ? +value : 0;
                  const totalQty = currentStage?.qty ?? 0;

                  if (quantity >= 0 && quantity + +outboundQty <= totalQty) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      quantity < 0
                        ? getTranslation(
                            "polyhouse.polyhouseDetails.lifecycle.mortalityUnitGreaterOrEqualOneErrorMsg"
                          )
                        : `${getTranslation(
                            "polyhouse.polyhouseDetails.lifecycle.totaQuantityErrorMsg"
                          )} ${totalQty}`
                    )
                  );
                },
              }),
            ]}
          />

          <Input
            testId="harvest-qty"
            name="qty"
            label={`${getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.unitsHarvested"
            )} (${getTranslation("global.in")} ${selectedLifeCycle.unit})`}
            placeholder={getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.noOfUnitsHarvestedPlaceholder"
            )}
            rules={[
              {
                required: true,
                message: getTranslation(
                  "polyhouse.polyhouseDetails.lifecycle.noOfUnitsHarvestedErrorMsg"
                ),
              },
              () => ({
                validator(_, value) {
                  const quantity = value !== "" ? +value : "";

                  if (quantity === "" || quantity >= 1) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      getTranslation(
                        "polyhouse.polyhouseDetails.lifecycle.unitGreaterOrEqualOneErrorMsg"
                      )
                    )
                  );
                },
              }),
            ]}
          />

          <FormItem
            label={getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.cropHarvestMoveDate"
            )}
            name="harvestDate"
            rules={[
              {
                required: true,
                message: getTranslation(
                  "polyhouse.polyhouseDetails.lifecycle.cropHarvestMoveDateError"
                ),
              },
            ]}
          >
            <DatePicker
              placeholder={`e.g: ${moment().format("DD MMM YYYY")}`}
              style={{ width: "100%", height: "45px" }}
              format="DD MMM YYYY"
              minDate={handleDisableDatePicker()}
              maxDate={dayjs()}
            />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
};

export default StartLifeCycle;
