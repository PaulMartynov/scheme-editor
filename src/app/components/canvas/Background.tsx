import React from "react";
import { useAppSelector } from "../../hooks/redux";

export default function Background(): JSX.Element {
  const { backgroundImg, backgroundScale, backgroundEn } = useAppSelector(
    (state) => state.canvas
  );
  return (
    <image
      className={`canvas__background-image ${backgroundEn ? "" : "_hidden"}`}
      href={backgroundImg as string}
      transform={`scale(${backgroundScale})`}
    />
  );
}
