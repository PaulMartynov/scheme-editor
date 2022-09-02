import React from "react";
import "./toolbar.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  toggleEditMode,
  toggleLineCreation,
  toggleRemoveMode,
} from "../../store/actions/canvasActions";
import line from "../../../assets/icons/menus/data-line.svg";
import edit from "../../../assets/icons/menus/edit-icon.svg";
import delIcon from "../../../assets/icons/menus/delete-icon.svg";
import NodesMenu from "./NodesMenu";

export default function ToolBar(): JSX.Element {
  const { drawLines, editMode, removeMode } = useAppSelector(
    (state) => state.canvas
  );
  const dispatch = useAppDispatch();
  return (
    <div className={"toolbar"}>
      <button
        className={`${drawLines ? "_active" : ""}`}
        onClick={() => {
          dispatch(toggleLineCreation());
        }}
        title={"add new line"}
      >
        <img src={line} alt={"new line"} />
      </button>
      <NodesMenu />
      <button
        className={`${editMode ? "_active" : ""}`}
        onClick={() => {
          dispatch(toggleEditMode());
        }}
        title={"edit"}
      >
        <img src={edit} alt={"edit"} />
      </button>
      <button
        className={`_delete ${removeMode ? "_active" : ""}`}
        onClick={() => {
          dispatch(toggleRemoveMode());
        }}
        title={"remove"}
      >
        <img src={delIcon} alt={"delete"} />
      </button>
    </div>
  );
}
