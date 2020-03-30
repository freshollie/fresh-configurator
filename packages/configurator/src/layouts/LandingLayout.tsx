import styled from "../theme";

export default styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

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

    h3 {
      margin-block-start: 0em;
      margin-block-end: 1em;
    }

    > section {
      display: flex;
      padding-top: 15px;
      padding-bottom: 15px;
      font-weight: normal;
      font-size: 12px;
      > * {
        flex: 1;
        margin: 15px;
      }

      > *:last-child {
        flex: 0;
      }
    }
  }

  > footer {
    flex: 1;
    background-color: ${({ theme }) => theme.colors.accent};
  }
`;
