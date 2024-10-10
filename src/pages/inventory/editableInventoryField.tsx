import CustomEdit from "@/components/common/CustomEditable/CustomEdit";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import InventoryActions from "@/redux/inventory/actions";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { EditableFieldProps } from "@/types/editableFieldProps";
import { FormInstance } from "antd/lib";
import { useEffect, useState } from "react";

const selectError = makeSelectErrorModel();
const EditableInventoryField = ({
  fieldName,
  value,
  placeholder,
  udf,
  children,
  type,
  form,
}: EditableFieldProps) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) =>
    requestingSelector(state, [InventoryActions.PATCH_INVENTORY], fieldName)
  );

  const error = useAppSelector((state) =>
    selectError(state, InventoryActions.PATCH_INVENTORY_FINISHED, fieldName)
  );

  const [isActive, setIsActive] = useState(false);
  const [isSubmitDisable, setIsSubmitDisable] = useState(false);

  const patchInvetnory = (value: string) => {
    udf.initialValues[fieldName] = value;
    dispatch(
      InventoryActions.patchInventory(
        {
          id: udf.inventoryId,
          data: udf.initialValues,
        },
        fieldName
      )
    );
  };

  useEffect(() => {
    if (!loading) {
      if (!error) {
        setIsActive(false);
      } else {
        setIsSubmitDisable(true);
      }
    }
  }, [loading, error]);
  return (
    <CustomEdit
      isHidden={false}
      onSubmit={patchInvetnory}
      onCancel={() => setIsActive(false)}
      isActive={isActive}
      loading={loading}
      setActive={() => setIsActive(!isActive)}
      type={type}
      userDefineField={udf}
      preset={false}
      name={fieldName}
      isEmpty={false}
      value={value}
      form={form as FormInstance}
      placeholder={placeholder}
      isFullWidth={false}
      disabled={false}
      bottomMarginLevel={4}
      isSubmitDisable={isSubmitDisable}
      containerDataTestId={""}
      setSubmitDisable={setIsSubmitDisable}
    >
      {children}
    </CustomEdit>
  );
};

export default EditableInventoryField;
