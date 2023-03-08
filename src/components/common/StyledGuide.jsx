import styled from "styled-components";

export const StyledDiv = styled.div`
  position: ${(props) => props.position};
  height: ${(props) => props.height};
  display: ${(props) => props.display};
  bottom: ${(props) => props.bottom};
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.fontColor};
  font-weight: ${(props) => props.fontWeight};
  margin: ${(props) => props.margin};
`;
