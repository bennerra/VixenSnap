import { useNavigate } from "react-router-dom";

import { type FC, type ReactNode, useEffect } from "react";

import { cookies, CookiesNames } from "@/constants/cookies";
import { AppRoutes, NotAuthPaths } from "@/constants/paths";

interface Props {
  currentPage: AppRoutes;
  children: ReactNode;
}

export const NavigateRouter: FC<Props> = ({ currentPage, children }) => {
  const navigate = useNavigate();
  const refreshToken = cookies.get(CookiesNames.AUTH);
  let route: string = currentPage;

  if (refreshToken && NotAuthPaths.includes(currentPage)) {
    route = AppRoutes.MAIN;
  }

  if (!refreshToken && !NotAuthPaths.includes(currentPage)) {
    route = AppRoutes.AUTH;
  }

  useEffect(() => {
    if (route !== window.location.pathname) {
      navigate(route);
    }
  }, [route, navigate]);

  return <div>{children}</div>;
};
