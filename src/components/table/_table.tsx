import React from 'react';
import { Button } from 'm78/button';

const _Table = () => {
  return (
    <div className="m78-table __border __stripe m78-scrollbar" style={{ height: 400 }}>
      <table>
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <td className="m78-table_fixed">
              <div>#</div>
              <span className="m78-table_fixed-border_left" />
              <span className="m78-table_fixed-border_right" />
            </td>
            <td>
              <div>标题2</div>
            </td>
            <td>
              <div>标题3</div>
            </td>
            <td>
              <div>标题4</div>
            </td>
            <td>
              <div>标题5</div>
            </td>
            <td>
              <div>
                标题6标题6题6标题6标6标题6标题6标题6标题6标题6标题6标题6标题6标题6标题6标题6标题6标题6标6标题6标题6标题6标题6标题6标题6标题6标题6标题6标题6标题6标题6标题6标6标题6标题6标题6标题6标题6标题6标题6标题6标题6标题6标题6标题6标题6标6标题6标题6标题6标题6标题6标题6标题6标题6
              </div>
            </td>
            <td>
              <div>标题7</div>
            </td>
            <td>
              <div>标题8</div>
            </td>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 20 }).map((item, key) => (
            <tr key={key}>
              <td className="m78-table_fixed">
                {key + 1}
                <span className="m78-table_fixed-border_left" />
                <span className="m78-table_fixed-border_right" />
              </td>
              <td>内容2</td>
              <td>
                <Button size="small">编辑</Button>
              </td>
              <td>内容4</td>
              <td>内容5</td>
              <td>内容6</td>
              <td>内容7</td>
              <td>内容8</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default _Table;
