import { useState, useEffect } from "react";
import { Col, Row, Form as AntdForm } from "antd";
import Input from "@/components/common/input";
import Button from "@/components/common/button";
import Modal from "@/components/ui/modal";
import NuseryCard from "./nurseryCard";
import Form, { useForm } from "@/components/common/form";
import Select from "@/components/ui/select";
import {
  FARM_REGEX,
  applyErrorsToCardFields,
  nurseryType,
  nurseryGerminationType,
  wateringType,
} from "../const";
import { getTranslation } from "@/translation/i18n";
import { Nursery } from "../../types";
import { errorDetail } from "@/types/error";

interface AddNurseryProps {
  polyhouseKey: number;
  nurseries: Nursery[];
  addNursery: (polyhouseKey: number, newNursery: Nursery) => void;
  updateNurseries: (polyhouseKey: number, updatedNurseries: Nursery[]) => void;
  errors: errorDetail[];
}

const AddNursery = ({
  polyhouseKey,
  nurseries,
  addNursery,
  updateNurseries,
  errors,
}: AddNurseryProps) => {
  const [form] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNursery, setCurrentNursery] = useState<Nursery | null>(null);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setCurrentNursery(null);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newNursery = {
          ...values,
          area: parseFloat(values.area),
          seedCount: parseFloat(values.seedCount),
          germinationArea: parseFloat(values.germinationArea),
          key: currentNursery ? currentNursery.key : nurseries.length,
        };

        if (currentNursery) {
          const updatedNurseries = nurseries.map((nursery: any) =>
            nursery.key === currentNursery.key ? newNursery : nursery
          );
          updateNurseries(polyhouseKey, updatedNurseries);
        } else {
          addNursery(polyhouseKey, newNursery);
        }

        form.resetFields();
        setIsModalOpen(false);
        setCurrentNursery(null);
      })
      .catch(() => {});
  };

  const handleEdit = (nursery: Nursery) => {
    form.setFieldsValue({ ...nursery });
    setCurrentNursery(nursery);
    setIsModalOpen(true);
  };

  const handleDelete = (nurseryKey: string) => {
    const updatedNurseries = nurseries.filter(
      (nursery: any) => nursery.key !== nurseryKey
    );
    updateNurseries(polyhouseKey, updatedNurseries);
  };

  useEffect(() => {
    if (errors && currentNursery) {
      applyErrorsToCardFields(
        form,
        errors,
        String(currentNursery.key),
        "nurseries"
      );
    }
  }, [errors, currentNursery]);

  return (
    <div>
      <div style={{ width: "150px", marginLeft: "auto" }}>
        <Button
          label={getTranslation("farm.createFarm.polyhouse.nursery.addNursery")}
          onClick={() => setIsModalOpen(true)}
          loading={false}
          data-testid="nursery-openModal-button"
        />
      </div>

      <NuseryCard
        nurseries={nurseries}
        onEdit={handleEdit}
        onDelete={handleDelete}
        errors={errors}
      />

      <Modal
        title={
          currentNursery
            ? getTranslation("farm.createFarm.polyhouse.nursery.editNursery")
            : getTranslation("farm.createFarm.polyhouse.nursery.addNursery")
        }
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        onClose={handleCancel}
        okText={
          currentNursery
            ? getTranslation("global.update")
            : getTranslation("global.add")
        }
        className="modal"
      >
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
