import React, { useEffect, useRef } from 'react';

import { Spin } from 'm78/spin';

import { useSetState } from '@lxjx/hooks';

import cls from 'clsx';
import { ComponentBaseProps } from '@lxjx/utils';
import { m78Config as config } from 'm78/config';

/* 组件必须有实际的尺寸 */

interface PictureProps
  extends ComponentBaseProps,
    React.PropsWithoutRef<JSX.IntrinsicElements['span']> {
  /** 图片的地址 */
  src?: string;
  /** 同 img alt */
  alt?: string;
  /** 使用指定的图片替换默认的错误占位图 */
  errorImg?: string;
  /** 使用指定的文本节点替换默认的错误占位图 */
  errorNode?: React.ReactNode;
  /** 挂载到生成的img上的className */
  imgClassName?: string;
  /** 挂载到生成的img上的style */
  imgStyle?: React.CSSProperties;
  /** 默认提供了imgClassName、imgStyle、alt、src几个最常用的参数，其他需要直接传递给图片的props通过此项传递 */
  imgProps?: React.PropsWithRef<JSX.IntrinsicElements['img']>;
}

const Picture: React.FC<PictureProps> = ({
  src = '',
  alt,
  imgClassName,
  imgStyle,
  errorImg,
  errorNode,
  className,
  style,
  imgProps,
  ...props
}) => {
  const wrap = useRef<HTMLSpanElement>(null!);

  const [state, setState] = useSetState({
    error: false,
    loading: false,
    style: undefined! as React.CSSProperties,
    text: '' as React.ReactNode,
  });

  const pictureConfig = config.useState(st => st.picture);

  const _errorImg = errorImg || pictureConfig.errorImg;

  useEffect(() => {
    setState({
      error: false,
      loading: true,
    });

    const img = new Image();

    function load() {
      setState({
        error: false,
        loading: false,
      });
    }

    function loadError() {
      setState({
        error: true,
        loading: false,
      });
      !_errorImg && placeholderUpdate();
    }

    img.addEventListener('load', load);

    img.addEventListener('error', loadError);

    img.src = src;

    return () => {
      img.removeEventListener('load', load);

      img.removeEventListener('error', loadError);
    };
    // eslint-disable-next-line
  }, [src]);

  /** 图片加载错误，更新占位节点样式 */
  function placeholderUpdate() {
    if (!wrap.current) return;

    const wrapW = wrap.current.offsetWidth;
    const wrapH = wrap.current.offsetHeight;

    setState({
      style: {
        width: wrapW,
        height: wrapH,
        fontSize: wrapW / 8,
      },
      text: errorNode || `${wrapW}X${wrapH}`,
    });

    // const canvas = cvs.current;
    //
    // const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    // const fontSize = wrapW / 8;
    //
    // canvas.width = wrapW;
    // canvas.height = wrapH;
    //
    // if (ctx) {
    //   ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    //   ctx.fillRect(0, 0, wrapW, wrapH);
    //
    //   ctx.font = `${fontSize}px tabular-nums, Microsoft YaHei`;
    //   ctx.fillStyle = '#fff';
    //   ctx.textAlign = 'center';
    //   ctx.textBaseline = 'middle';
    //   ctx.fillText(`${wrapW}X${wrapH}`, wrapW / 2, (wrapH / 2) * 1.04 /* 视觉上更居中 */);
    // }
  }

  return (
    <span {...props} ref={wrap} className={cls('m78 m78-picture', className)} style={style}>
      {!state.error && (
        <img {...imgProps} alt={alt} src={src} className={imgClassName} style={imgStyle} />
      )}
      {state.error &&
        (_errorImg ? (
          <img src={_errorImg} alt="" />
        ) : (
          <span style={state.style} className="m78-picture_placeholder">
            {state.text}
          </span>
        ))}
      <Spin loadingDelay={100} show={state.loading} full text="图片加载中" />
    </span>
  );
};

export default Picture;
