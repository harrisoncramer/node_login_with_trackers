import React from "react";

// subComponents
import Tweet from "./Tweet";
import AddTweet from "./AddTweet";

export default class Feed extends React.Component {
    render(){
        return (
            <div>
              {
                this.props.tweets.map((data,i) => <Tweet key={i} data={data} />)
              }
              <AddTweet />
            </div>
        );
    };
};