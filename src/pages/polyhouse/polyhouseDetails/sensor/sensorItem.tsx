import { List, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Button from "@/components/common/button";
import { getTranslation } from "@/translation/i18n";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import PolyhouseActions from "@/redux/polyhouse/action";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { Sensor } from "../../types";

const SensorItem = ({item, sensorArea}:{item:Sensor , sensorArea:string}) => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector((state) => requestingSelector(state, [PolyhouseActions.DELETE_SENSOR]))
    const deleteSensor = () => {
        dispatch(PolyhouseActions.deleteSensor(item.sensorId, sensorArea));
    }
  return (
    <List.Item
      actions={[<Popconfirm
        title={getTranslation("global.areYouSure")}
        okText={getTranslation("global.yes")}
        cancelText={getTranslation("global.cancel")}
        onConfirm={deleteSensor}
      >
        <Button
          data-testid="user-sidebar-menu-delete"
          icon={<DeleteOutlined />}
          type="link"
          loading={loading}
          danger
          ghost
        />
      </Popconfirm>]}
    >
      <List.Item.Meta
        title={item?.sensorComponent}
      />
    </List.Item>
  );
};

export default SensorItem;
