import React, { Component } from "react";

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }
  render() {
    const {
      width,
      headerBgColor,
      selected,
      paddingVertical,
      paddingHorizontal,
      maxHeight,
      searchable,
      showInfo,
      itemData,
      childStyleClassName,
      itemClick,
      onInfoClick,
    } = this.props;
    return (
      <div style={{ width, paddingVertical, paddingHorizontal, maxHeight }}>
        <label style={{ BackgroundColor: headerBgColor }}>Dropdown</label>
        <div className={childStyleClassName} onClick={itemClick}>
          {this.props.children}
        </div>
        {showInfo && <div className="info" onClick={onInfoClick}></div>}
      </div>
    );
  }
}
