import styled from "../../theme";

export const Container = styled.div`
  height: 115px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const LogoContainer = styled.div`
  position: relative;
  align-self: flex-start;
  padding-top: 14px;
  padding-left: 15px;
  width: 240px;

  @media all and (min-width: 800px) {
    padding-top: 9px;
    width: 340px;
  }
`;

export const LogoSubText = styled.div`
  position: absolute;
  margin-top: -8px;
  left: 85px;
  bottom: 8px;
  color: #949494;
  opacity: 0.5;
  font-size: 10px;

  @media all and (min-width: 800px) {
    font-size: inherit;
    left: 116px;
    bottom: 10px;
  }
`;

export const Children = styled.div`
  .tools {
    margin-top: 20px;
    display: flex;
    > * {
      margin-right: 20px;
    }
  }
`;
