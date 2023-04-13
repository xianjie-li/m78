import React from "react";
import { AspectRatio } from "m78";

import css from "./style.module.scss";

const AspectRatioDemo = () => {
  return (
    <div>
      <AspectRatio className={css.box3} style={{ width: 160 }}>
        1 / 1
      </AspectRatio>

      <AspectRatio className={css.box3} ratio={2 / 3} style={{ width: 160 }}>
        2 / 3
      </AspectRatio>

      <AspectRatio className={css.box3} ratio={1 / 2} style={{ width: 160 }}>
        1 / 2
      </AspectRatio>

      <AspectRatio className={css.box3} ratio={1.5} style={{ width: 160 }}>
        1.5 / 1
      </AspectRatio>
    </div>
  );
};

export default AspectRatioDemo;
