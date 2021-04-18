import { Seed } from '@m78/seed';
import { State, UseState } from './type';
declare function createState<D, V>(seed: Seed<D, V>, useState: UseState<D>): State<D>;
export default createState;
