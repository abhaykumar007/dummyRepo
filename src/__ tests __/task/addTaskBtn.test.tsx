import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import AddTaskButton from "@/pages/tasks/addTaskButton";
import userEvent from "@testing-library/user-event";
import TaskActions from "@/redux/task/actions";
import dayjs from "dayjs";

describe("Add Task Button", () => {
  let store: any;
  let consoleErrorMock: any;
  let consoleWarnMock: any;
  beforeAll(() => {
    consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {
      return;
      // if (JSON.stringify(message)?.includes("findDOMNode is deprecated")) {
      //   return;
      // }
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
    store = setupDefaultStore({
      users: {
        users: {
          entities: {
            users: {
              "61530dca-7031-70da-b1d5-db5d1ecf29c2": {
                userId: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                firstName: "kamal",
                lastName: "kishor",
                phone: "+917070970050",
                roles: [
                  "OWNER",
                  "ADMIN",
                  "FARM_MANAGER",
                  "AGRONOMIST",
                  "VIEWER",
                ],
                role: null,
                organisationId: null,
                createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                updatedBy: null,
                createdDate: "2024-04-26T09:00:51.818Z",
                updatedDate: 0,
              },
              "f183bd4a-e0b1-7023-ea73-efa364453725": {
                userId: "f183bd4a-e0b1-7023-ea73-efa364453725",
                firstName: "kamaly",
                lastName: "kishortu",
                phone: "+917070970051",
                roles: ["ADMIN"],
                role: null,
                organisationId: null,
                createdBy: "f183bd4a-e0b1-7023-ea73-efa364453725",
                updatedBy: null,
                createdDate: "2024-06-04T14:39:12.975Z",
                updatedDate: 0,
              },
            },
          },
          result: [
            "61530dca-7031-70da-b1d5-db5d1ecf29c2",
            "f183bd4a-e0b1-7023-ea73-efa364453725",
          ],
        },
        selectedUser: null,
      },
      inventories: {
        inventories: {
          entities: {
            inventories: {
              "66b1bb23e33955b963f179a1": {
                inventoryId: "66b1bb23e33955b963f179a1",
                productId: "6626234c3c4db8c98290828e",
                name: "NPK",
                farmId: "fm1a215ac2",
                description: null,
                provider: "provider1",
                quantity: 4,
                unit: "L",
                used: 1,
                wastage: 3,
                createdBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                updatedBy: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
                createdDate: "2024-08-06T05:56:51.325Z",
                updatedDate: "2024-08-12T12:54:41.287Z",
                key: 0,
              },
            },
          },
          result: ["66b1bb23e33955b963f179a1"],
        },
      },

      tasks: {
        open: {
          tasks: [],
          total: 0,
        },
        inProgress: {
          tasks: [],
          total: 0,
        },
        inReview: {
          tasks: [],
          total: 0,
        },
        closed: {
          tasks: [],
          total: 0,
        },
        cancelled: {
          tasks: [],
          total: 0,
        },
      },
      farms: {
        selectedFarmId: "fm1a215ac2",
      },
    });
  });
  it("should render modal on button click", () => {
    renderWithProvider(<AddTaskButton />, { store });
    const button = screen.getByRole("button", { name: /Add Task/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByTestId("add-task-modal")).toBeInTheDocument();
  });
  it("should close modal on cancel", () => {
    renderWithProvider(<AddTaskButton />, { store });
    const button = screen.getByRole("button", { name: /Add Task/i });
    fireEvent.click(button);
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(screen.queryByTestId("add-task-modal")).not.toBeInTheDocument();
  });
  it("should display error message on clicking ok without filling form", async () => {
    renderWithProvider(<AddTaskButton />, { store });
    const button = screen.getByRole("button", { name: /Add Task/i });
    fireEvent.click(button);

    const okButton = screen.getByRole("button", { name: "Add" });
    await userEvent.click(okButton);
    await waitFor(() => {
      expect(screen.getByText("Please input name")).toBeInTheDocument();
      expect(screen.getByText("Please select category")).toBeInTheDocument();
      expect(screen.getByText("Please select assignee"));
    });
  });

  it("Add button should be disabled on loading", async () => {
    store = setupDefaultStore({
      users: {
        users: {},
        selectedUser: null,
      },
      requesting: {
        [TaskActions.CREATE_TASK]: true,
      },
      inventories: {
        inventories: {
          entities: { inventories: {} },
          result: [],
        },
      },
      tasks: {
        open: {
          tasks: [],
          total: 0,
        },
        inProgress: {
          tasks: [],
          total: 0,
        },
        inReview: {
          tasks: [],
          total: 0,
        },
        closed: {
          tasks: [],
          total: 0,
        },
        cancelled: {
          tasks: [],
          total: 0,
        },
      },
    });
    renderWithProvider(<AddTaskButton />, { store });
    const button = screen.getByRole("button", { name: /Add Task/i });
    fireEvent.click(button);
    expect(screen.getByRole("img", { name: "loading" })).toBeInTheDocument();
  });
  it("dispatches create task action on clicking ok", async () => {
    renderWithProvider(<AddTaskButton />, { store });
    const button = screen.getByRole("button", { name: /Add Task/i });

    fireEvent.click(button);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test" },
    });

    const categorySelect =
      screen.getByTestId("category-select").firstElementChild;
    if (categorySelect) {
      await userEvent.click(categorySelect);
    }

    const cleaningOption = await screen.findAllByText("Cleaning");
    await userEvent.click(cleaningOption[1]);

    const assigneeSelect =
      screen.getByTestId("assignee-select").firstElementChild;
    if (assigneeSelect) {
      await userEvent.click(assigneeSelect);
    }

    const kamalOption = await screen.findByText("kamal kishor");
    await userEvent.click(kamalOption);
    const descriptionInput = screen.getByTestId("description-text-editor");
    const editor = descriptionInput.querySelector(".ql-editor");
    if (editor) await userEvent.type(editor, "Hello, React Quill!");

    const inventorySelect =
      screen.getByTestId("inventory-select").firstElementChild;
    if (inventorySelect) {
      await userEvent.click(inventorySelect);
      await userEvent.click(await screen.findByText("NPK"));
    }

    const quantityInput = screen.getByLabelText("Quantity");
    await userEvent.type(quantityInput, "1");
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    await waitFor(async () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        TaskActions.createTask({
          taskName: "Test",
          category: "Cleaning",
          severity: 1,
          createdFor: "61530dca-7031-70da-b1d5-db5d1ecf29c2",
          farmId: "fm1a215ac2",
          inventoryId: "66b1bb23e33955b963f179a1",
          itemName: "NPK",
          qty: 1,
          dueDate: dayjs(new Date().setHours(0, 0, 0, 0)),
          description: "<p><br></p><p>Hello, React Quill!</p>",
        })
      );
    });
  });
  it("should render error banner on error", async () => {
    store = setupDefaultStore({
      users: {
        users: {},
        selectedUser: null,
      },
      error: {
        "tasks/CREATE_TASK_FINISHED": {
          errors: [
            {
              error: "ERROR_BAD_REQUEST",
              message: "quantity must be less than or equal to 38",
              type: "error",
              location: "",
            },
          ],
          exception: "BadRequestException",
          path: "/v2/tasks",
          code: 400,
          timestamp: 1723429897955,
          actionType: "tasks/CREATE_TASK_FINISHED",
        },
      },
      inventories: {
        inventories: {
          entities: { inventories: {} },
          result: [],
        },
      },
      tasks: {
        open: {
          tasks: [],
          total: 0,
        },
        inProgress: {
          tasks: [],
          total: 0,
        },
        inReview: {
          tasks: [],
          total: 0,
        },
        closed: {
          tasks: [],
          total: 0,
        },
        cancelled: {
          tasks: [],
          total: 0,
        },
      },
    });
    renderWithProvider(<AddTaskButton />, { store });
    const button = screen.getByRole("button", { name: /Add Task/i });
    fireEvent.click(button);
    expect(
      screen.getByText("quantity must be less than or equal to 38")
    ).toBeInTheDocument();
  });
  // it("should render error on field on error", async () => {
  //   store = setupDefaultStore({
  //     users: {
  //       users: {},
  //       selectedUser: null,
  //     },
  //     error: {
  //       "tasks/CREATE_TASK_FINISHED": {
  //         errors: [
  //           {
  //             error: "ERROR_BAD_REQUEST",
  //             message: "quantity must be less than or equal to 38",
  //             type: "error",
  //             location: "qty",
  //           },
  //         ],
  //         exception: "FieldLevelException",
  //         path: "/v2/tasks",
  //         code: 400,
  //         timestamp: 1723429897955,
  //         actionType: "tasks/CREATE_TASK_FINISHED",
  //       },
  //     },
  //     inventories: {
  //       inventories: {
  //         entities: { inventories: {} },
  //         result: [],
  //       },
  //     },
  //     tasks: {
  //       open: {
  //         tasks: [],
  //         total: 0,
  //       },
  //       inProgress: {
  //         tasks: [],
  //         total: 0,
  //       },
  //       inReview: {
  //         tasks: [],
  //         total: 0,
  //       },
  //       closed: {
  //         tasks: [],
  //         total: 0,
  //       },
  //       cancelled: {
  //         tasks: [],
  //         total: 0,
  //       },
  //     },
  //   });
  //   renderWithProvider(<AddTaskButton />, { store });
  //   const button = screen.getByRole("button", { name: /Add Task/i });
  //   await userEvent.click(button);
  //   await waitFor(()=>{
  //     expect(screen.getByText("quantity must be less than or equal to 38")).toBeInTheDocument();
  //   });
  // });
  it("should close modal on close button click", async () => {
    renderWithProvider(<AddTaskButton />, { store });
    const button = screen.getByRole("button", { name: /Add Task/i });
    fireEvent.click(button);
    expect(screen.getByTestId("add-task-modal")).toBeInTheDocument();
    const closeButton = screen.getAllByRole("button", { name: /Close/i });
    await userEvent.click(closeButton[0]);
    expect(screen.queryByTestId("add-task-modal")).not.toBeInTheDocument();
  });
});
