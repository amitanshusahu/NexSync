import { ChartArea } from "lucide-react";
import Home from "./components/pages/dashboard/Home";
import Landing from "./components/pages/Home/Landing";
import Login from "./components/pages/Login/Login";
import NotFound from "./components/pages/NotFound/NotFound";
import AppLayout from "./components/ui/Layout/AppLayout";
import type { JSX } from "react";
import Task from "./components/pages/Task/Task";
import ProjectTasks from "./components/pages/Task/ProjectTasks";

type Route = {
  path: string;
  element: JSX.Element;
  menu?: boolean;
  name?: string;
  icon?: JSX.Element;
  activeFor?: string[];
}[]

export const routes: Route = [
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <AppLayout>
        <Home />
      </AppLayout>
    ),
    menu: true,
    name: 'Dashboard',
    icon: (<ChartArea className="w-4 h-4" />),
  },
  {
    path: '/tasks',
    element: (
      <AppLayout>
        <Task />
      </AppLayout>
    ),
    menu: true,
    activeFor: ['/project/tasks'],
  },
  {
    path: '/project/tasks',
    element: (
      <AppLayout>
        <ProjectTasks />
      </AppLayout>
    ),
    menu: false,
  },
]