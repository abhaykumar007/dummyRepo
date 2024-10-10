import { store } from "@/redux/store";
import UserSelectors from "@/redux/user/selectors";

export const getUserFullName = (userId: string): string => {
  const user = UserSelectors.selectUserById(store.getState(), userId);
  if (user) return `${user?.firstName} ${user?.lastName}`;
  return "";
};
