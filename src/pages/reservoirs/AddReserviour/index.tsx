import { useEffect, useState } from "react";
import { getTranslation } from "@/translation/i18n";
import Button from "@/components/common/button";
import { removeByActionType } from "@/redux/error/errorAction";
import { Reservoir } from "../../farm/types";
import ReservoirActions from "@/redux/reservoir/action";
import Card from "@/components/ui/card";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import requestingSelector from "@/redux/requesting/requestingSelector";
import routePaths from "@/config/routePaths";
import AddReserviourCard from "./addReserviourCard";
import { successToast } from "@/utilities/toast";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useForm } from "@/components/common/form";

const selectError = makeSelectErrorModel();

const AddReservoir = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = useForm();
  const [isActionDispatched, setIsActionDispatched] = useState(false);

  const loading = useAppSelector((state) =>
    requestingSelector(state, [ReservoirActions.ADD_RESERVOIR])
  );

  const error = useAppSelector((state) =>
    selectError(state, ReservoirActions.ADD_RESERVOIR_FINISHED)
  );

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newReservoir: Reservoir = {
          name: values.name,
          reservoirCapacity: parseFloat(values.reservoirCapacity),
          phReservoirCapacity: parseFloat(values.phReservoirCapacity),
          nutrientWaterReservoirCapacity: parseFloat(
            values.nutrientWaterReservoirCapacity
          ),
          stockNutrientSolutionCapacity: parseFloat(
            values.stockNutrientSolutionCapacity
          ),
        };

        dispatch(ReservoirActions.addReservoir(newReservoir));
        setIsActionDispatched(true);
      })
      .catch(() => {});
  };

  const goBack = () => {
    dispatch(removeByActionType(ReservoirActions.ADD_RESERVOIR_FINISHED));
    navigate(routePaths.reservoirs);
  };

  useEffect(() => {
    if (!loading && isActionDispatched) {
      if (!error) {
        goBack();
        successToast(getTranslation("reservoir.reservoirSuccessfulText"));
      }
    }
  }, [loading, error, isActionDispatched]);

  return (
    <div>
      <Card
        title={getTranslation("farm.createFarm.addFarm.addReservoir")}
        bordered={false}
        className="shadow-box"
        extra={
          <div>
            <IoClose
              className="close-icon"
              data-testid="reservoir-close-icon"
              onClick={goBack}
            />
          </div>
        }
      >
        <AddReserviourCard form={form} />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "200px", display: "flex", gap: "10px" }}>
            <Button
              label={getTranslation("global.cancel")}
              onClick={goBack}
              loading={false}
              type="default"
              data-testid="addRerservoir-cancelButton"
            />
            <Button
              label={getTranslation("global.add")}
              onClick={handleOk}
              loading={loading}
              data-testid="addRerservoir-addButton"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddReservoir;
