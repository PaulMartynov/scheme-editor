import React, { ChangeEvent, useEffect, useState } from "react";
import Modal from "./Modal";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { closeElementWindow } from "../../store/actions/elementActions";
import Selector from "../common/Selector/Selector";
import {
  removeLine,
  removeNode,
  updateLine,
  updateNode,
} from "../../store/actions/canvasActions";

export default function ElementOptions(): JSX.Element {
  const dispatch = useAppDispatch();
  const { active, line, node } = useAppSelector((state) => state.activeElement);
  const [passabilityType, setPassabilityType] = useState(
    line?.passabilityType ?? 0
  );
  const [countOfPillars, setCountOfPillars] = useState(
    line?.countOfPillars ?? 0
  );
  const [edgeLength, setEdgeLength] = useState(line?.edgeLength ?? 0);
  const [lineType, setLineType] = useState(line?.lineType ?? 0);
  const [isAbonentLine, setIsAbonentLine] = useState(
    line?.isAbonentLine ?? false
  );
  const [canHasDevices, setCanHasDevices] = useState(
    line?.canHasDevices ?? false
  );
  const [apvExists, setApvExists] = useState(node?.apvExists ?? false);

  useEffect(() => {
    setPassabilityType(line?.passabilityType ?? 0);
    setCountOfPillars(line?.countOfPillars ?? 0);
    setEdgeLength(line?.edgeLength ?? 0);
    setLineType(line?.lineType ?? 0);
    setIsAbonentLine(line?.isAbonentLine ?? false);
    setCanHasDevices(line?.canHasDevices ?? false);
  }, [line]);

  useEffect(() => {
    setApvExists(node?.apvExists ?? false);
  }, [node]);

  const getNodesForm = (n: GraphNode) => {
    switch (n.type) {
      case "substation":
        return (
          <div className={"line-options__form"}>
            <div className={"line-options__form-uint_checkboxes"}>
              <label htmlFor={"apvExists"} className={"line-options__label"}>
                {"Has Apv mode:"}
              </label>
              <input
                className={"line-options__form-input"}
                id={"apvExists"}
                type={"checkbox"}
                checked={apvExists}
                onChange={() => setApvExists(!apvExists)}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className={"line-options__form"}>
            <div className={"no-data"}>{"No options"}</div>
          </div>
        );
    }
  };

  const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (Number.isNaN(val)) {
      return;
    }
    if (e.target.id === "PillarsCountInput") {
      setCountOfPillars(Math.abs(val));
      setEdgeLength(Math.abs(val) * 60);
    }
    if (e.target.id === "LineLengthInput") {
      setEdgeLength(Math.abs(val));
    }
  };

  const deleteElement = () => {
    if (line) {
      dispatch(removeLine(line.id));
    }
    if (node) {
      dispatch(removeNode(node.id));
    }
    dispatch(closeElementWindow());
  };

  const updateElement = () => {
    if (line) {
      dispatch(
        updateLine({
          ...line,
          passabilityType,
          countOfPillars,
          edgeLength,
          lineType,
          isAbonentLine,
          canHasDevices,
        })
      );
    }
    if (node && node.type === "substation") {
      dispatch(updateNode(node.id, { apvExists }));
    }
    dispatch(closeElementWindow());
  };
  return (
    <Modal active={active} settings>
      <div className={"line-options"}>
        <div className={"modal-header"}>
          <button
            className={"x-close-button-small"}
            onClick={() => {
              dispatch(closeElementWindow());
            }}
          />
        </div>
        <div className={"line-options__content"}>
          {line && (
            <div className={"line-options__form"}>
              <div className={"line-options__form-uint"}>
                <p className={"line-options__header"}>{"Pillars count"}</p>
                <input
                  className={"line-options__form-input"}
                  id={"PillarsCountInput"}
                  type={"number"}
                  min={0}
                  value={countOfPillars}
                  onChange={changeInput}
                />
              </div>
              <div className={"line-options__form-uint"}>
                <p className={"line-options__header"}>{"Line length, m"}</p>
                <input
                  className={"line-options__form-input"}
                  id={"LineLengthInput"}
                  type={"number"}
                  min={0}
                  value={edgeLength}
                  onChange={changeInput}
                />
              </div>
              <div className={"line-options__form-uint"}>
                <p className={"line-options__header"}>{"Line passability"}</p>
                <Selector
                  values={{
                    "900": "ASPHALT",
                    "901": "DIRT ROAD",
                    "902": "MARSH",
                    "903": "FIELD",
                    "904": "RIVER",
                    "905": "IMPASSABLE",
                    "907": "DENCE FOREST",
                    "908": "FOREST",
                    "909": "POPULATED AREA",
                  }}
                  currentValue={`${passabilityType}`}
                  changeFn={(value) => setPassabilityType(Number(value))}
                  name={"passabilityType"}
                />
              </div>
              <div className={"line-options__form-uint"}>
                <p className={"line-options__header"}>{"Line type"}</p>
                <Selector
                  values={{
                    "0": "OVERHEAD LINE",
                    "1": "CABLE LINE",
                    "2": "SUBSTATION CABLE LINE",
                    "3": "OVERHEAD SIP LINE",
                  }}
                  currentValue={`${lineType}`}
                  changeFn={(value) => setLineType(Number(value))}
                  name={"lineType"}
                />
              </div>
              <div className={"line-options__form-uint_checkboxes"}>
                <label
                  htmlFor={"isAbonentLineBox"}
                  className={"line-options__label"}
                >
                  {"Is abonent line:"}
                </label>
                <input
                  className={"line-options__form-input"}
                  id={"isAbonentLineBox"}
                  type={"checkbox"}
                  checked={isAbonentLine}
                  onChange={() => setIsAbonentLine(!isAbonentLine)}
                />
              </div>
              <div className={"line-options__form-uint_checkboxes"}>
                <label
                  htmlFor={"canHasDevices"}
                  className={"line-options__label"}
                >
                  {"Can has devices:"}
                </label>
                <input
                  className={"line-options__form-input"}
                  id={"canHasDevices"}
                  type={"checkbox"}
                  checked={canHasDevices}
                  onChange={() => setCanHasDevices(!canHasDevices)}
                />
              </div>
            </div>
          )}
          {node && <>{getNodesForm(node)}</>}
        </div>
        <div className={"modal-footer"}>
          <button className={"button-antraks"} onClick={updateElement}>
            {"Save"}
          </button>
          <button className={"button-antraks cancel"} onClick={deleteElement}>
            {"Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
