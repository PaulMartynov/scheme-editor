import { configureStore, combineReducers } from "@reduxjs/toolkit";

import canvas from "./redusers/canvas";
import activeElement from "./redusers/activeElement";

const rootReducer = combineReducers({
  canvas,
  activeElement,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
