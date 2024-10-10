import routePaths from "@/config/routePaths";
import { Breadcrumb as AntdBreadcrumb } from "antd";
import { FaTractor } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const FarmLink = () => {
  return (
    <Link to={routePaths.farm}>
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <FaTractor />
        <span>Farms</span>
      </div>
    </Link>
  );
};

const Breadcrumb = () => {
  const { pathname } = useLocation();
  const pathSnippets = pathname.split("/").filter((i) => i);

  const breadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

    const title = snippet.charAt(0).toUpperCase() + snippet.slice(1);

    return {
      title:
        routePaths.farm !== pathname ? (
          <Link to={url}>{title}</Link>
        ) : (
          <FarmLink />
        ),
    };
  });

  const items =
    routePaths.farm !== pathname
      ? [
          {
            title: <FarmLink />,
          },
          ...breadcrumbItems,
        ]
      : breadcrumbItems;

  return (
    <AntdBreadcrumb
      separator=">"
      items={items}
      style={{ marginLeft: "10px" }}
    />
  );
};

export default Breadcrumb;
