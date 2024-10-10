import TaskList from "./taskList";
import "./style.scss";
import { useEffect } from "react";
import UserSelectors from "@/redux/user/selectors";
import UserActions from "@/redux/user/actions";
import TaskDetailsModal from "./taskDetails/taskDetailsModal";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import ScrollWrapper from "@/components/common/ScrollWrapper";
const Tasks = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(UserSelectors.selectUsers);

  useEffect(() => {
    if (!users || users.length === 0) dispatch(UserActions.fetchUsers());
  }, []);

  return (
    <div
      className="task"
      style={{
        height: "calc(100vh - 80px)",
        overflowY: "auto",
      }}
    >
      <ScrollWrapper maxHeight={`calc(100vh - 80px)`}>
        <TaskList />
        <TaskDetailsModal />
      </ScrollWrapper>
    </div>
  );
};

export default Tasks;
