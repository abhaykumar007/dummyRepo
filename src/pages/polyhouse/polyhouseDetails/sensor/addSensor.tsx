import Button from "@/components/common/button";
import Form, { useForm } from "@/components/common/form";
import Input from "@/components/common/input";
import { Form as AntdForm, Col, Row, Input as AntdInput, Switch } from "antd";
import { getTranslation } from "@/translation/i18n";
import { DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import PolyhouseActions from "@/redux/polyhouse/action";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import { useEffect } from "react";
import Select from "@/components/ui/select";

interface AddSensorProps {
  zoneId: string;
  setActiveKey: Function;
  sensorArea?: string;
}
const selectError = makeSelectErrorModel();
const sensorReadWriteDataTypeOptions = [
  {
    label: "Integer",
    value: "integer",
  },
  {
    label: "Float",
    value: "float",
  },
  {
    label: "String",
    value: "string",
  },
  {
    label: "Object",
    value: "object",
  },
];
const AddSensor = ({ zoneId, setActiveKey, sensorArea }: AddSensorProps) => {
  const loading = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.ADD_SENSOR])
  );
  const error = useAppSelector((state) =>
    selectError(state, [PolyhouseActions.ADD_SENSOR_FINISHED])
  );
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        values.zoneId = zoneId;
        dispatch(PolyhouseActions.addSensor(values, sensorArea as string));
      })
      .catch((errorInfo) => {
        console.log("Failed:", errorInfo);
      });
  };

  useEffect(() => {
    if (!loading && !error) {
      form.resetFields();
      setActiveKey("2");
    }
  }, [error, loading]);

  useEffect(() => {
    setActiveKey("1");
  }, []);

  return (
    <div>
      {error && <FullAlertError error={error} />}
      <Form
        form={form}
        initialValues={{
          parameters: [{}],
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Input
              label={getTranslation("polyhouse.addSensor.sensorName")}
              placeholder={getTranslation(
                "polyhouse.addSensor.sensorNamePlaceholder"
              )}
              name="sensorComponent"
              rules={[
                {
                  required: true,
                  message: getTranslation(
                    "polyhouse.addSensor.sensorNamePlaceholder"
                  ),
                },
              ]}
            />
          </Col>
          <Col xs={24} md={12}>
            <Input
              label={getTranslation("global.category")}
              placeholder={getTranslation("global.categoryInputPlaceholder")}
              name="category"
              rules={[
                {
                  required: true,
                  message: getTranslation("global.categoryInputError"),
                },
              ]}
            />
          </Col>
        </Row>
        <AntdForm.List name="parameters">
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
                {fields.map((field, index) => (
                  <Row
                    key={field.key}
                    style={{
                      position: "relative",
                      padding: "20px 0px",
                      border: "1px solid #c8c8c8",
                      borderRadius: "10px",
                      marginBottom: "20px",
                    }}
                  >
                    <Col span={24} style={{ padding: "10px 20px" }}>
                      <Row gutter={16}>
                        <Col span={10}>
                          <AntdForm.Item
                            layout="vertical"
                            label={getTranslation("polyhouse.addSensor.label")}
                            {...field}
                            name={[field.name, "uiLabel"]}
                            rules={[
                              {
                                required: true,
                                message: getTranslation(
                                  "polyhouse.addSensor.labelError"
                                ),
                              },
                            ]}
                          >
                            <AntdInput
                              className="common-input"
                              placeholder={getTranslation(
                                "polyhouse.addSensor.labelPlaceholder"
                              )}
                            />
                          </AntdForm.Item>
                        </Col>
                        <Col span={10}>
                          <AntdForm.Item
                            layout="vertical"
                            label={getTranslation("global.description")}
                            {...field}
                            name={[field.name, "description"]}
                          >
                            <AntdInput
                              className="common-input"
                              placeholder={getTranslation(
                                "global.descriptionPlaceholder"
                              )}
                            />
                          </AntdForm.Item>
                        </Col>
                        <Col span={4}>
                          <AntdForm.Item
                            layout="vertical"
                            label={getTranslation(
                              "polyhouse.addSensor.isSchedule"
                            )}
                            {...field}
                            name={[field.name, "isSchedule"]}
                            initialValue={false}
                          >
                            <Switch defaultValue={true} />
                          </AntdForm.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={4}>
                          <AntdForm.Item
                            layout="vertical"
                            label={getTranslation(
                              "polyhouse.addSensor.isWriteable"
                            )}
                            {...field}
                            name={[field.name, "isWriteable"]}
                            initialValue={true}
                          >
                            <Switch defaultValue={true} />
                          </AntdForm.Item>
                        </Col>
                        <Col span={8}>
                          <AntdForm.Item
                            layout="vertical"
                            label={getTranslation(
                              "polyhouse.addSensor.readDataType"
                            )}
                            {...field}
                            name={[field.name, "readDataType"]}
                            rules={[
                              {
                                required: true,
                                message: getTranslation(
                                  "polyhouse.addSensor.readDataTypeError"
                                ),
                              },
                            ]}
                          >
                            <Select
                              placeholder={getTranslation(
                                "polyhouse.addSensor.readDataTypePlaceholder"
                              )}
                              options={sensorReadWriteDataTypeOptions}
                            />
                          </AntdForm.Item>
                        </Col>
                        <Col span={8}>
                          <AntdForm.Item
                            layout="vertical"
                            label={getTranslation(
                              "polyhouse.addSensor.writeDataType"
                            )}
                            {...field}
                            name={[field.name, "writeDataType"]}
                            rules={[
                              {
                                required: true,
                                message: getTranslation(
                                  "polyhouse.addSensor.writeDataTypeError"
                                ),
                              },
                            ]}
                          >
                            <Select
                              placeholder={getTranslation(
                                "polyhouse.addSensor.writeDataTypePlaceholder"
                              )}
                              options={sensorReadWriteDataTypeOptions}
                            />
                          </AntdForm.Item>
                        </Col>
                        <Col span={4}>
                          <AntdForm.Item
                            layout="vertical"
                            label={getTranslation("polyhouse.addSensor.unit")}
                            {...field}
                            name={[field.name, "unit"]}
                            rules={[
                              {
                                required: true,
                                message: getTranslation(
                                  "polyhouse.addSensor.unitError"
                                ),
                              },
                            ]}
                          >
                            <AntdInput
                              className="common-input"
                              placeholder={getTranslation(
                                "polyhouse.addSensor.unitPlaceholder"
                              )}
                            />
                          </AntdForm.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={4}>
                          <AntdForm.Item
                            layout="vertical"
                            label={"Is gragh"}
                            {...field}
                            name={[field.name, "isGraph"]}
                            initialValue={true}
                          >
                            <Switch defaultValue={true} />
                          </AntdForm.Item>
                        </Col>
                        <Col span={7}>
                          <AntdForm.Item
                            layout="vertical"
                            label={getTranslation(
                              "polyhouse.addSensor.minValue"
                            )}
                            {...field}
                            name={[field.name, "minValue"]}
                            rules={[
                              {
                                required: true,
                                message: getTranslation(
                                  "polyhouse.addSensor.minValueError"
                                ),
                              },
                              {
                                validator: async (_, value) => {
                                  if (isNaN(value)) {
                                    return Promise.reject(
                                      getTranslation(
                                        "polyhouse.NotANumberError"
                                      )
                                    );
                                  }
                                },
                              },
                              {
                                validator: async (_, value) => {
                                  if (
                                    parseFloat(value) >=
                                    parseFloat(
                                      form.getFieldValue([
                                        "parameters",
                                        field.name,
                                        "maxValue",
                                      ])
                                    )
                                  ) {
                                    return Promise.reject(
                                      getTranslation(
                                        "polyhouse.addSensor.minValueGreaterThanMaxError"
                                      )
                                    );
                                  }
                                },
                              },
                            ]}
                          >
                            <AntdInput
                              className="common-input"
                              style={{ width: "100%" }}
                              placeholder={getTranslation(
                                "polyhouse.addSensor.minValuePlaceholder"
                              )}
                            />
                          </AntdForm.Item>
                        </Col>
                        <Col span={7}>
                          <AntdForm.Item
                            layout="vertical"
                            label={getTranslation(
                              "polyhouse.addSensor.maxValue"
                            )}
                            {...field}
                            name={[field.name, "maxValue"]}
                            rules={[
                              {
                                required: true,
                                message: getTranslation(
                                  "polyhouse.addSensor.maxValueError"
                                ),
                              },
                              {
                                validator: async (_, value) => {
                                  if (isNaN(value)) {
                                    return Promise.reject(
                                      getTranslation(
                                        "polyhouse.NotANumberError"
                                      )
                                    );
                                  }
                                },
                              },
                              {
                                validator: async (_, value) => {
                                  if (
                                    parseFloat(value) <=
                                    parseFloat(
                                      form.getFieldValue([
                                        "parameters",
                                        field.name,
                                        "minValue",
                                      ])
                                    )
                                  ) {
                                    return Promise.reject(
                                      getTranslation(
                                        "polyhouse.addSensor.maxValueLessThanMinError"
                                      )
                                    );
                                  }
                                },
                              },
                              {},
                            ]}
                          >
                            <AntdInput
                              className="common-input"
                              style={{ width: "100%" }}
                              placeholder={getTranslation(
                                "polyhouse.addSensor.maxValuePlaceholder"
                              )}
                            />
                          </AntdForm.Item>
                        </Col>
                        <Col span={6}>
                          <AntdForm.Item
                            layout="vertical"
                            label={getTranslation(
                              "polyhouse.addSensor.defaultValue"
                            )}
                            {...field}
                            name={[field.name, "defaultValue"]}
                            rules={[
                              {
                                required: true,
                                message: getTranslation(
                                  "polyhouse.addSensor.defaultValueError"
                                ),
                              },
                              {
                                validator: async (_, value) => {
                                  if (isNaN(value)) {
                                    return Promise.reject(
                                      getTranslation(
                                        "polyhouse.NotANumberError"
                                      )
                                    );
                                  }
                                },
                              },
                              {
                                validator: async (_, value) => {
                                  if (
                                    parseFloat(value) <
                                      parseFloat(
                                        form.getFieldValue([
                                          "parameters",
                                          field.name,
                                          "minValue",
                                        ])
                                      ) ||
                                    parseFloat(value) >
                                      parseFloat(
                                        form.getFieldValue([
                                          "parameters",
                                          field.name,
                                          "maxValue",
                                        ])
                                      )
                                  ) {
                                    return Promise.reject(
                                      getTranslation(
                                        "polyhouse.addSensor.defaultValueInBetweenMinMaxError"
                                      )
                                    );
                                  }
                                },
                              },
                            ]}
                          >
                            <AntdInput
                              className="common-input"
                              style={{ width: "100%" }}
                              placeholder={getTranslation(
                                "polyhouse.addSensor.defaultValuePlaceholder"
                              )}
                            />
                          </AntdForm.Item>
                          <AntdForm.Item
                            style={{ display: "none" }}
                            name={[field.name, "visiblity"]}
                            initialValue={"USER"}
                          >
                            <AntdInput />
                          </AntdForm.Item>
                        </Col>
                      </Row>
                    </Col>
                    {index !== 0 && (
                      <Button
                        danger
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(index)}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          cursor: "pointer",
                          width: "20px",
                        }}
                      />
                    )}
                  </Row>
                ))}
              </div>
              <Row gutter={20}>
                <Col span={12}>
                  <Button
                    type="default"
                    label={getTranslation("polyhouse.addSensor.addParmaeter")}
                    onClick={() => {
                      add();
                    }}
                    style={{ marginTop: "5px" }}
                  />
                </Col>
                <Col span={12}>
                  <Button
                    loading={loading}
                    type="primary"
                    label={getTranslation("global.add")}
                    onClick={() => {
                      onSubmit();
                    }}
                    style={{ marginTop: "5px" }}
                  />
                </Col>
              </Row>

              <AntdForm.ErrorList errors={errors} />
            </div>
          )}
        </AntdForm.List>
      </Form>
    </div>
  );
};

export default AddSensor;
