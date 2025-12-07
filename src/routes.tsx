import { MainLayout } from "./layouts/main";
import { AboutPage } from "./pages/about";
import { ChatPage } from "./pages/chat";
import { DashboardPage } from "./pages/dashboard";
import { ExperiencePage } from "./pages/experience";
import { ProjectsPage } from "./pages/projects";
import { SkillsPage } from "./pages/skills";

export const PortfolioRoutes = [
    {
        path: '/',
        element: <MainLayout><DashboardPage /></MainLayout>,
    },
    {
        path: '/chat',
        element: <MainLayout><ChatPage /></MainLayout>,
    },
    {
        path: '/about',
        element: <MainLayout><AboutPage /></MainLayout>,
    },
    {
        path: '/skills',
        element: <MainLayout><SkillsPage /></MainLayout>,
    },
    {
        path: '/experience',
        element: <MainLayout><ExperiencePage /></MainLayout>,
    },
    {
        path: '/projects',
        element: <MainLayout><ProjectsPage /></MainLayout>,
    }
]