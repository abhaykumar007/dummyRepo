import { createAction } from "@/utilities/actionUtility";

const RequestingActions = {
  SET_REQUESTING: "requesting/SET_REQUESTING",

  setRequesting: (type: string, value: boolean) =>
    createAction(RequestingActions.SET_REQUESTING, { type, value }),
};
export default RequestingActions;
