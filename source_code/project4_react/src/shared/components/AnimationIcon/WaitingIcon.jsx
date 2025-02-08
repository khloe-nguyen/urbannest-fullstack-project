import React from "react";

export default function WaitingIcon({ className }) {
  return (
    <div className={`lds-roller ${className}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
