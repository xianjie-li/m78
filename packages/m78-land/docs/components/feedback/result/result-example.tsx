import React from "react";

import {
  Size,
  StatusIconError,
  StatusIconInfo,
  StatusIconSuccess,
  StatusIconWarning,
  Button,
  Result,
  Divider,
  IllustrationEmpty1,
} from "m78";

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
        icon={<IllustrationEmpty1 height={160} />}
        title="没有数据"
        desc="数据上传中, 请过段时间再来查看"
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
