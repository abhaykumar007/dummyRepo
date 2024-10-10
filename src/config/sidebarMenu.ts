import { FaTractor } from "react-icons/fa";
import routePaths from "./routePaths";
import { MdDashboard, MdInventory } from "react-icons/md";
import { FaListCheck } from "react-icons/fa6";
import { HiMiniUsers } from "react-icons/hi2";
import { GiGreenhouse, GiWaterTank } from "react-icons/gi";
import { GrFolderCycle } from "react-icons/gr";

export const sidebarMenuData = [
  {
    title: "Farms",
    key: "farms",
    icon: FaTractor,
    url: routePaths.farm,
    children: [
      {
        title: "Dashboard",
        key: "dashboard",
        url: "/",
        icon: MdDashboard,
      },
      {
        title: "Polyhouses",
        key: "polyhouses",
        url: routePaths.polyhouse,
        icon: GiGreenhouse,
      },
      {
        title: "Reservoirs",
        key: "reservoirs",
        url: routePaths.reservoirs,
        icon: GiWaterTank,
      },
      {
        title: "Inventory",
        key: "inventory",
        url: routePaths.inventory,
        icon: MdInventory,
      },
      {
        title: "Tasks",
        key: "tasks",
        url: routePaths.tasks,
        icon: FaListCheck,
      },
    ],
  },
  {
    title: "Templates",
    key: "workflow",
    icon: GrFolderCycle,
    url: routePaths.template,
  },
  {
    title: "Users",
    key: "users",
    icon: HiMiniUsers,
    url: routePaths.userManagement,
  },
];
