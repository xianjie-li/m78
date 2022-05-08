import React, { useEffect } from 'react';
import { Button } from 'm78/button';
import { m78Config as config } from 'm78/config';

const ThemeCtl = () => {
  useEffect(() => {
    document.documentElement.className += ' m78';
  }, []);

  return (
    <Button
      icon
      className="themeCtl"
      style={{
        position: 'fixed',
        right: 24,
        top: 16,
        zIndex: 2000,
        fontSize: 24,
      }}
      onClick={() => {
        config.set({
          darkMode: !config.get().darkMode,
        });
      }}
    >
      <config.State>{({ darkMode }) => (darkMode ? '🌙' : '☀')}</config.State>
    </Button>
  );
};

export default ThemeCtl;
