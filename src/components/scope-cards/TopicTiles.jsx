import React, { Component } from "react";
import { Card, ProgressBar, Button, OverlayTrigger, Tooltip } from "react-bootstrap";

class TopicTiles extends Component {
  render() {
    let percentage, topicProgressClass = "";
    if (this.props.progressTopicid) {
      let count = 0;
      for (let i = 0; i < this.props.progressTopicid.completed.length; i++) {
        if (this.props.progressTopicid.completed[i])
          count++;
      }
      percentage = parseFloat(count / this.props.progressTopicid.completed.length * 100).toFixed(2);
    }
    if (percentage) {
      if (percentage < 50)
        topicProgressClass = "topicStarted";
      else if (percentage < 100)
        topicProgressClass = "topicProgressOver50";
      else if (percentage == 100)
        topicProgressClass = "topicCompleted";
    }
    return (
      // <OverlayTrigger
      //   key={this.props.topic.id}
      //   placement="top"
      //   overlay={
      //     <Tooltip id={`tooltip`}>
      //       Tooltip
      //     </Tooltip>
      //   }
      // >
        <div key={this.props.topic.id} className={"topicTiles " + topicProgressClass} onClick={() => {
          this.props.changeTopicView(this.props.topic.id, this.props.topic.name);
        }}>
          {this.props.topic.name}
        </div>
      // </OverlayTrigger>
      // <Card key={this.props.topic.id}
      //   id={this.props.topic.id}
      //   className="topicTiles"
      // >
      //   <Card.Body>
      //     <Card.Title className="topicTitle">
      //       {this.props.topic.name}
      //     </Card.Title>
      //     {percentage ?<ProgressBar className="topicProgress" variant="success" now={percentage} animated /> : <div className="topicProgress"></div>}

      //     <Button
      //       className="topicButton"
      //       onClick={() => {
      //         this.props.changeTopicView(this.props.topic.id, this.props.topic.name);
      //       }}
      //     >
      //     {this.props.progressTopicid ? "Resume" : "Start"}
      //     </Button>
      //   </Card.Body>
      // </Card>
    );
  }
}

export default TopicTiles;
