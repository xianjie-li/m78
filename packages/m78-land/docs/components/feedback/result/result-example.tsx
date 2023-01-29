import React from "react";

import {
  Size,
  StatusIconError,
  StatusIconInfo,
  StatusIconSuccess,
  StatusIconWarning,
} from "m78/common";
import { Button } from "m78/button";
import { Result } from "m78/result";
import { IconDrafts } from "@m78/icons/icon-drafts";
import { Divider } from "m78/layout";

const ResultExample = () => {
  return (
    <div>
      <Divider className="fs-20" align="start">
        <strong>status</strong>
      </Divider>

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

      <Divider className="fs-20 mt-32" align="start">
        <strong>empty</strong>
      </Divider>

      <Result
        size={Size.small}
        icon={<IconDrafts className="color-disabled" />}
        title="No data"
        actions={<Button size={Size.small}>refresh</Button>}
      />

      <Divider className="fs-20 mt-32" align="start">
        <strong>size</strong>
      </Divider>

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
