import React from "react";
import { Button } from "../../src/button";

import { IconTag } from "@m78/icons/icon-tag";
import { IconBeachAccess } from "@m78/icons/icon-beach-access";
import { IconBrightness7 } from "@m78/icons/icon-brightness-7";
import { IconCatchingPokemon } from "@m78/icons/icon-catching-pokemon";
import { IconAcUnit } from "@m78/icons/icon-ac-unit";
import { IconFaceRetouchingNatural } from "@m78/icons/icon-face-retouching-natural";
import { delay } from "@m78/utils";

export function ButtonExample() {
  return (
    <div className="p-24">
      <Button>default</Button>
      <Button color="red">red</Button>
      <Button color="green">green</Button>
      <Button color="orange">yellow</Button>
      <Button color="primary">primary</Button>
      <Button color="second">second</Button>

      <hr />

      <Button disabled>default</Button>
      <Button color="red" disabled>
        red
      </Button>
      <Button color="green" disabled>
        green
      </Button>
      <Button color="orange" disabled>
        yellow
      </Button>
      <Button color="primary" disabled>
        primary
      </Button>
      <Button color="second" disabled>
        second
      </Button>

      <hr />

      <Button size="large">large</Button>
      <Button>default</Button>
      <Button size="small">small</Button>

      <div className="mt-16">
        <Button color="primary" size="large">
          large
        </Button>
        <Button color="red">default</Button>
        <Button color="green" size="small">
          small
        </Button>
      </div>

      <hr />
      <Button color="red" circle outline size="large">
        丑
      </Button>
      <Button color="red" circle>
        亥
      </Button>
      <Button color="orange" circle size="small">
        卯
      </Button>

      <hr />

      <Button color="primary" outline>
        primary
      </Button>
      <Button color="red" outline>
        red
      </Button>
      <Button color="green" outline>
        green
      </Button>
      <Button color="orange" outline>
        yellow
      </Button>

      <hr />

      <Button size="large" loading color="second">
        click
      </Button>
      <Button loading color="primary">
        click
      </Button>
      <Button size="small" loading>
        click
      </Button>

      <div className="mt-8">
        <Button color="primary" circle size="large" loading>
          申
        </Button>
        <Button color="red" circle loading>
          亥
        </Button>
        <Button color="green" circle size="small" loading>
          卯
        </Button>
      </div>

      <hr />

      <Button color="red" block>
        block
      </Button>
      <Button color="primary" block size="large">
        block
      </Button>
      <Button color="green" block size="large">
        block
      </Button>

      <hr />

      <Button text>link</Button>
      <Button color="red" text>
        link
      </Button>
      <Button color="green" text disabled>
        link
      </Button>
      <Button color="primary" text href="https://www.google.com">
        link↗
      </Button>
      <Button color="orange" text>
        link
      </Button>
      <Button color="primary" text>
        primary
      </Button>

      <hr />

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

      <div className="mt-16">
        <Button color="green" icon outline size="small">
          <IconBeachAccess />
        </Button>
        <Button color="primary" outline icon>
          <IconCatchingPokemon />
        </Button>
        <Button color="red" icon outline size="large">
          <IconFaceRetouchingNatural />
        </Button>
      </div>

      <div className="mt-16">方型图标按钮, 占用空间更小</div>

      <div className="mt-16">
        <Button color="green" squareIcon size="small">
          <IconBeachAccess />
        </Button>
        <Button squareIcon>
          <IconBrightness7 />
        </Button>
        <Button color="primary" squareIcon>
          <IconCatchingPokemon />
        </Button>
        <Button color="red" squareIcon size="large">
          <IconFaceRetouchingNatural />
        </Button>
      </div>

      <div className="mt-16">
        <Button color="green" squareIcon outline size="small">
          <IconBeachAccess />
        </Button>
        <Button squareIcon outline>
          <IconBrightness7 />
        </Button>
        <Button color="primary" squareIcon outline>
          <IconCatchingPokemon />
        </Button>
        <Button color="red" squareIcon outline size="large">
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

      <hr />

      <Button
        onClick={async (e) => {
          console.log(e);

          await delay(2000);
        }}
      >
        点击
      </Button>
      <Button
        onClick={async (e) => {
          console.log(e);

          await delay(2000);
        }}
      >
        ab
      </Button>
    </div>
  );
}
