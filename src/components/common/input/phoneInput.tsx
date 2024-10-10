import ReactPhoneInput, { PhoneInputProps } from "react-phone-input-2";
import "./style.scss";
import "react-phone-input-2/lib/style.css";
import { Form } from "antd";

interface PhoneProps extends PhoneInputProps {
  rules?: { required: true; message: string }[];
  name?: string;
  label?: string;
}

const PhoneInput = (props: PhoneProps) => {
  return (
    <Form.Item
      name={props.name}
      label={props.label}
      rules={props.rules}
      style={{ marginBottom: "25px" }}
    >
      <ReactPhoneInput
        country="in"
        inputClass="phone_input_container"
        inputProps={{
          "data-testid": "phone-number-input",
        }}
        {...props}
      />
    </Form.Item>
  );
};

export default PhoneInput;
