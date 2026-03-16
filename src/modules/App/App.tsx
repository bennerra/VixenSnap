import { FC, useContext } from "react";
import classNames from "classnames/bind";
import { Route, Routes, useLocation } from "react-router-dom";

import { ThemeContext } from "@/context";

import { Home } from "@/pages/Home";
import { Registration } from "@/pages/Registration";
import { Login } from "@/pages/Login";
import { CreationCard } from "@/pages/CreationCard";
import { Profile } from "@/pages/Profile";
import { Card } from "@/pages/Card";
import { OAuth } from "@/modules/OAuth";
import { AppRoutes } from "@/constants/paths";
import { NavigateRouter } from "@/layouts/NavigateRouter/NavigateRouter";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const App: FC = () => {
  const { theme } = useContext(ThemeContext);
  const { pathname } = useLocation();

  return (
    <NavigateRouter currentPage={pathname as AppRoutes}>
      <div className={cx("App", `App-${theme}`)}>
        <Routes>
          <Route path={AppRoutes.MAIN} element={<Home />} />
          <Route path={AppRoutes.CREATION} element={<CreationCard />} />
          <Route path={AppRoutes.PROFILE} element={<Profile />} />
          <Route path={AppRoutes.PROFILE_ME} element={<Profile />} />
          <Route path={AppRoutes.CARD_DETAIL} element={<Card />} />
          <Route path={AppRoutes.REGISTRATION} element={<Registration />} />
          <Route path={AppRoutes.AUTH} element={<Login />} />
          <Route path={AppRoutes.VK_AUTH} element={<OAuth />} />
        </Routes>
      </div>
    </NavigateRouter>
  );
};

export default App;
