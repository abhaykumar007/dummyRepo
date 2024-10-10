import Card from "@/components/ui/card";
import { MdDelete } from "react-icons/md";
import Fields from "@/utilities/fields/field";
import { getTranslation } from "@/translation/i18n";
import { Zone } from "../../types";
import { errorDetail } from "@/types/error";

interface ZoneCardProps {
  zones: Zone[];
  onEdit: (zone: Zone) => void;
  onDelete: (zoneKey: string) => void;
  errors: errorDetail[];
}

const ZoneCard = ({ zones, onEdit, onDelete, errors }: ZoneCardProps) => {
  const hasErrors = (zone: Zone) =>
    errors.some((error) => error.location.includes(`zones.${zone.key}`));

  return (
    <>
      {zones.length === 0 && (
        <span
          style={{ color: "gray", display: "flex", justifyContent: "center" }}
        >
          {getTranslation("zone.noZones")}
        </span>
      )}

      <div
        style={{
          marginTop: "10px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
          gap: "10px",
        }}
      >
        {zones.map((zone, index) => (
          <div
            data-testid={`zone-card-${index}`}
            key={index}
            onClick={() => onEdit(zone)}
          >
            <Card
              bordered={false}
              title={`#${index + 1}`}
              style={{
                borderRadius: "10px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
              className={`cursor_pointer ${
                hasErrors(zone) ? "zone-card-error" : ""
              }`}
              extra={
                <div
                  style={{
                    color: "red",
                    fontSize: "25px",
                    cursor: "pointer",
                  }}
                  data-testid={`zone-card-delete-${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(String(zone.key));
                  }}
                >
                  <MdDelete />
                </div>
              }
            >
              <Fields
                info={[
                  {
                    label: `${getTranslation("global.name")}`,
                    value: <span style={{ width: "100%" }}>{zone.name}</span>,
                  },
                  {
                    label: `${getTranslation("global.area")}`,
                    value: `${zone.area}`,
                  },
                ]}
              />
            </Card>
            {hasErrors(zone) && (
              <span style={{ color: "red" }}>
                {getTranslation("global.errorOccured")}
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ZoneCard;
