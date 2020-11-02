import React from 'react';
import { AspectRatio } from 'm78/layout';

const boxSty: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  background: 'rgba(0, 0, 0, 0.1)',
  padding: 12,
  margin: 12,
};

const AspectRatioDemo = () => {
  return (
    <div>
      <AspectRatio style={{ ...boxSty, width: 160 }}>1 / 1</AspectRatio>

      <AspectRatio ratio={2 / 3} style={{ ...boxSty, width: 160 }}>
        2 / 3
      </AspectRatio>

      <AspectRatio ratio={1 / 2} style={{ ...boxSty, width: 160 }}>
        1 / 2
      </AspectRatio>

      <AspectRatio ratio={1.5} style={{ ...boxSty, width: 160 }}>
        1.5 / 1
      </AspectRatio>
    </div>
  );
};

export default AspectRatioDemo;
