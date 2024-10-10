import { useEffect, useState } from "react";
import "./style.scss";
import Stepper from "./stepper";
import { stepper, stepperNames } from "./const";
import AddFarm from "./Steps/addFarm";
import AddReservoirs from "./Steps/addReservoirs";
import AddPolyhouses from "./Steps/addPolyhouses";
import StepperNavigation from "./stepperNavigation";
import Card from "@/components/ui/card";
import { useForm } from "@/components/common/form";
import { getTranslation } from "@/translation/i18n";
import { removeByActionType } from "@/redux/error/errorAction";
import FarmActions from "@/redux/farm/action";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { FIELD_LEVEL_EXCEPTION } from "@/utilities/errorExceptions";
import FullAlertError from "@/components/common/error/FullAlertError";

const selectError = makeSelectErrorModel();

const CreateFarm = () => {
  const dispatch = useAppDispatch();
  const [form] = useForm();
  const [reservoirForm] = useForm();
  const [reservoirs, setReservoirs] = useState([{ key: 0 }]);
  const [polyhouses, setPolyhouses] = useState([
    { key: 0, zones: [], nurseries: [] },
  ]);
  const [current, setCurrent] = useState(0);
  const [farmValues, setFarmValues] = useState(null);

  const error = useAppSelector((state) =>
    selectError(state, FarmActions.ADD_FARM_FINISHED)
  );

  const polyhouseError = useAppSelector((state) =>
    selectError(state, FarmActions.ADD_POLYHOUSE_TO_FARM_FINISHED)
  );

  useEffect(() => {
    dispatch(removeByActionType(FarmActions.ADD_FARM_FINISHED));
    dispatch(removeByActionType(FarmActions.ADD_POLYHOUSE_TO_FARM_FINISHED));
  }, []);

  return (
    <div>
      <Card
        bordered={false}
        title={`${getTranslation("farm.farmCreation")}`}
        style={{
          borderRadius: "10px",
          marginRight: "20px",
        }}
      >
        {error && error?.exception !== FIELD_LEVEL_EXCEPTION && (
          <FullAlertError error={error} />
        )}
        {polyhouseError &&
          polyhouseError?.exception !== FIELD_LEVEL_EXCEPTION && (
            <FullAlertError error={polyhouseError} />
          )}
        <div className="createForm">
          <div className="stepper">
            <Stepper
              current={current}
              setCurrent={setCurrent}
              form={form}
              setFarmValues={setFarmValues}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {
              {
                [stepper[stepperNames.FARM_CREATION]]: <AddFarm form={form} />,
                [stepper[stepperNames.RESERVOIRS]]: (
                  <AddReservoirs
                    form={reservoirForm}
                    reservoirs={reservoirs}
                    setReservoirs={setReservoirs}
                  />
                ),
                [stepper[stepperNames.POLYHOUSES]]: (
                  <AddPolyhouses
                    form={form}
                    polyhouses={polyhouses}
                    setPolyhouses={setPolyhouses}
                  />
                ),
              }[current]
            }

            <StepperNavigation
              current={current}
              setCurrent={setCurrent}
              form={form}
              reservoirs={reservoirs}
              polyhouses={polyhouses}
              reservoirForm={reservoirForm}
              farmValues={farmValues}
              setFarmValues={setFarmValues}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateFarm;
