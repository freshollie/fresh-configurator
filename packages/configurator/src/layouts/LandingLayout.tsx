import styled from "../theme";

export default styled.div`
  > header {
    height: 140px;

    color: ${({ theme }) => theme.colors.defaultText};
    font-size: 14px;
    font-weight: 300;

    title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      > .logo {
        width: 600px;
        margin: 5px;
      }
    }
  }
  > main {
    background-color: ${({ theme }) => theme.colors.accent};
  }
`;
