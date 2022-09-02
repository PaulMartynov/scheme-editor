import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Selector from "./Selector";

describe("testing Selector", () => {
  test("rendering Selector", () => {
    const change = jest.fn();
    render(
      <Selector
        values={{ key: "value" }}
        currentValue={""}
        changeFn={change}
        name={"test"}
      />
    );
    expect(screen.queryByTestId("custom-selector")).toBeInTheDocument();
    expect(screen.queryByTestId("select-item-id-key-test")).toBeInTheDocument();
    expect(screen.queryByTestId("select-item-li-key-test")).toBeInTheDocument();
    expect(screen.getByTestId("select-item-li-key-test").innerHTML).toBe(
      "value"
    );
    expect(change).not.toBeCalled();
    userEvent.click(screen.getByTestId("select-item-li-key-test"));
    expect(change).toBeCalledWith("key");
  });
});
