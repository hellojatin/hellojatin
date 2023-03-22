import { Component } from "react";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, Input, Modal, ModalBody, ModalHeader, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

export default class ZoneSectionContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exerciseInput: "",
            improveAnswer: false,
            help: false,
            contactFacilitator: false,
            activeHelpTab: "2",
            helpTabsClasses: ['', 'active'],
            solutions: [],
            helpWindowActiveProblem: 0,
            askedProblem: false,
            problemDesc: ""
        }
        this.improveAnswer = this.improveAnswer.bind(this);
        this.toggleHelpWindow = this.toggleHelpWindow.bind(this);
        this.toggleContactFacilitator = this.toggleContactFacilitator.bind(this);
        this.changeHelpActiveTab = this.changeHelpActiveTab.bind(this);
        this.submitExercise = this.submitExercise.bind(this);
        this.changeHelpWindowActiveProblem = this.changeHelpWindowActiveProblem.bind(this);
        this.contactFacilitator = this.contactFacilitator.bind(this);
        this.sendProblem = this.sendProblem.bind(this);
        this.submitProblem = this.submitProblem.bind(this);
    }
    componentDidMount() {
        this.setExerciseView();
        this.getExerciseSolutions();
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setExerciseView();
            this.getExerciseSolutions();
        }
    }

    getExerciseSolutions() {
        const { helpApis, sectionsLocation, sectionIndex, activeExercise } = this.props;
        const { profile, roadmap, pathName, zoneName } = sectionsLocation;
        fetch(`${helpApis.getSolutions}?profile=${profile}&roadmap=${roadmap}&path=${pathName}&zone=${zoneName}&section=${sectionIndex}&exercise=${activeExercise}`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        solutions: result
                    });
                }
            )
    }

    toggleContactFacilitator() {
        let askedProblem = this.state.askedProblem;
        if(this.state.contactFacilitator === true){
            askedProblem = false
        }
        this.setState({
            contactFacilitator: !this.state.contactFacilitator,
            askedProblem: askedProblem,
            problemDesc: ""
        });
    }

    sendProblem(dataToSend) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: dataToSend,
            redirect: 'follow'
        };

        fetch(this.props.helpApis.getSolutions, requestOptions)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    facilitatorRoom: response.room,
                    askedProblem: true
                })
            })
            .catch(error => {
                alert("Some error occured, Please try again later");
                console.log('error', error)
            });
    }

    setExerciseView() {
        const { sectionProgress, type, activeExercise } = this.props;
        let n = sectionProgress.exercises[activeExercise - 1]?.response.length;
        if (activeExercise !== 0 && n !== 0) {
            this.setState({
                exerciseInput: sectionProgress.exercises[activeExercise - 1]?.response[n - 1],
                improveAnswer: true
            })
        }
        else {
            this.setState({
                exerciseInput: '',
                improveAnswer: false
            })
        }
    }

    submitExercise() {
        const { exerciseInput } = this.state;
        if (exerciseInput.trim() === "")
            alert("Enter exercise response");
        else
            this.props.submitExercise(exerciseInput);
    }

    improveAnswer() {
        this.setState({
            improveAnswer: false
        })
    }

    toggleHelpWindow() {
        this.setState({
            help: !this.state.help
        });
    }

    contactFacilitator() {
        this.setState({
            help: false,
            contactFacilitator: true
        })
    }

    changeHelpActiveTab(tabNo) {
        let helpTabsClasses = ['', ''];
        helpTabsClasses[tabNo - 1] = 'active';
        this.setState({
            activeHelpTab: tabNo + "",
            helpTabsClasses: helpTabsClasses,
            problemDesc: ""
        })
    }

    changeHelpWindowActiveProblem(problemIndex) {
        if (problemIndex === this.state.helpWindowActiveProblem)
            this.setState({
                helpWindowActiveProblem: 0
            })
        else
            this.setState({
                helpWindowActiveProblem: problemIndex
            })
    }

    submitProblem() {
        let problemDesc = JSON.stringify({
            "problem": this.state.problemDesc,
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
        this.sendProblem(problemDesc);
    }

    render() {
        const { sectionProgress, sectionData, activeExercise } = this.props;
        const { improveAnswer, solutions, askedProblem, helpWindowActiveProblem } = this.state;
        const completeVideoButtton = [], exerciseData = sectionData.exercises, zoneSectionContent=[];
        if (!sectionProgress.video)
            completeVideoButtton.push(<Button color="primary" id="videoCompleteButton" onClick={this.props.completeVideo}>Mark Video as complete</Button>)
        if (activeExercise == 0)
            zoneSectionContent.push(<div className="videoView">
                <video width="600" controls>
                    <source src={sectionData.video} type="video/mp4" />
                    Your browser doesn't support HTML video
                </video>
                <div>
                    {completeVideoButtton}
                    <Button color="primary" onClick={this.toggleHelpWindow}>Ask for help</Button>
                </div>
            </div>)
        else {
            if (improveAnswer)
                zoneSectionContent.push(<div className="exerciseContent">
                    <div className="exerciseDesc" dangerouslySetInnerHTML={{ __html: exerciseData[activeExercise - 1]?.desc }}></div>
                    <div className="exerciseResp">
                        <Input
                            type="textarea"
                            placeholder="Enter your response"
                            value={this.state.exerciseInput}
                            disabled
                        />
                        <Button className="exerciseButtons" color="primary" onClick={this.improveAnswer} >Improve Answer</Button>
                        <Button className="exerciseButtons" color="primary" onClick={this.toggleHelpWindow}>Ask for help</Button>
                    </div>
                </div>)
            else
                zoneSectionContent.push(<div className="exerciseContent">
                    <div className="exerciseDesc" dangerouslySetInnerHTML={{ __html: exerciseData[activeExercise - 1]?.desc }}></div>
                    <div className="exerciseResp">
                        <Input
                            type="textarea"
                            placeholder="Enter your response"
                            value={this.state.exerciseInput}
                            onChange={(e) => {
                                this.setState({
                                    exerciseInput: e.target.value
                                });
                            }}
                        />
                        <Button className="exerciseButtons" color="primary" onClick={this.submitExercise} >Submit</Button>
                        <Button className="exerciseButtons" color="primary" onClick={this.toggleHelpWindow}>Ask for help</Button>
                    </div>
                </div>)
        }
        let hintsUI = [], hintNav = [];
        if (sectionData.exercises[activeExercise - 1]?.hints?.length > 0) {
            for (let i = 0; i < sectionData.exercises[activeExercise - 1].hints.length; i++) {
                hintsUI.push(<div>
                    <div className="hintHeader">Hint {i + 1}</div>
                    <div dangerouslySetInnerHTML={{ __html: sectionData.exercises[activeExercise - 1].hints[i] }}></div>
                </div>
                )
            }
            hintNav.push(
                <NavItem>
                    <NavLink
                        className={this.state.helpTabsClasses[0]}
                        onClick={() => this.changeHelpActiveTab(1)}
                    >
                        Hint
                    </NavLink>
                </NavItem>
            )
        }
        let solutionsListUI = [];
        for (let i = 0; i < solutions.length; i++) {
            solutionsListUI.push(
                <AccordionItem>
                    <AccordionHeader targetId={i + 1}>
                        {solutions[i].problem}
                    </AccordionHeader>
                    <AccordionBody accordionId={i + 1}>
                        {solutions[i].solution}
                    </AccordionBody>
                </AccordionItem>
            )
        }
        let askProblemUI = [];
        if (!askedProblem) {
            askProblemUI = <div>
                <Input
                    type="textarea"
                    placeholder="Enter your problem here"
                    value={this.state.problemDesc}
                    onChange={(e) => {
                        this.setState({
                            problemDesc: e.target.value
                        });
                    }}
                />
                <Button onClick={this.submitProblem}>Ask your problem</Button>
            </div>
        }
        else {
            askProblemUI = <div>
                Your problem is recorded.
                <br />Facilitators are available between 9pm to 11pm Monday to Saturday.
                <br />Please join facilitator room : {this.state.facilitatorRoom}.
                <br />Hopefully this will resolve your problem.
            </div>
        }
        return (<div>
            {zoneSectionContent}
            <Modal
                isOpen={this.state.help}
            >
                <ModalHeader
                    toggle={this.toggleHelpWindow}
                >
                    Help Window
                </ModalHeader>
                <ModalBody>
                    <Nav tabs>
                        {hintNav}
                        <NavItem>
                            <NavLink
                                className={this.state.helpTabsClasses[1]}
                                onClick={() => this.changeHelpActiveTab(2)}
                            >
                                Ask your problem
                            </NavLink>
                        </NavItem>
                    </Nav>

                    <TabContent activeTab={this.state.activeHelpTab}>
                        <TabPane tabId="1">
                            {hintsUI}
                        </TabPane>
                        <TabPane tabId="2">
                            <div id="searchResultsPane">
                                <Accordion
                                    open={helpWindowActiveProblem}
                                    toggle={this.changeHelpWindowActiveProblem}
                                >
                                    {solutionsListUI}
                                </Accordion>
                            </div>
                            <Button id="newProblem" color="info" onClick={this.contactFacilitator}>Contact Facilitator</Button>
                        </TabPane>
                    </TabContent>
                </ModalBody>
            </Modal>
            <Modal
                isOpen={this.state.contactFacilitator}
            >
                <ModalHeader
                    toggle={this.toggleContactFacilitator}
                >
                    Describe your Problem
                </ModalHeader>
                <ModalBody>
                    {askProblemUI}
                </ModalBody>
            </Modal>

        </div>)
    }
}