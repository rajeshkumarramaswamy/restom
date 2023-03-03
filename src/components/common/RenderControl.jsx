import { Spin } from "antd";
import React from "react";

const RenderControl = (props) => {
  const {
    loading,
    error,
    ready,
    errorText,
    hasPlaceholder,
    placeholderComponent,
  } = props;
  if (loading)
    if (hasPlaceholder) {
      return placeholderComponent;
    } else {
      return (
        <div>
          <Spin size="default" />
        </div>
      );
    }

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
