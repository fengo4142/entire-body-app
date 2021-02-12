import React from "react";

export const Dropdown = (props) => {
  const {
    width,
    headerBgColor,
    paddingVertical,
    paddingHorizontal,
    maxHeight,
    showInfo,
    childStyleClassName,
    itemClick,
    onInfoClick,
    children,
  } = props;

  return (
    <div style={{ width, paddingVertical, paddingHorizontal, maxHeight }}>
      <label style={{ BackgroundColor: headerBgColor }}>Dropdown</label>
      <div className={childStyleClassName} onClick={itemClick}>
        {children}
      </div>
      {showInfo && <div className="info" onClick={onInfoClick}></div>}
    </div>
  );
};
