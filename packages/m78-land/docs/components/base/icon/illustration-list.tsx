import React from "react";

import {
  Illustration404,
  Illustration502,
  IllustrationEmpty1,
  IllustrationEmpty2,
  IllustrationEmpty3,
  IllustrationEmpty4,
  IllustrationGeneral1,
  IllustrationGeneral2,
  IllustrationOffline,
  IllustrationProgress,
  IllustrationSuccess1,
  IllustrationSuccess2,
  Cells,
  Cell,
  Column,
} from "m78";

const IllustrationList = () => {
  return (
    <div>
      <Cells gutter={8}>
        <Cell col={6}>
          <Column crossAlign="center">
            <Illustration404 height={240} className="mb-16" />
            <div>Illustration404</div>
          </Column>
        </Cell>
        <Cell col={6}>
          <Column crossAlign="center">
            <Illustration502 height={240} className="mb-16" />
            <div>Illustration502</div>
          </Column>
        </Cell>
        <Cell col={6}>
          <Column crossAlign="center">
            <IllustrationEmpty1 height={240} className="mb-16" />
            <div>IllustrationEmpty1</div>
          </Column>
        </Cell>
        <Cell col={6}>
          <Column crossAlign="center">
            <IllustrationEmpty2 height={240} className="mb-16" />
            <div>IllustrationEmpty2</div>
          </Column>
        </Cell>
        <Cell col={6}>
          <Column crossAlign="center">
            <IllustrationEmpty3 height={240} className="mb-16" />
            <div>IllustrationEmpty3</div>
          </Column>
        </Cell>
        <Cell col={6}>
          <Column crossAlign="center">
            <IllustrationEmpty4 height={240} className="mb-16" />
            <div>IllustrationEmpty4</div>
          </Column>
        </Cell>
        <Cell col={6}>
          <Column crossAlign="center">
            <IllustrationGeneral1 height={240} className="mb-16" />
            <div>IllustrationGeneral1</div>
          </Column>
        </Cell>
        <Cell col={6}>
          <Column crossAlign="center">
            <IllustrationGeneral2 height={240} className="mb-16" />
            <div>IllustrationGeneral2</div>
          </Column>
        </Cell>
        <Cell col={6}>
          <Column crossAlign="center">
            <IllustrationOffline height={240} className="mb-16" />
            <div>IllustrationOffline</div>
          </Column>
        </Cell>
        <Cell col={6}>
          <Column crossAlign="center">
            <IllustrationProgress height={240} className="mb-16" />
            <div>IllustrationProgress</div>
          </Column>
        </Cell>
        <Cell col={6}>
          <Column crossAlign="center">
            <IllustrationSuccess1 height={240} className="mb-16" />
            <div>IllustrationSuccess1</div>
          </Column>
        </Cell>
        <Cell col={6}>
          <Column crossAlign="center">
            <IllustrationSuccess2 height={240} className="mb-16" />
            <div>IllustrationSuccess2</div>
          </Column>
        </Cell>
      </Cells>
    </div>
  );
};

export default IllustrationList;
