import 'm78/notify/style';
import { _notify, _loading } from './notify-impl';

export const notify = Object.assign(_notify, {
  loading: _loading,
});
