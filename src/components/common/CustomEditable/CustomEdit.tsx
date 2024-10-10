import React, { ReactNode, useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Button, Flex } from "antd";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import styles from "./Editable.module.scss";
import UserDefineFields, {
  getPresetType,
} from "../UserDefineField/UserDefineFields";
import style from "../UserDefineField/userDefineField.module.scss";
import { arrayToString } from "@/utilities/typeConversion";
import { FormInstance } from "antd/lib";

export const userDefineFieldType = {
  INT: "int",
  FLOAT: "float",
  STRING: "string",
  BOOL: "bool",
  ARRAY_INT: "array-int",
  ARRAY_STRING: "array-string",
  ARRAY_FLOAT: "array-float",
  DATE: "date",
  TEXT_EDITOR: "text-editor",
  // UNKNOWN: 'unknown',
};

interface CustomEditProps {
  onSubmit: (args: any) => void;
  onCancel: () => void;
  onChange?: (args: any) => void;
  setActive: () => void;
  isActive: boolean;
  loading: boolean;
  value: any;
  form: FormInstance;
  userDefineField: Record<string, any>;
  name: string;
  label?: any;
  children?: ReactNode;
  type?: string;
  preset?: boolean;
  isEmpty?: boolean;
  emptyLabel?: any;
  placeholder?: string;
  error?: any;
  customValidator?: (context: object, value: string) => Promise<void>;
  disabled?: boolean;
  tooltip?: React.FC;
  isFullWidth?: boolean;
  tagRender?: ReactNode;
  isHidden?: boolean;
  setSubmitDisable: (arg: boolean) => void;
  isSubmitDisable?: boolean;
  bottomMarginLevel?: number;
  containerDataTestId?: string;
  inputDataTestId?: string;
}

const CustomEdit = ({
  isHidden,
  onSubmit,
  onCancel,
  onChange,
  isActive,
  loading,
  setActive,
  label,
  children,
  type,
  preset = false,
  userDefineField,
  name,
  isEmpty,
  emptyLabel,
  value,
  form,
  placeholder,
  isFullWidth,
  disabled,
  bottomMarginLevel = 4,
  isSubmitDisable,
  containerDataTestId,
  setSubmitDisable,
  customValidator,
}: CustomEditProps) => {
  const cancelButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const [valueChanged, setValueChanged] = React.useState(false);
  const isLabel = !!label;
  let presetType, defaultValues;
  if (preset) {
    presetType = getPresetType(type);
  } else if (type === userDefineFieldType.BOOL)
    presetType = userDefineFieldType.BOOL;
  else presetType = type;
  if (value === null) defaultValues = children;
  else defaultValues = value;
  const _onChange = (args: any[]) => {
    if (type === "text-editor") {
      form.setFieldsValue({ [name]: args });
    }
    setValueChanged(true);
    setSubmitDisable(false);
    if (onChange) onChange(args);
  };

  const [emails, setEmails] = useState([]);

  const _onSubmit = (e: any) => {
    e.preventDefault();
    if (userDefineField.emailInput) {
      onSubmit(emails);
      return;
    }

    if (!valueChanged) {
      onCancel();
      return;
    }

    if (loading) return null;

    // if (e.relatedTarget === cancelButtonRef.current) return;

    const errors = form.getFieldError(
      userDefineField.fieldId ? [userDefineField.fieldId, name] : [name]
    );
    if (errors.length !== 0) return null;
    const value = form.getFieldValue(
      userDefineField.fieldId ? [userDefineField.fieldId, name] : [name]
    );
    if (type === "date") {
      onSubmit(value ? value : null);
      return;
    }

    onSubmit(value);
  };
  // const Container =
  //   tooltip ||
  //   function ({ children }:any) {
  //     return <>{children}</>
  //   }
  useEffect(() => {
    if (disabled && isActive) onCancel();
  }, [disabled]);
  const _setActive = () => {
    if (!disabled) setActive();
  };
  return (
    <>
      {!isActive ? (
        <div
          data-testid={containerDataTestId}
          className={classNames({
            "editable-trigger": true,
            [`${style.grid} mb-${bottomMarginLevel}`]: isLabel,
          })}
          onClick={_setActive}
        >
          {isLabel ? <div className="text-gray-6 pl-0">{label}</div> : null}
          <div
            className={`pr-0 text-left ${!isEmpty ? "text-dark" : null} ${
              isLabel ? "ml-3" : null
            }`}
          >
            <div className={`${styles.editableBox}`}>
              <div className={`${isEmpty ? "text-gray-6" : null} d-flex`}>
                <div style={{ minWidth: 0 }} className="text-break">
                  {isEmpty ? emptyLabel : arrayToString(children)}
                </div>
                <div>
                  {(preset && (type === "date" || type === "bool")) ||
                  isHidden ? null : (
                    <>
                      {disabled && (
                        <Button
                          shape="circle"
                          size="small"
                          icon={<EditOutlined />}
                          disabled={disabled}
                          color="black"
                          type="link"
                          className={styles.button}
                          onClick={_setActive}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div
            className={` ${isFullWidth ? styles.fillWidth : ""} ${
              styles.editableField
            }`}
          >
            <div
              className="pr-0"
              style={{
                display: type !== "text-editor" ? "flex" : "",
              }}
            >
              <div
                className="flex-grow-1 "
                style={{ minWidth: 0, cursor: "text" }}
              >
                <UserDefineFields
                  rules={userDefineField.rules}
                  fieldDecorator={
                    userDefineField.fieldId
                      ? [`${userDefineField.fieldId}`, `${name}`]
                      : [`${name}`]
                  }
                  field={{
                    type: presetType,
                    defaultValue: defaultValues,
                    onlyFromLov: userDefineField?.onlyFromLov,
                    listOfValues: userDefineField?.listOfValues,
                    inputDataTestId: userDefineField.inputDataTestId,
                    options: userDefineField.options,
                    onChange: _onChange,
                    searchable: !!userDefineField.searchable,
                    filterOption: userDefineField.filterOption,
                    escapeValidation: userDefineField?.escapeValidation,
                    emailInput: userDefineField?.emailInput,
                    setEmails: setEmails,
                    minDate: userDefineField?.minDate,
                  }}
                  placeholder={placeholder || ""}
                  card
                  // tagRender={tagRender}
                  form={form}
                  customValidator={customValidator}
                />
              </div>

              {type !== "text-editor" && (
                <div
                  className="pr-0"
                  style={{
                    height: "33px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="d-flex align-items-center "
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div className="mx-1">
                      <Button
                        type="primary"
                        onClick={_onSubmit}
                        htmlType="submit"
                        disabled={isSubmitDisable}
                        icon={<CheckOutlined />}
                        loading={loading}
                        id="custom-edit-submit-btn"
                        data-testid={`${name}-save`}
                      />
                    </div>
                    <div className="mx-1">
                      <Button
                        ref={cancelButtonRef}
                        type="default"
                        onClick={onCancel}
                        icon={<CloseOutlined />}
                        id="custom-edit-cancel-btn"
                        data-testid={`${name}-cancel`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {type === "text-editor" && (
              <Flex gap={10}>
                <Button data-testid={`${name}-cancel`} onClick={onCancel}>
                  cancel
                </Button>
                <Button
                  data-testid={`${name}-save`}
                  type="primary"
                  loading={loading}
                  onClick={_onSubmit}
                >
                  Save
                </Button>
              </Flex>
            )}
          </div>
        </>
      )}
    </>
  );
};

CustomEdit.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  setActive: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  value: PropTypes.any.isRequired,
  form: PropTypes.objectOf(PropTypes.any).isRequired,
  userDefineField: PropTypes.objectOf(PropTypes.any).isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.any,
  children: PropTypes.node,
  type: PropTypes.string,
  preset: PropTypes.bool,
  isEmpty: PropTypes.bool,
  emptyLabel: PropTypes.any,
  placeholder: PropTypes.string,
  error: PropTypes.any,
  customValidator: PropTypes.func,
  disabled: PropTypes.bool,
  tooltip: PropTypes.node,
  isFullWidth: PropTypes.bool,
  tagRender: PropTypes.node,
  isHidden: PropTypes.bool,
  setSubmitDisable: PropTypes.func.isRequired,
  isSubmitDisable: PropTypes.bool,
};

export default CustomEdit;
