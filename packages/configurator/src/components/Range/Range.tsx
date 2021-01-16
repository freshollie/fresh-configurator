import React, { forwardRef } from "react";
import { Input } from "./Range.styles";

const Range = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Input {...props} type="range" ref={ref} />
));

export default Range;
