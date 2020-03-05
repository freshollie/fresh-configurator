import styled from "../../theme";

export default styled.h1`
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;

  border-bottom: 1px solid ${({ theme }) => theme.colors.accent};
  font-size: 20px;
  line-height: 24px;
  height: 30px;
  font-weight: 300;
  margin-bottom: 15px;

  @media only screen and (max-width: 1055px),
    only screen and (max-device-width: 1055px) {
    font-size: 16px;
    line-height: 18px;
    font-weight: 300;
    margin-bottom: 10px;
    height: 22px;
  }
`;
