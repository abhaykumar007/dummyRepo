import { useEffect, useState } from "react";
import { Steps } from "antd";
import { FaRegUser } from "react-icons/fa";
import { FaTractor } from "react-icons/fa";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FarmActions from "@/redux/farm/action";
import { getTranslation } from "@/translation/i18n";
import { errorDetail } from "@/types/error";
import { FormInstance } from "antd/lib";
import { useAppSelector } from "@/hooks/redux";
import { FIELD_LEVEL_EXCEPTION } from "@/utilities/errorExceptions";

const selectError = makeSelectErrorModel();

interface StepperProps {
  current: number;
  setCurrent: (current: number) => void;
  setFarmValues: any;
  form: FormInstance | any;
}

const Stepper = ({
  current,
  setCurrent,
  setFarmValues,
  form,
}: StepperProps) => {
  const error = useAppSelector((state) =>
    selectError(state, FarmActions.ADD_FARM_FINISHED)
  );

  const [farmColor, setFarmColor] = useState("inherit");
  const [reservoirColor, setReservoirColor] = useState("inherit");

  const changeStep = (index: number) => {
    if (index === 1) {
      form
        .validateFields()
        .then(() => {
          setFarmValues(form.getFieldsValue());
          setCurrent(current + 1);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    let newFarmColor = "inherit";
    let newReservoirColor = "inherit";
    if (error && error?.exception !== FIELD_LEVEL_EXCEPTION) {
      error?.errors?.forEach((err: errorDetail) => {
        if (err.location.includes("reservoirs")) {
          newReservoirColor = "red";
        } else {
          newFarmColor = "red";
        }
      });

      setFarmColor(newFarmColor);
      setReservoirColor(newReservoirColor);
    } else {
      setFarmColor(newFarmColor);
      setReservoirColor(newReservoirColor);
    }
  }, [error]);

  const stepsComponent = (orientation: "horizontal" | "vertical") => (
    <Steps
      current={current}
      onChange={changeStep}
      direction={orientation}
      size="default"
      style={{ height: "100%", width: "100%" }}
      items={[
        {
          title: (
            <span style={{ color: farmColor }}>
              {getTranslation("global.farm")}
            </span>
          ),
          description: (
            <span style={{ color: farmColor }}>
              {getTranslation("farm.createFarm.farmDetails")}
            </span>
          ),
          icon: <FaTractor style={{ color: farmColor }} />,
          disabled: current === 2,
        },
        {
          title: (
            <span style={{ color: reservoirColor }}>
              {getTranslation("global.reservoirs")}
            </span>
          ),
          description: (
            <span style={{ color: reservoirColor }}>
              {getTranslation("farm.createFarm.configureReservoirs")}
            </span>
          ),
          icon: <FaRegUser style={{ color: reservoirColor }} />,
          disabled: current === 2,
        },
        {
          title: getTranslation("global.polyhouses"),
          description: (
            <span>{getTranslation("farm.createFarm.configurePolyhouses")}</span>
          ),
          icon: <FaRegUser />,
          disabled: current === 0 || current === 1,
        },
      ]}
    />
  );

  return (
    <div>
      <div className="stepperVertical">{stepsComponent("vertical")}</div>
      <div className="stepperHorizontal">{stepsComponent("horizontal")}</div>
    </div>
  );
};

export default Stepper;
