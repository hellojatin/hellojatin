import './App.css';
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Spinner } from 'reactstrap';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/header/header';
import MainRoute from './components/main/main';
import ZoneRoute from './components/zone-content/zone-content'
import StartPage from './components/start-page/start-page';
import Home from './components/home/home';
import MainSubjectScope from './components/scope-cards/MainSubjectScope';
import Facilitator from './components/facilitator/facilitator';
import ReactGA from 'react-ga';

const TRACKING_ID = process.env.REACT_APP_ANALYTICS_TRACKING_ID; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseFile: false,
      lessonProgress: false,
      email: "testUser3@email.com",
      userName: false
    }
    this.getLessonProgressEmailAndUserName = this.getLessonProgressEmailAndUserName.bind(this);
    this.logout = this.logout.bind(this);
    this.updateLessonProgress = this.updateLessonProgress.bind(this);
  }
  componentDidMount() {
    fetch(process.env.PUBLIC_URL + "/data/index.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            baseFile: result
          });
        }
      )
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  componentDidUpdate() {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  getLessonProgressEmailAndUserName(lessonProgress, email, userName) {
    this.setState({
      lessonProgress: lessonProgress,
      email: email,
      userName: userName
    });
  }

  logout() {
    this.setState({
      userName: false
    })
  }

  updateLessonProgress(lessonProgress) {
    this.setState({
      lessonProgress: lessonProgress
    })
  }

  render() {
    if (this.state.baseFile)
      return (
        <div className="App">
          <Header userName={this.state.userName} email={this.state.email} logoutApi={this.state.baseFile.apis.login.logout} logout={this.logout} loginApis={this.state.baseFile.apis.login} getLessonProgressEmailAndUserName={this.getLessonProgressEmailAndUserName} />
          <Routes>
            <Route exact path="/" element={<Navigate to="/start-page" />} />
            <Route exact path="/start-page" element={<StartPage signUpApis={this.state.baseFile.apis.signUp} getLessonProgressEmailAndUserName={this.getLessonProgressEmailAndUserName} />} />
            <Route exact path="/facilitator" element={<Facilitator facilitatorApis={this.state.baseFile.apis.facilitator} />} />
            <Route exact path="/home" element={<Home lessonProgress={this.state.lessonProgress} />} />
            <Route exact path="/scope-cards" element={<MainSubjectScope scopeCardsApis={this.state.baseFile.apis.scopeCards} email={this.state.email}/>} />
            <Route exact path="/:profile/:roadmap/:pathName" element={<MainRoute lessonProgress={this.state.lessonProgress} />} />
            <Route exact path="/:profile/:roadmap/:pathName/:zoneName" element={<ZoneRoute lessonProgress={this.state.lessonProgress} mainApis={this.state.baseFile.apis.main} roomManagementApis={this.state.baseFile.apis.roomManagement} email={this.state.email} userName={this.state.userName} updateLessonProgress={this.updateLessonProgress} helpApis={this.state.baseFile.apis.help} meetingLink={this.state.baseFile.meetingLink} feedbackApis={this.state.baseFile.apis.feedback} />} />
          </Routes>
        </div>
      );
    else
      return (
        <div className="App">
          <Header />
          <div id="loadingApp">
            <Spinner id='appSpinner'>
              Loading...
            </Spinner>
          </div>
        </div>
      )
  }
}

export default App;
