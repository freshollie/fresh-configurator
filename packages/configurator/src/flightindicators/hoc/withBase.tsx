/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import styled, { css } from "styled-components";
import { FiBox, FiCircle } from "../assets";

const InstrumentContainer = styled.div<{ size?: number }>`
  ${({ size = 250 }) => css`
    width: ${size}px;
    height: ${size}px;
  `}
  position: relative;
  display: inline-block;
  overflow: hidden;

  div,
  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

type BaseInstrumentProps = {
  showBox?: boolean;
  size?: number;
};

/**
 * WithBase: a HOC which should be used as a Base to create instruments from
 */
export default <P extends Record<string, unknown>>(
  Instrument: React.FC<P>
): React.FC<P & BaseInstrumentProps> => ({ size, showBox, ...rest }) => (
  <InstrumentContainer size={size}>
    {showBox && <FiBox />}
    <Instrument {...(rest as P)} />
    <FiCircle />
  </InstrumentContainer>
);
