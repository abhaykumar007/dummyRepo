import { Card as AntdCard, CardProps } from "antd";
import "./style.scss";

const Card = (props: CardProps) => {
  return (
    <AntdCard
      className="transition"
      {...props}
      style={{ borderRadius: "10px", ...props.style }}
    />
  );
};

export default Card;
