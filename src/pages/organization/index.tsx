import AlertError from "@/components/common/error/AlertError";
import routePaths from "@/config/routePaths";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import OrganizationActions from "@/redux/organization/actions";
import OrganizationSelectors from "@/redux/organization/selectors";
import { makeRequestingSelector } from "@/redux/requesting/requestingSelector";
import { getTranslation } from "@/translation/i18n";
import { Images } from "@/utilities/imagesPath";
import { Skeleton } from "antd";
import { useEffect } from "react";
import { TiTick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { organization } from "./type";

const OrganizationCard = ({
  isActive,
  loading,
  data,
  onClick,
}: {
  isActive?: boolean;
  loading?: boolean;
  data: organization;
  onClick: (organisationId: string) => void;
}) => {
  const isOrganizationSelected = !loading && isActive;

  return (
    <div
      className={`organization_card ${
        isOrganizationSelected ? "selected_organization_card" : ""
      }`}
      onClick={() => onClick(data.organisationId)}
    >
      {loading ? (
        <>
          <Skeleton.Image active={true} className="loading_organization_logo" />
          <Skeleton.Input />
        </>
      ) : (
        <>
          <div className="organization_logo">
            <img
              // src={data?.logo ? data.logo : Images.NO_IMAGE}
              src={Images.NO_IMAGE}
              alt="logo"
              className="image"
            />
          </div>
          <p className="heading2">{data.organisationName}</p>
        </>
      )}

      {isOrganizationSelected && (
        <div className="selected_organization_tick">
          <TiTick />
        </div>
      )}
    </div>
  );
};

const selectLoading = makeRequestingSelector();
const selectError = makeSelectErrorModel();

const Organization = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const organizations = useAppSelector(
    OrganizationSelectors.SelectOrganization
  );
  const selectedOrganizationId = useAppSelector(
    OrganizationSelectors.SelectSelectedOrganizationId
  );

  const error = useAppSelector((state) =>
    selectError(state, OrganizationActions.REQUEST_ORGANIZATION_FINISHED)
  );
  const loading = useAppSelector((state) =>
    selectLoading(state, [OrganizationActions.REQUEST_ORGANIZATION])
  );
  const organizationList = loading ? new Array(5).fill("") : organizations;

  const handleSelectOrganization = (organisationId: string) => {
    dispatch(OrganizationActions.selectOrganization(organisationId));
    navigate(routePaths.farm);
  };

  useEffect(() => {
    if (organizations.length === 0) {
      dispatch(OrganizationActions.requestOrganization());
    }
  }, []);

  return (
    <div className="organization_container">
      <p className="heading1 organization_text">
        {getTranslation("organization.selectYourOrganization")}
      </p>

      <AlertError error={error} />

      <div className="organization_card_container">
        {organizationList.map((organization: organization) => (
          <OrganizationCard
            key={organization.organisationId}
            data={organization}
            isActive={selectedOrganizationId === organization.organisationId}
            loading={loading}
            onClick={handleSelectOrganization}
          />
        ))}
      </div>
    </div>
  );
};

export default Organization;
