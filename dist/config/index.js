import React, { useContext } from 'react';

var context = /*#__PURE__*/React.createContext({});

function useConfig() {
  return useContext(context);
}

var index = {
  context: context,
  Provider: context.Provider,
  Consumer: context.Consumer,
  useConfig: useConfig
};

export default index;
