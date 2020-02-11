import styled from "../../theme";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const DarkSelectContainer = styled.div`
  background: #636363; /* NEW2 */
  background: #3e403f; /* NEW */
  border-color: #111 #0a0a0a black;
  background-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.4));
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.1), 0 1px 1px rgba(0, 0, 0, 0.2);
  color: #a6a6a6;
  text-shadow: 0 1px black;

  &:before {
    border-bottom-color: #aaa;
  }

  &:after {
    border-top-color: #aaa;
  }

  select {
    color: #a6a6a6;
    text-shadow: 0 1px black;
    /* Fallback for IE 8 */
    background: #444;

    &:focus {
      color: #fff;
    }

    & > option {
      background: #56ab1a;
      text-shadow: 0 1px rgba(0, 0, 0, 0.4);
    }
  }
`;
