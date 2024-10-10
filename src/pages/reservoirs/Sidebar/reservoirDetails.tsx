import UserSelectors from "@/redux/user/selectors";
import Fields from "@/utilities/fields/field";
import moment from "moment";
import { getTranslation } from "@/translation/i18n";
import EditableReservoirField from "./editableReservoirField";
import { numberValidator } from "../../farm/CreateFarm/const";
import { User } from "@/pages/userManagement/types";
import ReservoirSelectors from "@/redux/reservoir/reservoirSelectors";
import { useAppSelector } from "@/hooks/redux";

const ReservoirDetails = () => {
  const selectedReservoir = useAppSelector(
    ReservoirSelectors.SelectSelectedReservoir
  );
  const users = useAppSelector(UserSelectors.selectUsers);

  const getSelectedUser = (userId: string) => {
    let selectedUserName = "";
    users.forEach((user: User) => {
      if (user.userId === userId)
        selectedUserName = `${user.firstName} ${user.lastName}`;
    });

    return selectedUserName;
  };

  const fileds = [
    {
      label: `${getTranslation("global.name")}`,
      value: (
        <EditableReservoirField
          fieldName="name"
          value={selectedReservoir?.name}
          placeholder={getTranslation(
            "reservoir.sideBar.reservoirDetails.namePlaceholder"
          )}
        >
          {selectedReservoir?.name}
        </EditableReservoirField>
      ),
    },
    {
      label: `${getTranslation("reservoir.reservoirCapacity")}`,
      value: (
        <div style={{ display: "flex", gap: "10px" }}>
          <EditableReservoirField
            fieldName="reservoirCapacity"
            value={selectedReservoir?.reservoirCapacity}
            placeholder={getTranslation(
              "reservoir.sideBar.reservoirDetails.reservoirCapacityPlaceholder"
            )}
            isParseField={true}
            customValidator={numberValidator}
          >
            {selectedReservoir?.reservoirCapacity}
          </EditableReservoirField>
          <div>{getTranslation("global.litre")}</div>
        </div>
      ),
    },
    {
      label: `${getTranslation("reservoir.nutrientWaterReservoirCapacity")}`,
      value: (
        <div style={{ display: "flex", gap: "10px" }}>
          <EditableReservoirField
            fieldName="nutrientWaterReservoirCapacity"
            value={selectedReservoir?.nutrientWaterReservoirCapacity}
            placeholder={getTranslation(
              "reservoir.sideBar.reservoirDetails.nutrientWaterReservoirCapacityPlaceholder"
            )}
            isParseField={true}
            customValidator={numberValidator}
          >
            {selectedReservoir?.nutrientWaterReservoirCapacity}
          </EditableReservoirField>
          <div>{getTranslation("global.litre")}</div>
        </div>
      ),
    },
    {
      label: `${getTranslation("reservoir.phReservoirCapacity")}`,
      value: (
        <div style={{ display: "flex", gap: "10px" }}>
          <EditableReservoirField
            fieldName="phReservoirCapacity"
            value={selectedReservoir?.phReservoirCapacity}
            placeholder={getTranslation(
              "reservoir.sideBar.reservoirDetails.phReservoirCapacityPlaceholder"
            )}
            isParseField={true}
            customValidator={numberValidator}
          >
            {selectedReservoir?.phReservoirCapacity}
          </EditableReservoirField>
          <div>{getTranslation("global.litre")}</div>
        </div>
      ),
    },
    {
      label: `${getTranslation("reservoir.stockNutrientSolutionCapacity")}`,
      value: (
        <div style={{ display: "flex", gap: "10px" }}>
          <EditableReservoirField
            fieldName="stockNutrientSolutionCapacity"
            value={selectedReservoir?.stockNutrientSolutionCapacity}
            placeholder={getTranslation(
              "reservoir.sideBar.reservoirDetails.stockNutrientSolutionCapacityPlaceholder"
            )}
            isParseField={true}
            customValidator={numberValidator}
          >
            {selectedReservoir?.stockNutrientSolutionCapacity}
          </EditableReservoirField>
          <div>{getTranslation("global.litre")}</div>
        </div>
      ),
    },
    {
      label: `${getTranslation("global.createdBy")}`,
      value: <span>{getSelectedUser(selectedReservoir?.createdBy)}</span>,
    },
    {
      label: `${getTranslation("global.createdDate")}`,
      value: (
        <span>
          {selectedReservoir?.createdDate
            ? moment(new Date(selectedReservoir.createdDate)).format(
                "DD-MM-YYYY"
              )
            : "-"}
        </span>
      ),
    },
    {
      label: `${getTranslation("global.updatedBy")}`,
      value: <span>{getSelectedUser(selectedReservoir?.updatedBy)}</span>,
    },
    {
      label: `${getTranslation("global.updatedDate")}`,
      value: (
        <span>
          {selectedReservoir?.updatedDate
            ? moment(new Date(selectedReservoir.updatedDate)).format(
                "DD-MM-YYYY"
              )
            : "-"}
        </span>
      ),
    },
  ];

  return (
    <>
      <Fields info={fileds} />
    </>
  );
};

export default ReservoirDetails;
