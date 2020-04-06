import React, { useRef, useLayoutEffect, useState } from "react";
import { Wrapper, LogsList, OpenSwitch, Scroll } from "./LogsView.styles";

const LogsView: React.FC = ({ children }) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    if (listRef.current) {
      listRef.current.scroll({
        top: listRef.current.scrollHeight,
      });
    }
  });

  useLayoutEffect(() => {
    if (listRef.current) {
      const listElement = listRef.current;
      const scrollTop = (): void => {
        listElement.scroll({
          top: listElement.scrollHeight,
        });
      };
      listElement.addEventListener("transitionend", scrollTop);
      return () => listElement.removeEventListener("transitionend", scrollTop);
    }
    return undefined;
  }, []);

  return (
    <Wrapper>
      <OpenSwitch onClick={() => setOpen(!open)}>
        {open ? "Hide log" : "Show log"}
      </OpenSwitch>
      <Scroll open={open} />
      <LogsList open={open} ref={listRef}>
        {children}
      </LogsList>
    </Wrapper>
  );
};

export default LogsView;
