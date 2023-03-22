import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";

class SubjectCard extends Component {
  render() {
    let isActive = this.props.subjectInfo.id == this.props.activeSubjectId;
    return (
      <Card
        key={this.props.subjectInfo.id}
        className="subjectCard"
        bg={isActive ? "info" : "light"}
      >
        <Card.Img
          className="subjectLogo"
          src={process.env.PUBLIC_URL + this.props.subjectInfo.logo}
        />
        <Card.Body>
          <Card.Title className="subjectTitle">
            {this.props.subjectInfo.name}
          </Card.Title>
          <Button
            variant={isActive ? "light" : "primary"}
            onClick={() => {
              this.props.changeActiveSubject(
                this.props.subjectInfo.id,
                this.props.subjectInfo.name
              );
            }}
          >
            Check Scope
          </Button>
        </Card.Body>
      </Card>
    );
  }
}

export default SubjectCard;
