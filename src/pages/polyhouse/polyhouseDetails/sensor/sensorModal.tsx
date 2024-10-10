import Modal from "@/components/ui/modal";
import { Tabs, TabsProps } from "antd";
import AddSensor from "./addSensor";
import SensorList from "./sensorList";
import { getTranslation } from "@/translation/i18n";
import { useState } from "react";

export interface AddSensorModalProps {
  isOpen: boolean;
  setIsOpen: Function;
  zoneId?: string;
  sensorArea?: string;
}

const AddSensorModal = ({
  isOpen,
  setIsOpen,
  zoneId,
  sensorArea
}: AddSensorModalProps) => {
  const [activeKey, setActiveKey] = useState('1');
  const items: TabsProps['items'] = [
    
    {
      key: '1',
      label: getTranslation("polyhouse.addSensor"),
      children: <AddSensor zoneId={zoneId as string} setActiveKey={setActiveKey} sensorArea={sensorArea}/>,
    },
    {
      key: '2',
      label: getTranslation("polyhouse.polyhouseDetails.sensors"),
      children: <SensorList  sensorArea={sensorArea as string} />,
    },
  ];

  const onTabChange = (key: string) => {
    setActiveKey(key);
  }
  
  return (
    <Modal
      className="add-sensor-modal"
      open={isOpen}
      title={getTranslation("polyhouse.polyhouseDetails.sensors")}
      onCancel={() => setIsOpen(false)}
      width={1000}
      style={{ top: 40 }}
      footer={null}
    >
      <Tabs defaultActiveKey="1" items={items} activeKey={activeKey} onChange={onTabChange}/>
    </Modal>
  );
};

export default AddSensorModal;
