import { RouteObject } from "react-router-dom";
import { MainLayout } from "./layouts/main";
import { ChatPage } from "./pages/chat";
import { DashboardPage } from "./pages/dashboard";
import { NotificationsPage } from "./pages/notifications";
import { OpenAIPage } from "./pages/open-ai";
import { ReactNode } from "react";
import LoginPage from "./pages/login";
import { PasskeyPage } from "./pages/passkey";

type Route = Omit<RouteObject, 'element'> & {
    element: (arg0: { authorised?: boolean }) => ReactNode;
    path: string;
}

export const PortfolioRoutes: Route[] = [
    {
        path: '/login',
        element: () => <LoginPage />,
    },
    {
        path: '/',
        element: ({ authorised }) => authorised ? <MainLayout><DashboardPage /></MainLayout> : <></>,
    },
    {
        path: '/open-ai',
        element: ({ authorised }) => authorised ? <MainLayout><OpenAIPage /></MainLayout> : <></>,
    },
    {
        path: '/chat',
        element: ({ authorised }) => authorised ? <MainLayout><ChatPage /></MainLayout> : <></>,
    },
    {
        path: '/notifications',
        element: ({ authorised }) => authorised ? <MainLayout><NotificationsPage /></MainLayout> : <></>,
    },
    {
        path: '/passkey',
        element: ({ authorised }) => authorised ? <MainLayout><PasskeyPage /></MainLayout> : <></>,
    },
]