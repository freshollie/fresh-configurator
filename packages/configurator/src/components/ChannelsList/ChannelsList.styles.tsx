import styled from "../../theme";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;

  .meters {
    flex: 1;
  }

  > * {
    > * {
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }
`;

export const Name = styled.div`
  margin-right: 10px;
  line-height: 16px;
  font-weight: bold;
  text-align: right;
`;
