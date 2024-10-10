import Button from "@/components/common/button";
import FullAlertError from "@/components/common/error/FullAlertError";
import Card from "@/components/ui/card";
import Table from "@/components/ui/table";
import routePaths from "@/config/routePaths";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { makeSelectErrorModel } from "@/redux/error/errorSelector";
import FarmSelectors from "@/redux/farm/farmSelectors";
import requestingSelector from "@/redux/requesting/requestingSelector";
import WorkflowActions from "@/redux/workflow/actions";
import WorkflowSelectors from "@/redux/workflow/selectors";
import { getTranslation } from "@/translation/i18n";
import { ReloadOutlined } from "@ant-design/icons";
import { TableProps } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { workflow } from "./types";

const selectError = makeSelectErrorModel();

const columns: TableProps["columns"] = [
  {
    title: getTranslation("global.name"),
    dataIndex: "name",
  },
  {
    title: getTranslation("global.createdDate"),
    dataIndex: "createdDate",
    render: (_, record) => {
      return moment(record.createdDate).format("DD MMM YYYY");
    },
  },
  {
    title: getTranslation("global.updatedDate"),
    dataIndex: "updatedDate",
    render: (_, record) => {
      return moment(record.updatedDate).format("DD MMM YYYY");
    },
  },
];

const Workflow = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const workflowList = useAppSelector(
    WorkflowSelectors.SelectDenormalizeWorkflow
  );

  const error = useAppSelector((state) =>
    selectError(state, WorkflowActions.REQUEST_WORKFLOW_FINISHED)
  );

  const loading = useAppSelector((state) =>
    requestingSelector(state, [WorkflowActions.REQUEST_WORKFLOW])
  );

  const selectedFarmId = useAppSelector(FarmSelectors.SelectSelectedFarmId);

  const handleInitWorkflowRequest = () => {
    if (selectedFarmId) {
      dispatch(WorkflowActions.requestWorkflow());
    }
  };

  const onRow: any = (record: workflow) => {
    return {
      onClick: () => {
        navigate(
          routePaths.templateUpdate.replace(":workflowId", record.workflowId)
        );
      },
    };
  };

  useEffect(() => {
    if (workflowList.length === 0) {
      handleInitWorkflowRequest();
    }
  }, [selectedFarmId]);

  return (
    <div className="workflow_list_details_container">
      <Card
        className="workflow_list_container"
        title={getTranslation("global.templates")}
        extra={
          <div className="workflow_header_container">
            <Button
              className="refreshButton"
              onClick={handleInitWorkflowRequest}
              loading={loading}
              icon={<ReloadOutlined style={{ color: "green" }} />}
              label={""}
              type="default"
              data-testid="refresh-btn"
            />

            <Button
              label={getTranslation("workflow.addTemplate")}
              style={{ padding: "none" }}
              onClick={() => {
                navigate(routePaths.templateCreate);
              }}
            />
          </div>
        }
      >
        <FullAlertError error={error} />

        <Table
          columns={columns}
          dataSource={workflowList}
          className="ant-border-space"
          onRow={onRow}
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>
    </div>
  );
};

export default Workflow;
