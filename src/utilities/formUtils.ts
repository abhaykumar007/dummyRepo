import { FormInstance  as Form} from "antd/lib";
import get from "lodash/get";

// type Form = {
//   setFields: (
//     fields: Array<{ name: string | string[]; value: any; errors: string[] }>
//   ) => void;
//   getFieldValue: (field: string | string[]) => any;
// };

type FieldMap = Record<
  string,
  { field: string; tab?: string; collapse?: string }
>;

type NestedFieldGetter = (field: string) => string[][] | null;

type FieldError = Record<string, string>;

export function applyFieldErrorsToForm(
  form: Form,
  fieldMap: FieldMap,
  fields: string[],
  fieldErrors: FieldError | null,
  getNestedFields: NestedFieldGetter = () => null
) {
  if (fieldErrors)
    Object.keys(fieldErrors).forEach((field) => {
      if (fields.includes(field)) {
        form.setFields([
          {
            name: fieldMap[field] ? fieldMap[field].field : field.split("."),
            value: form.getFieldValue(field),
            errors: [fieldErrors[field].toString()],
          },
        ]);

        return;
      }

      const NF = getNestedFields(field);
      if (NF && NF.length !== 0) {
        NF.forEach((NFField) => {
          form.setFields([
            {
              name: fieldMap[NFField.join(".")].field,
              value: form.getFieldValue(NFField),
              errors: [fieldErrors[field].toString()],
            },
          ]);
        });
      }
    });
}

export const applyErrors = (form: Form, fields: string[], nestedError: any) => {
  fields.forEach((fieldName) => {
    const error = get(nestedError, fieldName);
    if (error)
      form.setFields([
        {
          name: fieldName,
          value: form.getFieldValue(fieldName),
          errors: [error],
        },
      ]);
  });
};
export const filterByLabel = (
  input: string,
  option: { props: { label: string } }
) => {
  return option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

export const applyErrorsToFields = (
  form: Form,
  errors: Array<{ location?: string; message?: string }>,
  singleField?: string | string[]
): void => {
  errors.forEach((err: any) => {
    if (!singleField && !err.location) return;
    const fieldName = singleField || err.location.split(".");
    if(typeof fieldName !== "string") {
      fieldName.forEach((field:string) => {
        if(!isNaN(parseInt(field))) {
          //replace string with number
          fieldName[fieldName.indexOf(field)] = parseInt(field);
        }
      });
    }
    
    form.setFields([
      {
        name: fieldName,
        errors: [err.message || "Please enter valid value"],
        value: form.getFieldValue(fieldName),
      },
    ]);
  });
};

export const applyErrorOnTab = (
  errFields: string[],
  fields: string[],
  fieldMap: any,
  initialTab: Record<string, number>,
  initialCollapse: Record<string, number>,
  getNestedFields: NestedFieldGetter = () => null
) => {
  let newTab = initialTab;
  let newCollapse = initialCollapse;

  errFields.forEach((errField) => {
    if (fields.includes(errField)) {
      if (fieldMap[errField]) {
        newTab = {
          ...newTab,
          [fieldMap[errField].tab]: newTab[fieldMap[errField].tab] + 1,
        };
        newCollapse = {
          ...newCollapse,
          [fieldMap[errField].collapse]:
            newCollapse[fieldMap[errField].collapse] + 1,
        };
      }
    } else {
      const NF = getNestedFields(errField);
      if (NF && NF.length !== 0) {
        NF.forEach((NFField) => {
          const field = NFField.join(".");
          if (fieldMap[field]) {
            newTab = {
              ...newTab,
              [fieldMap[field].tab]: newTab[fieldMap[field].tab] + 1,
            };
            newCollapse = {
              ...newCollapse,
              [fieldMap[field].collapse]:
                newCollapse[fieldMap[field].collapse] + 1,
            };
          }
        });
      }
    }
  });
  return [newTab, newCollapse];
};

export function hasFieldErrors(fieldErrors: FieldError | null): Boolean {
  return !!fieldErrors && Object.keys(fieldErrors).length !== 0;
}
