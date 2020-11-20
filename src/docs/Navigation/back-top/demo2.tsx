import React, { useRef } from 'react';
import BackTop from 'm78/back-top';

const Demo2 = () => {
  const scrollEl = useRef<HTMLDivElement>(null!);

  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: 300,
          height: 400,
          border: '1px solid #ccc',
        }}
      >
        <BackTop target={scrollEl} style={{ position: 'absolute' }} />

        <div
          ref={scrollEl}
          style={{ width: '100%', height: '100%', overflow: 'auto', padding: 12 }}
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem eum ex incidunt minus
            officia officiis perspiciatis qui sed. Amet cumque impedit, incidunt mollitia
            necessitatibus odio possimus. Autem eveniet sequi suscipit?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem eum ex incidunt minus
            officia officiis perspiciatis qui sed. Amet cumque impedit, incidunt mollitia
            necessitatibus odio possimus. Autem eveniet sequi suscipit? Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Dolorem eum ex incidunt minus officia officiis
            perspiciatis qui sed. Amet cumque impedit, incidunt mollitia necessitatibus odio
            possimus. Autem eveniet sequi suscipit?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem eum ex incidunt minus
            officia officiis perspiciatis qui sed. Amet cumque impedit, incidunt mollitia
            necessitatibus odio possimus. Autem eveniet sequi suscipit? Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Dolorem eum ex incidunt minus officia officiis
            perspiciatis qui sed. Amet cumque impedit, incidunt mollitia necessitatibus odio
            possimus. Autem eveniet sequi suscipit?
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem eum ex incidunt minus
            officia officiis perspiciatis qui sed. Amet cumque impedit, incidunt mollitia
            necessitatibus odio possimus. Autem eveniet sequi suscipit? Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Dolorem eum ex incidunt minus officia officiis
            perspiciatis qui sed. Amet cumque impedit, incidunt mollitia necessitatibus odio
            possimus. Autem eveniet sequi suscipit? Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Dolorem eum ex incidunt minus officia officiis perspiciatis qui sed.
            Amet cumque impedit, incidunt mollitia necessitatibus odio possimus. Autem eveniet sequi
            suscipit? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem eum ex
            incidunt minus officia officiis perspiciatis qui sed. Amet cumque impedit, incidunt
            mollitia necessitatibus odio possimus. Autem eveniet sequi suscipit? Lorem ipsum dolor
            sit amet, consectetur adipisicing elit. Dolorem eum ex incidunt minus officia officiis
            perspiciatis qui sed. Amet cumque impedit, incidunt mollitia necessitatibus odio
            possimus. Autem eveniet sequi suscipit? Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Dolorem eum ex incidunt minus officia officiis perspiciatis qui sed.
            Amet cumque impedit, incidunt mollitia necessitatibus odio possimus. Autem eveniet sequi
            suscipit?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Demo2;
