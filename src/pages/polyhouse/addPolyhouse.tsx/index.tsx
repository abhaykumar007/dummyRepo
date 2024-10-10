import Button from "@/components/common/button";
import { useForm } from "@/components/common/form";
import Card from "@/components/ui/card";
import routePaths from "@/config/routePaths";
import AddPolyhouses from "@/pages/farm/CreateFarm/Steps/addPolyhouses";
import { Nursery, Polyhouse, Zone } from "@/pages/farm/types";
import { removeByActionType } from "@/redux/error/errorAction";
import FarmActions from "@/redux/farm/action";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { getTranslation } from "@/translation/i18n";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import FarmSelectors from "@/redux/farm/farmSelectors";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { successToast } from "@/utilities/toast";
import { FIELD_LEVEL_EXCEPTION } from "@/utilities/errorExceptions";
import FullAlertError from "@/components/common/error/FullAlertError";

const selectError = makeSelectErrorModel();

const AddPolyhouse = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = useForm();

  const [isPolyhouseDispatch, setIsPolyhouseDispatch] = useState(false);

  const [polyhouses, setPolyhouses] = useState([
    { key: 0, zones: [], nurseries: [] },
  ]);

  const error = useAppSelector((state) =>
    selectError(state, FarmActions.ADD_POLYHOUSE_TO_FARM_FINISHED)
  );

  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);

  const selectedFarm = useAppSelector((state) =>
    FarmSelectors.SelectFarmByFarmId(state, selectedFarmId)
  );

  const polyhouseLoading = useAppSelector((state) =>
    requestingSelector(state, [FarmActions.ADD_POLYHOUSE_TO_FARM])
  );

  const polyhouseError = useAppSelector((state) =>
    selectError(state, FarmActions.ADD_POLYHOUSE_TO_FARM_FINISHED)
  );

  const goBack = () => {
    dispatch(removeByActionType(FarmActions.ADD_POLYHOUSE_TO_FARM));
    navigate(routePaths.polyhouse);
  };

  const getPolyhousesData = () => {
    const values = form.getFieldsValue();
    const polyhousesData = polyhouses.map((polyhouse, index) => {
      const polyhouseValues: Record<string, string> | Polyhouse = {
        name: values[`name_${index}`],
        structureExpectedLife: parseFloat(
          values[`structureExpectedLife_${index}`]
        ),
        plasticExpectedLife: parseFloat(values[`plasticExpectedLife_${index}`]),
        zones: polyhouse.zones.map((zone: Zone) => {
          const updatedZone: Zone = { ...zone };
          delete updatedZone.key;
          return updatedZone;
        }),

        nurseries: polyhouse.nurseries.map((nursery: Nursery) => {
          const updatedNursery: Nursery = {
            ...nursery,
          };
          delete updatedNursery.key;
          return updatedNursery;
        }),
      };

      if (
        Array.isArray(polyhouseValues.zones) &&
        polyhouseValues.zones.length === 0
      ) {
        delete polyhouseValues.zones;
      }

      if (
        Array.isArray(polyhouseValues.nurseries) &&
        polyhouseValues.nurseries.length === 0
      ) {
        delete polyhouseValues.nurseries;
      }
      return polyhouseValues;
    });

    return polyhousesData;
  };

  const addPolyHousesToFarm = () => {
    form
      .validateFields()
      .then(() => {
        const payload: Polyhouse[] = getPolyhousesData();
        setIsPolyhouseDispatch(true);
        dispatch(FarmActions.setSelectedFarm(selectedFarm));
        dispatch(FarmActions.addPolyhousesToFarm(payload));
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!polyhouseLoading && isPolyhouseDispatch) {
      if (!error) {
        goBack();
        successToast(getTranslation("polyhouse.successPolyhouse"));
      }
    }
  }, [polyhouseLoading, error, isPolyhouseDispatch]);
  return (
    <div>
      <Card
        title={getTranslation("farm.createFarm.polyhouse.addPolyhouse")}
        bordered={false}
        className="shadow-box"
        extra={
          <div>
            <IoClose className="close-icon" onClick={goBack} />
          </div>
        }
      >
        {polyhouseError &&
          polyhouseError?.exception !== FIELD_LEVEL_EXCEPTION && (
            <FullAlertError error={polyhouseError} />
          )}
        <AddPolyhouses
          form={form}
          polyhouses={polyhouses}
          setPolyhouses={setPolyhouses}
          isAddPolyhouse
        />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "200px", display: "flex", gap: "10px" }}>
            <Button
              label={getTranslation("global.cancel")}
              onClick={goBack}
              loading={false}
              type="default"
            />
            <Button
              label={getTranslation("global.add")}
              onClick={addPolyHousesToFarm}
              loading={polyhouseLoading}
              data-testid="addPolyhouse-addButton"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddPolyhouse;
