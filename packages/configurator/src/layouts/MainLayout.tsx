import styled from "../theme";

export default styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  > header {
    flex: 0;
  }

  > main {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    flex: 1;
    > .tab-content {
      overflow-y: scroll;
      overflow-x: hidden;
      flex: 1;
      height: 100%;
    }

    > nav {
      flex: unset;
    }
  }

  > footer {
    flex: 0;
    display: flex;
    justify-content: space-between;
    height: 20px;
    padding: 0 10px 0 10px;
    border-top: 1px solid #7d7d79;
    background-color: ${({ theme }) => (theme.dark ? "#414443" : "#bfbeb5")};
  }
`;
