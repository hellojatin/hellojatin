import React, { Component } from "react";
import "./main.css";
import { Carousel, CarouselControl, CarouselIndicators, CarouselItem } from "reactstrap";
import Zone from "./zone/zone";
import { useParams } from "react-router-dom";

const MainRoute = (props) => {
    const params = useParams();
    const profile = params.profile, roadmap = params.roadmap, pathName = params.pathName;

    return (<Main lessonProgress={props.lessonProgress} profile={profile} roadmap={roadmap} pathName={pathName} />);
}

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewZoneIndex: 0,
            zoneAnimating: false,
            path: [],
            isLoaded: false,
            error: false,
            pathProgress: []
        }
        this.setViewZoneIndex = this.setViewZoneIndex.bind(this);
        this.setZoneAnimating = this.setZoneAnimating.bind(this);
        this.previousButton = this.previousButton.bind(this);
        this.nextButton = this.nextButton.bind(this);
    }

    componentDidMount() {
        const roadmaps = this.props.lessonProgress.find(profile => profile.profileCode === this.props.profile)?.roadmaps;
        const roadmapProgress = roadmaps?.find(roadmap => roadmap.name === this.props.roadmap)?.paths;
        const pathProgress = roadmapProgress?.find(path => path.code === this.props.pathName)?.progress;
        if (pathProgress) {
            let zoneIndex = pathProgress.length;
            if (!pathProgress[zoneIndex - 1].status)
                zoneIndex--;
            this.setState({
                viewZoneIndex: zoneIndex,
                pathProgress: pathProgress
            })
        }
        fetch(`${process.env.PUBLIC_URL}/data/profiles/${this.props.profile}/${this.props.roadmap}/${this.props.pathName}.json`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        path: result,
                        isLoaded: true
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    setViewZoneIndex(index) {
        this.setState({
            viewZoneIndex: index
        })
    }

    setZoneAnimating(animating) {
        this.setState({
            zoneAnimating: animating
        })
    }

    previousButton() {
        if (this.state.zoneAnimating) return;
        const previousZoneIndex = this.state.viewZoneIndex === 0 ? this.state.path.zones.length - 1 : this.state.viewZoneIndex - 1;
        this.setViewZoneIndex(previousZoneIndex);
    }

    nextButton() {
        if (this.state.zoneAnimating) return;
        const nextZoneIndex = this.state.viewZoneIndex === this.state.path.zones.length - 1 ? 0 : this.state.viewZoneIndex + 1;
        this.setViewZoneIndex(nextZoneIndex);
    }

    render() {
        const { profile, roadmap, pathName } = this.props;
        const { error, isLoaded, viewZoneIndex, zoneAnimating, path, pathProgress } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            let zonesJson = path.zones, zonesHtml = [];
            for (let i = 0; i < zonesJson.length; i++) {
                let status, resumeZone=false;
                if(pathProgress.length!==0){
                    if(!pathProgress[pathProgress.length-1].status)
                    resumeZone=true;
                }
                if(i<pathProgress.length-1 || (i<pathProgress.length && !resumeZone))
                status="completed";
                else if(i<pathProgress.length && resumeZone)
                status="inprogress";
                else if(i===pathProgress.length && !resumeZone)
                status="start";
                else
                status="locked";
                zonesHtml.push(<CarouselItem
                    className="zone"
                    onExited={() => this.setZoneAnimating(false)}
                    onExiting={() => this.setZoneAnimating(true)}
                >
                    <Zone profile={profile} roadmap={roadmap} pathName={pathName} zoneData={zonesJson[i]} status={status} />
                </CarouselItem>)
            }
            return (<div id="home">
                <div className="zones">
                    <Carousel
                        activeIndex={viewZoneIndex}
                        next={this.nextButton}
                        previous={this.previousButton}
                        interval={false}
                    >
                        <CarouselIndicators
                            activeIndex={viewZoneIndex}
                            items={zonesJson}
                            onClickHandler={(newIndex) => {
                                if (zoneAnimating) return;
                                this.setViewZoneIndex(newIndex);
                            }}
                        />
                        {zonesHtml}
                        <CarouselControl
                            direction="prev"
                            directionText="Previous"
                            onClickHandler={this.previousButton}
                        />
                        <CarouselControl
                            direction="next"
                            directionText="Next"
                            onClickHandler={this.nextButton}
                        />
                    </Carousel>
                </div>
                <div id="segmentInfo">
                    <div id="infoText" dangerouslySetInnerHTML={{ __html: path.introduction.content }}></div>
                    <video id="infoVideo" controls>
                        <source src={path.introduction.video} type="video/mp4" />
                        Your browser doesn't support HTML video
                    </video>
                </div>
            </div>
            );
        }
    }
}

export default MainRoute;