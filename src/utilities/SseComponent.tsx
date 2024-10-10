import { API_BASE, API_VER } from "@/config/config";
import PolyhouseActions from "@/redux/polyhouse/action";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type EventData = {
  type: string;
  data: any;
};

const SSEComponent: React.FC = () => {
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE}/${API_VER}/sse`);

    eventSource.onmessage = (event) => {
      const eventObj: EventData = JSON.parse(event.data).event;
      setEvents((prevEvents) => [...prevEvents, eventObj]);

      switch (eventObj.type) {
        case "CTRL_PING":
          break;
        case "parameters":
          dispatch(PolyhouseActions.updateSensorData(eventObj.data));
          break;
        default:
          break;
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return null;
};

export default SSEComponent;
