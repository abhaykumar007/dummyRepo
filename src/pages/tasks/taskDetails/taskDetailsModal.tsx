import Modal from "@/components/ui/modal";
import TaskActions from "@/redux/task/actions";
import TaskSelectors from "@/redux/task/selectors";
import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import RightSide from "./rightSide";
import LeftSide from "./leftSide";
import { getTranslation } from "@/translation/i18n";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { RootState } from "@/redux/store";
import { removeByActionType } from "@/redux/error/errorAction";

const selectError = makeSelectErrorModel();
const TaskDetailsModal = () => {
  const dispatch = useAppDispatch();
  const commentError = useAppSelector((state: RootState) =>
    selectError(state, [TaskActions.ADD_COMMENT_FINISHED])
  );

  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  const selectedTask = useAppSelector(TaskSelectors.selectSelectedTask);
  const statusUpdatingError = useAppSelector((state: RootState) =>
    selectError(
      state,
      [TaskActions.UPDATE_TASK_STATUS_FINISHED],
      selectedTask?.taskId
    )
  );
  useEffect(() => {
    selectedTask ? setIsOpen(true) : setIsOpen(false);
  }, [selectedTask]);

  const onClose = () => {
    if (statusUpdatingError)
      dispatch(removeByActionType(TaskActions.UPDATE_TASK_STATUS_FINISHED));
    dispatch(TaskActions.selectTask(null));
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onCancel={onClose}
      title={getTranslation("task.taskDetails")}
      width={1200}
      style={{ top: 20 }}
      destroyOnClose
      footer={null}
    >
      {commentError && <FullAlertError error={commentError} />}
      {statusUpdatingError && <FullAlertError error={statusUpdatingError} />}
      <Form form={form}>
        <Row gutter={[20, 20]}>
          <Col
            lg={14}
            md={24}
            style={{ maxHeight: "650px", overflow: "auto", width: "100%" }}
          >
            <LeftSide selectedTask={selectedTask} form={form} isOpen={isOpen} />
          </Col>
          <Col lg={10} md={24} style={{ width: "100%" }}>
            <RightSide selectedTask={selectedTask} form={form} />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default TaskDetailsModal;
