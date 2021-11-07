import React from 'react';
import { Popper } from 'm78/popper';
import { Button } from 'm78/button';

import sty from './demo.module.scss';

const Demo = () => (
  <div>
    <div className={sty.tooltip}>
      <div className={sty.top}>
        <Popper content="一段提示" direction="topStart">
          <Button>topStart</Button>
        </Popper>
        <Popper content="一段提示" direction="top">
          <Button>top</Button>
        </Popper>
        <Popper content="一段提示" direction="topEnd">
          <Button>topEnd</Button>
        </Popper>
      </div>

      <div className={sty.left}>
        <Popper content="一段提示" direction="leftStart">
          <Button>leftStart</Button>
        </Popper>
        <Popper content="一段提示" direction="left">
          <Button>left</Button>
        </Popper>
        <Popper content="一段提示" direction="leftEnd">
          <Button>leftEnd</Button>
        </Popper>
      </div>

      <div className={sty.right}>
        <Popper content="一段提示" direction="rightStart">
          <Button>rightStart</Button>
        </Popper>
        <Popper content="一段提示" direction="right">
          <Button>right</Button>
        </Popper>
        <Popper content="一段提示" direction="rightEnd">
          <Button>rightEnd</Button>
        </Popper>
      </div>

      <div className={sty.bottom}>
        <Popper content="一段提示" direction="bottomStart">
          <Button>bottomStart</Button>
        </Popper>
        <Popper content="一段提示" direction="bottom">
          <Button>bottom</Button>
        </Popper>
        <Popper content="一段提示" direction="bottomEnd">
          <Button>bottomEnd</Button>
        </Popper>
      </div>
    </div>
  </div>
);

const cachePrefix = 'FR_POPPER_CACHE';

export const IS_READ = '1';
export const NOT_IS_READ = '0';

export function getIsRead(studyKey: string) {
  return localStorage.getItem(`${cachePrefix}_${studyKey}`) || NOT_IS_READ;
}

export function setIsRead(studyKey: string, val: string) {
  localStorage.setItem(`${cachePrefix}_${studyKey}`, val);
}
//
// function Study(props: PopperPropsCustom) {
//   const {
//     wrapEl,
//     title,
//     studyData = [],
//     studyKey,
//     setShow,
//     setInlineDisable,
//     setTarget,
//     refresh,
//   } = props;
//
//   const sc = useScroll({ offset: -100, el: getRefDomOrDom(wrapEl) });
//
//   const [isRead, setRead] = useState(() => {
//     if (!studyKey) return NOT_IS_READ;
//     const old = getIsRead(studyKey);
//     if (old !== null) return old;
//     return NOT_IS_READ;
//   });
//
//   const [state, setState] = useSetState({
//     page: 0,
//   });
//
//   const [studyList, setStudyList] = useState<PopperStudyData[]>(studyData);
//
//   const currentStudy = studyList[state.page];
//
//   useUpdateEffect(() => {
//     setStudyList(studyData);
//   }, [studyKey]);
//
//   useEffect(() => {
//     if (isRead === IS_READ) {
//       setInlineDisable(true);
//       setShow(false);
//     }
//   }, [isRead]);
//
//   useEffect(() => {
//     if (isRead === IS_READ) return;
//     if (!currentStudy) return;
//
//     if (currentStudy.selector) {
//       const el = document.querySelector(currentStudy.selector);
//       if (el) {
//         setTarget(el as HTMLElement);
//         sc.scrollToElement(el as HTMLElement);
//       } else {
//         setTarget();
//       }
//     } else {
//       setTarget();
//     }
//
//     refresh(false, true, true);
//   }, [state.page]);
//
//   const closeHandle = useFn(() => {
//     setShow(false);
//   });
//
//   const signReadHandle = useFn(() => {
//     studyKey && setIsRead(studyKey, IS_READ);
//     setRead(IS_READ);
//     setShow(false);
//   });
//
//   const prevPage = useFn(() => {
//     setState(prev => ({
//       page: _clamp(prev.page - 1, 0, studyList.length),
//     }));
//   });
//
//   const nextPage = useFn(() => {
//     setState(prev => ({
//       page: _clamp(prev.page + 1, 0, studyList.length),
//     }));
//   });
//
//   const multiPage = studyList.length > 1;
//
//   return (
//     <div className="m78-popper_content m78-popper_study">
//       <If when={currentStudy.img}>
//         {() => <Picture className="m78-popper_study-img" src={currentStudy.img} />}
//       </If>
//       <If when={currentStudy}>
//         {() => (
//           <>
//             {title && <div className="m78-popper_study-title">{currentStudy.title}</div>}
//             <div className="m78-popper_study-content">{currentStudy.desc}</div>
//           </>
//         )}
//       </If>
//
//       <div className="m78-popper_study-btn-box">
//         <If when={multiPage}>
//           <span className="m78-popper_study-page">
//             {state.page + 1}/{studyList.length}
//           </span>
//         </If>
//         <If when={studyKey}>
//           <Button size="small" onClick={signReadHandle}>
//             不再显示
//           </Button>
//         </If>
//         <Button size="small" onClick={closeHandle}>
//           关闭
//         </Button>
//         <If when={multiPage}>
//           <Button disabled={state.page === 0} size="small" onClick={prevPage}>
//             上一条
//           </Button>
//         </If>
//         <If when={multiPage}>
//           <Button disabled={state.page === studyList.length - 1} size="small" onClick={nextPage}>
//             下一条
//           </Button>
//         </If>
//       </div>
//     </div>
//   );
// }

export default Demo;
