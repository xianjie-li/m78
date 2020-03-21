import React, { useEffect, useRef } from 'react';

import Spin from '@lxjx/fr/lib/spin';
import config from '@lxjx/fr/lib/config';

import { useSetState } from '@lxjx/hooks';

import cls from 'classnames';
import { ComponentBaseProps } from '../types/types';

interface PictureProps
  extends ComponentBaseProps,
    React.PropsWithoutRef<JSX.IntrinsicElements['span']> {
  /** 图片的地址 */
  src?: string;
  /** 同 img alt */
  alt?: string;
  /** 使用指定的图片替换默认的错误占位图 */
  errorImg?: string;
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
  className,
  style,
  imgProps,
  ...props
}) => {
  const wrap = useRef<HTMLSpanElement>(null!);
  const cvs = useRef<HTMLCanvasElement>(null!);
  const [state, setState] = useSetState({
    error: false,
    loading: false,
  });
  const { pictureErrorImg } = config.useConfig();
  const _errorImg = errorImg || pictureErrorImg;

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
      !_errorImg && canvasSet();
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

  /** 图片加载错误，更新canvas */
  function canvasSet() {
    if (!wrap.current) return;
    const wrapW = wrap.current.offsetWidth;
    const wrapH = wrap.current.offsetHeight;
    const canvas = cvs.current;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    const fontSize = wrapW / 8;

    canvas.width = wrapW;
    canvas.height = wrapH;

    if (ctx) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      ctx.fillRect(0, 0, wrapW, wrapH);

      ctx.font = `${fontSize}px tabular-nums, Microsoft YaHei`;
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${wrapW}X${wrapH}`, wrapW / 2, (wrapH / 2) * 1.04 /* 视觉上更居中 */);
    }
  }

  return (
    <span {...props} ref={wrap} className={cls('fr-picture', className)} style={style}>
      {!state.error && (
        <img {...imgProps} alt={alt} src={src} className={imgClassName} style={imgStyle} />
      )}
      {state.error && (_errorImg ? <img src={_errorImg} alt="" /> : <canvas ref={cvs} />)}
      <Spin show={state.loading} full text="图片加载中" />
    </span>
  );
};

export default Picture;
