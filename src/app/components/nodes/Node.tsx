import React from "react";
import costumer from "../../../assets/icons/nodes/costumer.svg";
import substation from "../../../assets/icons/nodes/substation.svg";
import switcher from "../../../assets/icons/nodes/switcher.svg";

type NodeProps = {
  active?: boolean;
  editMode: boolean;
  node: GraphNode;
};

const addNode = (node: GraphNode) => {
  let link = "";
  switch (node.type) {
    case "substation":
      link = substation;
      break;
    case "costumer":
      link = costumer;
      break;
    case "switcher":
      link = switcher;
      break;
    default:
      return (
        <circle cx={17} cy={17} r={15} className={`_blank-node`} id={node.id} />
      );
  }
  return (
    <image width={node.size.x} height={node.size.y} id={node.id} href={link} />
  );
};

const Node = (props: NodeProps): JSX.Element => {
  return (
    <svg
      className={`node ${props.active ? "_active" : ""}`}
      x={props.node.x}
      y={props.node.y}
    >
      {addNode(props.node)}
    </svg>
  );
};

export default Node;
