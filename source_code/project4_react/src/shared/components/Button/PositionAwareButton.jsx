import React from "react";
import { useEffect } from "react";
import "./button.css";
import { useState } from "react";

export default function PositionAwareButton({ content, action, className }) {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    const buttons = document.querySelectorAll(".btn-posnawr");

    const handleMouseEnter = (e) => {
      let parentOffset = e.currentTarget.getBoundingClientRect(),
        relX = e.pageX - parentOffset.left,
        relY = e.pageY - parentOffset.top;

      const span = e.currentTarget.getElementsByTagName("span");
      span[0].style.top = relY + "px";
      span[0].style.left = relX + "px";
    };

    const handleMouseOut = (e) => {
      let parentOffset = e.currentTarget.getBoundingClientRect(),
        relX = e.pageX - parentOffset.left,
        relY = e.pageY - parentOffset.top;

      const span = e.currentTarget.getElementsByTagName("span");
      span[0].style.top = relY + "px";
      span[0].style.left = relX + "px";
    };

    buttons.forEach((button) => {
      button.addEventListener("mouseenter", handleMouseEnter);
      button.addEventListener("mouseout", handleMouseOut);
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("mouseenter", handleMouseEnter);
        button.removeEventListener("mouseout", handleMouseOut);
      });
    };
  }, [number]);

  return (
    <button
      className={"btn-posnawr " + className}
      onClick={(ev) => {
        ev.preventDefault();
        action();
      }}
      href="#"
    >
      {content}
      <span></span>
    </button>
  );
}
