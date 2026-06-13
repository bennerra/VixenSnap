import { useNavigate } from "react-router-dom";

import { type FC, type ReactNode, useEffect } from "react";

import { cookies, CookiesNames } from "@/constants/cookies";
import { AppRoutes, AuthRoutes, NotAuthPaths } from "@/constants/paths";

interface Props {
  currentPage: AppRoutes;
  children: ReactNode;
}

export const NavigateRouter: FC<Props> = ({ currentPage, children }) => {
  const navigate = useNavigate();
  const refreshToken = cookies.get(CookiesNames.AUTH);
  const shouldIgnoreRedirect = currentPage === AppRoutes.VK_AUTH;
  let route: string = currentPage;

  if (refreshToken && NotAuthPaths.includes(currentPage)) {
    route = AppRoutes.MAIN;
  }

  if (!refreshToken && AuthRoutes.includes(currentPage)) {
    route = AppRoutes.AUTH;
  }

  useEffect(() => {
    if (shouldIgnoreRedirect) return;

    if (route !== window.location.pathname) {
      navigate(route);
    }
  }, [route, navigate, shouldIgnoreRedirect]);

  return <div>{children}</div>;
};
