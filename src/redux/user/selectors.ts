import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { userDenormalizeSchema } from "./schema";

class UserSelectors {

  public static selectNormalizedUsers(state: RootState) {
    return state?.users?.users;
  }

  public static selectSelectedUser(state: RootState) {
    return state.users.selectedUser;
  }
  
  public static selectUpdatedUser(state: RootState) {
    return state.users.updatedUser;
  }

  public static selectUserById = (state: RootState, userId: string) => {
    return state.users?.users?.entities?.users[userId];
  }

  static selectUsers = createSelector(
    (state) => state?.users?.users,
    (normalizedUser) => userDenormalizeSchema(normalizedUser)
  );

  static selectFilteredUsers = createSelector(
    (state: RootState) => UserSelectors.selectUsers(state),
    (state: RootState) => state.users.filter,
    (users, filter) => {
      if (!filter.search) return users;
      return users.filter((user:any) =>
        user.firstName.toLowerCase().includes(filter.search.toLowerCase())||
        user.lastName.toLowerCase().includes(filter.search.toLowerCase())
      );
    }
  );
  
  static SelectResetOTPSent = (state: RootState) =>
    !!state?.users?.passwordResetOTPSent;
}

export default UserSelectors;
