import { RootState } from "@/redux/store";
import TaskSelectors from "@/redux/task/selectors";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, Flex, Tag } from "antd";
import { ExclamationOutlined } from "@ant-design/icons";
import { TaskColumnType } from "./columns";
import { checkDueDateIsClose, getDateInStandardFormat } from "@/utilities/time";
import "./style.scss";
import { useEffect, useRef, useState } from "react";
import TaskActions from "@/redux/task/actions";
import FarmSelectors from "@/redux/farm/farmSelectors";
import { taskStatusKeyToValue } from "./utils";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { LoadingOutlined } from "@ant-design/icons";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import AlertError from "@/components/common/error/AlertError";
import { getTranslation } from "@/translation/i18n";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const selectError = makeSelectErrorModel();
const TaskColumn = ({ column }: { column: TaskColumnType }) => {
  const [prevFarmId, setPrevFarmId] = useState(null);
  const dispatch = useAppDispatch();
  const filteredTasks = useAppSelector((state: RootState) =>
    TaskSelectors.selectFilteredTasksByStatus(state, column.key as string)
  );

  const loading = useAppSelector((state: RootState) =>
    requestingSelector(state, [TaskActions.FETCH_TASKS], column.key)
  );
  const updateStatusLoading = useAppSelector((state: RootState) =>
    requestingSelector(state, [TaskActions.UPDATE_TASK_STATUS], column.key)
  );
  const updateStatusError = useAppSelector((state: RootState) =>
    selectError(state, [TaskActions.UPDATE_TASK_STATUS_FINISHED], column.key)
  );
  const currentFarm = useAppSelector(FarmSelectors.SelectSelectedFarmId);
  const columnRef = useRef<HTMLDivElement | null>(null);
  const fetchMoreTasks = () => {
    dispatch(
      TaskActions.fetchTasks(
        {
          status: taskStatusKeyToValue[column.key],
        },
        column.key,
        true
      )
    );
  };
  useEffect(() => {
    if (
      (currentFarm && prevFarmId && prevFarmId !== currentFarm) ||
      (currentFarm && !prevFarmId && !filteredTasks.length)
    ) {
      dispatch(
        TaskActions.fetchTasks(
          { status: taskStatusKeyToValue[column.key] },
          column.key
        )
      );
    }
    setPrevFarmId(currentFarm);
  }, [currentFarm]);

  useEffect(() => {
    const handleScroll = () => {
      const element = columnRef.current;
      let scrollHeight = element?.scrollHeight || 0;
      if (
        element &&
        (element?.clientHeight + element?.scrollTop >= scrollHeight - 1 ||
          element?.clientHeight + element?.scrollTop >= scrollHeight + 1)
      ) {
        fetchMoreTasks();
      }
    };

    const element = columnRef.current;
    element?.addEventListener("scroll", handleScroll);

    return () => {
      element?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Card
      key={column.key}
      style={{
        height: "fit-content",
        width: "fit-content",
      }}
      className="task-column"
      title={column.title}
      extra={
        updateStatusLoading && (
          <LoadingOutlined data-testid="loader" style={{ fontSize: 24 }} spin />
        )
      }
    >
      {updateStatusError && <AlertError error={updateStatusError} />}
      <Droppable droppableId={column.key} key={column.key}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <div
              data-testid={column.key}
              ref={columnRef}
              style={{
                marginBottom: "10px",
                width: "300px",
                maxHeight: "calc(100vh - 230px )",
                minHeight: "150px",
                overflowY: "auto",
              }}
            >
              {filteredTasks?.map((task: any, index: number) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(
                  task?.description,
                  "text/html"
                );
                const descriptionText = doc.body.textContent;
                return (
                  <Draggable
                    draggableId={task.taskId}
                    index={index}
                    key={task.taskId}
                  >
                    {(provided) => (
                      <div
                        data-testid={task.taskId}
                        style={{ marginBottom: "10px", width: "100%" }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => dispatch(TaskActions.selectTask(task))}
                        onDragEnd={() => console.log("drag end")}
                      >
                        <Card
                          style={{
                            height: "fit-content",
                            marginBottom: "10px",
                            borderRadius: "10px",
                          }}
                          title={task.taskName}
                          extra={
                            task.severity === 0 ? (
                              <span>
                                {task.createdForName}
                                <ExclamationOutlined
                                  style={{
                                    backgroundColor: "red",
                                    color: "#fff",
                                    borderRadius: "50%",
                                    padding: "2px",
                                    marginLeft: "5px",
                                  }}
                                />
                              </span>
                            ) : (
                              <span>{task.createdForName}</span>
                            )
                          }
                          className="task-card"
                        >
                          <Flex gap={10} justify="space-between">
                            <div
                              style={{
                                width: "100%",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 3,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {task.description ? (
                                descriptionText
                              ) : (
                                <span style={{ color: "grey" }}>
                                  {getTranslation("global.noDescription")}
                                </span>
                              )}
                            </div>
                          </Flex>

                          <Flex
                            justify="space-between"
                            align="center"
                            style={{ padding: "10px 0px 5px 0px" }}
                          >
                            <Tag
                              style={{ height: "fit-content" }}
                              color={"#005655"}
                            >
                              {task.category}
                            </Tag>

                            <Flex
                              gap={2}
                              style={{
                                color: checkDueDateIsClose(task.dueDate)
                                  ? "red"
                                  : "grey",
                              }}
                            >
                              <span style={{ fontSize: "14px" }}>
                                {getDateInStandardFormat(task.dueDate)}
                              </span>
                            </Flex>
                          </Flex>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
      {loading && (
        <Flex justify="center">
          <LoadingOutlined data-testid="loader" style={{ fontSize: 24 }} spin />
        </Flex>
      )}
    </Card>
  );
};

export default TaskColumn;
