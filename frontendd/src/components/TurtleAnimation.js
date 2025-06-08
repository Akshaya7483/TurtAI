import React from 'react';
import '../styles/TurtleAnimation.css'; // CSS for the turtle
import turtle from "../assets/turtle.png";

function TurtleAnimation() {
  return (
    <div>
      <h1 id="turtle" className="turtle">
        <img src={turtle} alt="Turtle" className="turtle-image" />
      </h1>
    </div>
  );
}

export default TurtleAnimation;
