import { useEffect } from "react";
import Layout from "dumi/theme-default/layouts/DocLayout";

import "m78/common/init";

import "../../style/reset.scss";
import SwitchTheme from "../../components/switch-theme";

export default ({ children, ...props }) => {
  useEffect(() => {
    document.documentElement.classList.add("m78");
  }, []);

  return (
    <Layout {...props}>
      {children}
      <SwitchTheme />
    </Layout>
  );
};
