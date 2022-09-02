import React, { useState } from "react";
import "./Selector.scss";

type SelectorType = {
  values: {
    [key: string]: string;
  };
  currentValue: string;
  changeFn: (value: string) => void;
  name: string;
};

export default function Selector(props: SelectorType): JSX.Element {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };
  return (
    <div
      className={open ? "custom-selector open" : "custom-selector"}
      onClick={toggle}
      data-testid={"custom-selector"}
    >
      <summary className={"radios"}>
        {Object.keys(props.values).map((key) => (
          <input
            key={`select-item-${key}`}
            type={"radio"}
            id={`select-item-id-${key}-${props.name}`}
            value={key}
            title={props.values[key]}
            data-testid={`select-item-id-${key}-${props.name}`}
            checked={key === props.currentValue}
            onChange={(e) => {
              if (e.target.checked) {
                setOpen(false);
                props.changeFn(key);
              }
            }}
          />
        ))}
      </summary>
      <ul className={open ? "list open" : "list"}>
        {Object.keys(props.values).map((key) => (
          <li key={`select-item-li-${key}`}>
            <label
              data-testid={`select-item-li-${key}-${props.name}`}
              htmlFor={`select-item-id-${key}-${props.name}`}
            >
              {props.values[key]}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
