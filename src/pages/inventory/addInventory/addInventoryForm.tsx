import Form, { useForm } from "@/components/common/form";
import { Form as AntdForm, Grid } from "antd";
import Button from "@/components/common/button";
import Input from "@/components/common/input";
import { Col, Flex, InputNumber, Row } from "antd";
import AddProductButton from "./addProductButton";
import { useNavigate } from "react-router-dom";
import routePaths from "@/config/routePaths";
import { getTranslation } from "@/translation/i18n";
import InventorySelectors from "@/redux/inventory/selectors";
import { useEffect, useState } from "react";
import InventoryActions from "@/redux/inventory/actions";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import requestingSelector from "@/redux/requesting/requestingSelector";
import Select from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { FIELD_LEVEL_EXCEPTION } from "@/utilities/errorExceptions";
import { applyErrorsToFields } from "@/utilities/formUtils";
import { removeByActionType } from "@/redux/error/errorAction";
import FarmSelectors from "@/redux/farm/farmSelectors";

const selectError = makeSelectErrorModel();
const { useBreakpoint } = Grid;
const AddInventoryForm = () => {
  const dispatch = useAppDispatch();
  const [form] = useForm();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [bannerError, setBannerError] = useState(null);
  const screen = useBreakpoint();
  const loading = useAppSelector((state) =>
    requestingSelector(state, [InventoryActions.CREATE_INVENTORY])
  );
  const createInventoryError = useAppSelector((state) =>
    selectError(state, [InventoryActions.CREATE_INVENTORY_FINISHED])
  );
  const fetchCategoryError = useAppSelector((state) =>
    selectError(state, [InventoryActions.FETCH_SUBCATEGORIES_FINISHED])
  );
  const categories = useAppSelector((state) =>
    InventorySelectors.selectSubCategories(state)
  );

  const currentFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);
  const navigate = useNavigate();
  const onCancel = () => {
    if (createInventoryError)
      dispatch(removeByActionType(InventoryActions.CREATE_INVENTORY_FINISHED));
    navigate(routePaths.inventory);
  };

  const onCategoryChange = (value: any) => {
    const selectedCategory = categories.find(
      (category: any) => category.subCategoryId === value
    );
    if (selectedCategory) {
      setSelectedCategory(selectedCategory);
    }
    form.setFieldsValue({ productId: undefined });
    setSelectedProduct(null);
  };

  const onProductChange = (value: any) => {
    form.setFieldsValue({ productId: value });
    selectedCategory?.products.forEach((product: any) => {
      if (product.id === value) {
        setSelectedProduct(product);
      }
    });
  };

  const categoryOptions = categories.map((category: any) => ({
    label: category.name,
    value: category.subCategoryId,
  }));

  const products = selectedCategory?.products.map((product: any) => ({
    label: product.name,
    value: product.id,
  }));

  const onFinish = (values: any) => {
    values.cost = 200;
    values.time = 1725968894;
    values.farmId = currentFarmId;
    dispatch(InventoryActions.createInventory(values));
  };

  useEffect(() => {
    if (!categories.length) {
      dispatch(InventoryActions.fetchSubCategories());
    }
  }, []);

  useEffect(() => {
    if (
      createInventoryError &&
      createInventoryError.exception === FIELD_LEVEL_EXCEPTION
    )
      applyErrorsToFields(form, createInventoryError.errors);
    else setBannerError(createInventoryError);
  }, [createInventoryError]);

  return (
    <>
      {bannerError && <FullAlertError error={createInventoryError} />}
      {fetchCategoryError && <FullAlertError error={fetchCategoryError} />}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ width: "100%" }}
      >
        <div className="inventory-container">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <AntdForm.Item
                label={getTranslation("global.category")}
                name="category"
                rules={[
                  {
                    required: true,
                    message: getTranslation("global.categoryError"),
                  },
                ]}
              >
                <Select
                  data-testid="category-select"
                  options={categoryOptions}
                  placeholder={getTranslation(
                    "global.categorySelectPlaceholder"
                  )}
                  onChange={onCategoryChange}
                />
              </AntdForm.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Row
                style={{
                  width: "100%",
                  position: !screen.xs ? "absolute" : undefined,
                }}
              >
                <Col xs={24} sm={15}>
                  <AntdForm.Item
                    style={{ width: "100%" }}
                    label={getTranslation("inventoryManagement.product")}
                    name="productId"
                    rules={[
                      {
                        required: true,
                        message: getTranslation(
                          "inventoryManagement.productError"
                        ),
                      },
                    ]}
                  >
                    <Select
                      style={{scrollBehavior: "auto"}}
                      showSearch
                      data-testid="product-select"
                      placeholder={getTranslation(
                        "inventoryManagement.selectProductPlaceholder"
                      )}
                      options={products}
                      onChange={onProductChange}
                      value={form.getFieldValue("productId")}
                      filterOption={(input, option) =>
                        ((option?.label as string) ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  </AntdForm.Item>
                </Col>
                <Col xs={24} md={9}>
                  <div
                    style={{
                      width: !screen.xs ? "80%" : "100%",
                      paddingBottom: "5px",
                      marginLeft: !screen.xs ? "10px" : "0px",
                      position: !screen.xs ? "relative" : undefined,
                      top: !screen.xs ? 30 : undefined,
                    }}
                  >
                    <AddProductButton />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <AntdForm.Item
                label={getTranslation("global.description")}
                name="description"
              >
                <Input
                  placeholder={getTranslation("global.descriptionPlaceholder")}
                />
              </AntdForm.Item>
            </Col>
            <Col xs={24} sm={12}>
              <AntdForm.Item
                label={getTranslation("inventoryManagement.provider")}
                name="provider"
                rules={[
                  {
                    required: true,
                    message: getTranslation(
                      "inventoryManagement.providerError"
                    ),
                  },
                ]}
              >
                <Input
                  placeholder={getTranslation(
                    "inventoryManagement.providerPlaceholder"
                  )}
                />
              </AntdForm.Item>
            </Col>
          </Row>
        </div>
        <div className="inventory-container">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <AntdForm.Item
                label={getTranslation("inventoryManagement.quantity")}
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: getTranslation(
                      "inventoryManagement.quantityError"
                    ),
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={getTranslation(
                    "inventoryManagement.quantityPlaceholder"
                  )}
                  suffix={
                    <span
                      style={{
                        marginRight: "30px",
                        borderLeft: "1px solid #d9d9d9",
                        paddingLeft: "10px",
                      }}
                    >
                      {selectedProduct?.unit ? selectedProduct.unit : "Unit"}
                    </span>
                  }
                />
              </AntdForm.Item>
            </Col>
            <Col xs={24} sm={12}>
              <AntdForm.Item
                label={getTranslation("inventoryManagement.minQuantity")}
                name="minQuantity"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder={getTranslation(
                    "inventoryManagement.minQuantityPlaceholder"
                  )}
                />
              </AntdForm.Item>
            </Col>
          </Row>
        </div>
        <Flex gap={20} justify="flex-end">
          <Button
            label={getTranslation("global.cancel")}
            type="default"
            style={{ width: "20%", minWidth: "100px" }}
            onClick={onCancel}
          />
          <Button
            loading={loading}
            label={getTranslation("global.add")}
            type="primary"
            htmlType="submit"
            style={{ width: "20%" }}
          />
        </Flex>
      </Form>
    </>
  );
};

export default AddInventoryForm;
