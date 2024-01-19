import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input, Transition } from "../../src";
import { isArray, isObject, simplyDeepClone } from "@m78/utils";

console.log(new URL("./play.ts", import.meta.url));

const Play = () => {
  const [show, setShow] = useState(false);

  const obj = useMemo(() => {
    return {
      a: 1,
      b: 2,
      c: {
        d: 4,
        e: 5,
      },
      f: [1, 2, 3],
      c1: {
        c: {
          d: 4,
          e: 5,
        },
        f: [1, 2, 3],
      },
      c2: {
        c: {
          d: 4,
          e: 5,
        },
        f: [
          1,
          2,
          {
            d: 4,
            e: 5,
          },
        ],
      },
    };
  }, []);

  const worker = useMemo(() => {
    return new Worker(new URL("./worker.ts", import.meta.url), {
      // type: "module",
    });
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          console.log(simplyDeepClone(obj));
        }}
      >
        click
      </button>

      <button
        onClick={() => {
          console.log(worker);

          const createRow = (key: any) => {
            const obj: any = {
              id: `id${key}`,
            };

            Array.from({ length: 40 }).forEach((_, j) => {
              if (j === 4 || j === 3) {
                obj[`field${j}`] = `${key}-${j} abcdefghi`;
              } else {
                obj[`field${j}`] = `${key}-${j}`;
              }

              // if (j === 1) {
              //   obj[`field${j}`] = ["abc", `${key}-${j}`];
              // }
              //
              // if (j === 2) {
              //   obj[`field${j}`] = {
              //     value: `${key}-${j}`,
              //     other: 123,
              //   };
              // }
            });

            return obj;
          };

          const data1 = Array.from({ length: 100000 }).map((_, i) => {
            return createRow(i);
          });

          console.log(1, window.performance.now());

          worker.postMessage(data1);

          console.log(2, window.performance.now());
        }}
      >
        send
      </button>
    </div>
  );
};

export default Play;
