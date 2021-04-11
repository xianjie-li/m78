import React, { useEffect, useState } from 'react';
import Button from 'm78/button';

const ThemeCtl = () => {
  const [theme, setTheme] = useState('light');

  console.log(theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  return (
    <Button
      icon
      style={{
        position: 'fixed',
        right: 12,
        bottom: 12,
        zIndex: 2000,
        fontSize: 24,
      }}
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}
    >
      💡
    </Button>
  );
};

export default ThemeCtl;
