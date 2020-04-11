import React, { useState } from "react";
import Switch from "../src/components/Switch";

export default {
  component: Switch,
  title: "Components|Switch",
};
export const Small = (): JSX.Element => {
  const [checked, setChecked] = useState(false);
  return (
    <Switch
      checked={checked}
      size="small"
      onChange={(value) => setChecked(value)}
    />
  );
};

export const Default = (): JSX.Element => {
  const [checked, setChecked] = useState(false);
  return <Switch checked={checked} onChange={(value) => setChecked(value)} />;
};

export const Large = (): JSX.Element => {
  const [checked, setChecked] = useState(false);
  return (
    <Switch
      checked={checked}
      size="large"
      onChange={(value) => setChecked(value)}
    />
  );
};

export const Checked = (): JSX.Element => <Switch checked />;
export const Unchecked = (): JSX.Element => <Switch checked={false} />;

export const Disabed = (): JSX.Element => <Switch disabled checked={false} />;
