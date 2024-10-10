import AddInventoryForm from "./addInventoryForm";

const AddInventory = () => {
  
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "20px",
      }}
    >
      <AddInventoryForm />
    </div>
  );
};

export default AddInventory;
