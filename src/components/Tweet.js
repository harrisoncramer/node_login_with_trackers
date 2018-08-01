import React from "react";

export default class Tweet extends React.Component {

    showAlert(){
        alert("Yay");
    }

    render(){
        const tweet = this.props.data;

        return (
            <div className="tweetWrapper">
                <p className="tweetText"> {tweet.text} </p>
                <p className="tweetHandle"> {tweet.handle} </p>
                <p className="tweetTime"> {tweet.time} </p>
                <button onClick={this.showAlert} >Click me</button>
            </div>
        );
    }
};