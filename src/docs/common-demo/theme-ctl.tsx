import React, { useEffect } from 'react';
import { Button } from 'm78/button';
import { m78Config as config } from 'm78/config';

const ThemeCtl = () => {
  useEffect(() => {
    document.documentElement.className += 'm78';
  }, []);

  return (
    <Button
      icon
      style={{
        position: 'fixed',
        right: 24,
        bottom: 16,
        zIndex: 2000,
        fontSize: 24,
      }}
      onClick={() => {
        config.setState({
          darkMode: !config.getState().darkMode,
        });
      }}
    >
      💡
    </Button>
  );
};

export default ThemeCtl;
