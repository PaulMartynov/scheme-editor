import React from "react";

type ZoomPanelProps = {
  value: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
};

export default function ZoomPanel(props: ZoomPanelProps): JSX.Element {
  return (
    <div className={"canvas-container__zoom-panel"}>
      <button onClick={() => props.zoomOut()}>{"-"}</button>
      <div className={"_zoom-info"} onClick={() => props.resetZoom()}>
        <span>{`${Math.ceil(props.value * 100)}%`}</span>
      </div>
      <button onClick={() => props.zoomIn()}>{"+"}</button>
    </div>
  );
}
