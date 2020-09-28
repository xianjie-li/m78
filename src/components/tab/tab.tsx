import React from 'react';
import { Divider } from 'm78/layout';
import { DoubleLeftOutlined, DoubleRightOutlined } from 'm78/icon';
import { TabProps } from './type';

const Tab: React.FC<TabProps> = ({}) => {
  return (
    <div>
      <div className="m78-tab __hasPage">
        <div className="m78-tab_tabs">
          <div className="m78-tab_page-ctrl __left">
            <DoubleLeftOutlined />
          </div>
          <div className="m78-tab_page-ctrl __right">
            <DoubleRightOutlined />
          </div>

          <div className="m78-tab_tabs-item m78-effect __md">标签1</div>
          <div className="m78-tab_tabs-item m78-effect __disabled __md __active">标签2</div>
          <div className="m78-tab_tabs-item m78-effect __disabled __md">标签3</div>
          <div className="m78-tab_tabs-item m78-effect __md">标签4</div>
          <div className="m78-tab_line" />
        </div>
        <div className="m78-tab_cont">
          <div className="m78-tab_cont-item">内容1</div>
          <div className="m78-tab_cont-item">内容2</div>
          <div className="m78-tab_cont-item">内容3</div>
          <div className="m78-tab_cont-item">内容4</div>
        </div>
      </div>

      <Divider margin={60} />

      <div className="m78-tab __left">
        <div className="m78-tab_tabs">
          <div className="m78-tab_tabs-item m78-effect __md">标签1</div>
          <div className="m78-tab_tabs-item m78-effect __disabled __md __active">标签2</div>
          <div className="m78-tab_tabs-item m78-effect __disabled __md">标签3</div>
          <div className="m78-tab_tabs-item m78-effect __md">标签4</div>
          <div className="m78-tab_line" />
        </div>
        <div className="m78-tab_cont">
          <div className="m78-tab_cont-item">内容1</div>
          <div className="m78-tab_cont-item">内容2</div>
          <div className="m78-tab_cont-item">内容3</div>
          <div className="m78-tab_cont-item">内容4</div>
        </div>
      </div>

      <Divider margin={60} />

      <div className="m78-tab __right">
        <div className="m78-tab_tabs">
          <div className="m78-tab_tabs-item m78-effect __md">标签1</div>
          <div className="m78-tab_tabs-item m78-effect __disabled __md __active">标签2</div>
          <div className="m78-tab_tabs-item m78-effect __disabled __md">标签3</div>
          <div className="m78-tab_tabs-item m78-effect __md">标签4</div>
          <div className="m78-tab_line" />
        </div>
        <div className="m78-tab_cont">
          <div className="m78-tab_cont-item">内容1</div>
          <div className="m78-tab_cont-item">内容2</div>
          <div className="m78-tab_cont-item">内容3</div>
          <div className="m78-tab_cont-item">内容4</div>
        </div>
      </div>

      <div className="m78-tab __bottom">
        <div className="m78-tab_tabs">
          <div className="m78-tab_tabs-item m78-effect __md">标签1</div>
          <div className="m78-tab_tabs-item m78-effect __disabled __md __active">标签2</div>
          <div className="m78-tab_tabs-item m78-effect __disabled __md">标签3</div>
          <div className="m78-tab_tabs-item m78-effect __md">标签4</div>
          <div className="m78-tab_line" />
        </div>
        <div className="m78-tab_cont">
          <div className="m78-tab_cont-item">内容1</div>
          <div className="m78-tab_cont-item">内容2</div>
          <div className="m78-tab_cont-item">内容3</div>
          <div className="m78-tab_cont-item">内容4</div>
        </div>
      </div>
    </div>
  );
};

export default Tab;
