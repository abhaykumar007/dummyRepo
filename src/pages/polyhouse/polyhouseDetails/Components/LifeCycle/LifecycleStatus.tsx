import { LIFECYCLE_STATUS } from "@/config/consts";

const STATUS_COLOUR: any = {
  [LIFECYCLE_STATUS.COMPLETED]: {
    backgroundColor: "#008b38",
    color: "white",
  },
  [LIFECYCLE_STATUS.RUNNING]: {
    backgroundColor: "#f4a261",
    color: "white",
  },
  [LIFECYCLE_STATUS.DRAFT]: {
    backgroundColor: "#b7b7a4",
    color: "white",
  },
};

const LifecycleStatus = ({ status }: { status: string }) => {
  return (
    <div
      style={{
        border: "2px solid",
        display: "inline",
        fontSize: "14px",
        textTransform: "capitalize",
        padding: "5px 10px",
        borderRadius: "6px",
        backgroundColor: STATUS_COLOUR[status].backgroundColor,
        color: STATUS_COLOUR[status].color,
        fontWeight: 500,
      }}
    >
      {status.toLowerCase()}
    </div>
  );
};

export default LifecycleStatus;
