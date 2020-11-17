import 'm78/message/style';
import _messageApi, { tips, loading, notify } from './factory';
declare type Message = typeof _messageApi;
interface MessageApi extends Message {
    tips: typeof tips;
    loading: typeof loading;
    notify: typeof notify;
}
declare const message: MessageApi;
export * from './factory';
export * from './type';
export default message;
