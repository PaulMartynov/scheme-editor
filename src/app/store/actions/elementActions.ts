import { createAction } from "@reduxjs/toolkit";

export const setActiveLineEl = createAction(
  "activeElement/setActiveLine",
  (line: Line) => {
    return { payload: line };
  }
);

export const setActiveNodeEl = createAction(
  "activeElement/setActiveNode",
  (node: GraphNode) => {
    return { payload: node };
  }
);

export const closeElementWindow = createAction("activeElement/closeWindow");
