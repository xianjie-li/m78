import React from 'react';
import Picture from 'm78/picture';
import { Grid } from 'm78/layout';

const Play = () => {
  return (
    <div>
      <Grid aspectRatio={1 / 2} count={5} crossSpacing={12} mainSpacing={8}>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
        <div>7</div>
        <div>7</div>
        <div>7</div>
        <div>7</div>
      </Grid>
    </div>
  );
};

export default Play;
