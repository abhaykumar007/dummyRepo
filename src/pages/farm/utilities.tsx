import { getTranslation } from "@/translation/i18n";
import { Device } from "./types";
export const deviceValue = (device: Device | null | undefined) => {
  const getStatusTag = (label: string, color: string) => (
    <span className="activeTag" style={{ backgroundColor: color }}>
      {label}
    </span>
  );

  if (!device) {
    return getStatusTag(getTranslation("farm.device.notConfigured"), "orange");
  }

  switch (device.status) {
    case "up":
      return getStatusTag(getTranslation("farm.device.active"), "green");
    case "down":
      return getStatusTag(getTranslation("farm.device.down"), "red");
    default:
      return null;
  }
};
