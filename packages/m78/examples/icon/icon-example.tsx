import React, { useEffect, useMemo, useState } from "react";
import _debounce from "lodash/debounce";

import css from "./style.module.scss";
import { Spin } from "../../src/spin";
import { useFn } from "@m78/hooks";

const IconExample = () => {
  const [list, setList] = useState<any>([]);
  const [list2, setList2] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [kw, setKw] = useState("");

  const [error, setError] = useState();

  const filterList = useMemo(() => {
    if (!kw) return [];

    const ls1 = list.filter((i: any) =>
      i.key.toLowerCase().includes(kw.toLowerCase())
    );
    const ls2 = list2.filter((i: any) =>
      i.key.toLowerCase().includes(kw.toLowerCase())
    );

    return [...ls1, ...ls2];
  }, [kw]);

  useEffect(() => {
    // @ts-ignore
    import("@m78/icons/_bundle.js")
      .then((bundle) => {
        const l1: any = [];
        const l2: any = [];
        Object.entries(bundle).forEach(([key, Icon]) => {
          const data = {
            key,
            Icon,
          };
          if (key.startsWith("IconTow")) {
            l2.push(data);
          } else {
            l1.push(data);
          }
        });
        setList(l1);
        setList2(l2);
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        console.log(e);
      });
  }, []);

  const kwChange = useFn(
    ({ target }) => {
      setKw(target.value);
    },
    (fn) => _debounce(fn, 200)
  );

  return (
    <div className="fs-24">
      <div className="p-8">
        <input placeholder="输入关键词搜索" onChange={kwChange} />
      </div>
      {error && <div className="p-12 color-red">{error}</div>}
      {loading && (
        <div className="p-12">
          <Spin size="small" className="mr-16" />
          loading icon assets...
        </div>
      )}

      {kw && <span className="fs-14">共找到{filterList.length}项</span>}

      {filterList.length !== 0 && (
        <div className={css.searchArea}>
          {filterList.map((i: any) => (
            <div key={i.key} className={css.item}>
              <div>
                <i.Icon />
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        {list.map((i: any) => (
          <div key={i.key} className={css.item}>
            <div>
              <i.Icon />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconExample;
