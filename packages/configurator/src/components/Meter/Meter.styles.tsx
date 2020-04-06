import styled from "../../theme";

export interface BarProps {
  color: string;
  percentage: number;
}

export const Bar = styled.div.attrs<BarProps>(
  ({ color, percentage, theme }) => ({
    style: {
      background: `linear-gradient(
    to right,
    ${color} ${percentage}%,
    ${theme.dark ? "#393b3a" : "#f4f4f4"} 0
  )
  no-repeat`,
    },
  })
)<BarProps>`
  width: 100%;
  height: 16px;
  line-height: 15px;
  border: 1px solid ${({ theme }) => theme.colors.subtleAccent};
  border-radius: 3px;
  text-align: center;
  box-sizing: border-box;
`;

export interface BarLabelProps {
  percentage: number;
}

export const BarLabel = styled.div.attrs<BarLabelProps>(
  ({ percentage, theme }) => ({
    style: {
      background: `linear-gradient(to right, white ${percentage}%, ${
        theme.dark ? "white" : "#474747"
      } 0)
    no-repeat`,
    },
  })
)<BarLabelProps>`
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
`;
