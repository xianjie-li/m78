import { Moment } from 'moment';
import { ComponentBaseProps } from '../types/types';

export interface DatesProps extends ComponentBaseProps {}

export interface DateItemProps {
  itemMoment: Moment;
  /** 该项所在时间 */
  currentMoment: Moment;
  /** 当前时间 */
  nowMoment: Moment;
}
