import * as reduxHooks from "@/hooks/redux";

import Workflow from "@/pages/workflow";
import WorkflowActions from "@/redux/workflow/actions";
import { getTranslation } from "@/translation/i18n";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import routePaths from "@/config/routePaths";

const dummyWorkflows = {
  entities: {
    workflows: {
      wf2c941003: {
        name: "Workflow 1",
        createdDate: "2024-09-10T10:19:55.876Z",
        updatedDate: "2024-09-11T11:32:58.440Z",
        workflowId: "wf2c941003",
      },
      wf2c941004: {
        name: "Workflow 2",
        createdDate: "2024-09-12T11:32:58.440Z",
        updatedDate: "2024-09-15T11:32:58.440Z",
        workflowId: "wf2c941004",
      },
    },
  },
  result: ["wf2c941003", "wf2c941004"],
};

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
jest.spyOn(reduxHooks, "useAppDispatch").mockReturnValue(mockDispatch);

describe("Workflow Page", () => {
  let store: any;

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("should render Workflow page with title, buttons, and table", () => {
    renderWithProvider(<Workflow />, { store });

    expect(
      screen.getByText(getTranslation("global.workflows"))
    ).toBeInTheDocument();

    expect(screen.getByTestId("refresh-btn")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: getTranslation("workflow.addWorkflow"),
      })
    ).toBeInTheDocument();

    expect(screen.getByText(getTranslation("global.name"))).toBeInTheDocument();
    expect(
      screen.getByText(getTranslation("global.createdDate"))
    ).toBeInTheDocument();
    expect(
      screen.getByText(getTranslation("global.updatedDate"))
    ).toBeInTheDocument();
  });

  test("should call handleInitWorkflowRequest when workflowList is empty", () => {
    renderWithProvider(<Workflow />, { store });

    expect(mockDispatch).toHaveBeenCalledWith(
      WorkflowActions.requestWorkflow()
    );
  });

  test("should call handleInitWorkflowRequest on refresh button click", async () => {
    renderWithProvider(<Workflow />, { store });

    await userEvent.click(screen.getByTestId("refresh-btn"));

    expect(mockDispatch).toHaveBeenCalledWith(
      WorkflowActions.requestWorkflow()
    );
  });

  test("should navigate to workflowCreate on Add Workflow button click", async () => {
    renderWithProvider(<Workflow />, { store });

    await userEvent.click(
      screen.getByRole("button", {
        name: getTranslation("workflow.addWorkflow"),
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith(routePaths.templateCreate);
  });

  test("should render correct number of rows in the table", () => {
    store.getState().workflows.workflows = dummyWorkflows;

    renderWithProvider(<Workflow />, { store });

    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  test("should render row with proper data in the table", () => {
    store.getState().workflows.workflows = dummyWorkflows;

    renderWithProvider(<Workflow />, { store });

    expect(screen.getByText("Workflow 1")).toBeInTheDocument();
    expect(screen.getByText("10 Sep 2024")).toBeInTheDocument();
    expect(screen.getByText("11 Sep 2024")).toBeInTheDocument();
  });

  test("should navigate to workflowUpdate on row click", async () => {
    store.getState().workflows.workflows = dummyWorkflows;

    renderWithProvider(<Workflow />, { store });

    await userEvent.click(screen.getByText("Workflow 1"));

    expect(mockNavigate).toHaveBeenCalledWith(
      routePaths.templateUpdate.replace(":workflowId", "wf2c941003")
    );
  });

  test("should display loading indicator when loading is true", () => {
    store.getState().requesting[WorkflowActions.REQUEST_WORKFLOW] = true;

    renderWithProvider(<Workflow />, { store });

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("should display error message if there is an error", () => {
    store.getState().error[WorkflowActions.REQUEST_WORKFLOW_FINISHED] = {
      errors: [{ message: "Network Error" }],
    };

    renderWithProvider(<Workflow />, { store });

    expect(screen.getByText("Network Error")).toBeInTheDocument();
  });
});
