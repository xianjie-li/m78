import renderer from "react-test-renderer";
import React from "react";
import { AsyncRender, If, Switch, Toggle } from "./index.js";

describe("fork", function () {
  test("If", () => {
    const r = renderer
      .create(
        <div>
          <If when={true}>
            <div>你看到我了 1</div>
          </If>
          <If when={false}>
            <div>你看不到我 2</div>
          </If>
          <If when={0}>
            <div>你看不到我 3</div>
          </If>
          <If when={123}>
            <div>你看到我了 4</div>
          </If>
          <If when>{() => <div>render用法, 条件成立后才会创建Element</div>}</If>
        </div>
      )
      .toJSON();

    expect(r).toMatchSnapshot();
  });

  test("Toggle", () => {
    const r = renderer
      .create(
        <div>
          <Toggle when>
            <div>你看到我了1</div>
          </Toggle>
          <Toggle when={false}>
            <div>你看不到我2</div>
          </Toggle>
          <Toggle when={0}>
            <div>你看不到我3</div>
          </Toggle>
          <Toggle when={123}>
            <div>你看到我了4</div>
          </Toggle>
          <Toggle when={false}>
            如果子节点是字符串或一组ReactElement,
            会使用一个div作为包裹节点来挂载 display: none
          </Toggle>
          <Toggle when={false}>
            <div>你看不到我</div>
            <div>你看不到我</div>
            <div>你看不到我</div>
            <div>你看不到我</div>
            <div>你看不到我</div>
          </Toggle>
        </div>
      )
      .toJSON();

    expect(r).toMatchSnapshot();
  });

  test("Switch", () => {
    const r = renderer
      .create(
        <div>
          <Switch>
            <If when={false}>
              <div>你看不到我1</div>
            </If>
            <If when={false}>
              <div>你看不到我2</div>
            </If>
            <div>你看到我了3</div>
          </Switch>

          <Switch>
            <Toggle when={false}>
              <div>你看不到我1</div>
            </Toggle>
            <Toggle when={false}>
              <div>你看不到我2</div>
            </Toggle>
            <Toggle when={123123}>
              <div>你看到我了3</div>
            </Toggle>
            <div>你看不到我4</div>
          </Switch>
        </div>
      )
      .toJSON();

    expect(r).toMatchSnapshot();
  });
});

test("AsyncRender", () => {
  const r = renderer
    .create(
      <div>
        <AsyncRender hasData={false}>
          <div>12312</div>
        </AsyncRender>

        <AsyncRender hasData={true}>{() => <div>12312</div>}</AsyncRender>

        <AsyncRender hasData={false} error>
          {() => <div>12312</div>}
        </AsyncRender>

        <AsyncRender hasData={false} timeout>
          {() => <div>12312</div>}
        </AsyncRender>

        <AsyncRender hasData={false} loading>
          {() => <div>12312</div>}
        </AsyncRender>

        <AsyncRender hasData={false} loading forceRender>
          {() => <div>12312</div>}
        </AsyncRender>

        <AsyncRender hasData={false} loading loadingFull loadingText="abc">
          {() => <div>12312</div>}
        </AsyncRender>

        <AsyncRender hasData={false} emptyText="abcd">
          {() => <div>12312</div>}
        </AsyncRender>

        <AsyncRender hasData={false} error errorText="abcd">
          {() => <div>12312</div>}
        </AsyncRender>

        <AsyncRender hasData={false} timeout timeoutText="abcd">
          {() => <div>12312</div>}
        </AsyncRender>

        <AsyncRender
          hasData={false}
          loading
          customLoading={<span>loading</span>}
        >
          {() => <div>12312</div>}
        </AsyncRender>

        <AsyncRender
          hasData={false}
          error
          customNotice={(title, message) => (
            <div>
              <div>{title}</div>
              <div>{message}</div>
            </div>
          )}
        >
          {() => <div>12312</div>}
        </AsyncRender>

        <AsyncRender hasData={false} customEmpty={<span>abcd</span>}>
          {() => <div>12312</div>}
        </AsyncRender>
      </div>
    )
    .toJSON();

  expect(r).toMatchSnapshot();
});
