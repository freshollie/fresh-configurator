import styled from "../../theme";

export const Box = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.subtleAccent};
  background-color: ${({ theme }) => (theme.dark ? "#5f5f5f" : "white")};
  border-radius: 5px;
  min-height: 187px;
  max-width: 220px;
  font-size: 11px;
  padding: 5px;

  h3 {
    margin-block-start: 0;
    margin-block-end: 0;
  }

  p > a {
    text-decoration: none;
    color: ${({ theme }) => (theme.dark ? theme.colors.accent : "black")};
  }
`;

export const DonateLink = styled.a`
  display: block;
  font-family: Verdana, Tahoma;
  font-weight: bold;
  font-style: italic;
  color: #253b80;
  text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.6);
  font-size: 10px;

  padding: 5px 29px;
  border: 1px solid #ff9933;
  border-radius: 50px;
  background-image: linear-gradient(#fff0a8, #f9b421);
  margin: 0 auto;
  position: relative;
  cursor: pointer;
  width: min-content;
`;
