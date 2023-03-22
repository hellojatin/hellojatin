import { Component } from "react";
import "./sections-nav.css"
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

class ExerciseNavigation extends Component {
    render(){
        const { activeExercise, currentExercise, sectionProgress, goToActiveSection, skipExercise, goToSkippedExercise, nextExercise } = this.props;
        if(sectionProgress.status){
            return(<Button className="exerciseNavigation" variant="contained" onClick={goToActiveSection}>Go to Active Section</Button>)
        }
        else{
            if(activeExercise === 0){
                if(!sectionProgress.video)
                return(<Button className="exerciseNavigation" variant="contained" disabled>Current Exercise</Button>)
            }
            else{
                if(currentExercise === activeExercise && !sectionProgress.exercises[activeExercise-1].status && activeExercise<sectionProgress.exercises.length)
                return(<Button className="exerciseNavigation" variant="contained" onClick={skipExercise}>Skip Exercise</Button>)
            }
            if(currentExercise === activeExercise && activeExercise<sectionProgress.exercises.length && ((activeExercise === 0 && sectionProgress.video) || (activeExercise !== 0 && sectionProgress.exercises[activeExercise-1].status)))
            return(<Button className="exerciseNavigation" variant="contained" onClick={nextExercise}>Next Exercise</Button>)
            if(sectionProgress.exercises[sectionProgress.exercises.length-1].status && (activeExercise === 0 || sectionProgress.exercises[activeExercise-1].status))
            return(<Button className="exerciseNavigation" variant="contained" onClick={goToSkippedExercise}>Skipped Exercise</Button>)
        }
        return(<Button className="exerciseNavigation" variant="contained" disabled>Current Exercise</Button>)
    }
}

export default class SectionNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shareFeedbackWindow: false,
            feedback: ""
        }
        this.changeExercise = this.changeExercise.bind(this);
        this.toggleFeedbackWindow = this.toggleFeedbackWindow.bind(this);
        this.shareFeedback = this.shareFeedback.bind(this);
    }

    changeExercise(exerciseIndexEvent) {
        let exerciseIndex = exerciseIndexEvent.target.value;
        this.props.changeExercise(exerciseIndex);
    }

    toggleFeedbackWindow() {
        this.setState({
            shareFeedbackWindow: !this.state.shareFeedbackWindow,
            feedback: ""
        })
    }

    shareFeedback() {
        let feedback = JSON.stringify({
            "feedback": this.state.feedback,
            "email": this.props.email,
            "userName": this.props.userName,
            "exerciseLocation": {
                "profile": this.props.sectionsLocation.profile,
                "roadmap": this.props.sectionsLocation.roadmap,
                "path": this.props.sectionsLocation.pathName,
                "zone": this.props.sectionsLocation.zoneName,
                "section": this.props.sectionIndex,
                "exercise": this.props.activeExercise
            }
        });
        this.sendFeedback(feedback);
    }

    sendFeedback(feedback) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: feedback,
            redirect: 'follow'
        };
        fetch(this.props.feedbackApis.sendFeedback, requestOptions)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    shareFeedbackWindow: false
                })
                alert("Thanks for sharing your valuable feedback");
            })
            .catch(error => {
                alert("Some error occured, Please try again later");
                console.log('error', error)
            });
    }

    render() {
        const { currentExercise, activeExercise, isExerciseComplete, nextExercise, changeExercise, sectionsLocationIndex, meetingLink, sectionProgress, goToActiveSection, skipExercise, goToSkippedExercise } = this.props;
        let menuItems = [], currentNextExercise;

        for (let i = 0; i < currentExercise && i<sectionProgress.exercises.length; i++) {
            let exerciseActionClass=""
            if(sectionProgress.exercises[i].status)
            exerciseActionClass="completeExerciseAction"
            menuItems.push(<MenuItem className={exerciseActionClass} value={i + 1}>{i + 1}</MenuItem>)
        }
        return (<div className="sectionsNav">
            <Button className="viewLesson" variant="contained" onClick={() => changeExercise(0)}>Lesson <AutoStoriesIcon className="iconCsss" /></Button>
            <div className="emptySpace">Join room Room{sectionsLocationIndex.zoneIndex + 1} <a href={meetingLink} target="_blank">here</a></div>
            <Button className="shareFeedback" variant="contained" onClick={this.toggleFeedbackWindow}>Share Feedback</Button>
            <div className="exerciseInfo">
                <div className="exerciseInfo1st">Exercise</div>
                <Select
                    className="exerciseInfo2nd"
                    value={activeExercise}
                    onChange={this.changeExercise}
                    variant="standard"
                    disableUnderline
                >
                    {menuItems}
                </Select>
                <div className="exerciseInfo3rd">of {sectionProgress.exercises.length}</div>
            </div>
            {currentNextExercise}
            <ExerciseNavigation nextExercise={nextExercise} skipExercise={skipExercise} goToSkippedExercise={goToSkippedExercise} currentExercise={currentExercise} activeExercise={activeExercise} isExerciseComplete={isExerciseComplete} sectionProgress={sectionProgress} goToActiveSection={goToActiveSection} />
            <Modal
                isOpen={this.state.shareFeedbackWindow}
                toggle={this.toggleFeedbackWindow}
            >
                <ModalHeader toggle={this.toggleFeedbackWindow}>
                    Share Feedback
                </ModalHeader>
                <ModalBody>
                    <Input
                        type="textarea"
                        placeholder="Share your Feedback"
                        value={this.state.feedback}
                        onChange={(e) => {
                            this.setState({
                                feedback: e.target.value
                            });
                        }}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' variant='contained' onClick={this.shareFeedback}>Share Feedback</Button>
                </ModalFooter>
            </Modal>
        </div>)
    }
}