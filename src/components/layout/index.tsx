import Main from "./Main";
import "./style.scss";
import "./responsive.scss";
import { useAppSelector } from "@/hooks/redux";
import SessionSelectors from "@/redux/session/selectors";
import { Navigate } from "react-router-dom";
import routePaths from "@/config/routePaths";
import { makeRequestingSelector } from "@/redux/requesting/requestingSelector";
import SessionActions from "@/redux/session/actions";
import PageLoading from "../common/loading/PageLoading";

const selectLoading = makeRequestingSelector();

const Layout = () => {
  const tokenLoading = useAppSelector((state) =>
    selectLoading(state, [SessionActions.REQUEST_REFRESH_TOKEN_SILENTLY])
  );

  const token = useAppSelector(SessionSelectors.SelectToken);

  if (tokenLoading) {
    return <PageLoading style={{ height: "100vh" }} />;
  }

  if (!token) {
    return <Navigate to={routePaths.login} />;
  }

  return <Main />;
};

export default Layout;
