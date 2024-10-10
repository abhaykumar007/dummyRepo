import InventorySelectors from "@/redux/inventory/selectors";
import { getTranslation } from "@/translation/i18n";
import Fields from "@/utilities/fields/field";
import { Form, FormInstance } from "antd";
import EditableInventoryField from "./editableInventoryField";
import { useAppSelector } from "@/hooks/redux";

interface inventoryDetailsProps {
  form: FormInstance;
}

const InventoryDetails = ({ form }: inventoryDetailsProps) => {
  const selectedInventory = useAppSelector(
    InventorySelectors.selectSelectedInventory
  );

  return (
    <Form form={form}>
      <div className="user-details-sidebar" style={{ width: "100%" }}>
        <Fields
          info={[
            {
              label: getTranslation("global.description"),
              value: (
                <div style={{ minHeight: "40px" }}>
                  <EditableInventoryField
                    fieldName="description"
                    value={selectedInventory?.description}
                    placeholder={getTranslation(
                      "global.descriptionPlaceholder"
                    )}
                    form={form}
                    udf={{
                      inputDataTestId: "description-input",
                      inventoryId: selectedInventory?.inventoryId,
                      initialValues: {
                        description: selectedInventory?.description,
                        provider: selectedInventory?.provider,
                        quantity: selectedInventory?.quantity,
                        wastage: selectedInventory?.wastage,
                      },
                    }}
                  >
                    {selectedInventory?.description ? (
                      selectedInventory?.description
                    ) : (
                      <span className="no-descriton" style={{color:'grey'}}>
                        {getTranslation("global.noDescription")}
                      </span>
                    )}
                  </EditableInventoryField>
                </div>
              ),
            },
            {
              label: getTranslation("inventoryManagement.provider"),
              value: (
                <div style={{ minHeight: "40px" }}>
                  <EditableInventoryField
                    fieldName="provider"
                    value={selectedInventory?.provider}
                    placeholder={getTranslation(
                      "inventoryManagement.providerPlaceholder"
                    )}
                    form={form}
                    udf={{
                      inputDataTestId: "provider-input",
                      inventoryId: selectedInventory?.inventoryId,
                      initialValues: {
                        description: selectedInventory?.description,
                        provider: selectedInventory?.provider,
                        quantity: selectedInventory?.quantity,
                        wastage: selectedInventory?.wastage,
                      },
                      rules: [
                        {
                          required: true,
                          message: getTranslation(
                            "inventoryManagement.providerError"
                          ),
                        },
                      ],
                    }}
                  >
                    {selectedInventory?.provider}
                  </EditableInventoryField>
                </div>
              ),
            },
            {
              label: getTranslation("inventoryManagement.quantity"),
              value: (
                <div style={{ minHeight: "40px" }}>
                  <EditableInventoryField
                    fieldName="quantity"
                    value={selectedInventory?.quantity}
                    placeholder={getTranslation(
                      "inventoryManagement.quantityPlaceholder"
                    )}
                    form={form}
                    udf={{
                      inputDataTestId: "quantity-input",
                      inventoryId: selectedInventory?.inventoryId,
                      initialValues: {
                        description: selectedInventory?.description,
                        provider: selectedInventory?.provider,
                        quantity: selectedInventory?.quantity,
                        wastage: selectedInventory?.wastage,
                      },
                      rules: [
                        {
                          required: true,
                          message: getTranslation(
                            "inventoryManagement.quantityError"
                          ),
                        },
                      ],
                    }}
                    type="int"
                  >
                    {selectedInventory?.quantity}
                  </EditableInventoryField>
                </div>
              ),
            },
            {
              label: "Wastage",
              value: (
                <div style={{ minHeight: "40px" }}>
                  <EditableInventoryField
                    fieldName="wastage"
                    value={selectedInventory?.wastage}
                    placeholder={getTranslation(
                      "inventoryManagement.wastagePlaceholder"
                    )}
                    form={form}
                    udf={{
                      inputDataTestId: "wastage-input",
                      inventoryId: selectedInventory?.inventoryId,
                      initialValues: {
                        description: selectedInventory?.description,
                        provider: selectedInventory?.provider,
                        quantity: selectedInventory?.quantity,
                        wastage: selectedInventory?.wastage,
                      },
                      rules: [
                        {
                          required: true,
                          message: getTranslation(
                            "inventoryManagement.wastageError"
                          ),
                        },
                      ],
                    }}
                    type="int"
                  >
                    {selectedInventory?.wastage}
                  </EditableInventoryField>
                </div>
              ),
            },
          ]}
        />
      </div>
    </Form>
  );
};

export default InventoryDetails;
