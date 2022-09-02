import React from "react";
import "./Modal.scss";

export default function Modal(props: ModalProps): JSX.Element {
  return (
    <div
      className={
        props.active
          ? `modal-${props.settings ? "settings" : "window"} active`
          : `modal-${props.settings ? "settings" : "window"}`
      }
      data-testid={"modal-div"}
    >
      <div
        className={
          props.active
            ? `modal-${props.settings ? "settings" : "window"}__content active`
            : `modal-${props.settings ? "settings" : "window"}__content`
        }
      >
        {props.children}
      </div>
    </div>
  );
}
