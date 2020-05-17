/** 从错误字符数组中取第一位 */
export function getFirstError(errors?: string[]) {
  if (!errors) return undefined;
  if (!errors.length) return undefined;
  return errors[0];
}

/** 根据错误字符和是否验证中获取status */
export function getStatus(error?: string, loading?: boolean) {
  let status: any;

  if (!error) return status;

  if (error) {
    status = 'error';
  }

  if (loading) {
    status = 'loading';
  }

  return status;
}
