import React, { Component } from "react";

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }
  render() {
    const { loading } = this.props;
    return <div>{loading && <div>loading...</div>}</div>;
  }
}
