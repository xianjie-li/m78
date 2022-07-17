import 'm78/notify/style';
import { _notify, _loading } from './_notify';

export const notify = Object.assign(_notify, {
  loading: _loading,
});
