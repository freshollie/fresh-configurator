import React, { useRef, useLayoutEffect, useState } from "react";
import { Wrapper, LogsList, OpenSwitch } from "./LogsView.styles";

const LogsView: React.FC = ({ children }) => {
  const listRef = useRef<HTMLElement | null>();
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    if (listRef.current) {
      listRef.current.scroll({
        top: listRef.current.scrollHeight
      });
    }
  });
  return (
    <Wrapper>
      <OpenSwitch onClick={() => setOpen(!open)}>
        {open ? "Hide log" : "Show log"}
      </OpenSwitch>
      <LogsList open={open} ref={listRef}>
        {children}
      </LogsList>
    </Wrapper>
  );
};

export default LogsView;
