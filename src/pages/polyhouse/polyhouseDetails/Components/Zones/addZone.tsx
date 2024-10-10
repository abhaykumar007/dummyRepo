import { useEffect, useState } from "react";
import { Col, Row, Form as AntdForm } from "antd";
import Input from "@/components/common/input";
import Modal from "@/components/ui/modal";
import Form, { useForm } from "@/components/common/form";
import Select from "@/components/ui/select";
import {
  FARM_REGEX,
  wateringType,
  zoneSystemType,
  applyErrorsInModal,
} from "../../../../farm/CreateFarm/const";
import { getTranslation } from "@/translation/i18n";
import { Zone } from "../../../../farm/types";
import Button from "@/components/common/button";
import PolyhouseActions from "@/redux/polyhouse/action";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { removeByActionType } from "@/redux/error/errorAction";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { FIELD_LEVEL_EXCEPTION } from "@/utilities/errorExceptions";
import FullAlertError from "@/components/common/error/FullAlertError";

const selectError = makeSelectErrorModel();

const AddZone = () => {
  const dispatch = useAppDispatch();
  const [form] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionDispatched, setIsActionDispatched] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setIsActionDispatched(false);
  };

  const loading = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.ADD_ZONE])
  );

  const error = useAppSelector((state) =>
    selectError(state, PolyhouseActions.ADD_ZONE_FINISHED)
  );

  useEffect(() => {
    form.resetFields();
    dispatch(removeByActionType(PolyhouseActions.ADD_ZONE_FINISHED));
    setIsActionDispatched(false);
  }, []);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newZone: Zone = {
          name: values.name,
          systemType: values.systemType,
          area: parseFloat(values.area),
          growingArea: {
            area: parseFloat(values[`growingArea.area`]),
            rowCount: parseFloat(values[`growingArea.rowCount`]),
            plantCountPerRow: parseFloat(
              values[`growingArea.plantCountPerRow`]
            ),
            plantSpacing: parseFloat(values[`growingArea.plantSpacing`]),
            rowSpacing: parseFloat(values[`growingArea.rowSpacing`]),
            wateringType: values[`growingArea.wateringType`],
            wateringSchedule: values[`growingArea.wateringSchedule`],
          },
        };

        dispatch(PolyhouseActions.addZone(newZone));
        setIsActionDispatched(true);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (error && isModalOpen) {
      applyErrorsInModal(form, error.errors);
    }
  }, [error, isModalOpen]);

  useEffect(() => {
    if (!loading && !error && isActionDispatched) {
      setIsModalOpen(false);
    }
  }, [loading, error, isActionDispatched]);

  return (
    <div>
      <div>
        <Button
          label={getTranslation("farm.createFarm.polyhouse.zone.addZone")}
          onClick={() => {
            setIsModalOpen(true);
          }}
          style={{ padding: "none" }}
          loading={false}
          data-testid="polyhouse-addZone"
        />
      </div>
      <Modal
        title={`${getTranslation("farm.createFarm.polyhouse.zone.addZone")}`}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        okText={`${getTranslation("global.add")}`}
        onClose={handleCancel}
        className="modal"
      >
        {error && error?.exception !== FIELD_LEVEL_EXCEPTION && (
          <FullAlertError error={error} />
        )}
        <Form form={form} layout="vertical" style={{ marginTop: "20px" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Input
                label={getTranslation("farm.createFarm.polyhouse.zone.name")}
                name={`name`}
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.nameMessage"
                    )}`,
                  },
                ]}
                placeholder={getTranslation(
                  "farm.createFarm.polyhouse.zone.namePlaceholder"
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <AntdForm.Item
                label={getTranslation(
                  "farm.createFarm.polyhouse.zone.systemType"
                )}
                name={`systemType`}
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.systemTypeMessage"
                    )}`,
                  },
                ]}
              >
                <Select
                  data-testid="zone-systemType"
                  placeholder={getTranslation(
                    "farm.createFarm.polyhouse.zone.systemTypePlaceholder"
                  )}
                  options={zoneSystemType}
                />
              </AntdForm.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={getTranslation(
                  "farm.createFarm.polyhouse.zone.zoneArea"
                )}
                name={`area`}
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.zoneAreaMessage"
                    )}`,
                  },
                  {
                    pattern: FARM_REGEX.number,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.zoneAreaRegexMessage"
                    )}`,
                  },
                ]}
                placeholder={getTranslation(
                  "farm.createFarm.polyhouse.zone.zoneAreaPlaceholder"
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={getTranslation(
                  "farm.createFarm.polyhouse.zone.growArea"
                )}
                name={`growingArea.area`}
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.growAreaMessage"
                    )}`,
                  },
                  {
                    pattern: FARM_REGEX.number,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.growAreaRegexMessage"
                    )}`,
                  },
                ]}
                placeholder={getTranslation(
                  "farm.createFarm.polyhouse.zone.growAreaPlaceholder"
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={getTranslation(
                  "farm.createFarm.polyhouse.zone.rowCount"
                )}
                name={`growingArea.rowCount`}
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.rowCountMessage"
                    )}`,
                  },
                  {
                    pattern: FARM_REGEX.number,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.rowCountRegexMessage"
                    )}`,
                  },
                ]}
                placeholder={getTranslation(
                  "farm.createFarm.polyhouse.zone.rowCountPlaceholder"
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={getTranslation(
                  "farm.createFarm.polyhouse.zone.rowSpacing"
                )}
                name={`growingArea.rowSpacing`}
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.rowSpacingMessage"
                    )}`,
                  },
                  {
                    pattern: FARM_REGEX.number,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.rowSpacingRegexMessage"
                    )}`,
                  },
                ]}
                placeholder={getTranslation(
                  "farm.createFarm.polyhouse.zone.rowSpacingPlaceholder"
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={getTranslation(
                  "farm.createFarm.polyhouse.zone.plantSpacing"
                )}
                name={`growingArea.plantSpacing`}
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.plantSpacingMessage"
                    )}`,
                  },
                  {
                    pattern: FARM_REGEX.number,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.plantSpacingRegexMessage"
                    )}`,
                  },
                ]}
                placeholder={getTranslation(
                  "farm.createFarm.polyhouse.zone.plantSpacingPlaceholder"
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={getTranslation(
                  "farm.createFarm.polyhouse.zone.plantCountPerRow"
                )}
                name={`growingArea.plantCountPerRow`}
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.plantCountPerRowMessage"
                    )}`,
                  },
                  {
                    pattern: FARM_REGEX.number,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.plantCountPerRowRegexMessage"
                    )}`,
                  },
                ]}
                placeholder={getTranslation(
                  "farm.createFarm.polyhouse.zone.plantCountPerRowPlaceholder"
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <AntdForm.Item
                label={getTranslation(
                  "farm.createFarm.polyhouse.zone.wateringType"
                )}
                name={`growingArea.wateringType`}
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.wateringTypeMessage"
                    )}`,
                  },
                ]}
              >
                <Select
                  placeholder={getTranslation(
                    "farm.createFarm.polyhouse.zone.wateringTypePlaceholder"
                  )}
                  data-testid="zone-wateringType"
                  options={wateringType}
                />
              </AntdForm.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={getTranslation(
                  "farm.createFarm.polyhouse.zone.wateringSchedule"
                )}
                name={`growingArea.wateringSchedule`}
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.zone.wateringScheduleMessage"
                    )}`,
                  },
                ]}
                placeholder={getTranslation(
                  "farm.createFarm.polyhouse.zone.wateringSchedulePlaceholder"
                )}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddZone;
