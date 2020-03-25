import styled from "../../theme";

export const Bar = styled.div`
  width: 100%;
  height: 15px;
  border: 1px solid ${({ theme }) => theme.colors.subtleAccent};
  background-color: #f4f4f4;
  border-radius: 3px;
`;

export const Label = styled.div`
  width: 50px;
  height: 15px;
  line-height: 15px;
  text-align: center;
  color: #474747;
`;

export interface FillProps {
  color: string;
}

export const Fill = styled.div<FillProps>`
  color: ${({ color }) => color};
`;
