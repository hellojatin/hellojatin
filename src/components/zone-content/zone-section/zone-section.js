import React, { Component } from "react";

import { AccordionBody, AccordionHeader, AccordionItem, Button, Col, Input, NavItem, NavLink } from "reactstrap";

import ZoneSectionContent from "./zone-section-content/zone-section-content";
import SectionNav from "./sections-nav/sections-nav";

class ZoneSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: Math.round(new Date().getTime() / 1000),
            facilitatorRoom: "",
            activeExercise: 0,
            currentExercise: 0
        }
        this.changeExercise = this.changeExercise.bind(this);
        this.nextExercise = this.nextExercise.bind(this);
        this.submitExercise = this.submitExercise.bind(this);
        this.skipExercise = this.skipExercise.bind(this);
        this.goToSkippedExercise = this.goToSkippedExercise.bind(this);
    }

    componentDidMount() {
        this.getCurrentContent();
    }

    getCurrentContent() {
        let { sectionProgress } = this.props;
        if (sectionProgress.status) {
            this.setState({
                activeExercise: 0,
                currentExercise: this.props.sectionData.exercises.length,
                startTime: Math.round(new Date().getTime() / 1000)
            })
        }
        else {
            if (sectionProgress.video) {
                let currentExercise, activeExercise;
                for (currentExercise = this.props.sectionData.exercises.length; currentExercise > 1; currentExercise--) {
                    if (sectionProgress.exercises[currentExercise-1].status)
                        break;
                }
                if(currentExercise === this.props.sectionData.exercises.length){
                    for(let i=0; i<this.props.sectionData.exercises.length; i++){
                        if(!sectionProgress.exercises[i].status){
                            activeExercise= i+1;
                            break;
                        }
                    }
                }
                else{
                    activeExercise = currentExercise;
                }
                this.setState({
                    activeExercise: activeExercise,
                    currentExercise: currentExercise,
                    startTime: Math.round(new Date().getTime() / 1000)
                });
            }
            else {
                this.setState({
                    activeExercise: 0,
                    currentExercise: 0,
                    isExerciseComplete: false,
                    isActiveSection: true
                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.getCurrentContent();
        }
    }

    submitExercise(exerciseInput) {
        const { startTime, activeExercise } = this.state;
        this.props.submitExercise(exerciseInput, startTime, activeExercise);
    }

    changeExercise(exerciseIndex) {
        this.setState({
            startTime: Math.round(new Date().getTime() / 1000),
            activeExercise: exerciseIndex
        })
    }

    nextExercise() {
        this.setState({
            startTime: Math.round(new Date().getTime() / 1000),
            currentExercise: this.state.currentExercise + 1,
            activeExercise: this.state.activeExercise + 1
        })
    }

    skipExercise() {
        this.setState({
            startTime: Math.round(new Date().getTime() / 1000),
            activeExercise: this.state.activeExercise + 1,
            currentExercise: this.state.currentExercise + 1
        })
    }

    goToSkippedExercise() {
        let activeExercise=0;
        for(let i=0;i<this.props.sectionProgress.exercises.length;i++){
            if(!this.props.sectionProgress.exercises[i].status){
                activeExercise=i+1;
                break;
            }
        }
        this.setState({
            startTime: Math.round(new Date().getTime() / 1000),
            activeExercise: activeExercise
        })
    }

    render() {
        const { sectionData, sectionProgress, goToActiveSection } = this.props;
        const { activeExercise, solutions, helpWindowActiveProblem, askedProblem, currentExercise, isExerciseComplete, isActiveSection } = this.state;
        const exerciseData = sectionData.exercises;
        let exercisesIndex = 0;
        if (sectionProgress.video) {
            while (exercisesIndex < exerciseData.length && sectionProgress.exercises[exercisesIndex].status) {
                let toggleIndex = exercisesIndex + 2, activeClass = '';
                if (activeExercise === toggleIndex - 1)
                    activeClass = ' active';
                exercisesIndex++;
            }
            if (exercisesIndex < exerciseData.length) {
                let toggleIndex = exercisesIndex + 2, activeClass = '';
                if (activeExercise === toggleIndex - 1)
                    activeClass = ' active';
                exercisesIndex++;
            }
        }
        while (exercisesIndex < exerciseData.length) {
            let toggleIndex = exercisesIndex + 2, activeClass = '';
            if (activeExercise === toggleIndex - 1)
                activeClass = ' active';
            exercisesIndex++;
        }
        let tempExercise = []
        for (let i = 0; i < exerciseData.length; i++) {
            tempExercise.push(<Col className="zoneSectionNavButton"><Button>{exerciseData[i].code}</Button></Col>)
        }
        return (<div className="zoneSection" key={this.props.sectionProgress}>
            <SectionNav activeExercise={activeExercise} currentExercise={currentExercise} isExerciseComplete={isExerciseComplete} changeExercise={this.changeExercise} nextExercise={this.nextExercise} sectionsLocationIndex={this.props.sectionsLocationIndex} meetingLink={this.props.meetingLink} email={this.props.email} userName={this.props.userName} sectionsLocation={this.props.sectionsLocation} sectionIndex={this.props.sectionIndex} feedbackApis={this.props.feedbackApis} sectionProgress={sectionProgress} goToActiveSection={goToActiveSection} skipExercise={this.skipExercise} goToSkippedExercise={this.goToSkippedExercise} />
            <ZoneSectionContent completeVideo={this.props.completeVideo} sectionProgress={sectionProgress} sectionData={sectionData} activeExercise={activeExercise} toggleHelpWindow={this.toggleHelpWindow} submitExercise={this.submitExercise} email={this.props.email} userName={this.props.userName} sectionsLocation={this.props.sectionsLocation} sectionIndex={this.props.sectionIndex} helpApis={this.props.helpApis} />
        </div>)
    }
}


export default ZoneSection;