import { MainLayout } from "./layouts/main";
import { ChatPage } from "./pages/chat";
import { DashboardPage } from "./pages/dashboard";
import { NotificationsPage } from "./pages/notifications";
import { OpenAIPage } from "./pages/open-ai";

export const PortfolioRoutes = [
    {
        path: '/',
        element: <MainLayout><DashboardPage /></MainLayout>,
    },
    {
        path: '/open-ai',
        element: <MainLayout><OpenAIPage /></MainLayout>,
    },
    {
        path: '/chat',
        element: <MainLayout><ChatPage /></MainLayout>,
    },
    {
        path: '/notifications',
        element: <MainLayout><NotificationsPage /></MainLayout>,
    },
]