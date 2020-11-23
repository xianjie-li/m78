import React from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { getValueIndexJointString } from 'm78/tree/common';
import TreeItem from './item';
import { DragItemProps } from './types';

export const DragItem = (props: DragItemProps) => {
  const { data, index } = props;

  return (
    <Draggable
      draggableId={getValueIndexJointString(data.value, index)}
      index={index}
      key={data.value}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <TreeItem {...props} provided={provided} snapshot={snapshot} index={index} />
      )}
    </Draggable>
  );
};
