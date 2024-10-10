import { useEffect } from "react";
import { Col, Row, Form as AntdForm } from "antd";
import Form from "@/components/common/form";
import Input from "@/components/common/input";
import Select from "@/components/ui/select";
import { FARM_REGEX, applyErrorsToFields } from "../const";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FarmActions from "@/redux/farm/action";
import { getTranslation } from "@/translation/i18n";
import { FormInstance } from "antd";
import { errorDetail } from "@/types/error";
import { useAppSelector } from "@/hooks/redux";
import AddAddress from "../addAdress";

const selectError = makeSelectErrorModel();

interface AddFarm {
  form: FormInstance;
}

function AddFarm({ form }: AddFarm) {
  const error = useAppSelector((state) =>
    selectError(state, FarmActions.ADD_FARM_FINISHED)
  );

  useEffect(() => {
    if (error) {
      applyErrorsToFields(form, error.errors);
      error.errors.forEach((err: errorDetail) => {
        if (err.location.includes("nutrient.dilutionRatio")) {
          form.setFields([
            {
              name: "nutrientDilutionRatio",
              errors: [err.message || "Please enter valid value"],
              value: form.getFieldValue("nutrientDilutionRatio"),
            },
          ]);
        }
      });
    }
  }, [error]);

  const nutrientType = [
    {
      label: `${getTranslation(
        "farm.createFarm.addFarm.nutrientType2PartMix"
      )}`,
      value: "2 part mix",
    },
    {
      label: `${getTranslation(
        "farm.createFarm.addFarm.nutrientType3PartMix"
      )}`,
      value: "3 part mix",
    },
    {
      label: `${getTranslation(
        "farm.createFarm.addFarm.nutrientTypeCustomNutrientMix"
      )}`,
      value: "Custom nutrient mix",
    },
  ];

  return (
    <div className="addForm">
      <Form data-testid="farm-form" form={form} layout="vertical">
        <Row gutter={24}>
          <Col span={24}>
            <Input
              label={getTranslation("global.name")}
              name="name"
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
              label={getTranslation("farm.createFarm.addFarm.area")}
              name="area"
              rules={[
                {
                  required: true,
                  message: `${getTranslation(
                    "farm.createFarm.addFarm.areaMessage"
                  )}`,
                },
                {
                  pattern: FARM_REGEX.number,
                  message: `${getTranslation(
                    "farm.createFarm.addFarm.areaRegexMessage"
                  )}`,
                },
              ]}
              placeholder={getTranslation(
                "farm.createFarm.addFarm.areaPlaceholder"
              )}
            />
          </Col>
          <Col xs={24} sm={12}>
            <AntdForm.Item
              label={getTranslation("farm.createFarm.addFarm.nutrientType")}
              name="nutrientType"
              rules={[
                {
                  required: true,
                  message: `${getTranslation(
                    "farm.createFarm.addFarm.nutrientTypeMessage"
                  )}`,
                },
              ]}
            >
              <Select
                placeholder={getTranslation(
                  "farm.createFarm.addFarm.nutrientTypePlaceholder"
                )}
                options={nutrientType}
              />
            </AntdForm.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Input
              label={getTranslation("farm.createFarm.addFarm.cultivableArea")}
              name="cultivableArea"
              rules={[
                {
                  required: true,
                  message: `${getTranslation(
                    "farm.createFarm.addFarm.cultivableAreaMessage"
                  )}`,
                },
                {
                  pattern: FARM_REGEX.number,
                  message: `${getTranslation(
                    "farm.createFarm.addFarm.cultivableAreaRegexMessage"
                  )}`,
                },
              ]}
              placeholder={getTranslation(
                "farm.createFarm.addFarm.cultivableAreaPlaceholder"
              )}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Input
              label={getTranslation(
                "farm.createFarm.addFarm.nutrientDilutionRatio"
              )}
              name="nutrientDilutionRatio"
              rules={[
                {
                  required: true,
                  message: `${getTranslation(
                    "farm.createFarm.addFarm.nutrientDilutionRatioMessage"
                  )}`,
                },
                {
                  pattern: FARM_REGEX.ratioValidationRegex,
                  message: `${getTranslation(
                    "farm.createFarm.addFarm.nutrientDilutionRatioRegexMessage"
                  )}`,
                },
              ]}
              placeholder={getTranslation(
                "farm.createFarm.addFarm.nutrientDilutionRatioPlaceholder"
              )}
            />
          </Col>
          <Col span={24}>
            <AddAddress form={form} />
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default AddFarm;
