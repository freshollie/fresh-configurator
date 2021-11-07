import { styled } from "bumbag";

export default styled.ul`
  display: flex;
  list-style-type: none;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0;
  line-height: 20px;

  > li {
    display: block;
    border-right: 1px solid
      ${({ color }) => (color === "dark" ? "#9c9c9c" : "#7d7d79")};
    padding-right: 10px;
    margin-right: 10px;
  }
`;
