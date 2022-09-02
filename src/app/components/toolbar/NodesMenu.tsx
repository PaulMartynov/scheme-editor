import React, { useState } from "react";
import { toggleNodeCreation } from "../../store/actions/canvasActions";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

const nodes: { [key: string]: DrawNodeType } = {
  blank: {
    type: "blank",
    size: { x: 34, y: 34 },
  },
  costumer: {
    type: "costumer",
    size: { x: 50, y: 50 },
  },
  substation: {
    type: "substation",
    size: { x: 100, y: 50 },
  },
  switcher: {
    type: "switcher",
    size: { x: 50, y: 50 },
  },
};

export default function NodesMenu(): JSX.Element {
  const { drawNode } = useAppSelector((state) => state.canvas);
  const dispatch = useAppDispatch();
  const [drawType, setDrawType] = useState(nodes.blank);
  const [active, setActive] = useState(false);
  const changeDrawType = (type: string) => {
    if (nodes[type]) {
      setDrawType(nodes[type]);
    }
    dispatch(toggleNodeCreation(nodes[type]));
    setActive(false);
  };
  return (
    <div className={"nodes-menu"}>
      <div
        className={`nodes-menu__btn _draw ${drawNode ? "_active" : ""}`}
        onClick={() => {
          if (drawNode) {
            dispatch(toggleNodeCreation(null));
            return;
          }
          dispatch(toggleNodeCreation(drawType));
        }}
        title={"new node"}
      >
        <div className={`node-icon _small _${drawType.type}-node`} />
      </div>
      <div
        className={`nodes-menu__btn _show-content ${active ? "_active" : ""}`}
        onClick={() => setActive(!active)}
      >
        <span>{"❱"}</span>
      </div>
      <div hidden={!active} className={"nodes-menu__content"}>
        <div
          className={"node-icon _blank-node"}
          onClick={() => changeDrawType("blank")}
        />
        <div
          className={"node-icon _substation-node"}
          onClick={() => changeDrawType("substation")}
        />
        <div
          className={"node-icon _costumer-node"}
          onClick={() => changeDrawType("costumer")}
        />
        <div
          className={"node-icon _switcher-node"}
          onClick={() => changeDrawType("switcher")}
        />
      </div>
    </div>
  );
}
