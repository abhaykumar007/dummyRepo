import { Spin } from "antd";

const PageLoading = ({ style }: { style?: React.CSSProperties }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "50vh",
        ...style,
      }}
    >
      <Spin size="large" />
    </div>
  );
};

export default PageLoading;
