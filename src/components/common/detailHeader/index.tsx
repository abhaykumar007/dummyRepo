import Button from "../button";
import { IoMdClose } from "react-icons/io";

interface DetailHeaderProps {
  label: string;
  onClose?: () => void;
}

const DetailHeader = ({ label, onClose }: DetailHeaderProps) => {
  return (
    <div
      style={{
        padding: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        borderBottom: "2px solid rgba(0,0,0,0.05)",
      }}
    >
      <p className="heading3" style={{ fontWeight: 600 }}>
        {label}
      </p>
      <Button
        onClick={onClose}
        icon={<IoMdClose fontSize={20} />}
        style={{
          padding: 0,
          height: "30px",
          minWidth: "30px",
          width: "30px",
          paddingTop: "3px",
        }}
        type="default"
      />
    </div>
  );
};

export default DetailHeader;
