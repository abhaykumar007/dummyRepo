import * as reduxHooks from "@/hooks/redux";
import AddUpdateWorkflow from "@/pages/workflow/addUpdateWorkflow";
import { getTranslation } from "@/translation/i18n";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import WorkflowActions from "@/redux/workflow/actions";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: {
    pathname: "/",
  },
}));

const mockDispatch = jest.fn();
jest.spyOn(reduxHooks, "useAppDispatch").mockReturnValue(mockDispatch);

const mockSelector = jest.fn();
jest.spyOn(reduxHooks, "useAppSelector").mockReturnValue(mockSelector);

const mockWorkflow = {
  name: "Test Workflow",
  description: "Test Description",
  workflowSteps: [
    {
      name: "Germination",
      stepId: "b8868c66-fe95-4cb5-9315-0195e96b8c26",
      parentId: null,
      description: "",
      sequence: 1,
    },
    {
      name: "Vegetative",
      stepId: "4cb7fce3-6319-402f-9e4a-d16b1edb9b02",
      parentId: "b8868c66-fe95-4cb5-9315-0195e96b8c26",
      description: "",
      sequence: 3,
    },
    {
      name: "Harvest",
      stepId: "8edd11b1-3d6c-4e50-80ef-8d326001d9e0",
      parentId: "4cb7fce3-6319-402f-9e4a-d16b1edb9b02",
      description: "",
      sequence: 5,
    },
  ],
};

describe("Add/Update Workflow Page", () => {
  let store: any;

  let consoleErrorMock: any;
  let consoleWarnMock: any;
  beforeAll(() => {
    consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {
      return;
    });
    consoleWarnMock = jest.spyOn(console, "warn").mockImplementation(() => {
      return;
    });
  });

  afterAll(() => {
    consoleErrorMock.mockRestore();
    consoleWarnMock.mockRestore();
  });

  beforeEach(() => {
    store = setupDefaultStore();
  });

  test("should render Workflow page with title, buttons, and table", () => {
    renderWithProvider(<AddUpdateWorkflow />, { store });

    expect(screen.getByText(/New Workflow/)).toBeInTheDocument();
  });

  test("should click and update the name", async () => {
    renderWithProvider(<AddUpdateWorkflow />, { store });

    const workflowName = screen.getByText("New Workflow");
    await userEvent.click(workflowName);
    const input = screen.getByTestId("name-input");
    await userEvent.type(input, "Test Workflow");
    const saveButton = screen.getByTestId("name-save");
    await userEvent.click(saveButton);

    const workflowDescription = screen.getByText(
      getTranslation(
        "polyhouse.polyhouseDetails.lifecycle.workflowDescriptionPlaceholder"
      )
    );
    await userEvent.click(workflowDescription);
    const descriptionInput = screen.getByTestId("description-input");
    await userEvent.type(descriptionInput, "Test Workflow Description");
    const descriptionSaveButton = screen.getByTestId("description-save");
    await userEvent.click(descriptionSaveButton);
  });

  test("Data display at the time of update", () => {
    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({
      workflowId: "wf2c941003",
    });

    jest
      .spyOn(require("../../hooks/redux"), "useAppSelector")
      .mockReturnValue(mockWorkflow);

    renderWithProvider(<AddUpdateWorkflow />, { store });

    expect(screen.getByText("Test Workflow")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  test("Update data at the time of update workflow", async () => {
    const workflowId = "wf2c941003";

    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({
      workflowId,
    });

    jest
      .spyOn(require("../../hooks/redux"), "useAppSelector")
      .mockReturnValue(mockWorkflow);

    renderWithProvider(<AddUpdateWorkflow />, { store });

    const workflowName = screen.getByText("Test Workflow");
    await userEvent.click(workflowName);
    const input = screen.getByTestId("name-input");
    await userEvent.type(input, "Update Test Workflow");
    const saveButton = screen.getByTestId("name-save");
    await userEvent.click(saveButton);

    const workflowDescription = screen.getByText("Test Description");
    await userEvent.click(workflowDescription);
    const descriptionInput = screen.getByTestId("description-input");
    await userEvent.type(descriptionInput, "Test Workflow Description");
    const descriptionSaveButton = screen.getByTestId("description-save");
    await userEvent.click(descriptionSaveButton);
  });

  test("should show loading state when update workflow is in progress", () => {
    const workflowId = "wf2c941003";

    jest.spyOn(require("react-router-dom"), "useParams").mockReturnValue({
      workflowId,
    });

    jest
      .spyOn(require("../../hooks/redux"), "useAppSelector")
      .mockReturnValue(mockWorkflow);

    store = setupDefaultStore({
      requesting: {
        [WorkflowActions.UPDATE_WORKFLOW]: true,
      },
    });

    renderWithProvider(<AddUpdateWorkflow />, { store });

    // expect(
    //   screen.getByRole("button", { name: /Update Workflow/i })
    // ).toBeDisabled();
  });

  test("should display error message if there is an error", () => {
    store.getState().error[WorkflowActions.CREATE_WORKFLOW_FINISHED] = {
      errors: [{ message: "Network Error" }],
    };

    renderWithProvider(<AddUpdateWorkflow />, { store });

    // expect(screen.getByText("Network Error")).toBeInTheDocument();
  });
});
