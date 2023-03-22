import React, { Component } from "react";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Button } from "react-bootstrap";

class TopicQuestions extends Component {
  state = { data: null, loading: true };

  async componentDidMount() {
    const url = process.env.PUBLIC_URL + `/data/scope-cards/Subjects/${this.props.currentScope}/${this.props.activeTopicId}.json`;
    const response = await fetch(url);
    const data = await response.json();
    if (!this.props.progressTopicid) {
      let newTopicProgress = [];
      for (let i = 0; i < data.length; i++) {
        newTopicProgress.push(false);
      }
      this.props.setNewTopicProgress(this.props.activeTopicId, newTopicProgress);
    }
    this.setState({ data: data, loading: false });
  }

  changeProgress(index) {
    console.log(this.props.progressTopicid)
    this.props.changeProgress(this.props.progressTopicid.topic_id, index)
  }

  render() {
    return this.state.loading || !this.state.data ? (
      <div>loading... </div>
    ) : (
      <div key={this.props.progressTopicid}>
        <div id="questionsHead"><Button id="questionsBack" onClick={this.props.back}>Back</Button>{this.props.activeTopicName}</div>
        <div id="questionsTable">
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Q-ID</TableCell>
                <TableCell>Questions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.data
                .map((ques, i) => {
                  return (
                    <TableRow hover>
                      <TableCell>
                        {this.props.progressTopicid?.completed[i] ? (
                          <input type="checkbox" checked onClick={() => this.changeProgress(i)} />
                        ) : (
                          <input type="checkbox" onClick={() => this.changeProgress(i)} />
                        )}
                      </TableCell>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{ques}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

export default TopicQuestions;
