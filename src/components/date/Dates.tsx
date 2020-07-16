import React from 'react';
import Button from '@lxjx/fr/lib/button';
import Carousel from '@lxjx/fr/lib/carousel';
import { LeftOutlined, RightOutlined } from '@lxjx/fr/lib/icon';

import cls from 'classnames';

const Dates = () => {
  return (
    <div className="fr-dates">
      <div className="fr-dates_head">
        <span className="bold">
          <div>
            <span className="fw-400 color-second">开始:</span> 2020-07-24
            <span className="color-primary fr-dates_time" title="点击选择">
              16:20:20
            </span>
          </div>
          <div>
            <span className="fw-400 color-second">结束:</span> 2020-07-24
            <span className="color-primary fr-dates_time" title="点击选择">
              16:20:20
            </span>
          </div>
        </span>
        <span className="fr-dates_btns">
          <Button size="small" link title="选择年份">
            年
          </Button>
          <Button size="small" link title="选择月份">
            月
          </Button>
          <Button size="small" link title="选择日期" color="primary">
            日
          </Button>
        </span>
      </div>
      <div className="fr-dates_body">
        <div className="fr-dates_label">
          <LeftOutlined title="上一月" />
          <span>
            2020年 <span>7月</span>
          </span>
          <RightOutlined title="下一月" />
        </div>
        <div className="fr-dates_day-item __title">
          <span>一</span>
        </div>
        <div className="fr-dates_day-item __title">
          <span>二</span>
        </div>
        <div className="fr-dates_day-item __title">
          <span>三</span>
        </div>
        <div className="fr-dates_day-item __title">
          <span>四</span>
        </div>
        <div className="fr-dates_day-item __title">
          <span>五</span>
        </div>
        <div className="fr-dates_day-item __title">
          <span>六</span>
        </div>
        <div className="fr-dates_day-item __title">
          <span>日</span>
        </div>
        <Carousel className="fr-dates_list" loop={false} control={false}>
          {Array.from({ length: 10 }).map((__, ind) => (
            <div className="fr-dates_list-item" key={ind}>
              {Array.from({ length: 30 }).map((_, index) => (
                <div
                  className={cls('fr-dates_day-item', {
                    __active: index === 10 || index === 5,
                    __disabled: index === 18,
                    __focus: index === 8,
                    __activeRang: index <= 24 && index >= 13,
                    __firstRang: index === 13,
                    __lastRang: index === 24,
                    __disabledRang: index >= 3 && index <= 8,
                  })}
                  key={index}
                >
                  <span>{index + 1}</span>
                </div>
              ))}
              <div className="fr-dates_day-item __gray">
                <span>1</span>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <div className="fr-dates_foot">
        <span>
          <Button size="small" link color="primary">
            今天
          </Button>
          <Button size="small" link color="primary">
            现在
          </Button>
        </span>
        <span>
          <Button size="small" link color="primary">
            选择时间
          </Button>
          <Button size="small" color="primary">
            完成
          </Button>
        </span>
      </div>
    </div>
  );
};

export default Dates;
