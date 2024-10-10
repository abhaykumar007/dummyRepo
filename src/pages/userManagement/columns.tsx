import { TableProps, Avatar, Typography, Tag } from "antd";
import { getAlphabetColor, getRoleColor, rolesToLabel } from "./utils";
import { getTranslation } from "@/translation/i18n";

const columns: TableProps["columns"] = [
  {
    title: getTranslation("global.name"),
    dataIndex: "name",
    render: (_, record) => {
      const backgroundColor = getAlphabetColor(record?.firstName[0]);
      return (
        <>
          <Avatar
            shape="square"
            style={{
              backgroundColor: backgroundColor,
              verticalAlign: "middle",
            }}
          >
            {`${record?.firstName[0]}${record.lastName[0]}`}
          </Avatar>
          <Typography.Text style={{ marginLeft: "10px" }}>
            {`${record?.firstName} ${record?.lastName}`}
          </Typography.Text>
        </>
      );
    },
    key: "1",
  },

  {
    title: getTranslation("global.contactNumber"),
    dataIndex: "phone",
    key: "2",
  },
  {
    title: getTranslation("global.roles"),
    dataIndex: "roles",
    render: (_, record) => {
      const roles = record?.roles;
      return (
        <>
          {roles?.map((role: string) => {
            const color = getRoleColor(role);
            return (
              <Tag color={color} key={role}>
                {rolesToLabel[role]}
              </Tag>
            );
          })}
        </>
      );
    },
    key: "3",
  },
];

export default columns;
