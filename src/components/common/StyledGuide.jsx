import styled from "styled-components";

export const StyledDiv = styled.div`
  position: ${(props) => props.position};
  height: ${(props) => props.height};
  display: ${(props) => props.display};
  bottom: ${(props) => props.bottom};
`;
