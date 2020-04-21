import React from "react";
import Confirmation from "../src/components/Confirmation";

export default {
  component: Confirmation,
  title: "Components|Confirmation Dialog",
};

export const example = (): JSX.Element => (
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
