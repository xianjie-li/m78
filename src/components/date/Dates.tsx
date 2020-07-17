import React, { useMemo, useRef, useState } from 'react';
import Button from '@lxjx/fr/lib/button';
import Carousel, { CarouselRef } from '@lxjx/fr/lib/carousel';
import { LeftOutlined, RightOutlined } from '@lxjx/fr/lib/icon';

import DateItem from '@/components/date/DateItem';
import moment from 'moment';
import { useSelf } from '@lxjx/hooks';
import { getDates, getListMoments } from './utils';

const Dates = () => {
  const self = useSelf({
    page: 1,
    lastPage: (undefined as unknown) as number,
  });
  /**  当前时间 */
  const [nowM, setNowM] = useState(() => moment());
  /** 当前显示时间 */
  const [currentM, setCurrentM] = useState(nowM);
  /** 跑马灯实例 */
  const carouselRef = useRef<CarouselRef>(null!);

  const list = useMemo(() => getListMoments(currentM), [currentM]);

  return (
    <div className="fr-dates">
      <div className="fr-dates_head">
        <span className="bold">
          <div>
            2020-07-24
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
            {currentM.year()}年 <span>{currentM.month() + 1}月</span>
          </span>
          <RightOutlined title="下一月" />
        </div>
        <div>
          <div className="fr-dates_date-item __title">
            <span>一</span>
          </div>
          <div className="fr-dates_date-item __title">
            <span>二</span>
          </div>
          <div className="fr-dates_date-item __title">
            <span>三</span>
          </div>
          <div className="fr-dates_date-item __title">
            <span>四</span>
          </div>
          <div className="fr-dates_date-item __title">
            <span>五</span>
          </div>
          <div className="fr-dates_date-item __title">
            <span>六</span>
          </div>
          <div className="fr-dates_date-item __title">
            <span>日</span>
          </div>
        </div>
        <Carousel
          className="fr-dates_list"
          loop={false}
          // control={false}
          forceNumberControl
          initPage={self.page} /* TODO: 处理该组件分页初始化分页不为0时跳动的问题 */
          ref={carouselRef}
          onWillChange={() => {
            // if (currentM === list[1]) return;
            // console.log('change', self.page);
            //
            // if (currentM === list[1]) return;
            //
            // if (self.page === 0) {
            //   setCurrentM(list[0]);
            // }
            //
            // if (self.page === 2) {
            //   setCurrentM(list[2]);
            // }
            //
            // setTimeout(() => {
            //   carouselRef.current.goTo(1, true);
            // });
          }}
          onChange={(page, first) => {
            self.page = page;
            if (self.page === 0) {
              setCurrentM(list[0]);
            }

            if (self.page === 2) {
              setCurrentM(list[2]);
            }
          }}
        >
          {list.map(cur => (
            <div className="fr-dates_list-item" key={cur.format()}>
              <span style={{ position: 'absolute' }}>{cur.format()}</span>
              {getDates(cur.year(), cur.month() + 1).map((mm, index) => (
                <DateItem itemMoment={mm} currentMoment={cur} nowMoment={nowM} key={index} />
              ))}
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
