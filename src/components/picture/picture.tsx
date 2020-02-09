import React, { useEffect, useRef } from 'react';

import Spin from '@lxjx/flicker/lib/spin';
import config from '@lxjx/flicker/lib/config';
import { ComponentBaseProps } from '@/components/types/types';

import { useSetState } from '@lxjx/hooks';

import cls from 'classnames';


interface PictureProps extends ComponentBaseProps {
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
}

const Picture: React.FC<PictureProps> = ({
  src = '',
  alt,
  imgClassName,
  imgStyle,
  errorImg,
  className,
  style,
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

      ctx.font = fontSize + 'px tabular-nums, Microsoft YaHei';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${wrapW}X${wrapH}`, wrapW / 2, wrapH / 2 * 1.04/* 视觉上更居中 */);
    }
  }

  return (
    <span ref={wrap} className={cls('fr-picture', className)} style={style}>
      {!state.error && <img alt={alt} src={src} className={imgClassName} style={imgStyle} />}
      {state.error && (
        _errorImg
          ? <img src={_errorImg} alt="" />
          : <canvas ref={cvs} />)}
      <Spin show={state.loading} full text="图片加载中" />
    </span>
  );
};

export default Picture;
