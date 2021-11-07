import React from "react";

const MockIcon: React.FC<{ name: string; className: string }> = ({
  name,
  className,
}) => <svg data-name={name} className={className} />;

export default MockIcon;
