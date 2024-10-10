import Card from "@/components/ui/card";
import Table from "@/components/ui/table";
import columns from "./columns";
import { Divider, Flex, Input as AntdInput } from "antd";
import Button from "@/components/common/button";
import { useNavigate } from "react-router-dom";
import routePaths from "@/config/routePaths";
import { useEffect, useState } from "react";
import InventoryActions from "@/redux/inventory/actions";
import InventorySelectors from "@/redux/inventory/selectors";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import requestingSelector from "@/redux/requesting/requestingSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import { getTranslation } from "@/translation/i18n";
import { DeleteOutlined } from "@ant-design/icons";
import FarmSelectors from "@/redux/farm/farmSelectors";
import Select from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const { Search } = AntdInput;

const selectError = makeSelectErrorModel();
const InventoryTable = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [prevFarmId, setPrevFarmId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);
  const inventories = useAppSelector(
    InventorySelectors.selectFilteredInventories
  );
  const categories = useAppSelector(InventorySelectors.selectSubCategories);
  const error = useAppSelector((state) =>
    selectError(state, InventoryActions.FETCH_INVENTORIES_FINISHED)
  );
  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);
  const selectedInventory = useAppSelector(
    InventorySelectors.selectSelectedInventory
  );
  const loading = useAppSelector((state) =>
    requestingSelector(state, [InventoryActions.FETCH_INVENTORIES])
  );
  const onAddButtonClick = () => {
    navigate(routePaths.addInventory);
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
    dispatch(InventoryActions.setFilter({ search: value }));
  };
  const onCategoryChange = (value: any) => {
    const selectedCategory = categories.find(
      (category: any) => category.subCategoryId === value
    );
    setProducts(selectedCategory?.products || []);
    setSelectedProduct(null);
    if (value === "all") value = null;
    dispatch(InventoryActions.setFilter({ category: value, product: null }));
  };

  const onRowSelectionChange = (selectedRowKeys: any, selectedRows: any) => {
    setSelectedRows(selectedRows);
    setDeleteButtonDisabled(selectedRowKeys.length === 0);
  };

  const categoryOptions = categories.map((category: any) => ({
    label: category.name,
    value: category.subCategoryId,
  }));
  categoryOptions.unshift({
    label: "All",
    value: "all",
  });

  const productOptions = products.map((product: any) => ({
    label: product.name,
    value: product.id,
  }));
  productOptions.unshift({
    label: "All",
    value: "all",
  });

  const onProductChange = (value: any) => {
    setSelectedProduct(value);
    if (value === "all") value = null;
    dispatch(InventoryActions.setFilter({ product: value }));
  };

  const onRowClick = (record: any) => {
    dispatch(InventoryActions.selectInventory(record));
  };

  const onDeleteButtonClick = () => {
    selectedRows.forEach((inventory: any) => {
      dispatch(InventoryActions.deleteInventory(inventory.inventoryId));
    });
  };

  useEffect(() => {
    if (!categories.length) {
      dispatch(InventoryActions.fetchSubCategories());
    }
  }, []);

  useEffect(() => {
    if (
      (selectedFarmId && prevFarmId && prevFarmId !== selectedFarmId) ||
      (selectedFarmId && !prevFarmId && !inventories.length)
    ) {
      dispatch(InventoryActions.fetchInventories());
    }

    setPrevFarmId(selectedFarmId);
  }, [selectedFarmId]);

  return (
    <Card
      style={{
        width: !selectedInventory ? "100%" : "calc( 100% - 350px)",
        height: "fit-content",
        paddingTop: "20px",
      }}
      bordered={false}
      title={getTranslation("global.inventory")}
      className="criclebox tablespace hideCardHeaderDivider"
    >
      {error && <FullAlertError error={error} />}
      <Flex style={{ width: "100%" }}>
        <div style={{ width: "100%" }}>
          <Flex
            justify="space-between"
            gap={20}
            style={{
              padding: "0px 20px",
              width: "100%",
            }}
          >
            <Flex gap={20}>
              <Search
                className="inventory"
                placeholder={getTranslation(
                  "inventoryManagement.searchInventoryPlaceholder"
                )}
                style={{ width: "40%", height: "45px", minWidth: "160px" }}
                onChange={onSearch}
                value={searchText}
              />
              <Select
                className="inventory-select"
                data-testid="category-select"
                placeholder={getTranslation("global.categorySelectPlaceholder")}
                options={categoryOptions}
                onChange={onCategoryChange}
              />
              <Select
                className="inventory-select"
                data-testid="product-select-filter"
                placeholder={getTranslation(
                  "inventoryManagement.selectProductPlaceholder"
                )}
                value={selectedProduct}
                style={{ minWidth: "160px" }}
                options={productOptions}
                onChange={onProductChange}
              />
            </Flex>
            <Flex gap={20} style={{ minWidth: "200px" }}>
              <Button
                label={getTranslation("inventoryManagement.addInventory")}
                type="primary"
                style={{ width: "60%" }}
                onClick={onAddButtonClick}
              />
              <Button
                icon={<DeleteOutlined />}
                data-testid="delete-inventory-button"
                type="default"
                danger
                style={{ width: "20%" }}
                disabled={deleteButtonDisabled}
                onClick={onDeleteButtonClick}
              />
            </Flex>
          </Flex>
          <Divider />
          <div className="table-responsive" style={{ minWidth: "900px" }}>
            <Table
              rowSelection={{
                type: "checkbox",
                onChange: (selectedRowKeys, selectedRows) => {
                  onRowSelectionChange(selectedRowKeys, selectedRows);
                },
              }}
              loading={loading}
              columns={columns}
              dataSource={inventories}
              className="ant-border-space"
              onRow={(record) => {
                return {
                  onClick: () => onRowClick(record),
                };
              }}
            />
          </div>
        </div>
      </Flex>
    </Card>
  );
};

export default InventoryTable;
