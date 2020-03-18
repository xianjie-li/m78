import React from 'react';
import ArticleBox from '@lxjx/fr/lib/article-box';
import '@lxjx/fr/lib/article-box/style';

import img from '@/src/mock/img/4.jpg';

const htmlStr = `
  <div>
    <h2><center>一篇关于橘子的文章</center></h2>
  
    <img src="${img}" />
    
    <h3 style="margin-top: 16px">橘子的营养成分:</h3>
    <table border="1">
      <tr>
        <td>iam. Accusamus deciatis, sed.</td>
        <td>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem sint, ven</td>
        <td>niti dicta eaque facilis fugiat, ipsum mollitia nisi porro possimus q</td>
        <td>leuod recusandae sequi sit voluptate. Ipsum perspi</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
      </tr>
    </table>
    
    <h3 style="margin-top: 16px">历史:</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus beatae dolorum, ea enim eos exercitationem libero molestiae, natus nobis officiis pariatur quaerat quas ratione repellendus sit tempora unde vel, vitae.</p>
    <img src="${img}" style="width: 250px;float: left;margin-right: 12px" />
    <p><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi fugit quo rerum? Ab accusamus consequatur culpa cumque debitis, dolorum eum exercitationem in ipsa iure quod rem saepe sed sit ullam.</span><span>Dicta, incidunt iusto libero neque omnis quas reprehenderit unde! Aspernatur beatae cumque eaque esse ex, fugit laboriosam laborum libero numquam officia pariatur perferendis placeat quidem sapiente suscipit unde, vero voluptate?</span><span>Ad aliquid esse fugiat fugit numquam rem, reprehenderit totam vitae. Hic nobis officiis quis quisquam repellat. Adipisci, dolore eum excepturi inventore libero numquam odit, pariatur quia repellat repellendus sunt voluptas!</span><span>Dicta iure odit officiis perferendis tempore. A ad aliquam animi aspernatur at delectus dolor, nobis quisquam, quos reiciendis saepe sunt tenetur vero? Doloribus inventore natus neque reprehenderit velit vero voluptatem!</span><span>Accusamus dolorem doloribus esse facilis impedit natus neque nulla provident, quia ratione rem rerum voluptate! Ab aliquam amet cum ea id illum magni molestiae quia repellendus, sed sit totam vero!</span></p>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus beatae dolorum, ea enim eos exercitationem libero molestiae, natus nobis officiis pariatur quaerat quas ratione repellendus sit tempora unde vel, vitae.</p>
  </div>
`;

const Demo = () => {
  return (
    <div>
      <ArticleBox
        watermark="我是水印"
        html={htmlStr}
      />
    </div>
  );
};

export default Demo;
