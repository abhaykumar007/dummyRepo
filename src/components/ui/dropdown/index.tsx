import {
  DropdownProps as AntdDropdownProps,
  Dropdown as AntdDropdown,
  MenuProps,
  Space,
} from "antd";
import { FaCaretDown } from "react-icons/fa";

interface DropdownProps extends AntdDropdownProps {
  items?: MenuProps["items"];
  label: string | React.ReactNode;
  value?: string | undefined;
  onChange?: (e: string) => void;
  isDownDropIconHide?: boolean;
}

const Dropdown = (props: DropdownProps) => {
  return (
    <AntdDropdown
      dropdownRender={props.dropdownRender}
      menu={{
        items: props.items,
        selectable: true,
        defaultSelectedKeys: props.value ? [props.value] : [],
        onClick: (e) => (props.onChange ? props.onChange(e.key) : () => {}),
      }}
      {...props}
    >
      <Space>
        <div className="bodyText">{props.label}</div>
        {!props.isDownDropIconHide && <FaCaretDown />}
      </Space>
    </AntdDropdown>
  );
};

export default Dropdown;
