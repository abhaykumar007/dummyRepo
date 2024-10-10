import { Table as AntdTable } from "antd";
import { TableProps } from "antd";
import "./style.scss";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const setSpinner = () => {
  const antIcon = (
    <LoadingOutlined data-testid="loader" style={{ fontSize: 24 }} spin />
  );
  Spin.setDefaultIndicator(antIcon);
};
const Table = (props: TableProps) => {
  setSpinner();
  const { dataSource } = props;
  dataSource?.map((data: any, index) => {
    data.key = index;
  });
  return <AntdTable {...props} />;
};

export default Table;
