import InventoryTable from "./inventoryTable";
import InventorySidebar from "./sideBar";
import "./style.scss";

const Inventory = () => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        width: "100%",
        
      }}
      className="inventory-card"
    >
      <InventoryTable />
      <InventorySidebar/>
    </div>
  );
};

export default Inventory;
