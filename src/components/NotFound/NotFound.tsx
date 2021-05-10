import React from "react";
import { Link } from "react-router-dom";
import './NotFound.scss';

class NotFound extends React.Component {
  render() {
    return (
      <div className="NotFound">
        <h1>Did you get lost, partner?</h1>
        <img src="https://image.freepik.com/free-vector/flat-landscape-cowboy-desert-nature-beautiful-atmosphere-during-day_205077-520.jpg" alt="lost" />
        <p>The url you are trying to reach is not available!</p>
        <h2>Maybe it's time to go <Link to="/">home</Link>.</h2>
      </div>
    );
  }
}

export default NotFound;