import { useEffect, useState } from "react";
import { Divider, Popconfirm } from "antd";
import SideBar from "@/components/ui/sidebar";
import { getTranslation } from "@/translation/i18n";
import Dropdown from "@/components/ui/dropdown";
import Button from "@/components/common/button";
import { DeleteOutlined } from "@ant-design/icons";
import { BsThreeDots } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import requestingSelector from "@/redux/requesting/requestingSelector";
import ReservoirSelectors from "@/redux/reservoir/reservoirSelectors";
import ReservoirActions from "@/redux/reservoir/action";
import UserSelectors from "@/redux/user/selectors";
import UserActions from "@/redux/user/actions";
import ReservoirDetails from "./reservoirDetails";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FullAlertError from "@/components/common/error/FullAlertError";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";

const selectError = makeSelectErrorModel();

const ReservoirSideBar = () => {
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const selectedReservoir = useAppSelector(
    ReservoirSelectors.SelectSelectedReservoir
  );
  const users = useAppSelector(UserSelectors.selectUsers);
  const closeSidebar = () => {
    dispatch(ReservoirActions.setSelectedReservoir(null));
  };

  const loading = useAppSelector((state) =>
    requestingSelector(state, [ReservoirActions.DELETE_RESERVOIR])
  );

  const error = useAppSelector((state) =>
    selectError(state, ReservoirActions.DELETE_RESERVOIR_FINISHED)
  );

  useEffect(() => {
    if (users) dispatch(UserActions.fetchUsers());
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [selectedReservoir]);

  const deleteFarm = () => {
    dispatch(ReservoirActions.deleteReservoir());
  };

  return (
    <div className="shadow-box" style={{ marginTop: "20px" }}>
      <div style={{ height: "100%" }}>
        <SideBar
          isResponsive
          onClose={closeSidebar}
          isOpen={!!selectedReservoir}
        >
          <div style={{ padding: "20px 20px", width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                textAlign: "center",
              }}
            >
              <h5 style={{ fontSize: "130%" }}>
                <strong>
                  {getTranslation("reservoir.sideBar.reservoirDetails")}
                </strong>
              </h5>
              <div>
                <Dropdown
                  trigger={["click"]}
                  open={isMenuOpen}
                  onOpenChange={setIsMenuOpen}
                  dropdownRender={() => (
                    <div style={{ marginRight: "10px" }}>
                      <Popconfirm
                        title={getTranslation("global.areYouSure")}
                        okText={getTranslation("global.yes")}
                        cancelText={getTranslation("global.cancel")}
                        onCancel={() => setIsMenuOpen(false)}
                        onConfirm={deleteFarm}
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          type="primary"
                          label={getTranslation("global.delete")}
                          loading={loading}
                          style={{ padding: "0px 15px" }}
                          danger
                          iconPosition="start"
                        />
                      </Popconfirm>
                    </div>
                  )}
                  label={
                    <BsThreeDots
                      style={{
                        cursor: "pointer",
                        marginRight: "10px",
                      }}
                      fontSize={20}
                      data-testid="reservoir-sidebar-threeDots-icon"
                    />
                  }
                  isDownDropIconHide={true}
                />
                <IoClose
                  style={{ cursor: "pointer" }}
                  onClick={closeSidebar}
                  data-testid="reservoir-sidebar-close-btn"
                  fontSize={20}
                />
              </div>
            </div>
            <Divider />
            {error && <FullAlertError error={error} />}
            <ReservoirDetails />
          </div>
        </SideBar>
      </div>
    </div>
  );
};

export default ReservoirSideBar;
