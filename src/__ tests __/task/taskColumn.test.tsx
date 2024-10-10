import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupDefaultStore } from "../utils/setupTests";
import { renderWithProvider } from "../utils/testUtils";
import TaskColumn from "@/pages/tasks/taskColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import TaskActions from "@/redux/task/actions";
import { taskStatusKeyToValue } from "@/pages/tasks/utils";

describe("Task Column", () => {
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
        users: {},
        selectedUser: null,
      },
      inventories: {
        inventories: {
          entities: { inventories: {} },
          result: [],
        },
      },
      tasks: {
        tasks: {
          open: {
            tasks: [],
            total: 0,
          },
          inProgress: {
            tasks: [
              {
                taskId: "66aa1649806aafc4c874ecff",
                farmId: "fm0a0a202e",
                polyhouseId: null,
                nurseryId: null,
                zoneId: null,
                cropLifeCycleId: null,
                severity: 1,
                taskName: "Desc test",
                category: "Water Quality",
                dueDate: "2024-07-31T10:46:49.594Z",
                startTime: "2024-07-31T10:47:37.892Z",
                endTime: null,
                description:
                  '<p><img src="data:image/jpeg;base64,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"></p><p><br></p><p>cleared pic</p>',
                itemName: null,
                qty: null,
                status: "IN_PROGRESS",
                createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdFor: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdByName: "Ravi  Soni",
                updatedByName: "Ravi  Soni",
                createdForName: "Ravi  Soni",
                createdDate: "2024-07-31T10:47:37.892Z",
                updatedDate: "2024-07-31T12:31:41.843Z",
                isWhatsAppMsgSent: false,
                tasksHistory: [
                  {
                    tasksHistoryId: "th1a8fea8e",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>beer</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:47:50.429Z",
                    updatedDate: "2024-07-31T11:47:50.429Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th6187bb7d",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>sobjer</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:31:22.784Z",
                    updatedDate: "2024-07-31T11:31:22.784Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th9c3430ca",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>test2</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:19:48.562Z",
                    updatedDate: "2024-07-31T11:19:48.562Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "thcaf69af4",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>test</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:08:39.129Z",
                    updatedDate: "2024-07-31T11:08:39.129Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th2d51d5da",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>hello</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:06:41.468Z",
                    updatedDate: "2024-07-31T11:06:41.468Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                ],
              },
              {
                taskId: "66a33ea4b431b975d7829ff9",
                farmId: "fm0a0a202e",
                polyhouseId: null,
                nurseryId: null,
                zoneId: null,
                cropLifeCycleId: null,
                severity: 0,
                taskName: "task3",
                category: "Irrigation",
                dueDate: "2024-08-28T18:30:00.000Z",
                startTime: "2024-07-26T06:13:56.657Z",
                endTime: null,
                description: null,
                itemName: null,
                qty: null,
                status: "IN_PROGRESS",
                createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdFor: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdByName: "Ravi  Soni",
                updatedByName: "Ravi  Soni",
                createdForName: "Ravi  Soni",
                createdDate: "2024-07-26T06:13:56.657Z",
                updatedDate: "2024-07-30T11:40:29.714Z",
                isWhatsAppMsgSent: true,
                tasksHistory: [
                  {
                    tasksHistoryId: "th855811b0",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>foughr</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T12:04:02.293Z",
                    updatedDate: "2024-07-31T12:04:02.293Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th761cc924",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>sought</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T12:03:31.526Z",
                    updatedDate: "2024-07-31T12:03:31.526Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th7b4c3283",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>treat</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:49:59.369Z",
                    updatedDate: "2024-07-31T11:49:59.369Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th1a1218e6",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>trafe</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:49:36.324Z",
                    updatedDate: "2024-07-31T11:49:36.324Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th1223b269",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>bro</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:49:16.303Z",
                    updatedDate: "2024-07-31T11:49:16.303Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                ],
              },
            ],
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
        filters: {
          user: null,
          search: null,
        },
      },
    });
  });
  it("should call fetchTasks on mount", async () => {
    store = setupDefaultStore({
      users: {
        users: {},
        selectedUser: null,
      },
      inventories: {
        inventories: {
          entities: { inventories: {} },
          result: [],
        },
      },
      tasks: {
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
        filters: {
          user: null,
          search: null,
        },
      },
      farms: {
        selectedFarmId: "fm0a0a202e",
      },
    });
    renderWithProvider(
      <DragDropContext onDragEnd={() => {}}>
        <TaskColumn
          column={{
            title: "In Progress",
            key: "inProgress",
            titleColor: "#00DDFF",
          }}
        />
      </DragDropContext>,
      { store }
    );
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        TaskActions.fetchTasks(
          { status: taskStatusKeyToValue.inProgress },
          "inProgress"
        )
      );
    });
  });
  it("It should render in progress column", async () => {
    renderWithProvider(
      <DragDropContext onDragEnd={() => {}}>
        <TaskColumn
          column={{
            title: "In Progress",
            key: "inProgress",
            titleColor: "#00DDFF",
          }}
        />
      </DragDropContext>,

      { store }
    );
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Desc test")).toBeInTheDocument();
  });
  it("It should select task on click", async () => {
    renderWithProvider(
      <DragDropContext onDragEnd={() => {}}>
        <TaskColumn
          column={{
            title: "In Progress",
            key: "inProgress",
            titleColor: "#00DDFF",
          }}
        />
      </DragDropContext>,

      { store }
    );
    const task = screen.getByText("Desc test");
    fireEvent.click(task);
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        TaskActions.selectTask({
          taskId: "66aa1649806aafc4c874ecff",
          farmId: "fm0a0a202e",
          polyhouseId: null,
          nurseryId: null,
          zoneId: null,
          cropLifeCycleId: null,
          severity: 1,
          taskName: "Desc test",
          category: "Water Quality",
          dueDate: "2024-07-31T10:46:49.594Z",
          startTime: "2024-07-31T10:47:37.892Z",
          endTime: null,
          description:
            '<p><img src="data:image/jpeg;base64,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"></p><p><br></p><p>cleared pic</p>',
          itemName: null,
          qty: null,
          status: "IN_PROGRESS",
          createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          createdFor: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
          createdByName: "Ravi  Soni",
          updatedByName: "Ravi  Soni",
          createdForName: "Ravi  Soni",
          createdDate: "2024-07-31T10:47:37.892Z",
          updatedDate: "2024-07-31T12:31:41.843Z",
          isWhatsAppMsgSent: false,
          tasksHistory: [
            {
              tasksHistoryId: "th1a8fea8e",
              taskId: "66aa1649806aafc4c874ecff",
              userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              comment: "<p>beer</p>",
              createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              createdDate: "2024-07-31T11:47:50.429Z",
              updatedDate: "2024-07-31T11:47:50.429Z",
              images: null,
              video: null,
              createdByName: "Ravi  Soni",
              updatedByName: "Ravi  Soni",
            },
            {
              tasksHistoryId: "th6187bb7d",
              taskId: "66aa1649806aafc4c874ecff",
              userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              comment: "<p>sobjer</p>",
              createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              createdDate: "2024-07-31T11:31:22.784Z",
              updatedDate: "2024-07-31T11:31:22.784Z",
              images: null,
              video: null,
              createdByName: "Ravi  Soni",
              updatedByName: "Ravi  Soni",
            },
            {
              tasksHistoryId: "th9c3430ca",
              taskId: "66aa1649806aafc4c874ecff",
              userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              comment: "<p>test2</p>",
              createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              createdDate: "2024-07-31T11:19:48.562Z",
              updatedDate: "2024-07-31T11:19:48.562Z",
              images: null,
              video: null,
              createdByName: "Ravi  Soni",
              updatedByName: "Ravi  Soni",
            },
            {
              tasksHistoryId: "thcaf69af4",
              taskId: "66aa1649806aafc4c874ecff",
              userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              comment: "<p>test</p>",
              createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              createdDate: "2024-07-31T11:08:39.129Z",
              updatedDate: "2024-07-31T11:08:39.129Z",
              images: null,
              video: null,
              createdByName: "Ravi  Soni",
              updatedByName: "Ravi  Soni",
            },
            {
              tasksHistoryId: "th2d51d5da",
              taskId: "66aa1649806aafc4c874ecff",
              userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              comment: "<p>hello</p>",
              createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
              createdDate: "2024-07-31T11:06:41.468Z",
              updatedDate: "2024-07-31T11:06:41.468Z",
              images: null,
              video: null,
              createdByName: "Ravi  Soni",
              updatedByName: "Ravi  Soni",
            },
          ],
        })
      );
    });
  });
  it("should loading on fetching data", async () => {
    store = setupDefaultStore({
      users: {
        users: {},
        selectedUser: null,
      },
      inventories: {
        inventories: {
          entities: { inventories: {} },
          result: [],
        },
      },
      tasks: {
        tasks: {
          open: {
            tasks: [],
            total: 0,
          },
          inProgress: {
            tasks: [
              {
                taskId: "66aa1649806aafc4c874ecff",
                farmId: "fm0a0a202e",
                polyhouseId: null,
                nurseryId: null,
                zoneId: null,
                cropLifeCycleId: null,
                severity: 1,
                taskName: "Desc test",
                category: "Water Quality",
                dueDate: "2024-07-31T10:46:49.594Z",
                startTime: "2024-07-31T10:47:37.892Z",
                endTime: null,
                description:
                  '<p><img src="data:image/jpeg;base64,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"></p><p><br></p><p>cleared pic</p>',
                itemName: null,
                qty: null,
                status: "IN_PROGRESS",
                createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdFor: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdByName: "Ravi  Soni",
                updatedByName: "Ravi  Soni",
                createdForName: "Ravi  Soni",
                createdDate: "2024-07-31T10:47:37.892Z",
                updatedDate: "2024-07-31T12:31:41.843Z",
                isWhatsAppMsgSent: false,
                tasksHistory: [
                  {
                    tasksHistoryId: "th1a8fea8e",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>beer</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:47:50.429Z",
                    updatedDate: "2024-07-31T11:47:50.429Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th6187bb7d",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>sobjer</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:31:22.784Z",
                    updatedDate: "2024-07-31T11:31:22.784Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th9c3430ca",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>test2</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:19:48.562Z",
                    updatedDate: "2024-07-31T11:19:48.562Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "thcaf69af4",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>test</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:08:39.129Z",
                    updatedDate: "2024-07-31T11:08:39.129Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th2d51d5da",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>hello</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:06:41.468Z",
                    updatedDate: "2024-07-31T11:06:41.468Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                ],
              },
              {
                taskId: "66a33ea4b431b975d7829ff9",
                farmId: "fm0a0a202e",
                polyhouseId: null,
                nurseryId: null,
                zoneId: null,
                cropLifeCycleId: null,
                severity: 0,
                taskName: "task3",
                category: "Irrigation",
                dueDate: "2024-08-14T18:30:00.000Z",
                startTime: "2024-07-26T06:13:56.657Z",
                endTime: null,
                description: "<p>jjkj</p>",
                itemName: null,
                qty: null,
                status: "IN_PROGRESS",
                createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdFor: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdByName: "Ravi  Soni",
                updatedByName: "Ravi  Soni",
                createdForName: "Ravi  Soni",
                createdDate: "2024-07-26T06:13:56.657Z",
                updatedDate: "2024-07-30T11:40:29.714Z",
                isWhatsAppMsgSent: true,
                tasksHistory: [
                  {
                    tasksHistoryId: "th855811b0",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>foughr</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T12:04:02.293Z",
                    updatedDate: "2024-07-31T12:04:02.293Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th761cc924",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>sought</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T12:03:31.526Z",
                    updatedDate: "2024-07-31T12:03:31.526Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th7b4c3283",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>treat</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:49:59.369Z",
                    updatedDate: "2024-07-31T11:49:59.369Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th1a1218e6",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>trafe</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:49:36.324Z",
                    updatedDate: "2024-07-31T11:49:36.324Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th1223b269",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>bro</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:49:16.303Z",
                    updatedDate: "2024-07-31T11:49:16.303Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                ],
              },
            ],
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
        filters: {
          user: null,
          search: null,
        },
      },
      requesting: {
        "[scope:inProgress]tasks/FTECH_TASKS": true,
      },
    });
    renderWithProvider(
      <DragDropContext onDragEnd={() => {}}>
        <TaskColumn
          column={{
            title: "In Progress",
            key: "inProgress",
            titleColor: "#00DDFF",
          }}
        />
      </DragDropContext>,

      { store }
    );
    expect(screen.getByRole("img", { name: "loading" })).toBeInTheDocument();
  });

  it("should be loading on updating status", () => {
    store = setupDefaultStore({
      users: {
        users: {},
        selectedUser: null,
      },
      inventories: {
        inventories: {
          entities: { inventories: {} },
          result: [],
        },
      },
      tasks: {
        tasks: {
          open: {
            tasks: [],
            total: 0,
          },
          inProgress: {
            tasks: [
              {
                taskId: "66aa1649806aafc4c874ecff",
                farmId: "fm0a0a202e",
                polyhouseId: null,
                nurseryId: null,
                zoneId: null,
                cropLifeCycleId: null,
                severity: 1,
                taskName: "Desc test",
                category: "Water Quality",
                dueDate: "2024-07-31T10:46:49.594Z",
                startTime: "2024-07-31T10:47:37.892Z",
                endTime: null,
                description:
                  '<p><img src="data:image/jpeg;base64,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"></p><p><br></p><p>cleared pic</p>',
                itemName: null,
                qty: null,
                status: "IN_PROGRESS",
                createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdFor: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdByName: "Ravi  Soni",
                updatedByName: "Ravi  Soni",
                createdForName: "Ravi  Soni",
                createdDate: "2024-07-31T10:47:37.892Z",
                updatedDate: "2024-07-31T12:31:41.843Z",
                isWhatsAppMsgSent: false,
                tasksHistory: [
                  {
                    tasksHistoryId: "th1a8fea8e",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>beer</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:47:50.429Z",
                    updatedDate: "2024-07-31T11:47:50.429Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th6187bb7d",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>sobjer</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:31:22.784Z",
                    updatedDate: "2024-07-31T11:31:22.784Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th9c3430ca",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>test2</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:19:48.562Z",
                    updatedDate: "2024-07-31T11:19:48.562Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "thcaf69af4",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>test</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:08:39.129Z",
                    updatedDate: "2024-07-31T11:08:39.129Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th2d51d5da",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>hello</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:06:41.468Z",
                    updatedDate: "2024-07-31T11:06:41.468Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                ],
              },
              {
                taskId: "66a33ea4b431b975d7829ff9",
                farmId: "fm0a0a202e",
                polyhouseId: null,
                nurseryId: null,
                zoneId: null,
                cropLifeCycleId: null,
                severity: 0,
                taskName: "task3",
                category: "Irrigation",
                dueDate: "2024-08-14T18:30:00.000Z",
                startTime: "2024-07-26T06:13:56.657Z",
                endTime: null,
                description: "<p>jjkj</p>",
                itemName: null,
                qty: null,
                status: "IN_PROGRESS",
                createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdFor: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdByName: "Ravi  Soni",
                updatedByName: "Ravi  Soni",
                createdForName: "Ravi  Soni",
                createdDate: "2024-07-26T06:13:56.657Z",
                updatedDate: "2024-07-30T11:40:29.714Z",
                isWhatsAppMsgSent: true,
                tasksHistory: [
                  {
                    tasksHistoryId: "th855811b0",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>foughr</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T12:04:02.293Z",
                    updatedDate: "2024-07-31T12:04:02.293Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th761cc924",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>sought</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T12:03:31.526Z",
                    updatedDate: "2024-07-31T12:03:31.526Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th7b4c3283",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>treat</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:49:59.369Z",
                    updatedDate: "2024-07-31T11:49:59.369Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th1a1218e6",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>trafe</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:49:36.324Z",
                    updatedDate: "2024-07-31T11:49:36.324Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th1223b269",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>bro</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:49:16.303Z",
                    updatedDate: "2024-07-31T11:49:16.303Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                ],
              },
            ],
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
        filters: {
          user: null,
          search: null,
        },
      },
      requesting: {
        "[scope:inProgress]tasks/UPDATE_STATUS": true,
      },
    });
    renderWithProvider(
      <DragDropContext onDragEnd={() => {}}>
        <TaskColumn
          column={{
            title: "In Progress",
            key: "inProgress",
            titleColor: "#00DDFF",
          }}
        />
      </DragDropContext>,

      { store }
    );
    expect(screen.getByRole("img", { name: "loading" })).toBeInTheDocument();
  });

  it("should render error message on update error", async () => {
    store = setupDefaultStore({
      users: {
        users: {},
        selectedUser: null,
      },
      inventories: {
        inventories: {
          entities: { inventories: {} },
          result: [],
        },
      },
      tasks: {
        tasks: {
          open: {
            tasks: [],
            total: 0,
          },
          inProgress: {
            tasks: [
              {
                taskId: "66aa1649806aafc4c874ecff",
                farmId: "fm0a0a202e",
                polyhouseId: null,
                nurseryId: null,
                zoneId: null,
                cropLifeCycleId: null,
                severity: 1,
                taskName: "Desc test",
                category: "Water Quality",
                dueDate: "2024-07-31T10:46:49.594Z",
                startTime: "2024-07-31T10:47:37.892Z",
                endTime: null,
                description:
                  '<p><img src="data:image/jpeg;base64,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"></p><p><br></p><p>cleared pic</p>',
                itemName: null,
                qty: null,
                status: "IN_PROGRESS",
                createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdFor: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdByName: "Ravi  Soni",
                updatedByName: "Ravi  Soni",
                createdForName: "Ravi  Soni",
                createdDate: "2024-07-31T10:47:37.892Z",
                updatedDate: "2024-07-31T12:31:41.843Z",
                isWhatsAppMsgSent: false,
                tasksHistory: [
                  {
                    tasksHistoryId: "th1a8fea8e",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>beer</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:47:50.429Z",
                    updatedDate: "2024-07-31T11:47:50.429Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th6187bb7d",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>sobjer</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:31:22.784Z",
                    updatedDate: "2024-07-31T11:31:22.784Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th9c3430ca",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>test2</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:19:48.562Z",
                    updatedDate: "2024-07-31T11:19:48.562Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "thcaf69af4",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>test</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:08:39.129Z",
                    updatedDate: "2024-07-31T11:08:39.129Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th2d51d5da",
                    taskId: "66aa1649806aafc4c874ecff",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>hello</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:06:41.468Z",
                    updatedDate: "2024-07-31T11:06:41.468Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                ],
              },
              {
                taskId: "66a33ea4b431b975d7829ff9",
                farmId: "fm0a0a202e",
                polyhouseId: null,
                nurseryId: null,
                zoneId: null,
                cropLifeCycleId: null,
                severity: 0,
                taskName: "task3",
                category: "Irrigation",
                dueDate: "2024-08-14T18:30:00.000Z",
                startTime: "2024-07-26T06:13:56.657Z",
                endTime: null,
                description: "<p>jjkj</p>",
                itemName: null,
                qty: null,
                status: "IN_PROGRESS",
                createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdFor: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                createdByName: "Ravi  Soni",
                updatedByName: "Ravi  Soni",
                createdForName: "Ravi  Soni",
                createdDate: "2024-07-26T06:13:56.657Z",
                updatedDate: "2024-07-30T11:40:29.714Z",
                isWhatsAppMsgSent: true,
                tasksHistory: [
                  {
                    tasksHistoryId: "th855811b0",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>foughr</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T12:04:02.293Z",
                    updatedDate: "2024-07-31T12:04:02.293Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th761cc924",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>sought</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T12:03:31.526Z",
                    updatedDate: "2024-07-31T12:03:31.526Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th7b4c3283",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>treat</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:49:59.369Z",
                    updatedDate: "2024-07-31T11:49:59.369Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th1a1218e6",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>trafe</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:49:36.324Z",
                    updatedDate: "2024-07-31T11:49:36.324Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                  {
                    tasksHistoryId: "th1223b269",
                    taskId: "66a33ea4b431b975d7829ff9",
                    userId: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    comment: "<p>bro</p>",
                    createdBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    updatedBy: "21f3bd3a-9011-70fd-8aba-8ed6189af0fe",
                    createdDate: "2024-07-31T11:49:16.303Z",
                    updatedDate: "2024-07-31T11:49:16.303Z",
                    images: null,
                    video: null,
                    createdByName: "Ravi  Soni",
                    updatedByName: "Ravi  Soni",
                  },
                ],
              },
            ],
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
        filters: {
          user: null,
          search: null,
        },
      },
      error:{
         "[scope:inProgress]tasks/UPDATE_STATUS_FINISHED": {
          errors: [
            {
              error: "ERROR_BAD_REQUEST",
              message: "status is required",
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
      }
    });
    renderWithProvider(
      <DragDropContext onDragEnd={() => {}}>
        <TaskColumn
          column={{
            title: "In Progress",
            key: "inProgress",
            titleColor: "#00DDFF",
          }}
        />
      </DragDropContext>,

      { store }
    );
    expect(screen.getByText("status is required")).toBeInTheDocument();
  });
});
