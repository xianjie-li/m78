import React from 'react';
import { Spacer, Tile } from 'm78/layout';
import Ellipsis from 'm78/ellipsis';
import { ArrowRightOutlined, GithubOutlined } from 'm78/icon';
import Button from 'm78/button';

const labelSty: React.CSSProperties = {
  minWidth: '3em',
  fontWeight: 'bold',
};

const TileDemo = () => {
  return (
    <div>
      <h3>Keys & Values 布局</h3>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px 12px',
          maxWidth: 400,
          borderRadius: 2,
        }}
      >
        <Tile leading={<div style={labelSty}>name</div>} title="Taro" />
        <Tile leading={<div style={labelSty}>call</div>} title="0000-123456" />
        <Tile leading={<div style={labelSty}>sex</div>} title="male" />
        <Tile leading={<div style={labelSty}>email</div>} title="123456@eml.com" />
        <Tile leading={<div style={labelSty}>loc</div>} title="M78 nebula" />
        <Tile
          leading={<div style={labelSty}>other</div>}
          title={
            <div>
              <Tile leading={<div style={labelSty}>name</div>} title="Taro" />
              <Tile leading={<div style={labelSty}>call</div>} title="0000-123456" />
              <Tile leading={<div style={labelSty}>sex</div>} title="male" />
              <Tile leading={<div style={labelSty}>email</div>} title="123456@eml.com" />
              <Tile leading={<div style={labelSty}>loc</div>} title="M78 nebula" />
            </div>
          }
        />
      </div>
      <Spacer height={50} />
      <h3>Article list</h3>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px 12px',
          maxWidth: 400,
          borderRadius: 2,
        }}
      >
        <Tile
          title={
            <Ellipsis>
              Lorem ipsum dolor sit amet, eum, incidunt ipsam laboriosam modi nemo, quibusdam sed
              sit. Deleniti ipsam neque quisquam tenetur totam!
            </Ellipsis>
          }
          desc={<div className="color-second">Here is a description of the article</div>}
          trailing={<span className="color-second">2020/11/11</span>}
        />
        <Tile
          title={
            <Ellipsis>
              Ectetur adipisicing elit. Accusamus assumenda atque beatae dolores ducimus est, eum,
              incidunt ipsam laboriosam modi nemo, quibusdam sed sit. Deleniti ipsam neque quisquam
              tenetur totam!
            </Ellipsis>
          }
          trailing={<span className="color-second">2020/05/13</span>}
        />
        <Tile
          title={<Ellipsis>Lorem ipsum dolor sit ame</Ellipsis>}
          trailing={<span className="color-second">2019/03/25</span>}
        />
        <Tile
          title={<Ellipsis>Deleniti ipsam neque quisquam tenetur totam!</Ellipsis>}
          trailing={<span className="color-second">2018/07/07</span>}
        />
        <Tile
          title={
            <Ellipsis>
              Incidunt ipsam laboriosam modi nemo, quibusdam sed sit. Deleniti ipsam neque quisquam
              tenetur totam!
            </Ellipsis>
          }
          trailing={<span className="color-second">2017/07/07</span>}
        />
      </div>
      <Spacer height={50} />
      <h3>Info card</h3>
      <Tile
        style={{
          border: '1px solid #ccc',
          maxWidth: 400,
          borderRadius: 2,
          padding: '10px 12px',
        }}
        title={<div className="color-title fs-18">Xianjie Li</div>}
        desc={
          <div className="color-second">
            <Tile
              leading="Profile:"
              title="Male, Focus on front end and back end, painting"
              style={{ paddingBottom: 4 }}
            />
            <Tile
              leading="GayHub:"
              title={
                // eslint-disable-next-line react/jsx-no-target-blank
                <a target="_blank" href="https://github.com/Iixianjie">
                  https://github.com/Iixianjie
                </a>
              }
              style={{ padding: 0 }}
            />
          </div>
        }
        leading={<GithubOutlined className="fs-30" />}
        trailing={
          <Button icon size="small">
            <ArrowRightOutlined />
          </Button>
        }
      />
    </div>
  );
};

export default TileDemo;
