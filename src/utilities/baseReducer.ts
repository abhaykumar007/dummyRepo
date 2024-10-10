import AppActions from "@/redux/actions";

type State = any;

interface Methods {
  [key: string]: (state: State, action: any) => State;
}

export default function BaseReducer(
  initialState: State,
  methods: Methods,
  allowReset: boolean = true
) {
  return (state: State = initialState, action: any) => {
    // if the action type is used for a method name then this be a reference to it.
    const method = methods[action.type];
    // if action is to reset the state
    if (allowReset && action.type === AppActions.RESET_STORE) {
      return initialState;
    }
    // if the action type "method" const is undefined or the action is an error
    // return the state.
    if (!method || action.error) {
      return state;
    }
    // if there is a valid method call it with the state and action objects.
    return method(state, action);
  };
}
