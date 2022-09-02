import React from "react";

type MouseOptions = {
  element?: HTMLDivElement | SVGSVGElement | null;
  shift?: Point;
  offset?: Point;
  zoomFactor?: number;
  startPoint?: Point | null;
};

export function getMousePosition(
  event: React.MouseEvent<SVGSVGElement | HTMLDivElement>,
  options: MouseOptions
): Point {
  const { shift, offset, zoomFactor, element, startPoint } = options;
  let x = event.pageX;
  let y = event.pageY;
  if (element) {
    const rect = element.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;
  }
  if (shift) {
    x -= shift.x;
    y -= shift.y;
  }
  if (zoomFactor) {
    x /= zoomFactor;
    y /= zoomFactor;
  }
  if (offset) {
    x += offset.x;
    y += offset.y;
  }
  if (startPoint) {
    const angle = Math.abs(
      (Math.atan((y - startPoint.y) / (x - startPoint.x)) * 180) / Math.PI
    );
    if (angle > 45) {
      x = startPoint.x;
    }
    if (angle < 45) {
      y = startPoint.y;
    }
  }
  return { x, y };
}

export function findNearestLinesPoint(
  lines: Line[],
  point: Point
): Point | null {
  let res: Point | null = null;
  lines.forEach((l) => {
    const points = [l.points[0], l.points[l.points.length - 1]];
    points.forEach((p) => {
      if (Math.abs(p.x - point.x) <= 20 && Math.abs(p.y - point.y) <= 20) {
        if (res) {
          if (res.x > p.x) {
            res = p;
          }
        } else {
          res = p;
        }
      }
    });
  });
  return res;
}

export function findNearestNode(
  points: GraphNode[],
  point: Point
): GraphNode | null {
  for (const p of points) {
    if (
      Math.abs(p.x + p.size.x / 2 - point.x) <= 20 &&
      Math.abs(p.y + p.size.y / 2 - point.y) <= 20
    ) {
      return {
        ...p,
        x: p.x + p.size.x / 2,
        y: p.y + p.size.y / 2,
      };
    }
  }
  return null;
}
