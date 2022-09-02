import { createSlice } from "@reduxjs/toolkit";
import {
  addNeLine,
  addNewNode,
  loadBackground,
  removeLine,
  removeNode,
  setBackgroundScale,
  toggleBackground,
  toggleEditMode,
  toggleLineCreation,
  toggleNodeCreation,
  toggleRemoveMode,
  updateLine,
  updateNode,
} from "../actions/canvasActions";

// const generateNodes = (): NodeElement[] => {
//   const res: NodeElement[] = [];
//   for (let i = 0; i < 100; i += 1) {
//     res.push({
//       id: `node-${i}`,
//       x: Math.floor(Math.random() * 1300),
//       y: Math.floor(Math.random() * 800),
//       size: { x: 100, y: 50 },
//       type: "substation",
//     });
//   }
//   return res;
// };

const updateLinesLinks = (
  lines: Line[],
  node: GraphNode | undefined
): Line[] => {
  if (!node) {
    return lines;
  }
  return lines.map((l) => {
    const firstPoint = l.points[0];
    const lastPoint = l.points[l.points.length - 1];

    if (
      firstPoint.x === node.x + node.size.x / 2 &&
      firstPoint.y === node.y + node.size.y / 2
    ) {
      if (l.startNodeId !== node.id) {
        l.startNodeId = node.id;
      }
    } else if (l.startNodeId === node.id) {
      l.startNodeId = null;
    }
    if (
      lastPoint.x === node.x + node.size.x / 2 &&
      lastPoint.y === node.y + node.size.y / 2
    ) {
      if (l.endNodeId !== node.id) {
        l.endNodeId = node.id;
      }
    } else if (l.endNodeId === node.id) {
      l.endNodeId = null;
    }
    return l;
  });
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState: {
    editMode: false,
    drawLines: false,
    drawNode: null as DrawNodeType | null,
    removeMode: false,
    backgroundImg: null as unknown as string | ArrayBuffer,
    backgroundScale: 1,
    backgroundEn: true,
    lines: [] as Line[],
    nodes: [] as GraphNode[],
  },
  reducers: {},
  extraReducers: (buider) => {
    buider.addCase(toggleLineCreation, (state) => {
      state.drawLines = !state.drawLines;
      state.drawNode = null;
      state.editMode = false;
      state.removeMode = false;
    });
    buider.addCase(toggleNodeCreation, (state, action) => {
      state.drawNode = action.payload;
      state.drawLines = false;
      state.editMode = false;
      state.removeMode = false;
    });
    buider.addCase(toggleEditMode, (state) => {
      state.editMode = !state.editMode;
      state.drawLines = false;
      state.drawNode = null;
      state.removeMode = false;
    });
    buider.addCase(toggleRemoveMode, (state) => {
      state.drawLines = false;
      state.drawNode = null;
      state.editMode = false;
      state.removeMode = !state.removeMode;
    });
    buider.addCase(addNeLine, (state, action) => {
      state.lines.push(action.payload);
    });
    buider.addCase(addNewNode, (state, action) => {
      state.nodes.push(action.payload);
      state.lines = updateLinesLinks(state.lines, action.payload);
    });
    buider.addCase(updateNode, (state, action) => {
      state.nodes = state.nodes.map((node) => {
        if (node.id === action.payload.id) {
          return {
            ...node,
            ...action.payload.node,
          };
        }
        return node;
      });
      state.lines = updateLinesLinks(
        state.lines,
        state.nodes.find((n) => n.id === action.payload.id)
      );
    });
    buider.addCase(removeNode, (state, action) => {
      state.nodes = state.nodes.filter((n) => n.id !== action.payload);
    });
    buider.addCase(removeLine, (state, action) => {
      state.lines = state.lines.filter((n) => n.id !== action.payload);
    });
    buider.addCase(loadBackground, (state, action) => {
      state.backgroundImg = action.payload;
    });
    buider.addCase(setBackgroundScale, (state, action) => {
      state.backgroundScale = action.payload;
    });
    buider.addCase(updateLine, (state, action) => {
      state.lines = state.lines.map((l) => {
        if (l.id === action.payload.id) {
          return action.payload;
        }
        return l;
      });
    });
    buider.addCase(toggleBackground, (state) => {
      state.backgroundEn = !state.backgroundEn;
    });
  },
});

export default canvasSlice.reducer;
