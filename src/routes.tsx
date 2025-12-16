import { MainLayout } from "./layouts/main";
import { ChatPage } from "./pages/chat";
import { DashboardPage } from "./pages/dashboard";

export const PortfolioRoutes = [
    {
        path: '/',
        element: <MainLayout><DashboardPage /></MainLayout>,
    },
    {
        path: '/chat',
        element: <MainLayout><ChatPage /></MainLayout>,
    },
]