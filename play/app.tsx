import React, { useEffect, useState } from 'react';
import Button from 'm78/button';

const App = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="p-32">
      <Button onClick={() => setDark(prev => !prev)}>{dark ? 'dark' : 'light'}</Button>
    </div>
  );
};

export default App;
