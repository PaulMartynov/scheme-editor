export default function pointsToPoly(points: Point[]): string {
  const result: string[] = [];
  points.forEach((p) => {
    result.push(`${p.x},${p.y}`);
  });
  return result.length > 0 ? result.join(" ") : "";
}
