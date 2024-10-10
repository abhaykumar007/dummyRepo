import { useAppSelector } from "@/hooks/redux";
import PolyhouseSelectors from "@/redux/polyhouse/polyhouseSelectors";
import { List } from "antd";
import SensorItem from "./sensorItem";
import { Sensor } from "../../types";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import PolyhouseActions from "@/redux/polyhouse/action";
import FullAlertError from "@/components/common/error/FullAlertError";
const selectError = makeSelectErrorModel();
const SensorList = ({sensorArea}:{sensorArea : string}) => {
    const sensors = useAppSelector(PolyhouseSelectors.SelectSensors) ;
    const components = useAppSelector(PolyhouseSelectors.SelectComponents);
    const sensorsList = [...sensors, ...components];
    const error = useAppSelector((state) => selectError(state, [PolyhouseActions.DELETE_SENSOR_FINISHED]));
    return (
        <div>
            {error && <FullAlertError error={error} />}
            <List
                itemLayout="horizontal"
                dataSource={sensorsList}
                renderItem={(item: Sensor) => (
                    <SensorItem item={item} key={item.sensorId} sensorArea={sensorArea}/>
                )}
            />
        </div>
    );
};

export default SensorList;