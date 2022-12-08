import React from "react";
import { Button } from "m78/button";

import { IconTag } from "@m78/icons/icon-tag";
import { IconBeachAccess } from "@m78/icons/icon-beach-access";
import { IconBrightness7 } from "@m78/icons/icon-brightness-7";
import { IconCatchingPokemon } from "@m78/icons/icon-catching-pokemon";
import { IconAcUnit } from "@m78/icons/icon-ac-unit";
import { IconFaceRetouchingNatural } from "@m78/icons/icon-face-retouching-natural";

const ButtonDemoColor = () => (
  <div>
    <div className="mb-16">纯图标</div>

    <Button icon>
      <IconTag />
    </Button>
    <Button color="red" icon>
      <IconBeachAccess />
    </Button>
    <Button color="green" icon disabled>
      <IconBrightness7 />
    </Button>
    <Button color="primary" icon>
      <IconCatchingPokemon />
    </Button>
    <Button color="orange" icon>
      <IconAcUnit />
    </Button>
    <Button color="red" icon>
      李
    </Button>

    <div className="mt-16">
      <Button color="green" icon size="small">
        <IconBeachAccess />
      </Button>
      <Button color="primary" icon>
        <IconCatchingPokemon />
      </Button>
      <Button color="red" icon size="large">
        <IconFaceRetouchingNatural />
      </Button>
    </div>

    <div className="mt-16">方型图标按钮, 占用空间更小</div>

    <div className="mt-16">
      <Button color="green" squareIcon size="small">
        <IconBeachAccess />
      </Button>
      <Button color="primary" squareIcon>
        <IconCatchingPokemon />
      </Button>
      <Button color="red" squareIcon size="large">
        <IconFaceRetouchingNatural />
      </Button>
    </div>

    <div className="mt-16">
      <div className="mb-16">文字图标混排</div>
      <Button>
        <IconBeachAccess />
        按钮
      </Button>
      <Button color="red">
        <IconAcUnit />
        按钮
      </Button>
      <Button color="green">
        <IconBeachAccess />
        按钮
      </Button>
      <Button color="primary">
        <IconFaceRetouchingNatural />
        按钮
      </Button>
      <Button color="orange">
        <IconAcUnit />
        按钮
      </Button>
      <Button color="primary">
        <IconBrightness7 />
        文本
        <IconTag />
        文本
        <IconBrightness7 />
      </Button>
    </div>
  </div>
);

export default ButtonDemoColor;
