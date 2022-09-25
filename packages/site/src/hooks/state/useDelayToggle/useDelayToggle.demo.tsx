import React, { useState } from 'react';
import { useDelayToggle } from '@m78/hooks';

const useDelayToggleDemo = () => {
  const [loading, setLoading] = useState(false);
  const delayLoading = useDelayToggle(loading, 500);

  function requestSome() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 300);
  }

  return (
    <div>
      <button disabled={loading} onClick={requestSome}>
        toggle
      </button>

      <p>loading: {loading.toString()}</p>
      <p>delayLoading: {delayLoading.toString()}</p>
    </div>
  );
};

export default useDelayToggleDemo;
