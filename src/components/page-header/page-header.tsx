import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeftOutlined } from 'm78/icon';
import { Button } from 'm78/button';
import { Divider } from 'm78/layout';
import cls from 'clsx';
import { useFn, useMeasure } from '@lxjx/hooks';
import { ComponentBaseProps } from '@lxjx/utils';

interface PageHeaderProps extends ComponentBaseProps {
  /** 标题 */
  title?: React.ReactNode;
  /** 操作区域 */
  actions?: React.ReactNode;
  /** false | 居中显示标题和描述 */
  centerTitle?: boolean;
  /** 颜色, 为true时使用主题色，为字符串时作为颜色使用 */
  color?: string | boolean;

  /** 描述 */
  desc?: React.ReactNode;
  /** 左侧内容(返回按钮后) */
  leading?: React.ReactNode;
  /** false | 白色前景(按钮、文字、边框) */
  white?: boolean;
  /** 自定义返回按钮, 为null时隐藏 */
  backIcon?: React.ReactElement | null;
  /** 点击返回时触发，如果传入，会替换默认的返回行为 */
  onBack?: () => void;
  /**
   * 固定模式
   * - 为防止固定后页面内容上移导致被遮挡，会在挂在位置生成一个同等高度得占位节点
   * - 这种模式只适合防止再页面顶部，如果有特殊需求，可以通过className自行配置fixed样式
   * */
  fixed?: boolean;

  /** true | 开启阴影 */
  shadow?: boolean;
  /** 开启边框, 优先级高于shadow */
  border?: boolean;
  /** 底部区域显示的内容 */
  bottom?: React.ReactNode;
}

const PageHeader = ({
  leading,
  title,
  desc,
  centerTitle,
  backIcon,
  shadow = true,
  border,
  bottom,
  actions,
  color,
  white,
  onBack,
  className,
  style,
  fixed,
}: PageHeaderProps) => {
  // 用于在centerTitle开启时统一两侧宽度
  const [sideW, setSideW] = useState<number | undefined>();

  const [calcRef, { height }] = useMeasure<HTMLDivElement>();

  const leadingEl = useRef<HTMLDivElement>(null!);
  const actionEl = useRef<HTMLDivElement>(null!);

  // 计算两侧宽度
  useEffect(() => {
    if (centerTitle === undefined) return;

    if (centerTitle) {
      const lW = leadingEl.current.offsetWidth;
      const aW = actionEl.current.offsetWidth;
      setSideW(Math.max(lW, aW));
      return;
    }
    setSideW(undefined);
  }, [centerTitle]);

  const backHandle = useFn(() => {
    onBack ? onBack() : history.back();
  });

  return (
    <>
      {fixed && <div style={{ height }} />}
      <div
        className={cls('m78 m78-page-header', className, {
          __center: centerTitle,
          __shadow: shadow,
          __border: border,
          __color: color,
          __white: white,
          __fixed: fixed,
        })}
        style={{ ...style, backgroundColor: typeof color === 'string' ? color : undefined }}
        ref={calcRef}
      >
        <div className="m78-page-header_bar">
          <div ref={leadingEl} className="m78-page-header_leading" style={{ width: sideW }}>
            {backIcon !== null && (
              <Button icon className="m78-page-header_back">
                {backIcon ? (
                  React.cloneElement(backIcon, { onClick: backHandle })
                ) : (
                  <ArrowLeftOutlined title="返回" onClick={backHandle} />
                )}
              </Button>
            )}
            {leading}
            {(title || desc) && backIcon !== null && !centerTitle && (
              <Divider height={18} vertical color={white ? 'rgba(255,255,255,0.2)' : undefined} />
            )}
          </div>
          <div className="m78-page-header_main">
            {title && <span className="m78-page-header_title">{title}</span>}
            <span className="m78-page-header_desc">{desc}</span>
          </div>
          <div ref={actionEl} className="m78-page-header_actions" style={{ width: sideW }}>
            {actions}
          </div>
        </div>
        {bottom && <div className="m78-page-header_bottom">{bottom}</div>}
      </div>
    </>
  );
};

export default PageHeader;
