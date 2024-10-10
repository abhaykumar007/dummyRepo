import { useEffect } from "react";
import { Col, Row } from "antd";
import Form from "@/components/common/form";
import Input from "@/components/common/input";
import Card from "@/components/ui/card";
import { FARM_REGEX, applyErrorsToFields } from "../../farm/CreateFarm/const";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { getTranslation } from "@/translation/i18n";
import { FormInstance } from "antd/lib";
import ReservoirActions from "@/redux/reservoir/action";
import { useAppSelector } from "@/hooks/redux";

const selectError = makeSelectErrorModel();

interface AddReserviourCard {
  form: FormInstance;
}

const AddReserviourCard = ({ form }: AddReserviourCard) => {
  const error = useAppSelector((state) =>
    selectError(state, ReservoirActions.ADD_RESERVOIR_FINISHED)
  );

  useEffect(() => {
    if (error) applyErrorsToFields(form, error.errors, "reservoirs");
  }, [error]);

  return (
    <div>
      <div>
        <Form data-testid="reservoir-form" form={form} layout="vertical">
          <Card
            className="shadowNone"
            bordered={false}
            title={null}
            style={{ borderRadius: "10px" }}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Input
                  label={getTranslation("global.name")}
                  name={`name`}
                  rules={[
                    {
                      required: true,
                      message: `${getTranslation(
                        "farm.createFarm.addFarm.nameMessage"
                      )}`,
                    },
                  ]}
                  placeholder={getTranslation(
                    "farm.createFarm.addFarm.namePlaceholder"
                  )}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Input
                  label={getTranslation(
                    "farm.createFarm.reservoir.reservoirCapacity"
                  )}
                  name={`reservoirCapacity`}
                  rules={[
                    {
                      required: true,
                      message: `${getTranslation(
                        "farm.createFarm.reservoir.reservoirCapacityMessage"
                      )}`,
                    },
                    {
                      pattern: FARM_REGEX.wholeNumber,
                      message: `${getTranslation(
                        "farm.createFarm.reservoir.reservoirCapacityRegexMessage"
                      )}`,
                    },
                  ]}
                  placeholder={getTranslation(
                    "farm.createFarm.reservoir.reservoirCapacityPlaceholder"
                  )}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Input
                  label={getTranslation(
                    "farm.createFarm.reservoir.phReservoirCapacity"
                  )}
                  name={`phReservoirCapacity`}
                  rules={[
                    {
                      required: true,
                      message: `${getTranslation(
                        "farm.createFarm.reservoir.phReservoirCapacityMessage"
                      )}`,
                    },
                    {
                      pattern: FARM_REGEX.wholeNumber,
                      message: `${getTranslation(
                        "farm.createFarm.reservoir.phReservoirCapacityRegexMessage"
                      )}`,
                    },
                  ]}
                  placeholder={getTranslation(
                    "farm.createFarm.reservoir.phReservoirCapacityPlaceholder"
                  )}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Input
                  label={getTranslation(
                    "farm.createFarm.reservoir.nutrientWaterReservoirCapacity"
                  )}
                  name={`nutrientWaterReservoirCapacity`}
                  rules={[
                    {
                      required: true,
                      message: `${getTranslation(
                        "farm.createFarm.reservoir.nutrientWaterReservoirCapacityMessage"
                      )}`,
                    },
                    {
                      pattern: FARM_REGEX.number,
                      message: `${getTranslation(
                        "farm.createFarm.reservoir.nutrientWaterReservoirCapacityRegexMessage"
                      )}`,
                    },
                  ]}
                  placeholder={getTranslation(
                    "farm.createFarm.reservoir.nutrientWaterReservoirCapacityPlaceholder"
                  )}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Input
                  label={getTranslation(
                    "farm.createFarm.reservoir.stockNutrientSolutionCapacity"
                  )}
                  name={`stockNutrientSolutionCapacity`}
                  rules={[
                    {
                      required: true,
                      message: `${getTranslation(
                        "farm.createFarm.reservoir.stockNutrientSolutionCapacityMessage"
                      )}`,
                    },
                    {
                      pattern: FARM_REGEX.number,
                      message: `${getTranslation(
                        "farm.createFarm.reservoir.stockNutrientSolutionCapacityRegexMessage"
                      )}`,
                    },
                  ]}
                  placeholder={getTranslation(
                    "farm.createFarm.reservoir.stockNutrientSolutionCapacityPlaceholder"
                  )}
                />
              </Col>
            </Row>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default AddReserviourCard;
