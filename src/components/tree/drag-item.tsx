import React from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import TreeItem from './item';
import { DragItemProps } from './types';

export const DragItem = (props: DragItemProps) => {
  const { data, index } = props;

  return (
    <Draggable draggableId={String(data.value)} index={index} key={data.value}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <TreeItem {...props} provided={provided} snapshot={snapshot} index={index} />
      )}
    </Draggable>
  );
};
