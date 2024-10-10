import { FormInstance } from "antd/lib";

export interface EditableFieldProps {
  fieldName: string;
  value: string;
  placeholder?: string;
  farmId?: string;
  isParseField?: boolean;
  customValidator?: (context: object, value: string) => Promise<void>;
  udf : Record<string, any> ;
  children?: React.ReactNode;
  type?: string;
  form ?: FormInstance;
}
