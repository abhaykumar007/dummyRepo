import { Tooltip as AntdTooltip } from "antd";
import { TooltipPropsWithTitle } from "antd/es/tooltip";

interface Tooltip extends TooltipPropsWithTitle {
  children: React.ReactNode;
}

const Tooltip = (props: Tooltip) => {
  return <AntdTooltip {...props}>{props.children}</AntdTooltip>;
};

export default Tooltip;
