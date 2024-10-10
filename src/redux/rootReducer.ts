import { combineReducers, Action } from "redux";
import session from "./session/reducer";
import account from "./account/reducer";
import error from "./error/errorReducer";
import requesting from "./requesting/requestingReducer";
import users from "./user/reducer";
import farms from "./farm/reducer";
import organizations from "./organization/reducer";
import polyhouses from "./polyhouse/reducer";
import inventories from "./inventory/reducer";
import workflows from "./workflow/reducer";
import tasks from "./task/reducer";
import AppActions from "./actions";
import reservoirs from "./reservoir/reducer";
import dashboard from "./dashboard/reducer";

const appReducer = combineReducers({
  session,
  account,
  error,
  requesting,
  users,
  farms,
  organizations,
  polyhouses,
  inventories,
  workflows,
  reservoirs,
  tasks,
  dashboard,
});

const rootReducer = (
  state: any,
  action: Action
): ReturnType<typeof appReducer> => {
  if (action.type === AppActions.RESET_STORE) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
