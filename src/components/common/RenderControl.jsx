import { Spin } from "antd";
import React from "react";
import { StyledDiv } from "./StyledGuide";

const RenderControl = (props) => {
  const {
    loading,
    error,
    ready,
    errorText,
    hasPlaceholder,
    placeholderComponent,
  } = props;
  if (true)
    return (
      <StyledDiv position="relative">
        <Spin size="default" />
      </StyledDiv>
    );

  if (error)
    return (
      <div>
        <div>Error</div>
      </div>
    );
  if (ready) return props.children;
  return null;
};

RenderControl.defaultProps = {
  loading: false,
  error: false,
  ready: false,
  errorText: "Something went wrong...!",
};

export default RenderControl;
