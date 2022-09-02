import React from "react";
import BackgroundImageSettings from "./BackgroundImageSettings";

export default function MainMenu() {
  return (
    <div className={"main-menu"}>
      <button className={"button-antraks"}>{"Save"}</button>
      <div>
        <label htmlFor={"project-input"} className={"button-antraks"}>
          {"Load"}
        </label>
        <input hidden={true} id={"project-input"} type={"file"} />
      </div>
      <BackgroundImageSettings />
    </div>
  );
}
