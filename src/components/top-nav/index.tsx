import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { api } from "../../api";

export const TopNav = () => {
    const setUser = useStore((state) => state.setUser);
    const token = useStore((state) => state.token);
    const navigate = useNavigate();

    const handleLogout = async () => {
        // Ends the session on the backend too; sign out locally even if that fails.
        if (token) await api.Logout(token).catch(console.error);
        setUser(undefined);
        navigate('/login', { replace: true });
    };

    return (
        <header className="top-nav">
            {/* <div className="top-nav__logo">MyApp</div> */}

            <nav className="top-nav__menu">
                <a href="/">Home</a>
                <a href="/open-ai">Open AI</a>
                <a href="/chat">Chat</a>
                <a href="/notifications">Notifications</a>
                <a href="/passkey">Passkey</a>
            </nav>

            <button type="button" className="top-nav__logout" onClick={handleLogout}>Logout</button>
        </header>
    );
};
