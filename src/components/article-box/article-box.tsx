import React from 'react';
import { useMeasure } from 'react-use';
import { If } from 'm78/fork';
import cls from 'classnames';
import { ComponentBaseProps } from 'm78/types';

export interface ArticleBoxProps extends ComponentBaseProps {
  /** 合法的html字符串 */
  html?: string;
  /** 可以传入react节点代替html */
  content?: React.ReactNode;
  /** 水印内容，不传时无水印 */
  watermark?: React.ReactNode;
}

/* 行数等于 高度 / 240 (行高) + 基础行 4 */
/* 列数等于 宽度 / 300 */

const ArticleBox: React.FC<ArticleBoxProps> = ({ watermark, html, content, style, className }) => {
  const [ref, { width, height }] = useMeasure();
  const row = Math.ceil(height / 240) + 4;
  const col = Math.ceil(width / 300);

  return (
    <div ref={ref} className={cls('m78-article-box', className)} style={style}>
      <If when={html}>
        {() => <div className="m78-article-box_html" dangerouslySetInnerHTML={{ __html: html! }} />}
      </If>
      <If when={content && !html}>
        <div>{content}</div>
      </If>
      <If when={watermark}>
        {() => (
          <div className="m78-article-box_watermark">
            {Array.from({ length: row }).map((rowItem, rowKey) => (
              <div className="m78-article-box_watermark_item" key={rowKey}>
                {Array.from({ length: col }).map((colItem, colKey) => (
                  <span key={colKey}>{watermark}</span>
                ))}
              </div>
            ))}
          </div>
        )}
      </If>
    </div>
  );
};

export default ArticleBox;
