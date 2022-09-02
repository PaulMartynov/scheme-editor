import { createSlice } from "@reduxjs/toolkit";
import {
  closeElementWindow,
  setActiveLineEl,
  setActiveNodeEl,
} from "../actions/elementActions";

const activeElementSlice = createSlice({
  name: "activeElement",
  initialState: {
    line: null as Line | null,
    node: null as GraphNode | null,
    active: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(closeElementWindow, (state) => {
      state.active = false;
      state.line = null;
      state.node = null;
    });
    builder.addCase(setActiveLineEl, (state, action) => {
      state.active = true;
      state.line = action.payload;
      state.node = null;
    });
    builder.addCase(setActiveNodeEl, (state, action) => {
      state.active = true;
      state.line = null;
      state.node = action.payload;
    });
  },
});

export default activeElementSlice.reducer;
