import { ReactElement } from "react";
import { TopNav } from "../components/topnav";

export const MainLayout = ({ children }: { children: ReactElement }): ReactElement => {

  return (
    <>
      <TopNav />
      <div
        className="app-content content"
        style={{ transition: "300ms ease all" }}
      >
        <div className="main-layout-content">{children}</div>
      </div>
    </>
  );
};
