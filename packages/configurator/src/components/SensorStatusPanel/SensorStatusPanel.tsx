import styled from "../../theme";

export default styled.ul`
  height: 67px;
  width: min-content;
  border-radius: 5px;
  border: 1px solid #272727;
  box-shadow: 0px 2px 0px rgba(92, 92, 92, 0.5);
  background-color: #434343;
  background-image: -webkit-linear-gradient(
    top,
    transparent,
    rgba(0, 0, 0, 0.55)
  );

  list-style-type: none;
  padding-inline-start: initial;
  margin-block-start: 0px;
  margin-block-end: 0px;

  > li {
    height: 61px;
    width: 33px;
    line-height: 18px;
    text-align: center;
    border-top: 1px solid #373737;
    border-bottom: 1px solid #1a1a1a;
    border-left: 1px solid #373737;
    border-right: 1px solid #222222;
    background-color: #434343;
    background-image: -webkit-linear-gradient(
      top,
      transparent,
      rgba(0, 0, 0, 0.45)
    );
    padding-left: 5px;
    padding-right: 5px;
    padding-bottom: 5px;
    text-shadow: 0px 1px rgba(0, 0, 0, 1);
    color: #4f4f4f;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .icon {
      margin-top: 13px;
      flex: 1;
      path {
        fill: #272727;
        stroke: #272727;
      }
    }

    &.active {
      color: #818181;

      .icon {
        path {
          fill: ${({ theme }) => theme.colors.accent};
          stroke: ${({ theme }) => theme.colors.accent};
        }
      }
    }
  }
`;
