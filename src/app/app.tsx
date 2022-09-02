import React from "react";
import Canvas from "./components/canvas/Canvas";
import ToolBar from "./components/toolbar/ToolBar";
import MainMenu from "./components/mainMenu/MainMenu";
import ElementOptions from "./components/modal/ElementOptions";

export default function App() {
  return (
    <>
      <MainMenu />
      <div className={"main-content"}>
        <ToolBar />
        <Canvas />
        <ElementOptions />
      </div>
    </>
  );
}
