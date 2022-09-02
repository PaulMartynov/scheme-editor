import React, { useMemo } from "react";
import pointsToPoly from "../../utils/pointsToPoly";

type PolyProps = {
  line: Line;
  edit: boolean;
};

export default function Polyline(props: PolyProps) {
  const points = useMemo(() => {
    if (!props.edit) {
      return null;
    }
    return props.line.points.map((p, i) => (
      <React.Fragment key={`${props.line.id}-p-${i}`}>
        <circle
          id={`${props.line.id}-p-${i}`}
          cx={p.x}
          cy={p.y}
          r={5}
          fill={"white"}
          stroke={props.line.edgeLength > 1000 ? "red" : "green"}
          strokeWidth={2}
          style={{ cursor: "pointer" }}
        />
      </React.Fragment>
    ));
  }, [props.edit, props.line.points, props.line.edgeLength]);
  return (
    <>
      <polyline
        className={"line"}
        id={props.line.id}
        stroke={props.line.edgeLength > 1000 ? "#ff0000" : "#00a000"}
        strokeWidth={4}
        fill={"none"}
        points={pointsToPoly(props.line.points)}
      />
      {points}
    </>
  );
}
