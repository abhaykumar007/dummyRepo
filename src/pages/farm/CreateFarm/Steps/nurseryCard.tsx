import Card from "@/components/ui/card";
import { MdDelete } from "react-icons/md";
import Fields from "@/utilities/fields/field";
import { getTranslation } from "@/translation/i18n";
import { Nursery } from "../../types";
import { errorDetail } from "@/types/error";

interface NurseryCardProps {
  nurseries: Nursery[];
  onEdit: (nursery: Nursery) => void;
  onDelete: (key: string) => void;
  errors: errorDetail[];
}

const NuseryCard = ({
  nurseries,
  onEdit,
  onDelete,
  errors,
}: NurseryCardProps) => {
  const hasErrors = (nursary: Nursery) =>
    errors.some((error) => error.location.includes(`nurseries.${nursary.key}`));

  return (
    <>
      {nurseries.length === 0 && (
        <span
          style={{ color: "gray", display: "flex", justifyContent: "center" }}
        >
          {getTranslation("nursery.noNurseries")}
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
        {nurseries.map((nusery, index) => (
          <div
            data-testid={`nusery-card-${index}`}
            key={index}
            onClick={() => onEdit(nusery)}
          >
            <Card
              bordered={false}
              title={`#${index + 1}`}
              style={{
                borderRadius: "10px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
              className={`cursor_pointer ${
                hasErrors(nusery) ? "zone-card-error" : ""
              }`}
              extra={
                <div
                  style={{
                    color: "red",
                    fontSize: "25px",
                  }}
                  data-testid={`nusery-card-delete-${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(String(nusery.key));
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
                    value: <span style={{ width: "100%" }}>{nusery.name}</span>,
                  },
                  {
                    label: `${getTranslation("global.area")}`,
                    value: `${nusery.area}`,
                  },
                ]}
              />
            </Card>

            {hasErrors(nusery) && (
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

export default NuseryCard;
