import React, { Component } from "react";

class NotFound extends Component {
  handleClick = () => {
    this.props.history.goBack();
  };

  render() {
    return (
      <div style={{ fontFamily: "Courier New, Courier, monospace" }}>
        <h1 style={h1Style}>Page Not Found.</h1>
        <button style={btnStyle} onClick={this.handleClick}>
          Go Back
        </button>
      </div>
    );
  }
}

const h1Style = {
  textAlign: "center",
  margin: "75px",
  marginBottom: "20px",
};

const btnStyle = {
  display: "block",
  margin: "auto",
  padding: "10px",
  fontSize: "16px",
  cursor: "pointer",
};

export default NotFound;
