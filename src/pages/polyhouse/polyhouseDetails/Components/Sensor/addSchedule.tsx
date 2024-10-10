import { useEffect, useState } from "react";
import { Col, Row, TimePicker, Form as AntdForm } from "antd";
import Modal from "@/components/ui/modal";
import Form, { useForm } from "@/components/common/form";
import { applyErrorsInModal } from "../../../../farm/CreateFarm/const";
import { getTranslation } from "@/translation/i18n";
import Button from "@/components/common/button";
import PolyhouseActions from "@/redux/polyhouse/action";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import { removeByActionType } from "@/redux/error/errorAction";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { FIELD_LEVEL_EXCEPTION } from "@/utilities/errorExceptions";
import FullAlertError from "@/components/common/error/FullAlertError";
import { Schedule } from "@/pages/polyhouse/types";
import dayjs from "dayjs";

const selectError = makeSelectErrorModel();

interface AddSchedule {
  schedule: Schedule[] | null;
  sensorId: string;
  parameterId: string;
}

const convertTimeToServerFormat = (time: string): number => {
  const parsedTime = dayjs(time, "h:mm A");

  const hours = parsedTime.format("HH");
  const minutes = parsedTime.format("mm");

  return parseFloat(`${hours}.${minutes}`);
};

const AddSchedule = ({ schedule, sensorId, parameterId }: AddSchedule) => {
  const dispatch = useAppDispatch();
  const [form] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionDispatched, setIsActionDispatched] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setIsActionDispatched(false);
  };

  const loading = useAppSelector((state) =>
    requestingSelector(state, [PolyhouseActions.ADD_SCHEDULE])
  );

  const error = useAppSelector((state) =>
    selectError(state, PolyhouseActions.ADD_SCHEDULE_FINISHED)
  );

  useEffect(() => {
    form.resetFields();
    dispatch(removeByActionType(PolyhouseActions.ADD_SCHEDULE_FINISHED));
    setIsActionDispatched(false);
  }, []);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          startTime: convertTimeToServerFormat(
            values.startTime.format("h:mm A")
          ),
          stopTime: convertTimeToServerFormat(values.stopTime.format("h:mm A")),
        };

        let id = 1;
        if (Array.isArray(schedule) && schedule.length > 0) {
          const lastScheduleId = schedule[schedule.length - 1].id;
          id =
            typeof lastScheduleId === "string"
              ? parseInt(lastScheduleId) + 1
              : lastScheduleId + 1;
        }

        setIsActionDispatched(true);
        dispatch(
          PolyhouseActions.addSchedule(sensorId, parameterId, {
            schedule: { ...formattedValues, id: id },
          })
        );
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (error && isModalOpen) {
      applyErrorsInModal(form, error.errors);
    }
  }, [error, isModalOpen]);

  useEffect(() => {
    if (!loading && !error && isActionDispatched) {
      setIsModalOpen(false);
    }
  }, [loading, error, isActionDispatched]);

  return (
    <div>
      <div>
        <Button
          style={{ padding: "5px 15px" }}
          label="Add schedule"
          onClick={() => {
            setIsModalOpen(true);
          }}
        />
      </div>
      <Modal
        title="Add schedule"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        okText={`${getTranslation("global.add")}`}
        onClose={handleCancel}
      >
        {error && error?.exception !== FIELD_LEVEL_EXCEPTION && (
          <FullAlertError error={error} />
        )}
        <Form form={form} layout="vertical" style={{ marginTop: "20px" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <AntdForm.Item
                label={getTranslation(
                  "polyhouse.polyhouseDetails.sensorDetails.startTime"
                )}
                name={`startTime`}
                rules={[
                  {
                    required: true,
                    message: `please input start time`,
                  },
                ]}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  use12Hours
                  format="h:mm a"
                />
              </AntdForm.Item>
            </Col>
            <Col xs={24} sm={12}>
              <AntdForm.Item
                label={getTranslation(
                  "polyhouse.polyhouseDetails.sensorDetails.stopTime"
                )}
                name={`stopTime`}
                rules={[
                  {
                    required: true,
                    message: `please input stop time`,
                  },
                ]}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  use12Hours
                  format="h:mm a"
                />
              </AntdForm.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AddSchedule;
