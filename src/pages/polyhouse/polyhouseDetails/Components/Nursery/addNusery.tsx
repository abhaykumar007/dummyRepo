import { useState, useEffect } from "react";
import { Col, Row, Form as AntdForm } from "antd";
import Input from "@/components/common/input";
import Button from "@/components/common/button";
import Modal from "@/components/ui/modal";
import Form, { useForm } from "@/components/common/form";
import Select from "@/components/ui/select";
import {
  FARM_REGEX,
  nurseryType,
  nurseryGerminationType,
  wateringType,
  applyErrorsInModal,
} from "../../../../farm/CreateFarm/const";
import { getTranslation } from "@/translation/i18n";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import PolyhouseActions from "@/redux/polyhouse/action";
import { removeByActionType } from "@/redux/error/errorAction";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { FIELD_LEVEL_EXCEPTION } from "@/utilities/errorExceptions";
import FullAlertError from "@/components/common/error/FullAlertError";

const selectError = makeSelectErrorModel();

const AddNursery = () => {
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
    requestingSelector(state, [PolyhouseActions.ADD_NURSERY])
  );

  const error = useAppSelector((state) =>
    selectError(state, PolyhouseActions.ADD_NURSERY_FINISHED)
  );

  useEffect(() => {
    form.resetFields();
    dispatch(removeByActionType(PolyhouseActions.ADD_NURSERY_FINISHED));
    setIsActionDispatched(false);
  }, []);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newNursery = {
          ...values,
          area: parseFloat(values.area),
          seedCount: parseFloat(values.seedCount),
          germinationArea: parseFloat(values.germinationArea),
        };

        dispatch(PolyhouseActions.addNursery(newNursery));
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
          label={getTranslation("farm.createFarm.polyhouse.nursery.addNursery")}
          onClick={() => setIsModalOpen(true)}
          loading={false}
          style={{ padding: "none" }}
          data-testid="polyhouse-addNursery"
        />
      </div>

      <Modal
        title={getTranslation("farm.createFarm.polyhouse.nursery.addNursery")}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        onClose={handleCancel}
        okText={getTranslation("global.add")}
        className="modal"
      >
        {error && error?.exception !== FIELD_LEVEL_EXCEPTION && (
          <FullAlertError error={error} />
        )}
        <Form form={form} layout="vertical" style={{ marginTop: "20px" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Input
                label={getTranslation(
                  "farm.createFarm.polyhouse.nursery.nurseryName"
                )}
                name="name"
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.nursery.nurseryNameMessage"
                    )}`,
                  },
                ]}
                placeholder={getTranslation(
                  "farm.createFarm.polyhouse.nursery.nurseryNamePlaceholder"
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <AntdForm.Item
                label={getTranslation(
                  "farm.createFarm.polyhouse.nursery.nurseryType"
                )}
                name="type"
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.nursery.nurseryTypeMessage"
                    )}`,
                  },
                ]}
              >
                <Select
                  data-testid="nursery-systemType"
                  placeholder={getTranslation(
                    "farm.createFarm.polyhouse.nursery.nurseryTypePlaceholder"
                  )}
                  options={nurseryType}
                />
              </AntdForm.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={getTranslation(
                  "farm.createFarm.polyhouse.nursery.nurseryArea"
                )}
                name="area"
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.nursery.nurseryAreaMessage"
                    )}`,
                  },
                  {
                    pattern: FARM_REGEX.number,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.nursery.nurseryAreaRegexMessage"
                    )}`,
                  },
                ]}
                placeholder={getTranslation(
                  "farm.createFarm.polyhouse.nursery.nurseryAreaPlaceholder"
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <AntdForm.Item
                label={getTranslation(
                  "farm.createFarm.polyhouse.nursery.germinationType"
                )}
                name="germinationType"
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.nursery.germinationTypeMessage"
                    )}`,
                  },
                ]}
              >
                <Select
                  data-testid="nursery-germinationType"
                  placeholder={getTranslation(
                    "farm.createFarm.polyhouse.nursery.germinationTypePlaceholder"
                  )}
                  options={nurseryGerminationType}
                />
              </AntdForm.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={getTranslation(
                  "farm.createFarm.polyhouse.nursery.germinationArea"
                )}
                name="germinationArea"
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.nursery.germinationAreaMessage"
                    )}`,
                  },
                  {
                    pattern: FARM_REGEX.number,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.nursery.germinationAreaRegexMessage"
                    )}`,
                  },
                ]}
                placeholder={getTranslation(
                  "farm.createFarm.polyhouse.nursery.germinationAreaPlaceholder"
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={getTranslation(
                  "farm.createFarm.polyhouse.nursery.seedCount"
                )}
                name="seedCount"
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.nursery.seedCountMessage"
                    )}`,
                  },
                  {
                    pattern: FARM_REGEX.number,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.nursery.seedCountRegexMessage"
                    )}`,
                  },
                ]}
                placeholder={getTranslation(
                  "farm.createFarm.polyhouse.nursery.seedCountPlaceholder"
                )}
              />
            </Col>
            <Col xs={24} sm={12}>
              <AntdForm.Item
                label={getTranslation(
                  "farm.createFarm.polyhouse.nursery.wateringType"
                )}
                name={`wateringType`}
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.nursery.wateringTypeMessage"
                    )}`,
                  },
                ]}
              >
                <Select
                  data-testid="nursery-wateringType"
                  placeholder={getTranslation(
                    "farm.createFarm.polyhouse.nursery.wateringTypePlaceholder"
                  )}
                  options={wateringType}
                />
              </AntdForm.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Input
                label={getTranslation(
                  "farm.createFarm.polyhouse.nursery.wateringSchedule"
                )}
                name="wateringSchedule"
                rules={[
                  {
                    required: true,
                    message: `${getTranslation(
                      "farm.createFarm.polyhouse.nursery.wateringScheduleMessage"
                    )}`,
                  },
                ]}
                placeholder={getTranslation(
                  "farm.createFarm.polyhouse.nursery.wateringSchedulePlaceholder"
                )}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddNursery;
