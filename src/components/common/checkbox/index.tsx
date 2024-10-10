import { Checkbox as AntdCheckbox, CheckboxProps } from "antd";

interface AntdCheckboxProps extends CheckboxProps {
  label?: string;
}

const Checkbox = (props: AntdCheckboxProps) => {
  return <AntdCheckbox {...props}>{props.label}</AntdCheckbox>;
};

export default Checkbox;
