import React, { useState } from 'react';
import {
  FileGifOutlined,
  FileJpgOutlined,
  FileOutlined,
  FilePdfOutlined,
  FolderOpenOutlined,
  FolderOutlined,
} from 'm78/icon';
import { Tree, TreeDataSourceItem } from 'm78/tree';
import { SizeEnum } from 'm78/types';

const badgeSty: React.CSSProperties = {
  padding: '1px 4px',
  fontSize: 12,
  backgroundColor: '#bfbfbf',
  borderRadius: 2,
  lineHeight: 1,
  color: '#fff',
};

const CustomDemo = () => {
  const [ds] = useState<TreeDataSourceItem[]>([
    {
      label: 'folder1',
      children: [
        {
          label: '一张动图.gif',
          icon: <FileGifOutlined className="fs-lg" />,
          actions: <a className="fs-sm">放大</a>,
        },
        {
          label: '一张神奇的图片.gif',
          icon: <FileJpgOutlined className="fs-lg" />,
          actions: <a className="fs-sm">了解更多</a>,
        },
        {
          label: (
            <span>
              <span className="color-info">Effective</span>Java.pdf
            </span>
          ),
          value: 'Effective Java',
          icon: <FilePdfOutlined className="fs-lg" />,
        },
        {
          label: (
            <span>
              <span className="color-error">JavaScript</span>高级程序设计.pdf
            </span>
          ),
          value: 'JavaScript',
          icon: <FilePdfOutlined className="fs-lg" />,
        },
      ],
    },
    {
      label: 'folder2',
      children: [
        {
          label: '开心',
          icon: '😀',
        },
        {
          label: '笑',
          icon: '😁',
        },
        {
          label: '(ノ｀Д)ノ)',
          icon: '😃',
        },
        {
          label: '爱情',
          icon: '🥰',
        },
      ],
    },
    {
      label: 'folder3',
      children: [
        {
          label: 'common',
          children: [
            {
              label: 'index.scss',
              icon: <span style={badgeSty}>cs</span>,
            },
            {
              label: 'index.js',
              icon: <span style={{ ...badgeSty, backgroundColor: 'rgb(247 191 67)' }}>js</span>,
            },
          ],
        },
        {
          label: 'main.kt',
          icon: <span style={{ ...badgeSty, backgroundColor: 'rgb(161 109 245)' }}>kt</span>,
        },
        {
          label: 'Some.tsx',
          icon: <span style={{ ...badgeSty, backgroundColor: 'rgb(40 159 228)' }}>ts</span>,
        },
      ],
    },
  ]);

  return (
    <div>
      <Tree
        // 默认节点图标, 优先级小于dataSource中传入的图标
        icon={<FileOutlined />}
        expansionIcon={open => (open ? <FolderOpenOutlined /> : <FolderOutlined />)}
        dataSource={ds}
        defaultOpenAll
        size={SizeEnum.large}
      />
    </div>
  );
};

export default CustomDemo;
