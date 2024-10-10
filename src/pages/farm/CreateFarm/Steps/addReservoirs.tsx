import { useEffect } from "react";
import { Col, Row } from "antd";
import Button from "@/components/common/button";
import Form from "@/components/common/form";
import Input from "@/components/common/input";
import Card from "@/components/ui/card";
import { MdDelete } from "react-icons/md";
import { FARM_REGEX, applyErrorsToFields } from "../const";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FarmActions from "@/redux/farm/action";
import { getTranslation } from "@/translation/i18n";
import { FormInstance } from "antd/lib";
import { useAppSelector } from "@/hooks/redux";

const selectError = makeSelectErrorModel();

interface Reservoir {
  key: number;
}

interface AddReservoirs {
  form: FormInstance;
  reservoirs: Reservoir[];
  setReservoirs: React.Dispatch<React.SetStateAction<Reservoir[]>>;
}

const AddReservoirs = ({ form, reservoirs, setReservoirs }: AddReservoirs) => {
  const error = useAppSelector((state) =>
    selectError(state, FarmActions.ADD_FARM_FINISHED)
  );

  useEffect(() => {
    if (error) applyErrorsToFields(form, error.errors, "reservoirs");
  }, [error]);

  const addReservoir = () => {
    setReservoirs([...reservoirs, { key: reservoirs.length }]);
  };

  const deleteReservoir = (key: number) => {
    setReservoirs(reservoirs.filter((reservoir) => reservoir.key !== key));

    const updatedFields = { ...form.getFieldsValue() };
    Object.keys(updatedFields).forEach((field) => {
      if (field.includes(`_${key}`)) {
        delete updatedFields[field];
      }
    });

    form.resetFields();
    form.setFieldsValue(updatedFields);
  };

  return (
    <div className="addForm">
      <div style={{ width: "150px", marginLeft: "auto" }}>
        <Button
          label={getTranslation("farm.createFarm.addFarm.addReservoir")}
          onClick={addReservoir}
          loading={false}
        />
      </div>
      <div className="reservoir">
        <Form data-testid="reservoir-form" form={form} layout="vertical">
          {reservoirs.map((reservoir, index) => (
            <div key={reservoir.key}>
              <Card
                bordered={false}
                title={`#${index + 1}`}
                style={{ borderRadius: "10px" }}
                extra={
                  <div
                    style={{
                      color: "red",
                      fontSize: "25px",
                      cursor: "pointer",
                    }}
                  >
                    <MdDelete
                      data-testid={`deleteReserviour-${index}`}
                      onClick={() => deleteReservoir(reservoir.key)}
                    />
                  </div>
                }
              >
                <Row gutter={24}>
                  <Col span={24}>
                    <Input
                      label={getTranslation("global.name")}
                      name={`name_${index}`}
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
                      name={`reservoirCapacity_${index}`}
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
                      name={`phReservoirCapacity_${index}`}
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
                      name={`nutrientWaterReservoirCapacity_${index}`}
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
                      name={`stockNutrientSolutionCapacity_${index}`}
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
            </div>
          ))}
        </Form>
      </div>
    </div>
  );
};

export default AddReservoirs;
