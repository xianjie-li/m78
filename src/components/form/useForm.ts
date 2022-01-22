import { useState } from 'react';
import { RFormConfig } from './types';
import { _createForm } from './createForm';

/**
 * createForm的便捷形式
 * */
export function _useForm(config?: RFormConfig) {
  const [f] = useState(() => _createForm(config));

  return f;
}
