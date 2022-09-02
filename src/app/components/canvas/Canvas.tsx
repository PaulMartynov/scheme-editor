import React, {
  useRef,
  MouseEvent,
  WheelEvent,
  useState,
  useEffect,
} from "react";
import "./Canvas.scss";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  findNearestLinesPoint,
  getMousePosition,
  findNearestNode,
} from "../../utils/mouse";
import {
  addNeLine,
  addNewNode,
  removeLine,
  removeNode,
  toggleNodeCreation,
  updateLine,
  updateNode,
} from "../../store/actions/canvasActions";
import Node from "../nodes/Node";
import Polyline from "../edges/Polyline";
import ZoomPanel from "./ZoomPanel";
import Background from "./Background";
import {
  setActiveLineEl,
  setActiveNodeEl,
} from "../../store/actions/elementActions";

export default function Canvas(): JSX.Element {
  const ref = useRef<SVGSVGElement | null>(null);
  const dispatch = useAppDispatch();
  const { drawLines, drawNode, editMode, removeMode, lines, nodes } =
    useAppSelector((state) => state.canvas);
  const [polyCoords, setPolyCoords] = useState<Point[]>([]);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [activeNode, setActiveNode] = useState<GraphNode | null>(null);
  const [activeLine, setActiveLine] = useState<Line | null>(null);
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const [startNode, setStartNode] = useState<GraphNode | null>(null);
  const [endNode, setEndNode] = useState<GraphNode | null>(null);
  const [neighbour, setNeighbour] = useState<Point | null>(null);
  const [shift, setShift] = useState({ x: 0, y: 0 });
  const [viewBox, setViewBox] = useState({ x: 0, y: 0 });
  const [zoomFactor, setZoomFactor] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragPos, setDragPos] = useState<Point | null>(null);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current?.getBoundingClientRect();
      setViewBox({
        x: rect.width,
        y: rect.height,
      });
    }
  }, [ref.current]);

  useEffect(() => {
    if (!drawLines) {
      setStartPoint(null);
      setEndPoint(null);
      setPolyCoords([]);
    }
  }, [drawLines]);

  useEffect(() => {
    if (drawNode) {
      setActiveNode({
        id: "new-node",
        x: 0,
        y: 0,
        ...drawNode,
      });
      setShift({ x: drawNode.size.x / 2, y: drawNode.size.y / 2 });
      return;
    }
    setActiveNode(null);
  }, [drawNode]);

  const dispatchNewLine = (withEndNode: GraphNode | null = null) => {
    let id = `line-${lines.length}`;
    if (lines[lines.length - 1]) {
      id = `line-${
        Number(lines[lines.length - 1].id.replace("line-", "")) + 1
      }`;
    }
    dispatch(
      addNeLine({
        id,
        points: withEndNode
          ? [...polyCoords, { x: withEndNode.x, y: withEndNode.y }]
          : polyCoords,
        canHasDevices: true,
        countOfPillars: 0,
        lineType: 0,
        passabilityType: 901,
        startNodeId: startNode?.id || null,
        endNodeId: endNode?.id || null,
        isMagistral: false,
        isAbonentLine: false,
        edgeLength: 60,
      })
    );
    setNeighbour(null);
    setStartPoint(null);
    setEndPoint(null);
    setStartNode(null);
    setEndNode(null);
    setPolyCoords([]);
  };

  const addLine = (e: MouseEvent<SVGSVGElement>) => {
    if (!startPoint) {
      const pos = getMousePosition(e, {
        element: ref.current,
        zoomFactor,
        offset,
      });
      const nb = findNearestNode(nodes, pos);
      if (nb) {
        setStartPoint(nb);
        setPolyCoords([nb]);
        setStartNode(nb);
        return;
      }
      setStartPoint(pos);
      setPolyCoords([pos]);
      return;
    }
    if (endPoint) {
      if (
        (polyCoords[polyCoords.length - 1].x === endPoint.x &&
          polyCoords[polyCoords.length - 1].y === endPoint.y) ||
        (polyCoords[polyCoords.length - 1].x === neighbour?.x &&
          polyCoords[polyCoords.length - 1].y === neighbour?.y)
      ) {
        dispatchNewLine();
        return;
      }
      if (neighbour) {
        dispatchNewLine(endNode);
        return;
      }
      setStartPoint(endPoint);
      setPolyCoords([...polyCoords, endPoint]);
    }
  };

  const moveNode = (nodeId: string, x: number, y: number) => {
    if (drawNode) {
      dispatch(toggleNodeCreation(null));
      let id = `node-${nodes.length}`;
      if (nodes[nodes.length - 1]) {
        id = `node-${
          Number(nodes[nodes.length - 1].id.replace("node-", "")) + 1
        }`;
      }
      dispatch(
        addNewNode({
          id,
          x,
          y,
          ...drawNode,
        })
      );
      setActiveNode(null);
      return;
    }
    dispatch(
      updateNode(nodeId, {
        x,
        y,
      })
    );
    setActiveNode(null);
  };

  const deleteObject = (e: MouseEvent<SVGSVGElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.id && target.id.includes("node-")) {
      dispatch(removeNode(target.id));
      return;
    }
    if (target.id && target.id.includes("line-")) {
      dispatch(removeLine(target.id));
    }
  };

  const startOrStopDraw = (e: MouseEvent<SVGSVGElement>) => {
    if (dragPos) {
      setDragPos(null);
    }
    if (removeMode) {
      deleteObject(e);
      return;
    }
    if (drawLines) {
      addLine(e);
      return;
    }
    if (activeLine) {
      dispatch(updateLine(activeLine));
      setActiveLine(null);
      setActivePoint(null);
      return;
    }
    if (activeNode) {
      if (neighbour) {
        moveNode(activeNode?.id ?? "", neighbour.x, neighbour.y);
        setNeighbour(null);
        return;
      }
      const { x, y } = getMousePosition(e, {
        element: ref.current,
        shift,
        offset,
        zoomFactor,
      });
      moveNode(activeNode?.id ?? "", x, y);
      setNeighbour(null);
    }
  };

  const editNode = (e: MouseEvent<SVGSVGElement>) => {
    const target = e.target as HTMLDivElement;
    const node = nodes.find((n) => n.id === target.id);
    if (editMode) {
      const newShift = {
        x: e.clientX - target.getBoundingClientRect().left,
        y: e.clientY - target.getBoundingClientRect().top,
      };
      setShift(newShift);
      if (node) {
        setActiveNode(node);
      }
      return;
    }
    if (node && !drawNode && !drawLines && !removeMode) {
      dispatch(setActiveNodeEl(node));
    }
  };

  const editLine = (e: MouseEvent<SVGSVGElement>) => {
    const target = e.target as HTMLDivElement;
    const [lineId, pointId] = target.id.split("-p-");
    if (lineId) {
      const line = lines.find((l) => l.id === lineId);
      if (line && pointId && editMode) {
        setActiveLine(line);
        setActivePoint(Number(pointId));
        return;
      }
      if (line && !editMode && !drawNode && !drawLines && !removeMode) {
        dispatch(setActiveLineEl(line));
      }
    }
  };

  const dragItem = (e: MouseEvent<SVGSVGElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.id.includes("node-")) {
      editNode(e);
    }
    if (target.id.includes("line-")) {
      editLine(e);
    }
    if (target.id === "canvas") {
      setDragPos(
        getMousePosition(e, {
          element: ref.current,
          zoomFactor,
          offset,
        })
      );
    }
  };

  const updatePoint = (e: MouseEvent<SVGSVGElement>) => {
    const p = getMousePosition(e, {
      element: ref.current,
      zoomFactor,
      offset,
    });
    if (activeLine && activePoint !== null) {
      const points = [...activeLine.points];
      const nb = findNearestNode(nodes, p);
      if (nb) {
        points[activePoint] = { x: nb.x, y: nb.y };
        if (activePoint === 0) {
          setActiveLine({ ...activeLine, points, startNodeId: nb.id });
          return;
        }
        if (activePoint === points.length - 1) {
          setActiveLine({ ...activeLine, points, endNodeId: nb.id });
          return;
        }
        setActiveLine({ ...activeLine, points });
        return;
      }
      points[activePoint] = p;
      if (activePoint === 0) {
        setActiveLine({ ...activeLine, points, startNodeId: null });
        setNeighbour(null);
        return;
      }
      if (activePoint === points.length - 1) {
        setActiveLine({ ...activeLine, points, endNodeId: null });
        setNeighbour(null);
        return;
      }
      setActiveLine({ ...activeLine, points });
      setNeighbour(null);
    }
  };

  const drawLine = (e: MouseEvent<SVGSVGElement>) => {
    const nb = findNearestNode(
      nodes,
      getMousePosition(e, {
        element: ref.current,
        zoomFactor,
        offset,
      })
    );
    if (nb) {
      setNeighbour(nb);
      setEndPoint(nb);
      setEndNode(nb);
      return;
    }
    setEndPoint(
      getMousePosition(e, {
        element: ref.current,
        zoomFactor,
        offset,
        startPoint,
      })
    );
    setNeighbour(null);
  };

  const updateNodePosition = (e: MouseEvent<SVGSVGElement>) => {
    if (!activeNode) {
      return;
    }

    const position = getMousePosition(e, {
      element: ref.current,
      zoomFactor,
      offset,
    });
    const nearestPoint = findNearestLinesPoint(lines, position);

    if (nearestPoint) {
      const pos = {
        x: nearestPoint.x - activeNode.size.x / 2,
        y: nearestPoint.y - activeNode.size.y / 2,
      };
      setActiveNode({ ...activeNode, ...pos });
      setNeighbour(pos);
      return;
    }
    const newPos = getMousePosition(e, {
      element: ref.current,
      zoomFactor,
      offset,
      shift,
    });
    setActiveNode({ ...activeNode, ...newPos });
    setNeighbour(null);
  };

  const moveViewBox = (e: MouseEvent<SVGSVGElement>) => {
    if (!dragPos) {
      return;
    }
    const mousePos = getMousePosition(e, {
      element: ref.current,
      zoomFactor,
    });
    const pos = {
      x: dragPos.x - mousePos.x,
      y: dragPos.y - mousePos.y,
    };
    setOffset({ x: pos.x > 0 ? pos.x : 0, y: pos.y > 0 ? pos.y : 0 });
  };

  const draw = (e: MouseEvent<SVGSVGElement>) => {
    if (dragPos) {
      moveViewBox(e);
      return;
    }

    if (drawLines) {
      drawLine(e);
      return;
    }

    if (activeLine) {
      updatePoint(e);
      return;
    }

    if (activeNode) {
      updateNodePosition(e);
    }
  };

  const onWheel = (e: WheelEvent<SVGSVGElement>) => {
    if (zoomFactor >= 0.3) {
      setZoomFactor(Math.abs(zoomFactor - e.nativeEvent.deltaY / 1000));
      return;
    }
    setZoomFactor(0.3);
  };

  return (
    <div className={"canvas-container"}>
      <svg
        id={"canvas"}
        ref={ref}
        style={drawLines ? { cursor: "pointer" } : {}}
        className={"canvas"}
        onMouseUp={startOrStopDraw}
        onMouseMove={draw}
        onMouseDown={dragItem}
        viewBox={`${offset.x} ${offset.y} ${viewBox.x / zoomFactor} ${
          viewBox.y / zoomFactor
        }`}
        onWheel={onWheel}
      >
        <g>
          <desc>{"background"}</desc>
          <Background />
        </g>
        <g>
          <desc>{"lines"}</desc>
          {lines.map((l) => {
            return l.id === activeLine?.id ? null : (
              <React.Fragment key={l.id}>
                <Polyline edit={editMode || removeMode || drawLines} line={l} />
              </React.Fragment>
            );
          })}
          {startPoint && endPoint ? (
            <polyline
              stroke={"#00a000"}
              strokeWidth={4}
              strokeDasharray={5}
              fill={"none"}
              points={`${startPoint.x},${startPoint.y} ${endPoint.x},${endPoint.y}`}
            />
          ) : null}
          {polyCoords.length > 0 ? (
            <Polyline
              edit={editMode || drawLines}
              line={{
                id: `new-line`,
                points: polyCoords,
                isAbonentLine: false,
                canHasDevices: false,
                countOfPillars: 0,
                edgeLength: 0,
                lineType: 0,
                endNodeId: null,
                startNodeId: null,
                passabilityType: 0,
                isMagistral: false,
              }}
            />
          ) : null}
          {activeLine ? (
            <Polyline edit={editMode || drawLines} line={activeLine} />
          ) : null}
        </g>
        <g>
          <desc>{"nodes"}</desc>
          {nodes.map((node) => {
            return node.id === activeNode?.id ? null : (
              <React.Fragment key={node.id}>
                <Node node={node} editMode={editMode} />
              </React.Fragment>
            );
          })}
          {activeNode ? (
            <Node node={activeNode} active={true} editMode={true} />
          ) : null}
        </g>
      </svg>
      <ZoomPanel
        value={zoomFactor}
        zoomOut={() => {
          if (zoomFactor >= 0.3) {
            setZoomFactor(zoomFactor - 0.1);
          }
        }}
        zoomIn={() => setZoomFactor(zoomFactor + 0.1)}
        resetZoom={() => setZoomFactor(1)}
      />
    </div>
  );
}
