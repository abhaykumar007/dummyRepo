import { Form, Input } from "antd";
import { Rule } from "antd/es/form";
import { TextAreaProps } from "antd/es/input";
import "./style.scss";

interface AntdInputProps extends TextAreaProps {
  rules?: Rule[];
  name?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  testId?: string;
}

const TextArea = ({
  name,
  label,
  rules,
  className,
  value,
  onChange,
  disabled,
  placeholder,
  maxLength,
  testId,
  style,
}: AntdInputProps) => {
  return (
    <Form.Item
      name={name}
      label={label}
      className={className}
      rules={rules}
      style={{ marginBottom: "25px" }}
    >
      <Input.TextArea
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        className="common-textArea"
        data-testid={testId}
        style={{ height: "100px", ...style }}
      />
    </Form.Item>
  );
};

export default TextArea;
