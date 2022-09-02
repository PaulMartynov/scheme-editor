interface Point {
  x: number;
  y: number;
}

interface DrawNodeType {
  type: string;
  size: Point;
  apvExists?: boolean;
}

interface GraphNode extends Point, DrawNodeType {
  id: string;
}

interface Line {
  id: string;
  points: Point[];
  startNodeId: string | null;
  endNodeId: string | null;
  edgeLength: number;
  passabilityType: number;
  lineType: number;
  canHasDevices: boolean;
  isAbonentLine: boolean;
  countOfPillars: number;
  isMagistral: boolean;
}
