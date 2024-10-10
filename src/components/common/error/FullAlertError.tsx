import { Alert } from "antd";
import "./style.scss";
import { errorDetail, errorModel } from "@/types/error";
import { useAppDispatch } from "@/hooks/redux";
import { removeByActionType } from "@/redux/error/errorAction";
import { getKeyForAction } from "@/utilities/actionUtility";

interface ErrorContentProps {
  label: string;
  value: string;
}

const ErrorContent = ({ label, value }: ErrorContentProps) => {
  return (
    <div className="error_content_container">
      <p className="heading4 error_content_label">{label}</p> :
      <p className="heading4 error_content_value">{value}</p>
    </div>
  );
};

const FullAlertError = ({ error }: { error: errorModel }) => {
  if (!error || !error?.errors) return null;

  const dispatch = useAppDispatch();

  const description = (
    <div>
      {error?.errors.map((err: errorDetail, index: number) => (
        <div className="error_alert_container" key={index}>
          <p className="heading3 error_count_text">#{index}</p>
          <div>
            <ErrorContent label="Error" value={err.error} />
            <ErrorContent label="Message" value={err.message || "-"} />
            <ErrorContent label="Exception" value={error.exception} />
            <ErrorContent label="Code" value={error.code} />
            <ErrorContent label="Time" value={error.timestamp} />
          </div>
        </div>
      ))}
    </div>
  );

  const handleClose = () => {
    dispatch(
      removeByActionType(getKeyForAction(error?.actionType, error?.scope))
    );
  };

  return (
    <Alert
      message="Error details"
      description={description}
      type="error"
      showIcon
      closable
      onClose={handleClose}
      style={{ marginBottom: "20px" }}
    />
  );
};

export default FullAlertError;
