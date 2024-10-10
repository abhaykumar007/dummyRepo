import React, {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from "react";
import PropTypes from "prop-types";
import { Input, InputNumber, Select, Radio, Tag, TimePicker } from "antd";
import dayjs from "dayjs";

import DatePicker from "../DatePicker";
import style from "./userDefineField.module.scss";

import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import { getTranslation } from "@/translation/i18n";
import { CustomTagProps } from "rc-select/lib/BaseSelect";
import { Form } from "antd";
import TextEditor from "../input/textEditor";

dayjs.extend(weekday);
dayjs.extend(localeData);

// const itemLayout = {
//   labelCol: { span: 8 },
//   wrapperCol: { span: 14 },
// }

export const userDefineFieldType = {
  INT: "int",
  FLOAT: "float",
  STRING: "string",
  BOOL: "bool",
  ARRAY_INT: "array-int",
  ARRAY_STRING: "array-string",
  ARRAY_FLOAT: "array-float",
  DATE: "date",
  // UNKNOWN: 'unknown',
};

type tagRenderType =
  | ((
      props: CustomTagProps
    ) => ReactElement<any, string | JSXElementConstructor<any>>)
  | undefined;

interface UserDefinedFieldsProps {
  fieldDecorator?: any[];
  field?: any;
  card?: boolean;
  placeholder?: string;
  form?: any;
  customValidator?: Function;
  tagRender?: tagRenderType;
  rules?: any[];
  validatorDependencies?: any;
  inputDataTestId?: string;
}

export const getComponent = (
  fields: any,
  placeholder: any,
  tagRender: tagRenderType
) => {
  let customComponent = (
    <Input
      data-testid={fields.inputDataTestId}
      autoFocus
      onChange={fields?.onChange}
      className={style.setHeight}
      placeholder={placeholder}
    />
  );
  let validator = userDefineFieldType.STRING;
  const options =
    fields.options ||
    (fields.listOfValues || []).map((value: any) => ({
      label: value.toString(),
      value,
    }));
  if (fields.type === userDefineFieldType.ARRAY_FLOAT) {
    customComponent = (
      <Select
        data-testid={fields.inputDataTestId}
        autoFocus
        allowClear
        popupMatchSelectWidth={false}
        onChange={fields?.onChange}
        placeholder={placeholder}
        mode="tags"
        tagRender={tagRender}
        options={options}
        // dropdownStyle={{ display: fields.options || fields.listOfValues ? 'unset' : 'none' }}
      />
    );
    validator = "array";
  }
  if (fields.type === userDefineFieldType.ARRAY_INT) {
    customComponent = (
      <Select
        data-testid={fields.inputDataTestId}
        autoFocus
        allowClear
        onChange={fields?.onChange}
        popupMatchSelectWidth={false}
        placeholder={placeholder}
        mode="tags"
        tagRender={tagRender}
        options={options}
        // dropdownStyle={{ display: fields.options || fields.listOfValues ? 'unset' : 'none' }}
      />
    );
    validator = "array";
  }
  if (fields.type === userDefineFieldType.ARRAY_STRING) {
    customComponent = (
      <Select
        size="small"
        data-testid={fields.inputDataTestId}
        allowClear
        popupMatchSelectWidth={false}
        autoFocus
        onChange={fields?.onChange}
        placeholder={placeholder}
        tagRender={tagRender}
        mode="tags"
        options={options}
        // dropdownStyle={{ display: fields.options || fields.listOfValues ? 'unset' : 'none' }}
      />
    );
    validator = "array";
  }
  if (fields.type === userDefineFieldType.BOOL) {
    customComponent = (
      <Radio.Group onChange={fields?.onChange}>
        <Radio value>{getTranslation("global.yes")}</Radio>
        <Radio value={false}>{getTranslation("global.no")}</Radio>
      </Radio.Group>
    );
    validator = "boolean";
  }
  if (fields.type === userDefineFieldType.DATE) {
    customComponent = (
      <DatePicker
        onChange={fields?.onChange}
        autoFocus
        minDate={fields.minDate}
      />
    );
    validator = fields.type;
  }
  if (fields.type === userDefineFieldType.INT) {
    customComponent = (
      <InputNumber
        data-testid={fields.inputDataTestId}
        onChange={fields?.onChange}
        autoFocus
        placeholder={placeholder}
      />
    );
    validator = "integer";
  }
  if (fields.type === userDefineFieldType.FLOAT) {
    customComponent = (
      <InputNumber
        data-testid={fields.inputDataTestId}
        onChange={fields?.onChange}
        autoFocus
        placeholder={placeholder}
      />
    );
    validator = fields.type;
  }
  if (fields.type === "textarea") {
    customComponent = (
      <Input.TextArea
        onChange={fields?.onChange}
        autoFocus
        placeholder={placeholder}
      />
    );
  }
  if (fields.type === "Disable") {
    customComponent = (
      <Input
        autoFocus
        onChange={fields?.onChange}
        disabled
        className={style.setHeight}
        placeholder={placeholder}
      />
    );
  }
  if (fields.type === "text-editor") {
    customComponent = (
      <div data-testid={fields.inputDataTestId}>
        <TextEditor
          onChange={fields?.onChange}
          placeholder={placeholder}
          value={fields.defaultValue}
        />
      </div>
    );
  }

  return { customComponent, validator };
};

export const getPresetType = (type: any) => {
  let presetType;
  if (
    type === userDefineFieldType.ARRAY_STRING ||
    type === userDefineFieldType.STRING
  ) {
    presetType = userDefineFieldType.ARRAY_STRING;
  } else if (
    type === userDefineFieldType.INT ||
    type === userDefineFieldType.ARRAY_INT
  ) {
    presetType = userDefineFieldType.ARRAY_INT;
  } else if (
    type === userDefineFieldType.FLOAT ||
    type === userDefineFieldType.ARRAY_FLOAT
  ) {
    presetType = userDefineFieldType.ARRAY_FLOAT;
  } else {
    presetType = "Disable";
  }
  return presetType;
};

const UserDefineFields = ({
  form,
  fieldDecorator,
  field,
  card = false,
  placeholder = "Value",
  customValidator,
  tagRender,
  rules,
  validatorDependencies,
}: UserDefinedFieldsProps) => {
  const [inputValue, setInputValue] = useState("");
  const [emails, setEmails] = useState<any[]>([]);
  const [emailError, setEmailError] = useState("");
  const [notify, setNotify] = useState("");

  useEffect(() => {
    if (field.defaultValue !== undefined) {
      if (field.type === "date" && field.defaultValue) {
        form.setFields([
          { name: fieldDecorator, value: dayjs(field.defaultValue) },
        ]);
      } else
        form.setFields([{ name: fieldDecorator, value: field.defaultValue }]);

      if (field.emailInput && Array.isArray(field.defaultValue))
        setEmails([...field.defaultValue]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (field.onChange)
      field.onChange(
        (e: React.ChangeEvent<HTMLInputElement>) => e.target.value
      );
    if (!isEmailValid(inputValue.trim())) {
      setEmailError("enter a valid email");
      setNotify("");
    }
    if (emailError && isEmailValid(inputValue.trim())) {
      setEmailError("");
      setNotify("press enter to add valid email in list");
    }
  };

  const isEmailValid = (email: string) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailPattern.test(email);
  };
  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim() !== "" && isEmailValid(inputValue.trim())) {
        setEmails([...emails, inputValue.trim()]);
        setInputValue("");
        setNotify("");
        if (field.setEmails) {
          field.setEmails([...emails, inputValue.trim()]);
        }
      } else {
        setEmailError(getTranslation("global.invalidEmail"));
      }
    }
  };

  const handleTagClose = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
    if (field.setEmails) {
      field.setEmails(emails.filter((e) => e !== email));
    }
  };

  let component;
  let valid;

  if (field.listOfValues && field.onlyFromLov) {
    const { validator } = getComponent(field, placeholder, tagRender);
    const options = field.options
      ? field.options
      : (field.listOfValues || []).map((value: any) => ({
          label: value,
          value,
        }));
    let mode: "multiple" | "tags" | undefined =
      field.type === "multiple" ? "multiple" : undefined;
    if (field.type.includes("array")) mode = "multiple";
    component = (
      <Select
        data-testid={field.inputDataTestId}
        open={field.open}
        autoFocus
        allowClear
        style={{ maxWidth: "100%" }}
        popupMatchSelectWidth={false}
        mode={mode}
        onChange={field?.onChange}
        showSearch={!!field?.searchable}
        filterOption={field?.filterOption}
        options={options}
      />
    );
    valid = validator;
  } else if (field.type === "multiple" || field.type === "tags") {
    const options = field.options
      ? field.options
      : (field.listOfValues || []).map((value: any) => ({
          label: value,
          value,
        }));
    component = (
      <Select
        data-testid={field.inputDataTestId}
        open
        autoFocus
        allowClear
        popupMatchSelectWidth={false}
        onChange={field?.onChange}
        mode={field.type}
        tagRender={tagRender}
        options={options}
        placeholder={placeholder}
      />
    );
    valid = "array";
  } else if (field.type === "time") {
    valid = "time";
    component = (
      <TimePicker use12Hours format="h:mm A" onChange={field?.onChange} />
    );
  } else if (field.emailInput) {
    component = (
      <>
        <div>
          <Input
            placeholder={getTranslation("global.email")}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
          />
          {emailError && <div style={{ color: "red" }}>{emailError}</div>}
          {notify && <div style={{ color: "green" }}>{notify}</div>}
          <div className="pt-1">
            {emails.map((email, index) => (
              <Tag key={index} closable onClose={() => handleTagClose(email)}>
                {email}
              </Tag>
            ))}
          </div>
        </div>
      </>
    );
  } else {
    const { customComponent, validator } = getComponent(
      field,
      placeholder,
      tagRender
    );

    component = customComponent;
    valid = validator;
  }
  const validation = !field.escapeValidation
    ? {
        type: valid,
        message: `Please enter ${valid}`,
      }
    : {};
  const isFloat = (n: number) => {
    // eslint-disable-next-line no-bitwise
    return n === +n && n !== (n | 0);
  };

  return (
    <>
      <Form.Item
        label={!card ? "Value" : null}
        // labelCol={!card ? itemLayout.labelCol : null}
        // wrapperCol={!card ? itemLayout.wrapperCol : null}
        dependencies={[validatorDependencies]}
        name={fieldDecorator}
        style={{ width: "100%", flexGrow: 0, marginBottom: "0px" }}
        rules={[
          ...(rules || []),
          validation,
          {
            validator(_, value) {
              let flag = 0;
              if (field.type === userDefineFieldType.ARRAY_INT) {
                if (Array.isArray(value)) {
                  value.forEach((e) => {
                    if (!Number.isInteger(+e)) flag = 1;
                  });
                }
              }
              if (field.type === userDefineFieldType.ARRAY_FLOAT) {
                if (Array.isArray(value)) {
                  value.forEach((e) => {
                    if (!isFloat(+e)) flag = 2;
                  });
                }
              }
              if (flag === 1)
                return Promise.reject(new Error(`Please enter integer`));
              if (flag === 2)
                return Promise.reject(new Error(`Please enter float`));
              return Promise.resolve();
            },
          },
          { validator: customValidator || (() => Promise.resolve()) },
        ]}
      >
        {component}
      </Form.Item>
    </>
  );
};

UserDefineFields.propTypes = {
  fieldDecorator: PropTypes.arrayOf(PropTypes.any).isRequired,
  field: PropTypes.objectOf(PropTypes.any).isRequired,
  card: PropTypes.bool,
  placeholder: PropTypes.string,
  form: PropTypes.objectOf(PropTypes.any).isRequired,
  customValidator: PropTypes.func,
  tagRender: PropTypes.node,
  rules: PropTypes.arrayOf(PropTypes.any),
};

export default UserDefineFields;
