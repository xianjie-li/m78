import '@lxjx/fr/message/style';

import _messageApi, { tips, loading, notify } from './factory';

type Message = typeof _messageApi;

interface MessageApi extends Message {
  tips: typeof tips;
  loading: typeof loading;
  notify: typeof notify;
}

const message: MessageApi = Object.assign(_messageApi, {
  tips,
  loading,
  notify,
});

export * from './factory';
export * from './type';
export default message;
