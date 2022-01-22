import { simplifiedChinese } from '@m78/verify';
import { createEvent } from '@lxjx/hooks';
import { createVForm as create } from '@m78/vform';
import { RForm, RFormConfig } from './types';
import { valueRenderFactory } from './valueRenderFactory';
import { fieldFactory } from './fieldFactory';
import { listFactory } from './listFactory';

export function _createForm(config?: RFormConfig): RForm {
  const conf = {
    languagePack: simplifiedChinese,
    ...config,
  };

  const form = create(conf) as RForm;

  form.updateEvent = createEvent.enhance(form.updateEvent);
  form.changeEvent = createEvent.enhance(form.changeEvent);
  form.submitEvent = createEvent.enhance(form.submitEvent);
  form.failEvent = createEvent.enhance(form.failEvent);
  form.resetEvent = createEvent.enhance(form.resetEvent);

  // 注意, fieldFactory/listFactory内部的form尚未包含Field/List
  const Field = fieldFactory(form, conf);
  const List = listFactory(form, Field, conf);
  const ValueRender = valueRenderFactory(form);

  return Object.assign(form, {
    Field,
    List,
    ValueRender,
  });
}
