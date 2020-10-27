import React from 'react';
import 'm78/base';
import { Title, SubTitle } from './titles';
import Footer from './footer';
import { ListType, ListItemProps } from './type';
declare const _List: React.FC<ListType>;
declare const Item: React.FC<ListItemProps>;
declare type List = typeof _List;
interface ListWithExtra extends List {
    Item: typeof Item;
    Title: typeof Title;
    SubTitle: typeof SubTitle;
    Footer: typeof Footer;
}
declare const List: ListWithExtra;
export { Item, Title, SubTitle, Footer };
export default List;
