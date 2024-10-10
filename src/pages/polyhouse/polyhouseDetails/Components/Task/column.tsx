import { severityToLabel, taskStatusValueToLabel } from "@/pages/tasks/utils";
import { getTranslation } from "@/translation/i18n";
import { getDateInStandardFormat } from "@/utilities/time";

const columns: any = [
  {
    title: getTranslation("global.name"),
    dataIndex: "taskName",
    key: "1",
  },

  {
    title: getTranslation("global.category"),
    dataIndex: "category",
    key: "2",
  },
  {
    title: getTranslation("task.severity"),
    dataIndex: "severity",
    key: "3",
    render: (severity: number) => severityToLabel[severity],
  },
  {
    title: getTranslation("global.status"),
    dataIndex: "status",
    key: "4",
    render: (status: string) => (taskStatusValueToLabel[status]),
  },
  {
    title: getTranslation("task.dueDate"),
    dataIndex: "dueDate",
    key: "5",
    render: (dueDate: any) => (
      <span>{getDateInStandardFormat(dueDate)}</span>
    
    )
  },
];

export default columns;
