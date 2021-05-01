import React from 'react';
import { render, fireEvent, queryByText, queryAllByText, findByText } from '@testing-library/react';
import { Fork, If, Toggle, Switch } from 'm78/fork';

test('Fork', () => {
  const notData = render(
    <Fork hasData={false} emptyText="not data">
      <span>Fork child</span>
    </Fork>,
  );

  const hasData = render(
    <Fork hasData>
      <span>Fork child</span>
    </Fork>,
  );

  const hasError = render(
    <Fork hasData={false} error={new Error('render error')}>
      <span>Fork child</span>
    </Fork>,
  );

  const hasTimeout = render(
    <Fork hasData={false} timeout>
      <span>Fork child</span>
    </Fork>,
  );

  expect(queryByText(notData.container, 'not data')).toBeTruthy();
  expect(queryByText(hasData.container, 'Fork child')).toBeTruthy();
  expect(queryByText(hasError.container, '数据加载失败')).toBeTruthy();
  expect(queryByText(hasError.container, 'render error')).toBeTruthy();
  expect(queryByText(hasError.container, 'render error')).toBeTruthy();
  expect(queryByText(hasTimeout.container, '请求超时')).toBeTruthy();
});

test('Fork .loading', () => {
  const loading = render(
    <Fork hasData={false} loading>
      <span>Fork child</span>
    </Fork>,
  );

  return findByText(loading.container, '加载中').then(node => {
    expect(node).toBeTruthy();
  });
});

test('Fork .forceRenderChild', () => {
  const loading = render(
    <Fork hasData loading forceRender>
      <span>Fork child</span>
    </Fork>,
  );

  expect(queryByText(loading.container, 'Fork child')).toBeTruthy();

  return findByText(loading.container, '加载中').then(node => {
    expect(node).toBeTruthy();
  });
});

test('Fork .loadingFull', async () => {
  const loading = render(
    <Fork hasData={false} loading loadingFull>
      <span>Fork child</span>
    </Fork>,
  );

  return findByText(loading.container, '加载中').then(node => {
    expect((node.parentNode as HTMLElement).classList.contains('__full')).toBe(true);
  });
});

test('Fork .loadingFull', async () => {
  const loading = render(
    <Fork hasData={false} loading loadingFull>
      <span>Fork child</span>
    </Fork>,
  );

  return findByText(loading.container, '加载中').then(node => {
    expect((node.parentNode as HTMLElement).classList.contains('__full')).toBe(true);
  });
});

test('Fork .send()', async () => {
  const send = jest.fn(() => {});

  const r1 = render(
    <Fork hasData={false} send={send}>
      <span>Fork child</span>
    </Fork>,
  );

  const r2 = render(
    <Fork hasData={false} error send={send}>
      <span>Fork child</span>
    </Fork>,
  );

  const btn1 = queryByText(r1.container, '点击重新加载');
  const btn2 = queryByText(r2.container, '点击重新加载');

  expect(btn1).toBeTruthy();
  expect(btn2).toBeTruthy();

  fireEvent.click(btn1!);
  fireEvent.click(btn2!);

  expect(send).toHaveBeenCalledTimes(2);
});

test('If', () => {
  const r1 = render(
    <If>
      <span>if child</span>
    </If>,
  );

  const r2 = render(
    <If when>
      <span>if child</span>
    </If>,
  );

  const r3 = render(<If when>{() => <span>if child</span>}</If>);

  expect(queryByText(r1.container, 'if child')).toBeNull();
  expect(queryByText(r2.container, 'if child')).toBeTruthy();
  expect(queryByText(r3.container, 'if child')).toBeTruthy();
});

test('Toggle', () => {
  const r1 = render(
    <Toggle>
      <span>if child</span>
    </Toggle>,
  );

  const r2 = render(
    <Toggle when>
      <span>if child</span>
    </Toggle>,
  );

  expect((r1.container.firstChild as HTMLElement).style.display).toBe('none');
  expect((r2.container.firstChild as HTMLElement).style.display).toBe('');
});

test('Switch', () => {
  const r1 = render(
    <Switch>
      <If>hide</If>
      <If when>show</If>
      <If when>hide</If>
    </Switch>,
  );

  const r2 = render(
    <Switch>
      <Toggle>
        <span>hide</span>
      </Toggle>
      <Toggle when={123}>
        <span>show</span>
      </Toggle>
      <Toggle when={123}>
        <span>hide</span>
      </Toggle>
    </Switch>,
  );

  expect(queryAllByText(r1.container, 'show').length).toBe(1);
  expect(queryAllByText(r2.container, 'show').length).toBe(1);
});
