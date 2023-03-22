import React, { Component } from "react";
import "./zone-content.css"

import { Link, useParams } from "react-router-dom";
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Button, Spinner } from "reactstrap";
import ZoneSection from "./zone-section/zone-section";

const ZoneRoute = (props) => {
    const params = useParams();
    const profile = params.profile, roadmap = params.roadmap, pathName = params.pathName, zoneName = params.zoneName;
    if(window.screen.width<768)
    return (<div>Coding is supposed to be learned through Laptop/PC. So please switch to Laptop/PC and login again.</div>)
    return (<ZoneContent lessonProgress={props.lessonProgress} updateLessonProgress={props.updateLessonProgress} mainApis={props.mainApis} roomManagementApis={props.roomManagementApis} helpApis={props.helpApis} email={props.email} userName={props.userName} profile={profile} roadmap={roadmap} pathName={pathName} zoneName={zoneName} meetingLink={props.meetingLink} feedbackApis={props.feedbackApis} />)
}

class ZoneContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            sectionsJson: [],
            activeSectionIndex: 0,
            currentSectionIndex: 0,
            lessonProgress: this.props.lessonProgress,
            sectionsLocation: {
                zoneName: this.props.zoneName,
                profile: this.props.profile,
                roadmap: this.props.roadmap,
                pathName: this.props.pathName,
            },
            sectionsLocationIndex: {},
            room: ""
        };
        this.toggle = this.toggle.bind(this);
        this.completeVideo = this.completeVideo.bind(this);
        this.submitExercise = this.submitExercise.bind(this);
        this.goToActiveSection = this.goToActiveSection.bind(this);
    }

    async componentDidMount() {
        let sectionsJson = await this.fetchSectionsJson();
        this.checkAndAddNewUserProgress(sectionsJson.sections);
        this.getRoomNo();
    }

    checkAndAddNewUserProgress(sectionsJson) {
        let { lessonProgress, sectionsLocation } = this.state;
        const { profile, roadmap, pathName, zoneName } = sectionsLocation;
        if (!lessonProgress.find(currProfile => currProfile.profileCode === profile)) {
            let newProfile = {
                "profileCode": profile,
                "roadmaps": []
            }
            lessonProgress.push(newProfile);
        }
        const profileIndex = lessonProgress.findIndex(currProfile => currProfile.profileCode === profile);
        if (!lessonProgress[profileIndex].roadmaps.find(currRoadmap => currRoadmap.name === roadmap)) {
            let newRoadmap = {
                "name": roadmap,
                "status": false,
                "paths": []
            }
            lessonProgress[profileIndex].roadmaps.push(newRoadmap);
        }
        const roadmapIndex = lessonProgress[profileIndex].roadmaps.findIndex(currRoadmap => currRoadmap.name === roadmap);
        if (!lessonProgress[profileIndex].roadmaps[roadmapIndex].paths.find(currPath => currPath.code === pathName)) {
            let newPath = {
                "code": pathName,
                "status": false,
                "progress": []
            }
            lessonProgress[profileIndex].roadmaps[roadmapIndex].paths.push(newPath);
        }
        const pathIndex = lessonProgress[profileIndex].roadmaps[roadmapIndex].paths.findIndex(currPath => currPath.code === pathName)
        if (!lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress.find(currZone => currZone.name === zoneName)) {
            let newZone = {
                "name": zoneName,
                "status": false,
                "progress": []
            }
            lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress.push(newZone);
        }
        const zoneIndex = lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress.findIndex(currZone => currZone.name === zoneName);
        let activeSectionIndex = lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress.length;
        if (activeSectionIndex === 0) {
            let newZoneJson = [];
            for (let i = 0; i < sectionsJson.length; i++) {
                newZoneJson.push({
                    "status": false,
                    "video": false,
                    "exercises": []
                })
                for (let j = 0; j < sectionsJson[i].exercises.length; j++) {
                    newZoneJson[i].exercises.push({
                        "status": false,
                        "startTime": "",
                        "endTime": "",
                        "response": []
                    })

                }
            }
            lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress = newZoneJson;
        }
        else {
            for (let i = 0; i < activeSectionIndex; i++) {
                if (!lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress[i].status) {
                    activeSectionIndex = i;
                    break;
                }
            }
        }
        activeSectionIndex++;
        let sectionsLocationIndex = {
            profileIndex: profileIndex,
            roadmapIndex: roadmapIndex,
            pathIndex: pathIndex,
            zoneIndex: zoneIndex
        }
        this.setState({
            lessonProgress: lessonProgress,
            activeSectionIndex: activeSectionIndex,
            currentSectionIndex: activeSectionIndex,
            sectionsJson: sectionsJson,
            isLoaded: true,
            sectionsLocationIndex: sectionsLocationIndex
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.zoneName !== this.props.zoneName) {
            this.checkAndAddNewUserProgress();
            this.fetchSectionsJson();
            this.getRoomNo();
        }
    }

    fetchSectionsJson = async () => {
        const fetchResponse = await fetch(`${process.env.PUBLIC_URL}/data/profiles/${this.props.profile}/${this.props.roadmap}/${this.props.pathName}/${this.props.zoneName}.json`);
        const data = await fetchResponse.json();
        return data;
    }

    getRoomNo() {
        let zone = this.state.lessonProgress.find(zone => zone.zoneName === this.props.zoneName);
        if (zone) {
            if (!zone.status) {
                for (let i = 0; i < zone.zoneProgress.length; i++) {
                    if (!zone.zoneProgress[i].status) {
                        fetch(this.props.roomManagementApis.getRoomNo + "?email=" + this.props.email + "&roadmap=foundation&zone=" + this.state.zoneName + "&section=Section" + (i + 1))
                            .then(res => res.json())
                            .then(
                                (result) => {
                                    this.setState({
                                        room: result.roomsName
                                    });
                                },
                                (error) => {
                                    console.error(error);
                                }
                            )
                        break;
                    }
                }
            }
        }
        else {
            fetch(this.props.roomManagementApis.getRoomNo + "?email=" + this.props.email + "&roadmap=foundation&zone=" + this.state.zoneName + "&section=Section1")
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({
                            room: result.roomsName
                        });
                    },
                    (error) => {
                        console.error(error);
                    }
                )
        }
    }

    toggle(cardToggleNo) {
        if (cardToggleNo === this.state.activeSectionIndex)
            this.setState({
                activeSectionIndex: 0
            })
        else
            this.setState({
                activeSectionIndex: cardToggleNo
            })
    }

    goToActiveSection() {
        this.setState({
            activeSectionIndex: this.state.currentSectionIndex
        })
    }

    completeVideo() {
        let { lessonProgress, sectionsLocationIndex, activeSectionIndex } = this.state;
        lessonProgress[sectionsLocationIndex.profileIndex].roadmaps[sectionsLocationIndex.roadmapIndex].paths[sectionsLocationIndex.pathIndex].progress[sectionsLocationIndex.zoneIndex].progress[activeSectionIndex - 1].video = true;
        this.updateLessonProgress(lessonProgress, false);
    }

    submitExercise(exerciseInput, startTime, exerciseIndex) {
        let { lessonProgress, sectionsLocationIndex, activeSectionIndex, sectionsLocation, currentSectionIndex } = this.state;
        let { profile, roadmap, pathName, zoneName } = sectionsLocation;
        let { profileIndex, roadmapIndex, pathIndex, zoneIndex } = sectionsLocationIndex;
        lessonProgress = this.updateLessonProgressOnExerciseAndUpdateRoomIfRequired(lessonProgress, startTime, exerciseInput, sectionsLocationIndex, activeSectionIndex, exerciseIndex);

        let exerciseData = {
            "profile": profile,
            "roadmap": roadmap,
            "pathName": pathName,
            "zoneName": zoneName,
            "sectionIndex": activeSectionIndex - 1,
            "exerciseIndex": exerciseIndex - 1,
            "timeTaken": lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress[activeSectionIndex - 1].exercises[exerciseIndex - 1].endTime - startTime,
            "startTime": startTime
        }
        this.updateLessonProgress(lessonProgress, exerciseData);
        if (lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress[activeSectionIndex - 1].status && activeSectionIndex === currentSectionIndex) {
            activeSectionIndex++;
            currentSectionIndex++;
        }
        this.setState({
            lessonProgress: lessonProgress,
            activeSectionIndex: activeSectionIndex,
            currentSectionIndex: currentSectionIndex
        })
        // if (updateRoom)
        //     this.getRoomNo();
    }

    updateLessonProgressOnExerciseAndUpdateRoomIfRequired(lessonProgress, startTime, exerciseInput, sectionsLocationIndex, activeSectionIndex, exerciseIndex) {
        let updateRoom = false, isSectionComplete = true;
        let { profileIndex, roadmapIndex, pathIndex, zoneIndex } = sectionsLocationIndex;
        lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress[activeSectionIndex - 1].exercises[exerciseIndex - 1].status = true;
        lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress[activeSectionIndex - 1].exercises[exerciseIndex - 1].startTime = startTime;
        lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress[activeSectionIndex - 1].exercises[exerciseIndex - 1].endTime = Math.round(new Date().getTime() / 1000);
        lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress[activeSectionIndex - 1].exercises[exerciseIndex - 1].response.push(exerciseInput);
        for(let i=0; i < lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress[activeSectionIndex - 1].exercises.length; i++){
            if(!lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress[activeSectionIndex - 1].exercises[i].status)
            isSectionComplete = false
        }
        if (isSectionComplete) {
            lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress[activeSectionIndex - 1].status = true;
            if (lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].progress.length === activeSectionIndex) {
                lessonProgress[profileIndex].roadmaps[roadmapIndex].paths[pathIndex].progress[zoneIndex].status = true
            }
            else
                updateRoom = true;
        }
        return lessonProgress;
    }

    updateLessonProgress(lessonProgress, exerciseUpdate) {
        this.props.updateLessonProgress(lessonProgress);
        var lessonProgressDetails = JSON.stringify({
            "email": this.props.email,
            "lessonProgress": lessonProgress,
            "exerciseAnalytics": exerciseUpdate
        });
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: lessonProgressDetails,
            redirect: 'follow'
        };
        fetch(this.props.mainApis.updateLesson, requestOptions)
            .then(response => response.text())
            .then(response => {
                let result = JSON.parse(response);
                if (result.status !== 200) {
                    alert("Couldn't update progress to server");
                }
            })
            .catch(error => {
                alert("Couldn't update progress to server");
                console.log('error', error)
            });
    }

    render() {
        const { error, isLoaded, lessonProgress, sectionsJson, activeSectionIndex, sectionsLocation, sectionsLocationIndex, currentSectionIndex } = this.state;
        const { zoneName, helpApis, feedbackApis, email, userName, meetingLink } = this.props;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <Spinner id='appSpinner'>
                Loading...
            </Spinner>
        } else {
            let zoneProgress, moveToNextZone = [];
            zoneProgress = lessonProgress[sectionsLocationIndex.profileIndex].roadmaps[sectionsLocationIndex.roadmapIndex].paths[sectionsLocationIndex.pathIndex].progress[sectionsLocationIndex.zoneIndex].progress;
            // zoneProgress = lessonProgress.find(zone => zone.zoneName === zoneName).zoneProgress;
            // zoneIndex = lessonProgress.findIndex(zone => zone.zoneName === zoneName);
            // if (lessonProgress.find(zone => zone.zoneName === zoneName).status && zonesJson.length !== (zoneIndex + 1)) {
            //     moveToNextZone.push(
            //         <Card
            //             body
            //             className="text-center"
            //         >
            //             <CardTitle tag="h5">
            //                 Zone Completed
            //             </CardTitle>
            //             <CardText>
            //                 Congratulations on completing this zone, you can move to next zone by clicking on the button below.
            //             </CardText>
            //             <Link to={`/zone/${zonesJson[zoneIndex + 1].name}`}>
            //                 <Button color="primary">Go to Next Zone</Button>
            //             </Link>
            //         </Card>
            //     )
            // }
            return (
                <div key={zoneName} className="sections">
                    {/* <Link to={`/${sectionsLocation.profile}/${sectionsLocation.roadmap}/${sectionsLocation.pathName}`}><Button color="primary">Back to Home</Button></Link> */}
                    <Accordion open={activeSectionIndex} toggle={this.toggle}>
                        {zoneProgress.map((section, i) => {
                            return <AccordionItem key={i}>
                                <AccordionHeader targetId={i + 1}>
                                    {sectionsJson[i].desc}
                                </AccordionHeader>
                                {(section.status || currentSectionIndex === (i + 1)) && <AccordionBody accordionId={i + 1}>
                                <ZoneSection completeVideo={this.completeVideo} submitExercise={this.submitExercise} sectionProgress={section} sectionData={sectionsJson[i]} helpApis={helpApis} feedbackApis={feedbackApis} sectionsLocation={sectionsLocation} sectionIndex={i} email={email} userName={userName} sectionsLocationIndex={sectionsLocationIndex} meetingLink={meetingLink} goToActiveSection={this.goToActiveSection} />
                                </AccordionBody>}
                            </AccordionItem>;
                        })}
                    </Accordion>
                    {/* {moveToNextZone} */}
                </div>
            );
        }
    }
}

export default ZoneRoute;