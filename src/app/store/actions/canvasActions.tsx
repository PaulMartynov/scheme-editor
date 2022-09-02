import { createAction } from "@reduxjs/toolkit";

export const toggleLineCreation = createAction("canvas/toggleLineCreation");

export const toggleNodeCreation = createAction(
  "canvas/toggleNodeCreation",
  (nodeType: DrawNodeType | null) => {
    return { payload: nodeType };
  }
);

export const toggleEditMode = createAction("canvas/toggleEditMode");

export const toggleRemoveMode = createAction("canvas/toggleRemoveMode");

export const addNeLine = createAction("canvas/addNeLine", (line: Line) => {
  return { payload: line };
});

export const addNewNode = createAction(
  "canvas/addNewNode",
  (node: GraphNode) => {
    return { payload: node };
  }
);

export const updateNode = createAction(
  "canvas/updateNode",
  (id: string, node: Partial<GraphNode>) => {
    return { payload: { id, node } };
  }
);

export const removeNode = createAction("canvas/removeNode", (id: string) => {
  return { payload: id };
});

export const removeLine = createAction("canvas/removeLine", (id: string) => {
  return { payload: id };
});

export const loadBackground = createAction(
  "canvas/loadBackground",
  (file: string | ArrayBuffer) => {
    return { payload: file };
  }
);

export const setBackgroundScale = createAction(
  "canvas/setBackgroundScale",
  (scale: number) => {
    return { payload: scale };
  }
);

export const updateLine = createAction("canvas/updateLine", (line: Line) => {
  return { payload: line };
});

export const toggleBackground = createAction("canvas/toggleBackground");
