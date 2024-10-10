import DatePicker from "@/components/common/DatePicker";
import Button from "@/components/common/button";
import Form, { useForm } from "@/components/common/form";
import Modal from "@/components/ui/modal";
import Select from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import { DeleteOutlined } from "@ant-design/icons";
import { Form as AntdForm, Modal as AntdModal, Col, Input, Row } from "antd";
import { useEffect, useState } from "react";
import { Sensor } from "../types";
import { BaseOptionType } from "antd/es/select";
import PolyhouseActions from "@/redux/polyhouse/action";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { FIELD_LEVEL_EXCEPTION } from "@/utilities/exceptions";
import { applyErrorsToFields } from "@/utilities/formUtils";
import FullAlertError from "@/components/common/error/FullAlertError";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { getTranslation } from "@/translation/i18n";
import { removeByActionType } from "@/redux/error/errorAction";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { errorModel } from "@/types/error";

dayjs.extend(utc);

interface AddSensorDataModalProps {
  isOpen: boolean;
  setIsOpen: Function;
  sensorArea?: string;
  polyhouse?: Record<string, string>;
}

const { confirm } = AntdModal;

const selectError = makeSelectErrorModel();
const AddSensorDataModal = ({
  isOpen,
  setIsOpen,
  sensorArea,
  polyhouse,
}: AddSensorDataModalProps) => {
  const [form] = useForm();
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [bannerError, setBannerError] = useState<errorModel | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [currentParameter, setCurrentParameter] = useState<string>("");
  let sensors: { [key: string]: Sensor[] };
  switch (sensorArea) {
    case "polyhouse":
      sensors = useAppSelector(PolyhouseSelectors.SelectSensorData);
      break;
    case "zone":
      sensors = useAppSelector(PolyhouseSelectors.SelectSensorZoneData);
      break;
    case "nursery":
      sensors = useAppSelector(PolyhouseSelectors.SelectSensorNurseryData);
      break;
    default:
      sensors = useAppSelector(PolyhouseSelectors.SelectSensorData);
  }

  const loading = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.ADD_SENSOR_DATA])
  );
  const error = useAppSelector((state) =>
    selectError(state, PolyhouseActions.ADD_SENSOR_DATA_FINISHED)
  );
  const dispatch = useAppDispatch();
  const sensorOptions: BaseOptionType[] = [];

  if (sensors)
    Object.keys(sensors).map((sensorName) => {
      sensors[sensorName].map((sensor: Sensor, index: number) => {
        sensorOptions.push({
          label: `${sensorName} ${index + 1}`,
          value: sensor.sensorId,
        });
      });
    });

  const parameterOptions: BaseOptionType[] = [];

  if (selectedSensor) {
    selectedSensor.parameters.map((parameter) => {
      parameterOptions.push({
        label: parameter.parameterId,
        value: parameter.parameterId,
      });
    });
  }
  const onClose = () => {
    form.resetFields();
    setIsOpen(false);
    setSelectedSensor(null);
    setCurrentParameter("");
    setCurrentValue(null);
    dispatch(removeByActionType(PolyhouseActions.ADD_SENSOR_DATA_FINISHED));
    setBannerError(null);
  };

  const onParameterValueChange = (e: any) => {
    setCurrentValue(e.target.value);
  };
  const showConfirm = (sensorId: string) => {
    confirm({
      title: getTranslation("polyhouse.addSensorData.changeSensorWarningTitle"),
      icon: <ExclamationCircleFilled data-testid="sensor-change-warning" />,
      content: getTranslation(
        "polyhouse.addSensorData.changeSensorWarningMessage"
      ),
      onOk() {
        form.resetFields();
        setCurrentParameter("");
        form.setFieldsValue({
          sensorId: sensorId,
        });
        Object.keys(sensors).map((sensorName) => {
          sensors[sensorName].map((sensor: Sensor) => {
            if (sensor.sensorId === sensorId) {
              setSelectedSensor(sensor);
            }
          });
        });
      },
      onCancel() {
        form.setFieldsValue({
          sensorId: selectedSensor?.sensorId,
        });
      },
    });
  };
  const onSensorChange = (sensorId: string) => {
    const parameters = form.getFieldValue("parameters");
    if (selectedSensor && parameters?.length) showConfirm(sensorId);
    else {
      sensors &&
        Object.keys(sensors).map((sensorName) => {
          sensors[sensorName].map((sensor: Sensor) => {
            if (sensor.sensorId === sensorId) {
              setSelectedSensor(sensor);
            }
          });
        });
    }
  };

  const onParameterChange = (parameterId: string) => {
    setCurrentParameter(parameterId);
  };

  const handleKeyDown = (e: any, field: any) => {
    if (e.key === "Tab") {
      e.preventDefault();
      form.setFields([
        {
          name: ["parameters", field.name, "value"],
          value: currentValue,
        },
      ]);
    }
  };

  const onAddRowButtonClick = (add: any, errors: any) => {
    if (!selectedSensor)
      form.setFields([
        {
          name: "sensorId",
          value: form.getFieldValue("sensorId"),
          errors: [getTranslation("polyhouse.addSensorData.selectSensorError")],
        },
      ]);
    else if (!errors.length) {
      add({
        parameterId: currentParameter,
        value: "",
        time: "",
      });
    }
    return;
  };

  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const sensorId = values.sensorId;
        delete values.sensorId;
        const deviceId = selectedSensor?.deviceId;
        delete values.currentParameter;
        values.polyhouse = polyhouse;
        values.parameters.forEach((parameter: any) => {
          if (parameter.time) parameter.time = parameter.time.unix();
        });
        dispatch(
          PolyhouseActions.addSensorData({ data: values, deviceId, sensorId })
        );
      })
      .catch((error) => {
        console.log(error.values.parameters);
      });
  };

  useEffect(() => {
    if (!loading && !error) {
      onClose();
    }
    if (!loading && error) {
      if (error.exception === FIELD_LEVEL_EXCEPTION) {
        applyErrorsToFields(form, error.errors);
      } else setBannerError(error);
    }
  }, [loading, error]);

  return (
    <Modal
      destroyOnClose
      onClose={onClose}
      onCancel={onClose}
      open={isOpen}
      title={getTranslation("polyhouse.addSensorData")}
      width={800}
      onOk={onSubmit}
      okText={getTranslation("global.add")}
      okButtonProps={{ loading: loading }}
      cancelText={getTranslation("global.cancel")}
      className="add-sensor-data-modal"
      data-testid="add-sensor-data-modal"
      style={{ top: 20 }}
    >
      {bannerError && <FullAlertError error={bannerError} />}
      <Form form={form} layout="vertical">
        <Row gutter={16} style={{ marginBottom: "10px" }}>
          <Col span={12}>
            <AntdForm.Item
              label={getTranslation("global.sensor")}
              name={"sensorId"}
              rules={[
                {
                  required: true,
                  message: getTranslation(
                    "polyhouse.addSensorData.selectSensorError"
                  ),
                },
              ]}
            >
              <Select
                placeholder={getTranslation(
                  "polyhouse.addSensorData.selectSensorPlaceholder"
                )}
                data-testid="sensor-select"
                options={sensorOptions}
                onChange={onSensorChange}
              />
            </AntdForm.Item>
          </Col>
        </Row>
        <AntdForm.List
          name="parameters"
          rules={[
            {
              validator: async (_, parameters) => {
                if (parameters.length === 100) {
                  return Promise.reject(
                    getTranslation(
                      "polyhouse.addSensorData.hundredRecordLimitError"
                    )
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <div
              style={{ display: "flex", rowGap: 16, flexDirection: "column" }}
            >
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                {fields.map((field) => (
                  <Row
                    gutter={16}
                    key={field.key}
                    style={{ paddingBottom: "10px" }}
                  >
                    <Col span={6}>
                      <AntdForm.Item
                        layout="vertical"
                        label={
                          field.key === 0
                            ? getTranslation("global.parameter")
                            : null
                        }
                        {...field}
                        name={[field.name, "parameterId"]}
                        rules={[
                          {
                            required: true,
                            message: getTranslation(
                              "polyhouse.addSensorData.selectParameterError"
                            ),
                          },
                        ]}
                      >
                        <Select
                          placeholder={getTranslation(
                            "polyhouse.addSensorData.selectParameterPlaceholder"
                          )}
                          data-testid={`${field.name}-parameter-select`}
                          options={parameterOptions}
                          onChange={onParameterChange}
                        />
                      </AntdForm.Item>
                    </Col>
                    <Col span={8}>
                      <AntdForm.Item
                        {...field}
                        name={[field.name, "value"]}
                        layout="vertical"
                        label={
                          field.key === 0
                            ? getTranslation("global.value")
                            : null
                        }
                        rules={[
                          {
                            required: true,
                            message: getTranslation(
                              "polyhouse.addSensorData.valueError"
                            ),
                          },
                        ]}
                      >
                        <Input
                          placeholder={
                            currentValue
                              ? currentValue.toString()
                              : getTranslation(
                                  "polyhouse.addSensorData.valuePlaceholder"
                                )
                          }
                          onChange={onParameterValueChange}
                          onKeyDown={(e) => handleKeyDown(e, field)}
                          data-testid={`${field.name}-value-input`}
                        />
                      </AntdForm.Item>
                    </Col>
                    <Col span={8} style={{ display: "flex", flexWrap: "wrap" }}>
                      <AntdForm.Item
                        {...field}
                        name={[field.name, "time"]}
                        layout="vertical"
                        label={
                          field.key === 0 ? getTranslation("global.time") : null
                        }
                        rules={[
                          {
                            required: true,
                            message: getTranslation(
                              "polyhouse.addSensorData.timeError"
                            ),
                          },
                        ]}
                      >
                        <DatePicker
                          showTime
                          placeholder="e.g: 2024-08-08 00:00:00"
                          data-testid={`${field.name}-time-input`}
                        />
                      </AntdForm.Item>
                    </Col>
                    <Col span={2} style={{ position: "relative" }}>
                      <Button
                        type="default"
                        onClick={() => remove(field.name)}
                        icon={<DeleteOutlined />}
                        style={{
                          cursor: "pointer",
                          position: "absolute",
                          top: field.key == 0 ? "40%" : "0",
                          width: "60%",
                        }}
                        danger
                        data-testid={`${field.name}-delete-button`}
                      />
                    </Col>
                  </Row>
                ))}
              </div>

              <Button
                type="default"
                label={getTranslation("polyhouse.addSensorData.addRow")}
                onClick={() => {
                  onAddRowButtonClick(add, errors);
                }}
                style={{ marginTop: "5px" }}
              />
              <AntdForm.ErrorList errors={errors} />
            </div>
          )}
        </AntdForm.List>
      </Form>
    </Modal>
  );
};

export default AddSensorDataModal;
