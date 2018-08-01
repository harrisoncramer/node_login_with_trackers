import React from "react";
import axios from "axios";

export default class AddTweet extends React.Component {
    addTracker(e){
      e.preventDefault();
      const handle = e.target.elements.handle.value;
      axios.post("test", {
        account: handle
      }).then((res) => {
        alert(res.status)
      }).catch((err) => {
        console.log(err)
      });
    }

    render(){
        return (
            <div className="tweetWrapper">
                <form onSubmit={this.addTracker}>
                  <input type='text' name='handle'/>
                  <button>Add Tracker</button>
                </form>
            </div>
        );
    }
};