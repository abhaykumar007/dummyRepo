import Button from "@/components/common/button";
import routePaths from "@/config/routePaths";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { stepper, stepperNames } from "./const";
import FarmActions from "@/redux/farm/action";
import { getTranslation } from "@/translation/i18n";
import { FormInstance } from "antd";
import { Farm, Nursery, Polyhouse, Reservoir, Zone } from "../types";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { successToast } from "@/utilities/toast";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { removeByActionType } from "@/redux/error/errorAction";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const selectError = makeSelectErrorModel();

interface ButtonProps {
  label: string;
  onClick: () => void;
  loading: boolean;
  type?: "default" | "link" | "text" | "primary" | "dashed" | undefined;
}

interface ActionButtonsProps {
  buttons: ButtonProps[];
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ buttons }) => (
  <div style={{ width: "30%", display: "flex", gap: "10px" }}>
    {buttons.map(({ label, onClick, loading, type }) => (
      <Button
        key={label}
        label={label}
        onClick={onClick}
        loading={loading}
        type={type || "primary"}
      />
    ))}
  </div>
);

interface StepActionsProps {
  current: number;
  stepper: { [key: string]: number };
  stepperNames: { [key: string]: string };
  actions: {
    farmCreation: ButtonProps[];
    reservoirs: ButtonProps[];
    polyhouses: ButtonProps[];
  };
}

const StepActions: React.FC<StepActionsProps> = ({
  current,
  stepper,
  stepperNames,
  actions,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "10px",
    }}
  >
    {current === stepper[stepperNames.FARM_CREATION] && (
      <ActionButtons buttons={actions.farmCreation} />
    )}
    {current === stepper[stepperNames.RESERVOIRS] && (
      <ActionButtons buttons={actions.reservoirs} />
    )}
    {current === stepper[stepperNames.POLYHOUSES] && (
      <ActionButtons buttons={actions.polyhouses} />
    )}
  </div>
);

interface stepperNavigationProps {
  current: number;
  setCurrent: (current: number) => void;
  form: FormInstance | any;
  reservoirForm: FormInstance | any;
  reservoirs: { key: number }[];
  polyhouses: { key: number; zones?: Zone[]; nurseries?: Nursery[] }[];
  farmValues: any;
  setFarmValues: any;
}

const StepperNavigation = ({
  current,
  setCurrent,
  form,
  reservoirs,
  polyhouses,
  reservoirForm,
  setFarmValues,
  farmValues,
}: stepperNavigationProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isFarmCreationDispatch, setIsFarmCreationDispatch] = useState(false);
  const [isPolyhouseDispatch, setIsPolyhouseDispatch] = useState(false);

  const farmCreationError = useAppSelector((state) =>
    selectError(state, FarmActions.ADD_FARM_FINISHED)
  );

  const polyhouseError = useAppSelector((state) =>
    selectError(state, FarmActions.ADD_POLYHOUSE_TO_FARM_FINISHED)
  );

  const farmLoading = useAppSelector((state) =>
    requestingSelector(state, [FarmActions.ADD_FARM])
  );

  const polyhouseLoading = useAppSelector((state) =>
    requestingSelector(state, [FarmActions.ADD_POLYHOUSE_TO_FARM])
  );

  useEffect(() => {
    if (!farmLoading && isFarmCreationDispatch) {
      if (!farmCreationError) {
        dispatch(removeByActionType(FarmActions.ADD_FARM_FINISHED));
        setCurrent(current + 1);
      }
    }
  }, [farmLoading, farmCreationError, isFarmCreationDispatch]);

  useEffect(() => {
    if (!polyhouseLoading && isPolyhouseDispatch) {
      if (!polyhouseError) {
        successToast(getTranslation("polyhouse.successPolyhouse"));
        dispatch(
          removeByActionType(FarmActions.ADD_POLYHOUSE_TO_FARM_FINISHED)
        );
        navigate(routePaths.farm);
      }
    }
  }, [polyhouseLoading, polyhouseError, isPolyhouseDispatch]);

  const nextStep = () => {
    form
      .validateFields()
      .then(() => {
        setFarmValues(form.getFieldsValue());
        setCurrent(current + 1);
      })
      .catch(() => {});
  };
  const previousStep = () => setCurrent(current - 1);

  const goBack = () => {
    dispatch(removeByActionType(FarmActions.ADD_FARM_FINISHED));
    navigate(routePaths.farm);
  };

  const getReservoirsData = () => {
    const values = reservoirForm.getFieldsValue();
    const reservoirsData: (Record<string, string> | null | Reservoir)[] =
      reservoirs.map((_, index) => {
        const reservoirValues = {
          name: values[`name_${index}`],
          reservoirCapacity: parseFloat(values[`reservoirCapacity_${index}`]),
          phReservoirCapacity: parseFloat(
            values[`phReservoirCapacity_${index}`]
          ),
          nutrientWaterReservoirCapacity: parseFloat(
            values[`nutrientWaterReservoirCapacity_${index}`]
          ),
          stockNutrientSolutionCapacity: parseFloat(
            values[`stockNutrientSolutionCapacity_${index}`]
          ),
        };

        const filteredValues = Object.fromEntries(
          Object.entries(reservoirValues).filter(
            ([key, value]) =>
              key === "name" || (!isNaN(value) && value !== undefined)
          )
        );

        const allNumericValuesUndefinedOrNaN = Object.entries(reservoirValues)
          .filter(([key]) => key !== "name")
          .every(([_, value]) => isNaN(value) || value === undefined);

        if (allNumericValuesUndefinedOrNaN && !filteredValues.name) {
          return null;
        }

        return filteredValues;
      });

    const validReservoirsData = reservoirsData.filter(
      (reservoir) => reservoir !== null
    );

    if (validReservoirsData.length === 0) {
      return Promise.resolve([]);
    } else {
      return reservoirForm
        .validateFields()
        .then(() => validReservoirsData)
        .catch(() => {
          throw new Error(getTranslation("farm.reserviour.errorValidation"));
        });
    }
  };

  const getFarmData = async () => {
    const { nutrientType, nutrientDilutionRatio, ...remainingFields } =
      farmValues;
    const [numerator, denominator] = nutrientDilutionRatio
      .split(":")
      .map(Number);
    const reservoirs = await getReservoirsData();

    const farmPayload = {
      name: remainingFields?.name,
      type: remainingFields?.type,
      nutrient: {
        type: nutrientType,
        dilutionRatio: {
          numerator: parseInt(numerator),
          denominator: parseInt(denominator),
        },
      },
      area: parseFloat(remainingFields?.area),
      cultivableArea: parseFloat(remainingFields?.cultivableArea),
      location: {
        address: remainingFields?.address,
        lat: remainingFields?.lat,
        long: remainingFields?.long,
      },
    };

    return reservoirs.length === 0
      ? farmPayload
      : { ...farmPayload, reservoirs };
  };

  const farmCreate = () => {
    form
      .validateFields()
      .then(() => {
        getFarmData()
          .then((payload: { [k: string]: any } | Farm) => {
            dispatch(FarmActions.addFarm(payload));
            setIsFarmCreationDispatch(true);
          })
          .catch(() => {});
      })
      .catch(() => {});
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
        zones: polyhouse.zones
          ? polyhouse.zones.map((zone) => {
              const updatedZone: Record<string, string> | Zone = { ...zone };
              delete updatedZone.key;
              return updatedZone;
            })
          : [],
        nurseries: polyhouse.nurseries
          ? polyhouse.nurseries.map((nursery) => {
              const updatedNursery: Record<string, string> | Nursery = {
                ...nursery,
              };
              delete updatedNursery.key;
              return updatedNursery;
            })
          : [],
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
        dispatch(FarmActions.addPolyhousesToFarm(payload));
        setIsPolyhouseDispatch(true);
      })
      .catch(() => {});
  };

  const actions: {
    farmCreation: ButtonProps[];
    reservoirs: ButtonProps[];
    polyhouses: ButtonProps[];
  } = {
    farmCreation: [
      {
        label: getTranslation("global.cancel"),
        onClick: goBack,
        loading: false,
        type: "default",
      },
      {
        label: getTranslation("global.next"),
        onClick: nextStep,
        loading: false,
        type: "primary",
      },
    ],
    reservoirs: [
      {
        label: getTranslation("global.back"),
        onClick: previousStep,
        loading: false,
        type: "default",
      },
      {
        label: getTranslation("global.create"),
        onClick: farmCreate,
        loading: farmLoading,
        type: "primary",
      },
    ],
    polyhouses: [
      {
        label: getTranslation("global.cancel"),
        onClick: goBack,
        loading: false,
        type: "default",
      },
      {
        label: getTranslation("global.add"),
        onClick: addPolyHousesToFarm,
        loading: polyhouseLoading,
        type: "primary",
      },
    ],
  };

  return (
    <StepActions
      current={current}
      stepper={stepper}
      stepperNames={stepperNames}
      actions={actions}
    />
  );
};

export default StepperNavigation;
