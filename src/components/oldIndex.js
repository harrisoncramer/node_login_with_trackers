// IMPORT OUR DEPENDENCIES
import React from "react";
import ReactDOM from "react-dom";
import Feed from "./components/Feed";
import "./styles/styles.scss";

// Mock data
const tweets = [{
  text: "This is the first tweet.",
  handle: "harrisoncramer",
  time: new Date().toTimeString()
  },{
  text: "This is the second tweet.",
  handle: "johnnyappleseed",
  time: new Date().toTimeString()
},{
  text: "This is the third tweet.",
  handle: "thirdguy",
  time: new Date().toTimeString()
}];


class TwitterPage extends React.Component {
  render(){
    return (
      <div>
        <Feed tweets={tweets} />
      </div>
    );
  }
}

// FINAL RENDER
ReactDOM.render(<TwitterPage />, document.getElementById("app"));