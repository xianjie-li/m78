import '@lxjx/fr/lib/dates/style';
import moment from 'moment';

import { TimeLimiter, DateLimiter, DateType } from './type';
import Dates from './Dates';

moment.locale('zh-cn');

export { DateType, TimeLimiter, DateLimiter };

export default Dates;
