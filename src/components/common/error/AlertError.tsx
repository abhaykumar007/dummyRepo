import { errorDetail, errorModel } from "@/types/error";
import { Alert } from "antd";

interface AlertErrorProps {
  error?: errorModel;
  message?: string;
}

const AlertError = ({ error, message }: AlertErrorProps) => {
  if (!error && !message) return null;

  if (!message && error?.errors) {
    return error.errors.map(
      (err: errorDetail, index: number) =>
        err.message && (
          <Alert
            key={err.message + index}
            message={err.message}
            type="error"
            closable
            style={{ marginBottom: "10px" }}
          />
        )
    );
  }

  return (
    <Alert
      message={
        message ? message : "There was an error while processing your request."
      }
      type="error"
      closable
      style={{ marginBottom: "20px" }}
    />
  );
};

export default AlertError;
