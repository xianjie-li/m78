import './style';

import createRenderApi, { ReactRenderApiProps } from '@lxjx/react-render-api';
import _ActionSheet from './action-sheet';

import { ActionSheetProps } from './type';

type ActionSheetOption = Omit<ActionSheetProps, keyof ReactRenderApiProps>;

const actionSheetApi = createRenderApi<ActionSheetOption>(_ActionSheet, {
  namespace: 'ACTION_SHEET',
});

type ActionSheet = typeof _ActionSheet;

interface ActionSheetWithApi extends ActionSheet {
  api: typeof actionSheetApi;
}

const ActionSheet: ActionSheetWithApi = Object.assign(_ActionSheet, { api: actionSheetApi });

export * from './type';
export default ActionSheet;
