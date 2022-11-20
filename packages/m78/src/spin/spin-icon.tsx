import React from "react";
import clsx from "clsx";

const S = 200;
const S_HALF = S / 2;
const BW = 60;
const BW_HALF = BW / 2;
const R = 100 - BW_HALF;
const ROUND_SIZE = Math.PI * S;

export function SpinIcon(props: any) {
  return (
    <svg
      {...props}
      width={S}
      height={S}
      viewBox={`0 0 ${S} ${S}`}
      fill="transparent"
      className={clsx("m78-spin-svg", props.className)}
    >
      <circle
        cx={S_HALF}
        cy={S_HALF}
        r={R}
        strokeWidth={BW}
        className="m78-spin-svg_bg"
      />
      <circle
        cx={S_HALF}
        cy={S_HALF}
        r={R}
        strokeWidth={BW}
        stroke="url(#Gradient1)"
        strokeDasharray={`${ROUND_SIZE} ${ROUND_SIZE}`}
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke-dashoffset"
          values={`${ROUND_SIZE};0;${ROUND_SIZE}`}
          dur="5s"
          repeatCount="indefinite"
        />
      </circle>
      <defs>
        <linearGradient id="Gradient1">
          <stop offset="0%" className="m78-spin-svg_stop1" />
          <stop offset="100%" className="m78-spin-svg_stop2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
