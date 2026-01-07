
export const TopNav = () => {

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
        </header>
    );
};
