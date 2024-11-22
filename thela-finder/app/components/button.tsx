"use client";

import React from "react";

type ButtonComponentProps = {
  callback: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode; // Allows custom button component.
};

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  callback,
  children,
}) => (
  <button className="w-20 h-20 border p-2" onClick={callback}>
    {children || "Click me!"}
  </button>
);
export default ButtonComponent;
