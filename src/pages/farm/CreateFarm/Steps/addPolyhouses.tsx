import { useEffect } from "react";
import { Col, Row, Tabs } from "antd";
import Button from "@/components/common/button";
import Form from "@/components/common/form";
import Input from "@/components/common/input";
import Card from "@/components/ui/card";
import { MdDelete } from "react-icons/md";
import AddZones from "./addZones";
import AddNursery from "./addNursery";
import { FARM_REGEX, applyErrorsToFields } from "../const";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FarmActions from "@/redux/farm/action";
import { getTranslation } from "@/translation/i18n";
import { FormInstance } from "antd/lib";
import { Nursery, Zone } from "../../types";
import { errorDetail } from "@/types/error";
import { useAppSelector } from "@/hooks/redux";

const selectError = makeSelectErrorModel();

interface PolyhouseProp {
  key: number;
  zones: Zone[];
  nurseries: Nursery[];
}
interface AddPolyhousesProp {
  form: FormInstance;
  polyhouses: PolyhouseProp[];
  setPolyhouses: any;
  isAddPolyhouse?: boolean;
}

const AddPolyhouses = ({
  form,
  polyhouses,
  setPolyhouses,
  isAddPolyhouse,
}: AddPolyhousesProp) => {
  const error = useAppSelector((state) =>
    selectError(state, FarmActions.ADD_POLYHOUSE_TO_FARM_FINISHED)
  );

  const hasZoneErrors = (key: number) =>
    error?.errors?.some((err: errorDetail) =>
      err.location.includes(`zones.${key}`)
    );

  const hasNursaryErrors = (key: number) =>
    error?.errors?.some((err: errorDetail) =>
      err.location.includes(`nurseries.${key}`)
    );

  useEffect(() => {
    if (error) applyErrorsToFields(form, error.errors);
  }, [error]);
  const addPolyhouse = () => {
    setPolyhouses([
      ...polyhouses,
      { key: polyhouses.length, zones: [], nurseries: [] },
    ]);
  };

  const deletePolyhouse = (key: number) => {
    setPolyhouses(polyhouses.filter((polyhouse) => polyhouse.key !== key));

    const updatedFields = { ...form.getFieldsValue() };
    Object.keys(updatedFields).forEach((field) => {
      if (field.includes(`_${key}`)) {
        delete updatedFields[field];
      }
    });
    form.resetFields();
    form.setFieldsValue(updatedFields);
  };

  const addZoneToPolyhouse = (polyhouseKey: number, newZone: Zone) => {
    setPolyhouses(
      polyhouses.map((polyhouse: any) => {
        if (polyhouse.key === polyhouseKey) {
          return { ...polyhouse, zones: [...polyhouse.zones, newZone] };
        }
        return polyhouse;
      })
    );
  };

  const addNurseryToPolyhouse = (polyhouseKey: number, newNursery: Nursery) => {
    setPolyhouses(
      polyhouses.map((polyhouse: any) => {
        if (polyhouse.key === polyhouseKey) {
          return {
            ...polyhouse,
            nurseries: [...polyhouse.nurseries, newNursery],
          };
        }
        return polyhouse;
      })
    );
  };

  const updateZonesInPolyhouse = (
    polyhouseKey: number,
    updatedZones: Zone[]
  ) => {
    const updatedPolyhouse = polyhouses.map((polyhouse) => {
      if (polyhouse.key === polyhouseKey) {
        return { ...polyhouse, zones: updatedZones };
      }
      return polyhouse;
    });
    setPolyhouses(updatedPolyhouse);
  };

  const updateNurseryInPolyhouse = (
    polyhouseKey: number,
    updatedNurseries: Nursery[]
  ) => {
    const updatedPolyhouse = polyhouses.map((polyhouse) => {
      if (polyhouse.key === polyhouseKey) {
        return { ...polyhouse, nurseries: updatedNurseries };
      }
      return polyhouse;
    });
    setPolyhouses(updatedPolyhouse);
  };

  return (
    <div className="addForm">
      {!isAddPolyhouse && (
        <div style={{ width: "150px", marginLeft: "auto" }}>
          <Button
            label={getTranslation("farm.createFarm.polyhouse.addPolyhouse")}
            onClick={addPolyhouse}
            loading={false}
          />
        </div>
      )}
      <div
        className="reservoir"
        style={{ height: isAddPolyhouse ? "calc(100vh - 250px)" : "" }}
      >
        <Form data-testid="polyhouse-form" form={form} layout="vertical">
          {polyhouses.map((polyhouse, index) => (
            <div key={polyhouse.key}>
              <Card
                bordered={false}
                className="shadowNone"
                title={!isAddPolyhouse ? `#${index + 1}` : null}
                style={{
                  borderRadius: "10px",
                }}
                extra={
                  !isAddPolyhouse && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "25px",
                        cursor: "pointer",
                      }}
                    >
                      <MdDelete
                        data-testid={`deletePolyhouse-${index}`}
                        onClick={() => deletePolyhouse(polyhouse.key)}
                      />
                    </div>
                  )
                }
              >
                <Row gutter={24}>
                  <Col span={24}>
                    <Input
                      label={getTranslation("farm.createFarm.polyhouse.name")}
                      name={`name_${index}`}
                      rules={[
                        {
                          required: true,
                          message: `${getTranslation(
                            "farm.createFarm.polyhouse.nameMessage"
                          )}`,
                        },
                      ]}
                      placeholder={getTranslation(
                        "farm.createFarm.polyhouse.namePlaceholder"
                      )}
                    />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Input
                      label={getTranslation(
                        "farm.createFarm.polyhouse.structureExpectedLife"
                      )}
                      name={`structureExpectedLife_${index}`}
                      rules={[
                        {
                          required: true,
                          message: `${getTranslation(
                            "farm.createFarm.polyhouse.structureExpectedLifeMessage"
                          )}`,
                        },
                        {
                          pattern: FARM_REGEX.number,
                          message: `${getTranslation(
                            "farm.createFarm.polyhouse.structureExpectedLifeRegexMessage"
                          )}`,
                        },
                      ]}
                      placeholder={getTranslation(
                        "farm.createFarm.polyhouse.structureExpectedLifePlaceholder"
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <Input
                      label={getTranslation(
                        "farm.createFarm.polyhouse.plasticExpectedLife"
                      )}
                      name={`plasticExpectedLife_${index}`}
                      rules={[
                        {
                          required: true,
                          message: `${getTranslation(
                            "farm.createFarm.polyhouse.plasticExpectedLifeMessage"
                          )}`,
                        },
                        {
                          pattern: FARM_REGEX.number,
                          message: `${getTranslation(
                            "farm.createFarm.polyhouse.plasticExpectedLifeRegexMessage"
                          )}`,
                        },
                      ]}
                      placeholder={getTranslation(
                        "farm.createFarm.polyhouse.plasticExpectedLifePlaceholder"
                      )}
                    />
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={24}>
                    <Tabs
                      defaultActiveKey="1"
                      items={[
                        {
                          key: "1",
                          label: (
                            <div
                              style={{
                                color: hasZoneErrors(index) ? "red" : "inherit",
                              }}
                            >
                              {getTranslation(
                                "farm.createFarm.polyhouse.configureZones"
                              )}
                            </div>
                          ),
                          children: (
                            <AddZones
                              polyhouseKey={polyhouse.key}
                              zones={polyhouse.zones}
                              addZone={addZoneToPolyhouse}
                              updateZones={updateZonesInPolyhouse}
                              errors={error ? error.errors : []}
                            />
                          ),
                        },
                        {
                          key: "2",
                          label: (
                            <div
                              data-testid={`nusery-configureNurseries-${index}`}
                              style={{
                                color: hasNursaryErrors(index)
                                  ? "red"
                                  : "inherit",
                              }}
                            >
                              {getTranslation(
                                "farm.createFarm.polyhouse.configureNurseries"
                              )}
                            </div>
                          ),
                          children: (
                            <AddNursery
                              polyhouseKey={polyhouse.key}
                              nurseries={polyhouse.nurseries}
                              addNursery={addNurseryToPolyhouse}
                              updateNurseries={updateNurseryInPolyhouse}
                              errors={error ? error.errors : []}
                            />
                          ),
                        },
                      ]}
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

export default AddPolyhouses;
