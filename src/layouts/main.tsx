import { ReactElement } from "react";

export const MainLayout = ({ children }: { children: ReactElement }): ReactElement => {

  return (
    <>
      <div
        className="app-content content"
        style={{ transition: "300ms ease all" }}
      >
        <div className="main-layout-content">{children}</div>
      </div>
    </>
  );
};
