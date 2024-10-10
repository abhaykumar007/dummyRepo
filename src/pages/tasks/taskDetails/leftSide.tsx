import { Avatar, Flex, Form, FormInstance, Input, Typography } from "antd";
import { useEffect, useState } from "react";
import CustomEdit from "@/components/common/CustomEditable/CustomEdit";
import requestingSelector from "@/redux/requesting/requestingSelector";

import TaskActions from "@/redux/task/actions";
import EditableTaskField from "./editableTaskField";
import { getTranslation } from "@/translation/i18n";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import TaskHistory from "./taskHistory";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { RootState } from "@/redux/store";

const selectError = makeSelectErrorModel();
interface leftSideProps {
  selectedTask: any;
  form: FormInstance;
  isOpen: boolean;
}

const LeftSide = ({ selectedTask, form }: leftSideProps) => {
  const dispatch = useAppDispatch();
  const [comment, setComment] = useState("");
  const [commentActive, setCommentActive] = useState(false);
  const commentLoading = useAppSelector((state: RootState) =>
    requestingSelector(state, [TaskActions.ADD_COMMENT])
  );
  const commentError = useAppSelector((state: RootState) =>
    selectError(state, [TaskActions.ADD_COMMENT_FINISHED])
  );

  const submitComment = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch(TaskActions.addComment(selectedTask?.taskId, values.comment));
      })
      .catch(() => {});
  };

  const initialValues = {
    farmId: selectedTask?.farmId,
    zoneId: selectedTask?.zoneId,
    cropLifeCycleId: selectedTask?.cropLifeCycleId,
    severity: selectedTask?.severity,
    taskName: selectedTask?.taskName,
    category: selectedTask?.category,
    dueDate: selectedTask?.dueDate,
    description: selectedTask?.description,
    inventoryId: selectedTask?.inventoryId,
    itemName: selectedTask?.itemName,
    qty: selectedTask?.qty,
    createdFor: selectedTask?.createdFor,
  };

  useEffect(() => {
    if (!commentLoading && !commentError) {
      setCommentActive(false);
      setComment("");
    }
  }, [commentLoading, commentError]);

  return (
    <>
      <Flex gap={10} style={{ marginTop: "auto" }}>
        <EditableTaskField
          form={form}
          fieldName="taskName"
          placeholder={getTranslation("global.namePlaceholder")}
          value={selectedTask?.taskName}
          udf={{
            containerDataTestId: "name-container",
            inputDataTestId: "name-input",
            initialValues: initialValues,
            taskId: selectedTask?.taskId,
          }}
        >
          <Typography.Title level={3}>
            {selectedTask?.taskName}
          </Typography.Title>
        </EditableTaskField>
      </Flex>
      <Typography.Title level={5}>
        {getTranslation("global.description")}
      </Typography.Title>
      <EditableTaskField
        form={form}
        fieldName="description"
        placeholder={getTranslation("global.descriptionPlaceholder")}
        value={
          selectedTask?.description
            ? selectedTask.description
            : `<p style="color:grey">${getTranslation("global.noDescription")}</p>`
        }
        udf={{
          initialValues: initialValues,
          taskId: selectedTask?.taskId,
        }}
        type="text-editor"
      ></EditableTaskField>
      <Typography.Title style={{ marginTop: "20px" }} level={5}>
        {getTranslation("taks.comments")}
      </Typography.Title>

      <Flex className="task-comment" gap={10} style={{ marginTop: "30px" }}>
        <Avatar size={40} style={{ backgroundColor: "#f56a00" }}>
          A
        </Avatar>
        <Flex style={{ width: "100%" }} vertical>
          <Form form={form}>
            <CustomEdit
              isHidden={false}
              onSubmit={() => {
                submitComment();
              }}
              onCancel={() => {
                setCommentActive(false);
              }}
              isActive={commentActive}
              loading={commentLoading}
              setActive={() => {}}
              type={"text-editor"}
              userDefineField={{
                containerDataTestId: "comment-container",
                inputDataTestId: "comment-texteditor",
              }}
              preset={false}
              name={"comment"}
              isEmpty={false}
              form={form}
              placeholder={getTranslation("task.addComment")}
              isFullWidth={true}
              disabled={false}
              bottomMarginLevel={4}
              isSubmitDisable={false}
              containerDataTestId={""}
              inputDataTestId={"comment-texteditor"}
              setSubmitDisable={() => {}}
              onChange={(value) => setComment(value)}
              value={comment}
            >
              <Input
                data-testid="comment-input"
                placeholder={getTranslation("task.addComment")}
                style={{ width: "100%" }}
                onClick={() => setCommentActive(true)}
              />
            </CustomEdit>
          </Form>
        </Flex>
      </Flex>
      {selectedTask?.tasksHistory.map((comment: any) => {
        return <TaskHistory comment={comment} key={comment.tasksHistoryId} />;
      })}
    </>
  );
};

export default LeftSide;
