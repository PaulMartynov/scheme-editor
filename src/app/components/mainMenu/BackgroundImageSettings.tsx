import React, { useState } from "react";
import {
  loadBackground,
  setBackgroundScale,
  toggleBackground,
} from "../../store/actions/canvasActions";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import "./Menu.scss";

export default function BackgroundImageSettings() {
  const [active, setActive] = useState(false);
  const dispatch = useAppDispatch();
  const { backgroundScale, backgroundEn } = useAppSelector(
    (state) => state.canvas
  );
  const toggle = () => {
    dispatch(toggleBackground());
  };
  return (
    <div className={"background-image-menu"}>
      <div
        className={`button-antraks ${active ? "in-queue" : ""}`}
        onClick={() => setActive(!active)}
      >
        {"Substrate"}
      </div>
      <div hidden={!active} className={"background-image-menu__content"}>
        <div className={"background-image-menu__toggle"}>
          <label htmlFor={"toggle-background"}>{"Show background:"}</label>
          <input
            type={"checkbox"}
            id={"toggle-background"}
            checked={backgroundEn}
            onChange={toggle}
          />
        </div>
        <input
          id={"background-image-input"}
          type={"file"}
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files[0]) {
              const file = target.files[0];
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = (ev) => {
                if (ev.target?.result) {
                  dispatch(loadBackground(ev.target.result));
                }
              };
            }
          }}
        />
        <input
          type={"range"}
          min={0.1}
          step={0.01}
          max={3}
          value={backgroundScale}
          onInput={(e) => {
            dispatch(
              setBackgroundScale(Number((e.target as HTMLInputElement).value))
            );
          }}
        />
      </div>
    </div>
  );
}
