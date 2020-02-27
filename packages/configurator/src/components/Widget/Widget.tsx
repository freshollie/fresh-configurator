import styled, { css } from "../../theme";

interface WidgetProps {
  type?: "warning" | "note" | "white";
}

export default styled.article<WidgetProps>`
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ffffff;
  width: calc(100% - 2px);
  margin-bottom: 10px;
  background-color: #f9f9f9;

  ${({ type }) =>
    type === "white" &&
    css`
      background-color: #414443;
    `}

  ${({ type }) =>
    type === "warning" &&
    css`
      background-color: #ffdddd;
    `}
  
  ${({ type }) =>
    type === "note" &&
    css`
      background-color: #fff6de;
    `}

  ${({ theme, type }) =>
    theme.dark &&
    css`
      border: 1px solid #4d4d4d;
      background-color: #414443;

      ${type === "warning" &&
        css`
          background-color: #393b3a;
        `}
      ${type === "note" &&
        css`
          background-color: #393b3a;
        `};

      ${type === "white" &&
        css`
          background-color: #393b3a;
        `}
    `}

  > header {
    background-color: ${({ theme }) => theme.colors.quietHeader};
    color: ${({ theme }) => theme.colors.quietText};
    border-radius: 3px 3px 0px 0px;
    font-size: 13px;
    height: 24px;
    font-weight: 600;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 3px;

    ${({ type, theme }) =>
      type === "warning" &&
      css`
        background-color: #dc0000;
        background-image: linear-gradient(
          -45deg,
          rgba(255, 255, 255, 0.3) 10%,
          transparent 10%,
          transparent 20%,
          rgba(255, 255, 255, 0.3) 20%,
          rgba(255, 255, 255, 0.3) 30%,
          transparent 30%,
          transparent 40%,
          rgba(255, 255, 255, 0.3) 40%,
          rgba(255, 255, 255, 0.3) 50%,
          transparent 50%,
          transparent 60%,
          rgba(255, 255, 255, 0.3) 60%,
          rgba(255, 255, 255, 0.3) 70%,
          transparent 70%,
          transparent 80%,
          rgba(255, 255, 255, 0.3) 80%,
          rgba(255, 255, 255, 0.3) 90%,
          transparent 90%,
          transparent 100%,
          rgba(255, 255, 255, 0.4) 100%,
          transparent
        );
        color: white;

        ${theme.dark && css``}
      `}

    ${({ type, theme }) =>
      type === "note" &&
      css`
        background-color: ${theme.colors.accent};
        background-image: linear-gradient(
          -45deg,
          rgba(255, 255, 255, 0.3) 10%,
          transparent 10%,
          transparent 20%,
          rgba(255, 255, 255, 0.3) 20%,
          rgba(255, 255, 255, 0.3) 30%,
          transparent 30%,
          transparent 40%,
          rgba(255, 255, 255, 0.3) 40%,
          rgba(255, 255, 255, 0.3) 50%,
          transparent 50%,
          transparent 60%,
          rgba(255, 255, 255, 0.3) 60%,
          rgba(255, 255, 255, 0.3) 70%,
          transparent 70%,
          transparent 80%,
          rgba(255, 255, 255, 0.3) 80%,
          rgba(255, 255, 255, 0.3) 90%,
          transparent 90%,
          transparent 100%,
          rgba(255, 255, 255, 0.4) 100%,
          transparent
        );
        color: white;

        ${theme.dark &&
          css`
            background: #393b3a;
          `}
      `}
  }

  > main {
    padding: 10px;
    margin-bottom: 3px;
  }

  > footer {
    background-color: #e4e4e4;
    border-radius: 0px 0px 3px 3px;
    font-size: 13px;
    width: 100%;
    height: 27px;
    padding-top: 0px;
    float: left;
    font-weight: 600;

    ${({ theme }) =>
      theme.dark &&
      css`
        background-color: #393b3a;
      `}
  }
`;
