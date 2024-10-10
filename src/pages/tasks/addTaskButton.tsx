import Button from "@/components/common/button";
import Form, { useForm } from "@/components/common/form";
import Modal from "@/components/ui/modal";
import { useEffect, useState } from "react";
import { Form as AntdForm, Col, Radio, Row } from "antd";
import Input from "@/components/common/input";

import "react-quill/dist/quill.snow.css";
import Select from "@/components/ui/select";
import DatePicker from "@/components/common/input/datePicker";
import InputNumber from "@/components/common/input/inputNumber";
import TextEditor from "@/components/common/input/textEditor";
import InventorySelectors from "@/redux/inventory/selectors";
import UserSelectors from "@/redux/user/selectors";
import TaskActions from "@/redux/task/actions";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import FarmSelectors from "@/redux/farm/farmSelectors";
import dayjs from "dayjs";
import { calculateTextSize, categoryOptions } from "./utils";
import { getTranslation } from "@/translation/i18n";
import { FIELD_LEVEL_EXCEPTION } from "@/utilities/errorExceptions";
import InventoryActions from "@/redux/inventory/actions";
import { Inventory } from "../inventory/types";
import { User } from "../userManagement/types";
import { applyErrorsToFields } from "@/utilities/formUtils";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { removeByActionType } from "@/redux/error/errorAction";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import PolyhouseActions from "@/redux/polyhouse/action";

const selectError = makeSelectErrorModel();
const AddTaskButton = () => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerError, setBannerError] = useState<any>(null);
  const [inventoryUnit, setInventoryUnit] = useState<string>("");
  const [selectedAreaType, setSelectedAreaType] = useState<string>("");
  const [selectedPolyhouse, setSelectedPolyhouse] = useState<any>(null);
  const [form] = useForm();
  const inventories = useAppSelector(InventorySelectors.selectInventories);
  const users = useAppSelector(UserSelectors.selectUsers);
  const loading = useAppSelector((state) =>
    requestingSelector(state, [TaskActions.CREATE_TASK])
  );
  const error = useAppSelector((state) =>
    selectError(state, [TaskActions.CREATE_TASK_FINISHED])
  );
  const userOptions = users.map((user: User) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.userId,
  }));
  const inventoryOptions = inventories.map((inventory: Inventory) => ({
    label: inventory.name,
    value: inventory.inventoryId,
  }));
  const currentFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);
  const polyhouses = useAppSelector(
    PolyhouseSelectors.SelectDenormalizePolyhouse
  );
  const polyhouseOptions = polyhouses.map((polyhouse: any) => ({
    label: polyhouse.name,
    value: polyhouse.polyhouseId,
  }));
  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (values.inventoryId)
          values.itemName = inventories.find(
            (inventory: any) => inventory.inventoryId === values.inventoryId
          ).name;
        values.farmId = currentFarmId;
        if (selectedAreaType === "polyhouse") {
          values.taskAreaId = values.polyhouseId;
        }else if (selectedAreaType === "zone") {
          values.taskAreaId = values.zoneId;
        }
        else if (selectedAreaType === "nursery") {
          values.taskAreaId = values.nurseryId;
        }
        dispatch(TaskActions.createTask(values));
      })
      .catch(() => {});
  };

  const onDescriptionChange = (value: string) => {
    const size = calculateTextSize(value);
    if (size > 1048576) {
      form.setFields([
        {
          name: "description",
          value,
          errors: [getTranslation("task.desciption.sizeLimitError")],
        },
      ]);
      return;
    }
    form.setFieldsValue({ description: value });
  };

  const onModalClose = async () => {
    setIsModalOpen(false);
    form.resetFields();
    form.setFieldsValue({
      dueDate: dayjs(new Date().setHours(0, 0, 0, 0)),
      severity: 1,
    });
    if (error) dispatch(removeByActionType(TaskActions.CREATE_TASK_FINISHED));
    setBannerError(null);
  };

  const onInventoryChange = (inventoryId: string) => {
    const inventory = inventories.find(
      (inventory: Inventory) => inventory.inventoryId === inventoryId
    );
    if (inventory) setInventoryUnit(inventory.unit);
  };

  const onTaskAreaTypeChange = (e: any) => {
    setSelectedAreaType(e.target.value);
    form.setFieldsValue({ zoneId: null, nurseryId: null });
  };

  const onPolyHouseChange = (polyhouseId: string) => {
    const polyhouse = polyhouses.find(
      (polyhouse: any) => polyhouse.polyhouseId === polyhouseId
    );
    if (polyhouse) {
      setSelectedPolyhouse(polyhouse);
      form.setFieldsValue({ zoneId: null, nurseryId: null });
      }
  }
  const zoneoptions = selectedPolyhouse?.zones.map((zone: any) => ({
    label: zone.name,
    value: zone.zoneId,
  }));

  const nurseryOptions = selectedPolyhouse?.nurseries.map((nursery: any) => ({
    label: nursery.name,
    value: nursery.nurseryId,
  }));
  useEffect(() => {
    if (!loading && !error && !bannerError) {
      setIsModalOpen(false);
      form.resetFields();
      form.setFieldsValue({
        dueDate: dayjs(new Date().setHours(0, 0, 0, 0)),
        severity: 1,
      });
    } else if (error && error.exception === FIELD_LEVEL_EXCEPTION) {
      applyErrorsToFields(form, error.errors);
    } else if (error) {
      setBannerError(error);
    } else setBannerError(null);
  }, [loading, error]);

  useEffect(() => {
    form.setFieldsValue({
      dueDate: dayjs(new Date().setHours(0, 0, 0, 0)),
      severity: 1,
    });
  }, []);

  useEffect(() => {
    if (currentFarmId) {
      dispatch(InventoryActions.fetchInventories());
      dispatch(PolyhouseActions.fetchPolyhouses(currentFarmId));
    }
  }, [currentFarmId]);

  return (
    <>
      <Button
        label={getTranslation("task.addTask")}
        type="primary"
        style={{ width: "100px" }}
        onClick={() => setIsModalOpen(true)}
      />
      <Modal
        data-testid="add-task-modal"
        destroyOnClose={true}
        style={{ padding: "20px 30px", top: 30 }}
        title={getTranslation("task.addTask")}
        open={isModalOpen}
        onCancel={() => onModalClose()}
        onOk={onSubmit}
        okText={getTranslation("global.add")}
        cancelText={getTranslation("global.cancel")}
        confirmLoading={loading}
        width={1000}
      >
        {bannerError && <FullAlertError error={bannerError} />}
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Input
                name="taskName"
                placeholder={getTranslation("global.namePlaceholder")}
                label={getTranslation("global.name")}
                rules={[
                  {
                    required: true,
                    message: getTranslation("global.nameError"),
                  },
                  {
                    max: 50,
                    message: getTranslation("global.nameLengthError"),
                  },
                ]}
              />
            </Col>
            <Col xs={24} md={12}>
              <AntdForm.Item
                name="category"
                label={getTranslation("global.category")}
                rules={[
                  {
                    required: true,
                    message: getTranslation("global.categoryError"),
                  },
                ]}
              >
                <Select
                  placeholder={getTranslation(
                    "global.categorySelectPlaceholder"
                  )}
                  options={categoryOptions}
                  data-testid="category-select"
                />
              </AntdForm.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <AntdForm.Item
                name="severity"
                label={getTranslation("task.severity")}
              >
                <Radio.Group>
                  <Radio value={0}> {getTranslation("task.urgent")} </Radio>
                  <Radio value={1}> {getTranslation("task.medium")}</Radio>
                  <Radio value={2}> {getTranslation("task.normal")} </Radio>
                </Radio.Group>
              </AntdForm.Item>
            </Col>
            <Col xs={24} md={12}>
              <AntdForm.Item
                name="createdFor"
                label={getTranslation("task.assignee")}
                rules={[
                  {
                    required: true,
                    message: getTranslation("task.assigneeError"),
                  },
                ]}
              >
                <Select
                  placeholder={getTranslation("task.assigneePlaceholder")}
                  options={userOptions}
                  data-testid="assignee-select"
                />
              </AntdForm.Item>
            </Col>
          </Row>
          <AntdForm.Item
            name="description"
            label={getTranslation("global.description")}
          >
            <div data-testid={"description-text-editor"}>
              <TextEditor
                value={form.getFieldValue("description")}
                onChange={onDescriptionChange}
                placeholder={getTranslation("global.descriptionPlaceholder")}
              />
            </div>
          </AntdForm.Item>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <AntdForm.Item
                name="dueDate"
                label={getTranslation("task.dueDate")}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  minDate={dayjs(new Date())}
                />
              </AntdForm.Item>
            </Col>
            <Col xs={24} md={8}>
              <AntdForm.Item
                name="inventoryId"
                label={getTranslation("global.inventory")}
              >
                <Select
                  data-testid="inventory-select"
                  placeholder={getTranslation(
                    "global.inventorySelectPlaceholder"
                  )}
                  options={inventoryOptions}
                  onChange={onInventoryChange}
                />
              </AntdForm.Item>
            </Col>
            <Col xs={24} md={8}>
              <AntdForm.Item
                name="qty"
                label={getTranslation("global.quantity")}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={getTranslation("global.quantityPlaceholder")}
                  suffix={
                    <span
                      style={{
                        marginRight: "30px",
                        borderLeft: "1px solid #d9d9d9",
                        paddingLeft: "10px",
                      }}
                    >
                      {inventoryUnit || "Unit"}
                    </span>
                  }
                />
              </AntdForm.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={10}>
              <AntdForm.Item
                name="taskAreaType"
                label={getTranslation("task.taskAreaType")}
              >
                <Radio.Group onChange={onTaskAreaTypeChange}>
                  <Radio value={"polyhouse"}>
                    {getTranslation("global.polyhouse")}{" "}
                  </Radio>
                  <Radio value={"zone"}> {getTranslation("global.zone")}</Radio>
                  <Radio value={"nursery"}>
                    {getTranslation("global.nursery")}{" "}
                  </Radio>
                </Radio.Group>
              </AntdForm.Item>
            </Col>
            {(selectedAreaType === "polyhouse" ||
              selectedAreaType === "zone" ||
              selectedAreaType === "nursery") && (
                <Col xs={24} md={7}>
                  <AntdForm.Item
                    name="polyhouseId"
                    label={getTranslation("global.polyhouse")}
                    rules={[
                      {
                        required: true,
                        message: getTranslation("task.selectPolyhouseError"),
                      },
                    ]}
                  >
                    <Select
                      data-testid="taskArea-select"
                      placeholder={getTranslation(
                        "task.selectPolyhousePlaceholder"
                      )}
                      options={polyhouseOptions}
                      onChange={onPolyHouseChange}
                    />
                  </AntdForm.Item>
                </Col>
              )}
            {selectedAreaType === "zone" && (
              <Col xs={24} md={7}>
                <AntdForm.Item
                  name="zoneId"
                  label={getTranslation("global.zone")}
                  rules={[
                    {
                      required: true,
                      message: getTranslation("task.selectZoneError"),
                    },
                  ]}
                >
                  <Select
                    data-testid="taskArea-select"
                    placeholder={getTranslation("task.selectZonePlaceholder")}
                    options={zoneoptions}
                  />
                </AntdForm.Item>
              </Col>
            )}
            {selectedAreaType === "nursery" && (
              <Col xs={24} md={7}>
                <AntdForm.Item
                  name="nurseryId"
                  label={getTranslation("global.nursery")}
                  rules={[
                    {
                      required: true,
                      message: getTranslation("task.selectNurseryError"),
                    },
                  ]}
                >
                  <Select
                    data-testid="taskArea-select"
                    placeholder={getTranslation(
                      "task.selectNurseryPlaceholder"
                    )}
                    options={nurseryOptions}
                  />
                </AntdForm.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default AddTaskButton;
