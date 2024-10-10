import FullAlertError from "@/components/common/error/FullAlertError";
import Card from "@/components/ui/card";
import { useAppSelector } from "@/hooks/redux";
import DashboardActions from "@/redux/dashboard/action";
import DashboardSelectors from "@/redux/dashboard/dashboardSelector";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FarmSelectors from "@/redux/farm/farmSelectors";
import { getTranslation } from "@/translation/i18n";
import Fields from "@/utilities/fields/field";

const selectError = makeSelectErrorModel();

const DashboardHeader = () => {
  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);
  const selectedFarm = useAppSelector((state) =>
    FarmSelectors.SelectFarmByFarmId(state, selectedFarmId || "")
  );

  const farmMetrics = useAppSelector(DashboardSelectors.SelectFarmMetrics);

  const error = useAppSelector((state) =>
    selectError(state, DashboardActions.REQUEST_FARM_METRICS_FINISHED)
  );

  return (
    <div>
      <Card
        bordered={false}
        title={selectedFarm?.name ?? "-"}
        style={{ borderRadius: "10px" }}
      >
        {error && <FullAlertError error={error} />}

        {farmMetrics && !error && (
          <div style={{ display: "flex" }}>
            <div style={{ flex: "1" }}>
              <Fields
                info={[
                  {
                    label: getTranslation("global.polyhouses"),
                    value: farmMetrics.totalPolyhouses,
                  },
                  {
                    label: getTranslation("global.reservoirs"),
                    value: farmMetrics.totalReservoirs,
                  },
                ]}
              />
            </div>
            <div style={{ flex: "1" }}>
              <Fields
                info={[
                  {
                    label: getTranslation("global.nurseries"),
                    value: farmMetrics.totalNurseries,
                  },
                  {
                    label: getTranslation("global.zones"),
                    value: farmMetrics.totalZones,
                  },
                ]}
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardHeader;
