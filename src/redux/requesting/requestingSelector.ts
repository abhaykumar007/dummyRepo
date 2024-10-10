import { getKeyForAction } from "@/utilities/actionUtility";
import { createSelector } from "@reduxjs/toolkit";

type requesting = { [key: string]: boolean };

interface State {
  requesting: requesting;
}

function selectRequesting(
  requestingState: requesting,
  actionTypes: string[],
  scope: string
) {
  return actionTypes.some((actionType: string) => {
    return !!requestingState[getKeyForAction(actionType, scope)];
  });
}

const requestingSelector = createSelector(
  (state: State) => state.requesting,
  (_, actionTypes: string[]) => actionTypes,
  (_, __, scope: string = "") => scope,
  selectRequesting
);
export default requestingSelector;
export const makeRequestingSelector = () => requestingSelector;
