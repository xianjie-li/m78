import React from "react";
import { Button } from "m78";

import { IconTagOne } from "@m78/icons/tag-one.js";
import { IconBear } from "@m78/icons/bear.js";
import { IconBrightness } from "@m78/icons/brightness.js";
import { IconPoker } from "@m78/icons/poker.js";
import { IconSettingTwo } from "@m78/icons/setting-two.js";
import { IconPureNatural } from "@m78/icons/pure-natural.js";

const ButtonDemoColor = () => (
  <div>
    <div className="mb-16">纯图标</div>

    <Button icon>
      <IconTagOne />
    </Button>
    <Button color="red" icon>
      <IconBear />
    </Button>
    <Button color="green" icon disabled>
      <IconBrightness />
    </Button>
    <Button color="primary" icon>
      <IconPoker />
    </Button>
    <Button color="orange" icon>
      <IconSettingTwo />
    </Button>
    <Button color="red" icon>
      李
    </Button>

    <div className="mt-16">
      <Button color="green" icon size="small">
        <IconBear />
      </Button>
      <Button color="primary" icon>
        <IconPoker />
      </Button>
      <Button color="red" icon size="large">
        <IconPureNatural />
      </Button>
    </div>

    <div className="mt-16">方型图标按钮, 占用空间更小</div>

    <div className="mt-16">
      <Button color="green" squareIcon size="small">
        <IconBear />
      </Button>
      <Button color="primary" squareIcon>
        <IconPoker />
      </Button>
      <Button color="red" squareIcon size="large">
        <IconPureNatural />
      </Button>
    </div>

    <div className="mt-16">
      <div className="mb-16">文字图标混排</div>
      <Button>
        <IconBear />
        按钮
      </Button>
      <Button color="red">
        <IconSettingTwo />
        按钮
      </Button>
      <Button color="green">
        <IconBear />
        按钮
      </Button>
      <Button color="primary">
        <IconPureNatural />
        按钮
      </Button>
      <Button color="orange">
        <IconSettingTwo />
        按钮
      </Button>
      <Button color="primary">
        <IconBrightness />
        文本
        <IconTagOne />
        文本
        <IconBrightness />
      </Button>
    </div>
  </div>
);

export default ButtonDemoColor;
