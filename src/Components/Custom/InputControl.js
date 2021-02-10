import React, { Component } from "react";

export default class InputControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }
  render() {
    const { label, className } = this.props;
    return (
      <div className={className}>
        <label>{label}</label>
        {this.props.children}
      </div>
    );
  }
}
