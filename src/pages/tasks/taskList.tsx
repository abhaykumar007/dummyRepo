import Input from "@/components/common/input";
import Card from "@/components/ui/card";
import { Col, Flex, Row, Tooltip } from "antd";
import { Avatar } from "antd";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import AddTaskButton from "./addTaskButton";
import { TaskColumnType, taskColumns } from "./columns";
import TaskColumn from "./taskColumn";
import TaskActions from "@/redux/task/actions";
import UserSelectors from "@/redux/user/selectors";
import { getAlphabetColor } from "../userManagement/utils";
import TaskSelectors from "@/redux/task/selectors";
import { User } from "../userManagement/types";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
const TaskList = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(UserSelectors.selectUsers);
  const filters = useAppSelector(TaskSelectors.selectTaskFilters);
  const setUserFilter = (userId: string) => {
    if (filters.user === userId) {
      dispatch(TaskActions.setFilters({ user: null }));
      return;
    }
    dispatch(TaskActions.setFilters({ user: userId }));
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(TaskActions.setFilters({ search: e.target.value }));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.droppableId === result.source.droppableId) return;
    dispatch(
      TaskActions.updateTaskStatus(
        result.draggableId,
        result.destination,
        result.source,
        result.destination.droppableId
      )
    );
  };
  return (
    <>
      <Card className="task-list-header" bordered={false}>
        <Flex style={{ width: "100%" }} gap={30} justify="space-between">
          <Row style={{ width: "100%" }}>
            <Col md={6} xs={24}>
              <Input
                placeholder="Search"
                onChange={onSearch}
                testId="search-input"
              />
            </Col>
            <Col md={14} xs={24} style={{padding:'0px 0px 10px 10px'}}>
              <Avatar.Group size={"large"}>
                {users.map((user: User) => (
                  <Tooltip
                    title={`${user.firstName} ${user.lastName}`}
                    key={user.userId}
                  >
                    <Avatar
                      data-testid={`task-avatar-${user.userId}`}
                      key={user.userId}
                      style={{
                        backgroundColor: getAlphabetColor(user.firstName[0]),
                        cursor: "pointer",
                      }}
                      className={
                        filters.user === user.userId
                          ? "selected-task-avatar"
                          : "task-avatar"
                      }
                      onClick={() => setUserFilter(user.userId)}
                    >
                      {user.firstName[0]}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
            </Col>
            <Col md={4} xs={24} style={{paddingBottom:'10px',display:'flex',justifyContent:'flex-end'}} >
              <AddTaskButton />
            </Col>
          </Row>
        </Flex>
      </Card>
      <DragDropContext onDragEnd={onDragEnd}>
        <Flex
          gap={30}
          style={{
            overflowX: "auto",
            paddingRight: "20px",
            backgroundColor: "#fafafa",
            padding: "20px 0px",
          }}
        >
          {taskColumns.map((column: TaskColumnType) => (
            <TaskColumn column={column} key={column.key} />
          ))}
        </Flex>
      </DragDropContext>
    </>
  );
};

export default TaskList;
