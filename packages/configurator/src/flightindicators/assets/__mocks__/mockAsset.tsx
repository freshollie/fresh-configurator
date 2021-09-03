import React from "react";

export default (name: string): React.FC =>
  (props) =>
    (
      // eslint-disable-next-line jsx-a11y/alt-text
      <svg data-asset={name} {...props} />
    );
