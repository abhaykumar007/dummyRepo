import Button from "@/components/common/button";
import DatePicker from "@/components/common/DatePicker";
import FullAlertError from "@/components/common/error/FullAlertError";
import Form, { FormItem, useForm } from "@/components/common/form";
import Input from "@/components/common/input";
import Select from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { StartLifeCyclePayload } from "@/pages/polyhouse/types";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FarmSelectors from "@/redux/farm/farmSelectors";
import InventoryActions from "@/redux/inventory/actions";
import InventorySelectors from "@/redux/inventory/selectors";
import PolyhouseActions from "@/redux/polyhouse/action";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { getTranslation } from "@/translation/i18n";
import { applyFieldErrorsToForm, hasFieldErrors } from "@/utilities/formUtils";
import { get30DaysBack } from "@/utilities/time";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./style.scss";

const selectError = makeSelectErrorModel();

export const fieldMap = {
  inventoryId: {
    field: "inventoryId",
  },
  qty: {
    field: "qty",
  },
  batchPrefix: {
    field: "batchPrefix",
  },
  unit: {
    field: "unit",
  },
};

const MEASUREMENT_UNIT_OPTION = [
  {
    label: "KG",
    value: "KG",
  },
  {
    label: "Piece",
    value: "PIECE",
  },
];

const StartLifeCycleModal = () => {
  const [form] = useForm();
  const { lifeCycleId: workflowInstancesId, polyhouseId } = useParams();

  const dispatch = useAppDispatch();

  const [isQuantityDisabled, setIsQuantityDisabled] = useState(true);
  const [maxQuantity, setMaxQuantity] = useState<number>(0);
  const [unit, setUnit] = useState<string>("");

  const [prevFarmId, setPrevFarmId] = useState(null);

  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);
  const selectedInventoryList = useAppSelector(
    InventorySelectors.SelectInventoryOptions
  );
  const categories = useAppSelector(InventorySelectors.selectSubCategories);

  const loadingStartLifeCycle = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.START_LIFECYCLE])
  );

  const loadingInventory = useAppSelector((state) =>
    requestingSelector(state, [
      InventoryActions.FETCH_INVENTORIES,
      InventoryActions.FETCH_SUBCATEGORIES,
    ])
  );

  const fieldsError = useAppSelector((state) =>
    PolyhouseSelectors.SelectFieldErrors(state, [
      PolyhouseActions.START_LIFECYCLE_FINISHED,
    ])
  );

  const error = useAppSelector((state) =>
    selectError(state, PolyhouseActions.START_LIFECYCLE_FINISHED)
  );

  const onFormValuesChange = (changedValues: any) => {
    if (changedValues.inventoryId) {
      setIsQuantityDisabled(false);

      const selectedCrop = selectedInventoryList.find(
        (item: any) => item.value === changedValues.inventoryId
      );

      setMaxQuantity(selectedCrop?.quantity || 0);
      setUnit(selectedCrop?.unit);
    }
  };

  const onFinish = (values: StartLifeCyclePayload) => {
    const payload: StartLifeCyclePayload = { ...values };
    payload.qty = +payload.qty;
    payload.startDate = dayjs(payload.startDate).toISOString();

    dispatch(
      PolyhouseActions.startLifeCycle({
        payload,
        workflowInstancesId,
        polyhouseId,
      })
    );
  };

  useEffect(() => {
    if (
      (selectedFarmId && prevFarmId && prevFarmId !== selectedFarmId) ||
      (selectedFarmId && !prevFarmId && !selectedInventoryList.length)
    ) {
      dispatch(InventoryActions.fetchInventories());
    }

    setPrevFarmId(selectedFarmId);
  }, [selectedFarmId]);

  useEffect(() => {
    if (!categories.length) {
      dispatch(InventoryActions.fetchSubCategories());
    }
  }, []);

  useEffect(() => {
    if (hasFieldErrors(fieldsError)) {
      applyFieldErrorsToForm(
        form,
        fieldMap,
        Object.keys(fieldMap),
        fieldsError
      );
    }
  }, [fieldsError]);

  return (
    <div>
      <FullAlertError error={error} />
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        onValuesChange={onFormValuesChange}
      >
        <FormItem
          name="inventoryId"
          label={getTranslation("polyhouse.polyhouseDetails.lifecycle.crop")}
          rules={[
            {
              required: true,
              message: getTranslation(
                "polyhouse.polyhouseDetails.lifecycle.pleaseSelectCrop"
              ),
            },
          ]}
        >
          <Select
            loading={loadingInventory}
            placeholder={getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.selectCrop"
            )}
            options={selectedInventoryList}
            style={{ width: "100%" }}
            allowClear
            data-testid="crop-select"
          />
        </FormItem>

        <Input
          label={getTranslation("global.quantity")}
          name="qty"
          testId="quantity-input"
          disabled={isQuantityDisabled}
          placeholder={getTranslation("global.quantityPlaceholder")}
          suffix={unit ? <span className="suffix">{unit}</span> : ""}
          rules={[
            {
              required: true,
              message: getTranslation("global.quantityErrorMsg"),
            },
            () => ({
              validator(_, value) {
                if (!value || value <= maxQuantity) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    `${getTranslation(
                      "polyhouse.polyhouseDetails.lifecycle.quantityErrorMsg"
                    )} ${maxQuantity}`
                  )
                );
              },
            }),
          ]}
        />

        <Input
          label={getTranslation(
            "polyhouse.polyhouseDetails.lifecycle.batchPrefix"
          )}
          name="batchPrefix"
          placeholder={getTranslation(
            "polyhouse.polyhouseDetails.lifecycle.enterBatchPrefix"
          )}
          testId="batch-prefix-input"
          rules={[
            {
              required: true,
              message: getTranslation(
                "polyhouse.polyhouseDetails.lifecycle.batchPrefixErrorMsg"
              ),
            },
          ]}
        />

        <FormItem
          name="unit"
          label={getTranslation(
            "polyhouse.polyhouseDetails.lifecycle.batchMesaurementUnit"
          )}
          rules={[
            {
              required: true,
              message: getTranslation(
                "polyhouse.polyhouseDetails.lifecycle.batchMesaurementUnitErrorMsg"
              ),
            },
          ]}
        >
          <Select
            placeholder={getTranslation(
              "polyhouse.polyhouseDetails.lifecycle.selectBatchMesaurementUnit"
            )}
            options={MEASUREMENT_UNIT_OPTION}
            style={{ width: "100%" }}
            allowClear
            data-testId="batch-measurement-unit-select"
          />
        </FormItem>

        <FormItem
          label={getTranslation(
            "polyhouse.polyhouseDetails.lifecycle.lifeCycleStartDate"
          )}
          name="startDate"
          rules={[
            {
              required: true,
              message: getTranslation(
                "polyhouse.polyhouseDetails.lifecycle.lifeCycleStartDateError"
              ),
            },
          ]}
        >
          <DatePicker
            placeholder="e.g: 2024-08-08"
            style={{ width: "100%", height: "45px" }}
            minDate={get30DaysBack()}
            maxDate={dayjs()}
          />
        </FormItem>

        <Button
          label={getTranslation("global.start")}
          onClick={() => form.submit()}
          loading={loadingStartLifeCycle}
        />
      </Form>
    </div>
  );
};

export default StartLifeCycleModal;
