import { Component } from "react";
import "./home.css";
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs"

class Profile extends Component {
    inConstruction() {
        alert("Method in construction");
    }
    render() {
        const { profile, profileProgress } = this.props;
        let segmentsGroup = [], profileIndex = 0;
        if (profileProgress) {
            while (profileIndex < profileProgress.length && profileProgress[profileIndex].status) {
                const rightArrow = [];

                if (profileIndex !== profile.roadmaps[0].path.length - 1)
                    rightArrow.push(<BsArrowRight className="rightArrow" />);
                if (profile.roadmaps[0].path[profileIndex].code && profile.roadmaps[0].path[profileIndex].file)
                    segmentsGroup.push(<div>
                        <Link to={`/${profile.code}/${profile.roadmaps[0].name}/${profile.roadmaps[0].path[profileIndex].code}`}><Button color="success">{profile.roadmaps[0].path[profileIndex].name}</Button></Link>
                        {rightArrow}
                    </div>);
                else
                    segmentsGroup.push(<div>
                        <Button color="success" onClick={this.inConstruction}>{profile.roadmaps[0].path[profileIndex].name}</Button>
                        {rightArrow}
                    </div>);
                profileIndex++;
            }
            if (profileIndex < profileProgress.length) {
                const rightArrow = [];
                if (profileIndex !== profile.roadmaps[0].path.length - 1)
                    rightArrow.push(<BsArrowRight className="rightArrow" />);
                if (profile.roadmaps[0].path[profileIndex].code && profile.roadmaps[0].path[profileIndex].file)
                    segmentsGroup.push(<div>
                        <Link to={`/${profile.code}/${profile.roadmaps[0].name}/${profile.roadmaps[0].path[profileIndex].code}`}><Button color="warning">{profile.roadmaps[0].path[profileIndex].name}</Button></Link>
                        {rightArrow}
                    </div>);
                else
                    segmentsGroup.push(<div>
                        <Button color="warning" onClick={this.inConstruction}>{profile.roadmaps[0].path[profileIndex].name}</Button>
                        {rightArrow}
                    </div>);
            }
            else {
                const rightArrow = [];

                if (profileIndex !== profile.roadmaps[0].path.length - 1)
                    rightArrow.push(<BsArrowRight className="rightArrow" />);
                if (profile.roadmaps[0].path[profileIndex].code && profile.roadmaps[0].path[profileIndex].file)
                    segmentsGroup.push(<div>
                        <Link to={`/${profile.code}/${profile.roadmaps[0].name}/${profile.roadmaps[0].path[profileIndex].code}`}><Button color="primary">{profile.roadmaps[0].path[profileIndex].name}</Button></Link>
                        {rightArrow}
                    </div>);
                else
                    segmentsGroup.push(<div>
                        <Button color="primary" onClick={this.inConstruction}>{profile.roadmaps[0].path[profileIndex].name}</Button>
                        {rightArrow}
                    </div>);
            }
            profileIndex++;

        }
        else if (profileIndex < profile.roadmaps[0].path.length) {
            const rightArrow = [];

            if (profileIndex !== profile.roadmaps[0].path.length - 1)
                rightArrow.push(<BsArrowRight className="rightArrow" />);
            if (profile.roadmaps[0].path[profileIndex].code && profile.roadmaps[0].path[profileIndex].file)
                segmentsGroup.push(<div>
                    <Link to={`/${profile.code}/${profile.roadmaps[0].name}/${profile.roadmaps[0].path[profileIndex].code}`}><Button color="primary">{profile.roadmaps[0].path[profileIndex].name}</Button></Link>
                    {rightArrow}
                </div>);
            else
                segmentsGroup.push(<div>
                    <Button color="primary" onClick={this.inConstruction}>{profile.roadmaps[0].path[profileIndex].name}</Button>
                    {rightArrow}
                </div>);
            profileIndex++;
        }
        for (let i = profileIndex; i < profile.roadmaps[0].path.length; i++) {
            const rightArrow = [];

            if (i !== profile.roadmaps[0].path.length - 1)
                rightArrow.push(<BsArrowRight className="rightArrow" />);

            segmentsGroup.push(<div>
                <Button color="danger" disabled>{profile.roadmaps[0].path[i].name}</Button>
                {rightArrow}
            </div>);
        }
        return (<div className="roadmap">
            <Card>
                <CardBody>
                    <CardTitle tag="h5">
                        {profile.name}
                    </CardTitle>
                    <CardSubtitle
                        className="mb-2 text-muted"
                        tag="h6"
                    >
                        {profile.desc}
                    </CardSubtitle>
                    <CardText>
                        Here is the roadmap:-
                    </CardText>
                    <div className="segments">
                        {segmentsGroup}
                    </div>
                </CardBody>
            </Card>
        </div>)
    }
}

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profiles: [],
            isLoaded: false,
            error: false
        }
    }
    componentDidMount() {
        fetch(process.env.PUBLIC_URL + "/data/profiles.json")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        profiles: result,
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
    render() {
        const { error, isLoaded, profiles } = this.state;
        const { lessonProgress } = this.props;
        let roadmapsHtml = [];
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            for (let i = 0; i < profiles.length; i++) {
                let profileProgress = lessonProgress.find(lesson => lesson.profileCode === profiles[i].code)?.roadmaps[0].paths;
                roadmapsHtml.push(<Profile profile={profiles[i]} profileProgress={profileProgress} />)
            }
            return (<div key={this.props.lessonProgress}>
                {roadmapsHtml}
            </div>
            )
        }
    }
}