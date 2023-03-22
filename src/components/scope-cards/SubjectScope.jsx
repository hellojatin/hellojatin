import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TopicTiles from "./TopicTiles";
import TopicQuestions from "./TopicQuestions";

class SubjectScope extends Component {
  state = {
    viewTopic: false,
    activeTopicId: false,
    activeTopicName: null,
    categories: null,
    loading: true,
    progress: [],
  };

  async componentDidMount() {
    let categories = null;
    let data_progress = [];
    if (this.props.activeSubjectId) {
      const topicData = await this.fetchTopic();
      data_progress = await this.fetchProgress();
      categories = this.makeAndGetCategories(topicData);
    }

    this.setState({
      categories: categories,
      loading: false,
      progress: data_progress,
    });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.activeSubjectId != this.props.activeSubjectId) {
      const topicData = await this.fetchTopic();
      let data_progress = await this.fetchProgress();
      let categories = this.makeAndGetCategories(topicData);

      this.setState({
        categories: categories,
        loading: false,
        viewTopic: false,
        progress: data_progress,
      });
    }
  }

  fetchTopic = async () => {
    const url =
      process.env.PUBLIC_URL +
      `/data/scope-cards/Subjects/${this.props.activeSubjectId}/topics.json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  fetchProgress = async () => {
    const { email, scopeCardApis, activeSubjectId } = this.props;
    const progress_url = `${scopeCardApis.fetchProgress}?email=${email}&subject_id=${activeSubjectId}`;
    const response_progress = await fetch(progress_url);
    let data = await response_progress.json();
    return data.progress;
  };

  makeAndGetCategories = (topicData) => {
    let categories = {};
    topicData.forEach((topic) => {
      if (!(topic.category in categories)) categories[topic.category] = [];
      categories[topic.category].push({ name: topic.name, id: topic.id });
    });
    return categories;
  };

  updateProgress = (topicid, index) => {
    let updatedProgress = this.state.progress;
    for (let i = 0; i < updatedProgress.length; i++) {
      if (updatedProgress[i].topic_id == topicid) {
        updatedProgress[i].completed[index] =
          !updatedProgress[i].completed[index];
      }
    }
    this.setState({ progress: updatedProgress });
    this.updateProgressOnServer(updatedProgress);
  };

  updateProgressOnServer = (updatedProgress) => {
    let { email, scopeCardApis, activeSubjectId } = this.props;
    let progressUpdate = JSON.stringify({
      email: email,
      subject_id: activeSubjectId,
      progress: updatedProgress,
    });
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: progressUpdate,
      redirect: "follow",
    };

    fetch(scopeCardApis.updateProgress, requestOptions)
      .then((response) => response.json())
      .then((response) => {
        console.info("data updated successfully");
      })
      .catch((error) => {
        alert(
          "Progress couldn't be saved. Please refresh and try again later!!"
        );
        console.error("error", error);
      });
  };

  setNewTopicProgress = (topicId, newTopicProgress) => {
    let progress = this.state.progress;
    let newTopicProgressUpdate = {
      topic_id: topicId,
      completed: newTopicProgress,
    };
    progress.push(newTopicProgressUpdate);
    this.setState({
      progress: progress,
    });
  };

  changeTopicView = (topicId, topicName) => {
    this.setState({
      activeTopicId: topicId,
      activeTopicName: topicName,
    });
    this.toggleTopicView();
  };

  toggleTopicView = () => {
    this.setState({ viewTopic: !this.state.viewTopic });
  };

  render() {
    const categoriesHTML = [];
    for (const category in this.state.categories) {
      categoriesHTML.push(
        <div className="category">
          <div className="categoryName"><div className="head">{category}</div></div>
          <div className="categoryContent">
            {this.state.categories[category].map((element) => (
              <TopicTiles
                topic={element}
                changeTopicView={this.changeTopicView}
                progressTopicid={this.state.progress.find(
                  (topicProgress) => topicProgress.topic_id == element.id
                )}
              />
            ))}
            {this.state.categories[category].map((element) => (
              <TopicTiles
                topic={element}
                changeTopicView={this.changeTopicView}
                progressTopicid={this.state.progress.find(
                  (topicProgress) => topicProgress.topic_id == element.id
                )}
              />
            ))}
            {this.state.categories[category].map((element) => (
              <TopicTiles
                topic={element}
                changeTopicView={this.changeTopicView}
                progressTopicid={this.state.progress.find(
                  (topicProgress) => topicProgress.topic_id == element.id
                )}
              />
            ))}
            {this.state.categories[category].map((element) => (
              <TopicTiles
                topic={element}
                changeTopicView={this.changeTopicView}
                progressTopicid={this.state.progress.find(
                  (topicProgress) => topicProgress.topic_id == element.id
                )}
              />
            ))}
          </div>
          {/* <Container fluid>
            <Row
              className="bg-primary p-3 m-5"
              style={{
                fontSize: "15pt",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {category}

              <Col
                className="bg-info"
                md={{ span: 12 }}
                style={{
                  fontSize: "10pt",
                  textAlign: "center",
                  margin: "3pt",
                  marginTop: "5pt",
                }}
              >
                {this.state.categories[category].map((element) => (
                  <TopicTiles
                    topic={element}
                    changeTopicView={this.changeTopicView}
                    progressTopicid={this.state.progress.find(
                      (topicProgress) => topicProgress.topic_id == element.id
                    )}
                  />
                ))}
              </Col>
            </Row>
          </Container> */}
        </div>
      );
    }
    if (!this.props.activeSubjectId)
      return <div id="message">Please click on subject to view scope</div>;
    if (this.state.loading || !this.state.categories)
      return <div>loading... </div>;
    return (
      <div key={this.props.activeSubjectId}>
        {this.state.viewTopic ? (
          <TopicQuestions
            activeTopicId={this.state.activeTopicId}
            activeTopicName={this.state.activeTopicName}
            currentScope={this.props.activeSubjectId}
            progressTopicid={this.state.progress.find(
              (topicProgress) =>
                topicProgress.topic_id == this.state.activeTopicId
            )}
            back={this.toggleTopicView}
            changeProgress={this.updateProgress}
            setNewTopicProgress={this.setNewTopicProgress}
          />
        ) : (
          <div>
            <h1 id="subjectTitle">{this.props.activeSubjectName}</h1>
            {categoriesHTML}
          </div>
        )}
      </div>
    );
  }
}

export default SubjectScope;
