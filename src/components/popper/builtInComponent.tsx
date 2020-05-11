import React, { useEffect, useState } from 'react';
import { SvgIcon } from '@lxjx/fr/lib/icon';
import Button from '@lxjx/fr/lib/button';
import { useFn, useSetState } from '@lxjx/hooks';
import Picture from '@lxjx/fr/lib/picture';
import { If } from '@lxjx/fr/lib/fork';
import _clamp from 'lodash/clamp';
import { AnyFunction } from '@lxjx/utils';
import { useUpdateEffect } from 'react-use';
import { PopperProps, PopperStudyData } from './types';

interface PopperPropsCustom extends PopperProps {
  setShow(patch: boolean | ((prevState: boolean) => boolean)): void;
  setInlineDisable: AnyFunction;
  show: boolean;
  refresh(fix?: boolean, skipTransition?: boolean): void;
  setTarget(currentTarget?: HTMLElement): void;
}

function Tooltip(props: PopperPropsCustom) {
  const { content } = props;

  return <div className="fr-popper_content fr-popper_tooltip">{content}</div>;
}

function Popper(props: PopperPropsCustom) {
  const { content, title } = props;

  return (
    <div className="fr-popper_content fr-popper_popper">
      {title && <div className="fr-popper_popper-title">{title}</div>}
      <div className="fr-popper_popper-content">{content}</div>
    </div>
  );
}

function Confirm(props: PopperPropsCustom) {
  const {
    content,
    confirmText = '确认',
    cancelText = '取消',
    setShow,
    onConfirm,
    disabled,
    icon,
  } = props;
  const closeHandle = useFn(() => {
    setShow(false);
  });

  const confirmHandle = useFn(() => {
    onConfirm?.();
    setShow(false);
  });

  return (
    <div className="fr-popper_content fr-popper_confirm">
      <span className="fr-popper_confirm-icon">{icon || <SvgIcon type="warning" size={28} />}</span>
      <span>{content}</span>
      <div className="fr-popper_confirm-btns">
        <Button size="small" onClick={closeHandle}>
          {cancelText}
        </Button>
        <Button disabled={disabled} size="small" color="primary" onClick={confirmHandle}>
          {confirmText}
        </Button>
      </div>
    </div>
  );
}

const cachePrefix = 'FR_POPPER_CACHE';

export const IS_READ = '1';
export const NOT_IS_READ = '0';

export function getIsRead(studyKey: string) {
  return localStorage.getItem(`${cachePrefix}_${studyKey}`) || NOT_IS_READ;
}

export function setIsRead(studyKey: string, val: string) {
  localStorage.setItem(`${cachePrefix}_${studyKey}`, val);
}

function Study(props: PopperPropsCustom) {
  const { title, studyData = [], studyKey, setShow, setInlineDisable, setTarget, refresh } = props;

  const [isRead, setRead] = useState(() => {
    if (!studyKey) return NOT_IS_READ;
    const old = getIsRead(studyKey);
    if (old !== null) return old;
    return NOT_IS_READ;
  });

  const [state, setState] = useSetState({
    page: 0,
  });

  const [studyList, setStudyList] = useState<PopperStudyData[]>(studyData);

  const currentStudy = studyList[state.page];

  useUpdateEffect(() => {
    setStudyList(studyData);
  }, [studyKey]);

  useEffect(() => {
    if (isRead === IS_READ) {
      setInlineDisable(true);
      setShow(false);
    }
  }, [isRead]);

  useEffect(() => {
    if (!currentStudy) return;

    if (currentStudy.selector) {
      const el = document.querySelector(currentStudy.selector);
      if (el) {
        setTarget(el as HTMLElement);
      } else {
        setTarget();
      }
    } else {
      setTarget();
    }

    refresh();
  }, [state.page]);

  const closeHandle = useFn(() => {
    setShow(false);
  });

  const signReadHandle = useFn(() => {
    studyKey && setIsRead(studyKey, IS_READ);
    setRead(IS_READ);
    setShow(false);
  });

  const prevPage = useFn(() => {
    setState(prev => ({
      page: _clamp(prev.page - 1, 0, studyList.length),
    }));
  });

  const nextPage = useFn(() => {
    setState(prev => ({
      page: _clamp(prev.page + 1, 0, studyList.length),
    }));
  });

  const multiPage = studyList.length > 1;

  return (
    <div className="fr-popper_content fr-popper_study">
      <If when={currentStudy.img}>
        {() => <Picture className="fr-popper_study-img" src={currentStudy.img} />}
      </If>
      <If when={currentStudy}>
        {() => (
          <>
            {title && <div className="fr-popper_study-title">{currentStudy.title}</div>}
            <div className="fr-popper_study-content">{currentStudy.desc}</div>
          </>
        )}
      </If>

      <div className="fr-popper_study-btn-box">
        <If when={multiPage}>
          <span className="fr-popper_study-page">
            {state.page + 1}/{studyList.length}
          </span>
        </If>
        <If when={studyKey}>
          <Button size="small" onClick={signReadHandle}>
            不再显示
          </Button>
        </If>
        <Button size="small" onClick={closeHandle}>
          关闭
        </Button>
        <If when={multiPage}>
          <Button disabled={state.page === 0} size="small" onClick={prevPage}>
            上一条
          </Button>
        </If>
        <If when={multiPage}>
          <Button disabled={state.page === studyList.length - 1} size="small" onClick={nextPage}>
            下一条
          </Button>
        </If>
      </div>
    </div>
  );
}

export const buildInComponent = {
  tooltip: Tooltip,
  popper: Popper,
  confirm: Confirm,
  study: Study,
};
