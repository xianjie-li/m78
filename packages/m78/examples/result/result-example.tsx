import React from "react";
import { Button } from "../../src/index.js";
import { Result } from "../../src/result/index.js";
import {
  Size,
  StatusIconError,
  StatusIconInfo,
  StatusIconSuccess,
  StatusIconWarning,
} from "../../src/common/index.js";
import { IconDrafts } from "@m78/icons/icon-drafts";

const ResultExample = () => {
  return (
    <div>
      <Result
        icon={<StatusIconInfo />}
        title="这是一个标题"
        desc="这是一段详细说明"
        extra={
          <div>
            <div>Lorem Facere minus, modi? illo</div>
            <div>ipsum dolor sit amet, consectetur adipisicing elit.</div>
          </div>
        }
        actions={
          <>
            <Button>取消</Button>
            <Button color="primary">确认</Button>
          </>
        }
      />
      <Result
        icon={<StatusIconSuccess />}
        title="这是一个标题"
        desc="这是一段详细说明"
        extra={
          <div>
            <div>Lorem Facere minus, modi? illo</div>
            <div>ipsum dolor sit amet, consectetur adipisicing elit.</div>
          </div>
        }
        actions={
          <>
            <Button>取消</Button>
            <Button color="primary">确认</Button>
          </>
        }
      />
      <Result
        icon={<StatusIconError />}
        title="这是一个标题"
        desc="这是一段详细说明"
        extra={
          <div>
            <div>Lorem Facere minus, modi? illo</div>
            <div>ipsum dolor sit amet, consectetur adipisicing elit.</div>
          </div>
        }
        actions={
          <>
            <Button>取消</Button>
            <Button color="primary">确认</Button>
          </>
        }
      />
      <Result
        icon={<StatusIconWarning />}
        title="这是一个标题"
        desc="这是一段详细说明"
        actions={
          <>
            <Button>取消</Button>
            <Button color="primary">确认</Button>
          </>
        }
      />

      <Result
        size={Size.small}
        icon={<IconDrafts className="color-disabled" />}
        title="暂无数据"
        actions={<Button size={Size.small}>刷新页面</Button>}
      />

      <Result
        size={Size.small}
        icon={<StatusIconInfo />}
        title="这是一个标题"
        desc="这是一段详细说明"
        extra={
          <div>
            <div>Lorem Facere minus, modi? illo</div>
            <div>ipsum dolor sit amet, consectetur adipisicing elit.</div>
          </div>
        }
        actions={
          <>
            <Button size={Size.small}>取消</Button>
            <Button size={Size.small} color="primary">
              确认
            </Button>
          </>
        }
      />
      <Result
        icon={<StatusIconInfo />}
        title="这是一个标题"
        desc="这是一段详细说明"
        extra={
          <div>
            <div>Lorem Facere minus, modi? illo</div>
            <div>ipsum dolor sit amet, consectetur adipisicing elit.</div>
          </div>
        }
        actions={
          <>
            <Button>取消</Button>
            <Button color="primary">确认</Button>
          </>
        }
      />
      <Result
        size={Size.large}
        icon={<StatusIconInfo />}
        title="这是一个标题"
        desc="这是一段详细说明"
        extra={
          <div>
            <div>Lorem Facere minus, modi? illo</div>
            <div>ipsum dolor sit amet, consectetur adipisicing elit.</div>
          </div>
        }
        actions={
          <>
            <Button size={Size.large}>取消</Button>
            <Button size={Size.large} color="primary">
              确认
            </Button>
          </>
        }
      />
    </div>
  );
};

export default ResultExample;
