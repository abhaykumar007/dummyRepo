import SessionSelectors from "@/redux/session/selectors";
import { store } from "@/redux/store";
import sha256 from "crypto-js/sha256";

const encodePreferencesKey = (phoneNumber: string) =>
  sha256(`preferences:${phoneNumber}`).toString();

export const setAuthStatusInLocalStorage = (authStatus: boolean) => {
  localStorage.setItem(
    "growloc.isAuthed",
    authStatus ? "authenticated" : "unauthenticated"
  );
};

export const getIsAuthenticated = () => {
  const authStatus = localStorage.getItem("growloc.isAuthed");
  return authStatus === "authenticated";
};

export const getPreferenceValueFromStorage = (key: string) => {
  const userDetails = SessionSelectors.SelectUserDetails(store.getState());
  const phoneNumber = userDetails?.phone_number;

  if (!phoneNumber) return null;
  const preferences = localStorage.getItem(encodePreferencesKey(phoneNumber));
  if (preferences === null || preferences.toString() === "undefined")
    return null;
  return JSON.parse(preferences).current?.[key];
};

export const setPreferenceValueInStorage = (
  key: string,
  value: string | null
) => {
  const userDetails = SessionSelectors.SelectUserDetails(store.getState());
  const phoneNumber = userDetails.phone_number;

  const preferences = JSON.parse(
    localStorage.getItem(encodePreferencesKey(phoneNumber)) || "{}"
  );
  const current = preferences.current || {};
  current[key] = value;
  preferences.current = current;
  localStorage.setItem(
    encodePreferencesKey(phoneNumber),
    JSON.stringify(preferences)
  );
};
