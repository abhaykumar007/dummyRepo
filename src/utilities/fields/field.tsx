import React from "react";
import "./style.scss";

interface FieldItem {
  label: string;
  value: any;
}

interface FieldsProps {
  info: FieldItem[];
  style?: React.CSSProperties;
  className?: string;
}

const Fields: React.FC<FieldsProps> = ({ info, style, className }) => {
  return (
    <div
      className={`info-list ${className ? className : ""}`}
      style={{ ...style }}
    >
      {info.map((item, index) => (
        <div key={`${item.label}_${index}`} className="info-item" style={style}>
          <div className="label">{item.label}:</div>
          <div className="value">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export default Fields;
