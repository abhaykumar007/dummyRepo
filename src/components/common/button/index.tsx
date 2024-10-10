import { Button as AntdButton } from "antd";
import { ButtonProps as AntdButtonProps } from "antd/es/button/button";

interface ButtonProps extends AntdButtonProps {
  label?: string;
  loading?: boolean;
  style?: React.CSSProperties;
}

const Button = (props: ButtonProps) => {
  return (
    <AntdButton
      iconPosition="end"
      type={props.type ? props.type : "primary"}
      disabled={props.loading}
      {...props}
      style={{
        width: "100%",
        padding: "22px ",
        borderRadius: "6px",
        boxShadow: "none",
        ...props.style,
      }}
    >
      {props.label}
    </AntdButton>
  );
};

export default Button;
