import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from "./Modal";

describe("testing ModalWindow", () => {
  test("rendering active Modal test", () => {
    render(
      <>
        <Modal active={true} children={<></>} />
      </>
    );
    expect(screen.queryByTestId("modal-div")).toBeInTheDocument();
    expect(screen.queryByTestId("modal-div")?.className).toBe(
      "modal-window active"
    );
  });

  test("rendering inactive Modal", () => {
    render(
      <>
        <Modal active={false} children={<></>} />
      </>
    );
    expect(screen.queryByTestId("modal-div")?.className).toBe("modal-window");
  });

  test("rendering Modal settings window", () => {
    render(
      <>
        <Modal active={false} settings={true} children={<></>} />
      </>
    );
    expect(screen.queryByTestId("modal-div")?.className).toBe("modal-settings");
  });
});
