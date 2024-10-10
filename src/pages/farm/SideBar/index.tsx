import { useEffect, useState } from "react";
import { Divider, Popconfirm } from "antd";
import SideBar from "@/components/ui/sidebar";
import FarmSelectors from "@/redux/farm/farmSelectors";
import FarmActions from "@/redux/farm/action";
import UserActions from "@/redux/user/actions";
import { getTranslation } from "@/translation/i18n";
import FarmDetails from "./farmDetails";
import UserSelectors from "@/redux/user/selectors";
import Dropdown from "@/components/ui/dropdown";
import Button from "@/components/common/button";
import { DeleteOutlined } from "@ant-design/icons";
import { BsThreeDots } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import requestingSelector from "@/redux/requesting/requestingSelector";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import ScrollWrapper from "@/components/common/ScrollWrapper";
import FullAlertError from "@/components/common/error/FullAlertError";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";

const selectError = makeSelectErrorModel();

const FarmSideBar = () => {
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const selectedFarm = useAppSelector(FarmSelectors.SelectSelectedFarm);
  const users = useAppSelector(UserSelectors.selectUsers);

  const closeSidebar = () => {
    dispatch(FarmActions.setSelectedFarm(null));
  };

  const error = useAppSelector((state) =>
    selectError(state, FarmActions.DELETE_FARM_FINISHED)
  );

  const loading = useAppSelector((state) =>
    requestingSelector(state, [FarmActions.DELETE_FARM])
  );

  useEffect(() => {
    if (users) dispatch(UserActions.fetchUsers());
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [selectedFarm]);

  const deleteFarm = () => {
    dispatch(FarmActions.deleteFarm());
  };

  return (
    <div className="shadow-box" style={{ marginTop: "20px" }}>
      <div style={{ height: "100%" }}>
        <ScrollWrapper maxHeight="600px">
          <SideBar isResponsive onClose={closeSidebar} isOpen={!!selectedFarm}>
            <div style={{ padding: "20px 20px", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  textAlign: "center",
                }}
              >
                <h5 style={{ fontSize: "130%" }}>
                  <strong>{getTranslation("farm.farmDetails")}</strong>
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
                        data-testid="farm-sidebar-threeDots-icon"
                      />
                    }
                    isDownDropIconHide={true}
                  />
                  <IoClose
                    style={{ cursor: "pointer" }}
                    onClick={closeSidebar}
                    data-testid="farm-sidebar-close-btn"
                    fontSize={20}
                  />
                </div>
              </div>
              <Divider />

              {error && <FullAlertError error={error} />}
              <div>
                <FarmDetails />
              </div>
            </div>
          </SideBar>
        </ScrollWrapper>
      </div>
    </div>
  );
};

export default FarmSideBar;
