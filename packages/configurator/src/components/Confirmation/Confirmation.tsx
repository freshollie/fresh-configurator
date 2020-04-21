import React, { useState } from "react";
import { StyledModal } from "./Confirmation.styles";
import Button from "../Button";

type OnConfirmedCallback = () => unknown;
type ConfirmFunction = (onConfirmed: OnConfirmedCallback) => unknown;

type ConfirmationProps = {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  children: (confirm: ConfirmFunction) => JSX.Element;
};

const Confirmation: React.FC<ConfirmationProps> = ({
  children,
  confirmText,
  title,
  message,
  cancelText,
}) => {
  const [onConfirmedFunction, setOnConfirmedFunction] = useState<
    OnConfirmedCallback | undefined
  >();

  const close = (): void => setOnConfirmedFunction(undefined);

  return (
    <>
      <StyledModal
        ariaHideApp={false}
        isOpen={!!onConfirmedFunction}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            display: "flex",
            zIndex: 100,
          },
        }}
      >
        <h3>{title}</h3>
        <main>{message}</main>
        <footer>
          <Button
            onClick={() => {
              onConfirmedFunction?.();
              close();
            }}
          >
            {confirmText}
          </Button>
          <Button onClick={close}>{cancelText}</Button>
        </footer>
      </StyledModal>
      {children((onConfirmed) => {
        setOnConfirmedFunction(() => onConfirmed);
      })}
    </>
  );
};

export default Confirmation;
