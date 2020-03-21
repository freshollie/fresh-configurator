import styled from "../../theme";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

export const SelectorsContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 180px;
`;

export const ManualOverride = styled.label`
  background-color: #2b2b2b;
  border-radius: 3px;
  padding: 3px;
  margin-top: 5x;
  color: ${({ theme }) => theme.colors.subtleAccent};
  margin-right: 10px;

  input {
    border: 0;
    background-color: rgba(0, 0, 0, 0.1);
    color: #888888;
    width: 140px;
    margin-left: 2px;
    margin-top: 0px;
    padding: 1px;
    border-radius: 3px;
  }
`;

export const DarkSelectContainer = styled.div`
  overflow: hidden;
  position: relative;
  height: 20px;
  background: #fff;
  background-image: -webkit-linear-gradient(
    top,
    transparent,
    rgba(0, 0, 0, 0.06)
  );
  background-image: -moz-linear-gradient(top, transparent, rgba(0, 0, 0, 0.06));
  background-image: -o-linear-gradient(top, transparent, rgba(0, 0, 0, 0.06));
  background-image: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 0, 0, 0.06)
  );
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
  width: 99%;
  margin-bottom: 7px;
  border: 1px solid;
  border-color: #ccc #ccc #ccc;
  border-radius: 3px;

  background: #3e403f;
  border-color: #111 #0a0a0a black;
  background-image: -webkit-linear-gradient(
    top,
    transparent,
    rgba(0, 0, 0, 0.4)
  );
  background-image: -moz-linear-gradient(top, transparent, rgba(0, 0, 0, 0.4));
  background-image: -o-linear-gradient(top, transparent, rgba(0, 0, 0, 0.4));
  background-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.4));
  -webkit-box-shadow: inset 0 1px rgba(255, 255, 255, 0.1),
    0 1px 1px rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.1), 0 1px 1px rgba(0, 0, 0, 0.2);
  color: #a6a6a6;
  text-shadow: 0px 1px rgba(0, 0, 0, 0.25);

  select {
    overflow: visible;
    width: 100%;
    margin-top: 0px;
    padding: 1px 8px 6px 5px;
    height: 23px;
    line-height: 20px;
    font-size: 12px;
    color: #62717a;
    text-shadow: 0 1px white;
    /* "transparent" doesn't work with Opera */
    background: rgba(0, 0, 0, 0) !important;
    border: 0;
    border-radius: 0;
    -webkit-appearance: none;
  }

  select:focus {
    z-index: 3;
    width: 90%;
    color: #4fa619;
    outline: 0px solid #49aff2;
    outline: 0px solid -webkit-focus-ring-color;
    outline-offset: 5px;
    height: 25px;
  }

  select > option {
    margin: 3px;
    padding: 6px 8px;
    text-shadow: none;
    background: #f2f2f2;
    border-radius: 3px;
    cursor: pointer;
  }

  select {
    width: 100%;
    margin-top: 0px;
    padding: 1px 8px 6px 5px;
    height: 23px;
    line-height: 20px;
    font-size: 12px;
    color: #62717a;
    text-shadow: 0 1px white;
    background: #f2f2f2;
    background: rgba(0, 0, 0, 0) !important;
    border: 0;
    border-radius: 0;
    -webkit-appearance: none;

    color: #a6a6a6;
    text-shadow: 0 1px black;

    &:focus {
      color: #fff;
    }

    & > option {
      background: #56ab1a;
      text-shadow: 0 1px rgba(0, 0, 0, 0.4);
    }
  }

  &:before,
  &:after {
    content: "";
    position: absolute;
    z-index: 2;
    top: 7px;
    right: 7px;
    width: 0;
    height: 0;
    border: 4px dashed;
    border-color: #888 transparent;
    pointer-events: none;
  }

  &:after {
    margin-top: 5px;
    border-top-style: solid;
    border-bottom: none;

    border-top-color: #aaa;
  }

  &:before {
    border-bottom-style: solid;
    border-top: none;
    margin-top: -2px;

    border-bottom-color: #aaa;
  }
`;
