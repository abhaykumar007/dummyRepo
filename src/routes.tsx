import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { Suspense } from "react";
import Layout from "./components/layout";
import routePaths from "./config/routePaths";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const OtpVerification = React.lazy(
  () => import("./pages/auth/otpVerification/otpVerification.tsx")
);
const ForgotPassword = React.lazy(() => import("./pages/auth/forgotPassword"));
const Login = React.lazy(() => import("./pages/auth/login"));
const SignUp = React.lazy(() => import("./pages/auth/signUp"));
const Dashboard = React.lazy(() => import("./pages/dashboard"));
const Farm = React.lazy(() => import("./pages/farm"));
const Polyhouse = React.lazy(() => import("./pages/polyhouse"));
const Reservoirs = React.lazy(() => import("./pages/reservoirs"));
const Tasks = React.lazy(() => import("./pages/tasks"));
const UserManagement = React.lazy(() => import("./pages/userManagement"));
const AddUpdateWorkflow = React.lazy(
  () => import("./pages/workflow/addUpdateWorkflow")
);
const CreateFarm = React.lazy(() => import("./pages/farm/CreateFarm"));
const Organization = React.lazy(() => import("./pages/organization"));
const AddInventory = React.lazy(() => import("./pages/inventory/addInventory"));
const Inventory = React.lazy(() => import("./pages/inventory"));
const Profile = React.lazy(() => import("./pages/profile"));
const PolyhouseDetails = React.lazy(
  () => import("./pages/polyhouse/polyhouseDetails")
);
const SensorDetails = React.lazy(
  () =>
    import(
      "./pages/polyhouse/polyhouseDetails/Components/Sensor/sensorDetails.tsx"
    )
);
const NurseryDetails = React.lazy(
  () =>
    import(
      "./pages/polyhouse/polyhouseDetails/Components/Nursery/nurseryDetails.tsx"
    )
);
const ZoneDetails = React.lazy(
  () =>
    import(
      "./pages/polyhouse/polyhouseDetails/Components/Zones/zoneDetails.tsx"
    )
);
const AddPolyhouse = React.lazy(
  () => import("./pages/polyhouse/addPolyhouse.tsx")
);
const Zones = React.lazy(
  () => import("./pages/polyhouse/polyhouseDetails/Components/Zones/index.tsx")
);
const Nursery = React.lazy(
  () =>
    import("./pages/polyhouse/polyhouseDetails/Components/Nursery/index.tsx")
);
const LifeCycle = React.lazy(
  () =>
    import("./pages/polyhouse/polyhouseDetails/Components/LifeCycle/index.tsx")
);
const AddReservoir = React.lazy(
  () => import("./pages/reservoirs/AddReserviour/index.tsx")
);
const Workflow = React.lazy(() => import("./pages/workflow"));
const AddLifeCycle = React.lazy(
  () =>
    import(
      "./pages/polyhouse/polyhouseDetails/Components/LifeCycle/AddLifeCycle.tsx"
    )
);
const StartLifeCycle = React.lazy(
  () =>
    import(
      "./pages/polyhouse/polyhouseDetails/Components/LifeCycle/startLifeCycle/index.tsx"
    )
);

const fallbackLoader = () => (
  <span
    style={{
      display: "flex",
      justifyContent: "center",
      marginTop: "30vh",
    }}
  >
    <Spin indicator={<LoadingOutlined spin />} size="large" />
  </span>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={fallbackLoader()}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: routePaths.userManagement,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <UserManagement />
          </Suspense>
        ),
      },
      {
        path: routePaths.farm,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <Farm />
          </Suspense>
        ),
      },
      {
        path: routePaths.polyhouse,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <Polyhouse />
          </Suspense>
        ),
      },
      {
        path: routePaths.polyhouseCreate,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <AddPolyhouse />
          </Suspense>
        ),
      },
      {
        path: routePaths.polyhouseDetails,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <PolyhouseDetails />
          </Suspense>
        ),
      },
      {
        path: routePaths.nurseries,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <Nursery />
          </Suspense>
        ),
      },
      {
        path: routePaths.nurseryDetails,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <NurseryDetails />
          </Suspense>
        ),
      },
      {
        path: routePaths.zones,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <Zones />
          </Suspense>
        ),
      },
      {
        path: routePaths.zoneDetails,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <ZoneDetails />
          </Suspense>
        ),
      },
      {
        path: routePaths.polyhouseSensorDetails,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <SensorDetails />
          </Suspense>
        ),
      },
      {
        path: routePaths.zoneSensorDetails,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <SensorDetails />
          </Suspense>
        ),
      },
      {
        path: routePaths.nurserySensorDetails,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <SensorDetails />
          </Suspense>
        ),
      },
      {
        path: routePaths.lifeCycle,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <LifeCycle />
          </Suspense>
        ),
      },
      {
        path: routePaths.addLifeCycle,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <AddLifeCycle />
          </Suspense>
        ),
      },
      {
        path: routePaths.updateLifeCycle,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <AddLifeCycle />
          </Suspense>
        ),
      },
      {
        path: routePaths.startLifeCycle,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <StartLifeCycle />
          </Suspense>
        ),
      },
      {
        path: routePaths.reservoirs,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <Reservoirs />
          </Suspense>
        ),
      },
      {
        path: routePaths.reservoirCreate,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <AddReservoir />
          </Suspense>
        ),
      },
      {
        path: routePaths.inventory,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <Inventory />
          </Suspense>
        ),
      },
      {
        path: routePaths.addInventory,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <AddInventory />
          </Suspense>
        ),
      },
      {
        path: routePaths.tasks,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <Tasks />
          </Suspense>
        ),
      },
      {
        path: routePaths.template,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <Workflow />
          </Suspense>
        ),
      },
      {
        path: routePaths.templateCreate,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <AddUpdateWorkflow />
          </Suspense>
        ),
      },
      {
        path: routePaths.templateUpdate,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <AddUpdateWorkflow />
          </Suspense>
        ),
      },
      {
        path: routePaths.farmCreate,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <CreateFarm />
          </Suspense>
        ),
      },
      {
        path: routePaths.profile,
        element: (
          <Suspense fallback={fallbackLoader()}>
            <Profile />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: routePaths.organization,
    element: (
      <Suspense fallback={fallbackLoader()}>
        <Organization />
      </Suspense>
    ),
  },
  {
    path: routePaths.login,
    element: (
      <Suspense fallback={fallbackLoader()}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: routePaths.signUp,
    element: (
      <Suspense fallback={fallbackLoader()}>
        <SignUp />
      </Suspense>
    ),
  },
  {
    path: routePaths.forgotPassword,
    element: (
      <Suspense fallback={fallbackLoader()}>
        <ForgotPassword />
      </Suspense>
    ),
  },
  {
    path: routePaths.userVerfication,
    element: (
      <Suspense fallback={fallbackLoader()}>
        <OtpVerification />
      </Suspense>
    ),
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
