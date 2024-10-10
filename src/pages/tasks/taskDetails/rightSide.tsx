import { getAlphabetColor } from "@/pages/userManagement/utils";
import Fields from "@/utilities/fields/field";
import { getDateInStandardFormat } from "@/utilities/time";
import {
  Avatar,
  Collapse,
  Dropdown,
  Flex,
  FormInstance,
  MenuProps,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  categoryOptions,
  severityToColors,
  severityToLabel,
  taskStatusKeyToColor,
  taskStatusKeyToLabel,
  taskStatusValueTokey,
} from "../utils";
import { DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import TaskActions from "@/redux/task/actions";
import TaskSelectors from "@/redux/task/selectors";
import EditableTaskField from "./editableTaskField";
import UserSelectors from "@/redux/user/selectors";
import dayjs from "dayjs";
import { getTranslation } from "@/translation/i18n";
import { Task } from "../types";
import { User } from "@/pages/userManagement/types";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { LoadingOutlined } from "@ant-design/icons";

interface RightSideProps {
  selectedTask: any;
  form: FormInstance;
}

const items: MenuProps["items"] = [
  {
    label: getTranslation("task.open"),
    key: "open",
  },
  {
    label: getTranslation("task.inProgress"),
    key: "inProgress",
  },
  {
    label: getTranslation("task.inReview"),
    key: "inReview",
  },
  {
    label: getTranslation("task.closed"),
    key: "closed",
  },
  {
    label: getTranslation("task.cancelled"),
    key: "cancelled",
  },
];

const severityOptions = [
  { label: getTranslation("task.urgent"), value: 0 },
  { label: getTranslation("task.medium"), value: 1 },
  { label: getTranslation("task.normal"), value: 2 },
];

const RightSide = ({ selectedTask, form }: RightSideProps) => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState("");
  const updateStatusLoading = useAppSelector((state) =>
    requestingSelector(state, [TaskActions.UPDATE_TASK_STATUS],selectedTask?.taskId)
  );
  const tasks = useAppSelector((state: any) =>
    TaskSelectors.selectTasksByStatus(
      state,
      taskStatusValueTokey[selectedTask?.status]
    )
  );
  const users = useAppSelector(UserSelectors.selectUsers);
  const userOptions = users.map((user: User) => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.userId,
  }));
  const onStatusSelect = (item: any) => {
    dispatch(
      TaskActions.updateTaskStatus(
        selectedTask?.taskId,
        { droppableId: item.key, index: 0 },
        {
          droppableId: status,
          index: tasks.findIndex(
            (task: Task) => task.taskId === selectedTask?.taskId
          ),
        },
        selectedTask?.taskId
      )
    );
    setStatus(item.key);
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
  const fieldItems = [
    {
      label: getTranslation("task.assignee"),
      value: (
        <EditableTaskField
          form={form}
          fieldName="createdFor"
          placeholder={getTranslation("task.assigneePlaceholder")}
          value={selectedTask?.createdFor}
          udf={{
            options: userOptions,
            onlyFromLov: true,
            listOfValues: userOptions,
            taskId: selectedTask?.taskId,
            containerDataTestId: "assignee-select-container",
            inputDataTestId: "assignee-select",
            initialValues: initialValues,
          }}
          type="string"
        >
          <Flex gap={10} align="center" >
            <Avatar
              size={30}
              style={{
                backgroundColor: getAlphabetColor(
                  selectedTask?.createdForName[0]
                ),
              }}
            >
              {selectedTask?.createdForName[0]}
            </Avatar>
            <Typography.Text>{selectedTask?.createdForName}</Typography.Text>
          </Flex>
        </EditableTaskField>
      ),
    },
    {
      label: getTranslation("task.severity"),
      value: (
        <EditableTaskField
          form={form}
          fieldName="severity"
          placeholder={getTranslation("task.severityPlaceholder")}
          value={selectedTask?.severity}
          udf={{
            options: severityOptions,
            onlyFromLov: true,
            listOfValues: severityOptions,
            taskId: selectedTask?.taskId,
            containerDataTestId: "severity-select-container",
            inputDataTestId: "severity-select",
            initialValues: initialValues,
          }}
          type="int"
        >
          <Tag
            style={{ height: "fit-content", padding: "5px 10px" }}
            color={severityToColors[selectedTask?.severity]}
          >
            {severityToLabel[selectedTask?.severity]}
          </Tag>
        </EditableTaskField>
      ),
    },
    {
      label: getTranslation("global.category"),
      value: (
        <EditableTaskField
          form={form}
          fieldName="category"
          placeholder={getTranslation("global.categorySelectPlaceholder")}
          value={selectedTask?.category}
          udf={{
            options: categoryOptions,
            onlyFromLov: true,
            listOfValues: categoryOptions,
            taskId: selectedTask?.taskId,
            containerDataTestId: "category-select-container",
            inputDataTestId: "category-select",
            initialValues: initialValues,
          }}
          type="string"
        >
          <Tag color="blue">{selectedTask?.category}</Tag>
        </EditableTaskField>
      ),
    },
    {
      label: getTranslation("task.dueDate"),
      value: (
        <EditableTaskField
          form={form}
          fieldName="dueDate"
          placeholder="Select due date"
          value={selectedTask?.dueDate}
          type="date"
          udf={{
            format: "YYYY-MM-DD",
            taskId: selectedTask?.taskId,
            minDate: dayjs(new Date()),
            initialValues: initialValues,
          }}
        >
          {getDateInStandardFormat(selectedTask?.dueDate)}
        </EditableTaskField>
      ),
    },
    {
      label: getTranslation("global.inventory"),
      value: selectedTask?.itemName || (
        <span style={{ color: "grey" }}>
          {getTranslation("task.noInventory")}
        </span>
      ),
    },
    {
      label: getTranslation("task.reportedBy"),
      value: (
        <Flex gap={10} align="center">
          <Avatar
            size={30}
            style={{
              backgroundColor: getAlphabetColor(selectedTask?.createdByName[0]),
            }}
          >
            {selectedTask?.createdByName[0]}
          </Avatar>
          <Typography.Text>{selectedTask?.createdByName}</Typography.Text>
        </Flex>
      ),
    },
    {
      label: getTranslation("global.createdDate"),
      value: getDateInStandardFormat(selectedTask?.createdDate),
    },
    {
      label: getTranslation("global.updatedDate"),
      value: getDateInStandardFormat(selectedTask?.updatedDate),
    },
  ];
  useEffect(() => {
    if (selectedTask) setStatus(taskStatusValueTokey[selectedTask?.status]);
  }, [selectedTask]);

  return (
    <>
      <Dropdown
        menu={{ items, selectable: true, onSelect: onStatusSelect }}
        trigger={["click"]}
      >
        <Space
          style={{
            cursor: "pointer",
            backgroundColor: taskStatusKeyToColor[status],
            color: "#fff",
            padding: "5px 20px",
            borderRadius: "5px",
          }}
          data-testid="status-dropdown"
        >
          {taskStatusKeyToLabel[status]}
          {updateStatusLoading && <LoadingOutlined data-testid="loader"  spin />}
          <DownOutlined />
        </Space>
      </Dropdown>
      <Collapse
        style={{ marginTop: "10px" }}
        defaultActiveKey={["1"]}
        items={[
          {
            label: "Details",
            key: "1",
            children: <Fields info={fieldItems} style={{padding:'5px 0px'}}/>,
            showArrow: false,
            extra: <DownOutlined />,
          },
        ]}
      />
    </>
  );
};

export default RightSide;
