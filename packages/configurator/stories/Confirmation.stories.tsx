import React, { useEffect } from "react";
import Confirmation from "../src/components/Confirmation";

export default {
  component: Confirmation,
  title: "Components/Confirmation Dialog",
};

export const open = (): JSX.Element => (
  <Confirmation
    title="Confirm"
    message="Some question?"
    cancelText="Cancel"
    confirmText="Confirm"
  >
    {(confirm) => {
      useEffect(() => {
        confirm(() => {
          console.log("Confirmed");
        });
      }, [confirm]);
      return null;
    }}
  </Confirmation>
);

export const clickToOpen = (): JSX.Element => (
  <Confirmation
    title="Confirm"
    message="Some question?"
    cancelText="Cancel"
    confirmText="Confirm"
  >
    {(confirm) => (
      <button
        type="button"
        onClick={() => confirm(() => console.log("Confirmed"))}
      >
        Confirm
      </button>
    )}
  </Confirmation>
);
