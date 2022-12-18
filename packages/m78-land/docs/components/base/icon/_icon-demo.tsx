import React, { useEffect, useMemo, useState } from "react";
import _debounce from "lodash/debounce";

import css from "./style.module.scss";
import { Spin } from "m78/spin";
import { useFn } from "@m78/hooks";
import { Input } from "m78/input";
import { notify } from "m78/notify";
import { copyToClipboard } from "@site/src/common/common";

const IconDemo = () => {
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
    (val) => {
      setKw(val);
    },
    (fn) => _debounce(fn, 200)
  );

  const copy = useFn((e, item) => {
    const el = e.currentTarget;
    const className = el.getAttribute("class");

    const clsPiece = className.split(" ");

    let cls = "";

    for (const piece of clsPiece) {
      if (/m78-icon_.+/.test(piece)) {
        cls = piece.replace("m78-icon_", "");
        break;
      }
    }

    copyToClipboard(`import { ${item.key} } from "@m78/icons/${cls}";`).then(
      () => {
        notify.success("复制成功");
      }
    );
    console.log(`import { ${item.key} } from "@m78/icons/${cls}";`);
  });

  return (
    <div className="fs-24">
      <div className="p-8">
        <Input placeholder="输入关键词搜索" onChange={kwChange} />
      </div>
      {loading && (
        <div className="p-12">
          <Spin size="small" className="mr-16" />
          loading icon assets...
        </div>
      )}

      {error && <div className="p-12 color-red">{error}</div>}

      {kw && <div className="p-12 fs-14">共找到{filterList.length}项</div>}

      {filterList.length !== 0 && (
        <div className={css.searchArea}>
          {filterList.map((i: any) => (
            <div key={i.key} className={css.item}>
              <i.Icon onClick={(e: any) => copy(e, i)} />
            </div>
          ))}
        </div>
      )}

      <div>
        {list.map((i: any) => (
          <div key={i.key} className={css.item}>
            <i.Icon onClick={(e: any) => copy(e, i)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconDemo;
