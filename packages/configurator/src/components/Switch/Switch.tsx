import React from "react";
import ReactSwitch from "react-switch";
import { useTheme } from "../../theme";

const SIZES = {
  small: [20, 10],
  default: [35, 14],
  large: [66, 40],
};

export type SwitchProps = {
  checked: boolean;
  onChange?: (checked: boolean) => unknown;
  disabled?: boolean;
  size?: keyof typeof SIZES;
};

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange = () => {},
  disabled,
  size = "default",
}) => {
  const theme = useTheme();

  return (
    <ReactSwitch
      checked={checked}
      onColor={theme.colors.accent}
      handleDiameter={SIZES[size][1]}
      checkedIcon={false}
      uncheckedIcon={false}
      disabled={disabled}
      height={SIZES[size][1]}
      width={SIZES[size][0]}
      onChange={onChange}
    />
  );
};

export default Switch;
