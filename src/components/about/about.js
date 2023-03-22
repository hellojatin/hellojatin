import React, { Component } from 'react';
import { Card, CardBody, CardImg, CardText, CardTitle } from 'reactstrap';
import './start-page.css';
import SignUp from "../signup/signup";
import Login from "../login/login";

class StepTile extends Component {
    render() {
        return (
            <Card className='stepTile'>
                <CardImg
                    alt="Card image cap"
                    src={this.props.imgSrc}
                    top
                    width="100%"
                />
                <CardBody>
                    <CardTitle tag="h5">
                        {this.props.title}
                    </CardTitle>
                    <CardText>
                        {this.props.content}
                    </CardText>
                </CardBody>
            </Card>);
    }
}

class FeatureTile extends Component {
    render() {
        let img = <img src={this.props.imgSrc} className={this.props.float} />
        let infoClass = this.props.float === "left" ? "right" : "left";
        let content = <div className={infoClass + " info"}>
            <h2 className="title">{this.props.title}</h2>
            <div className="content">{this.props.content}</div>
        </div>
        if (this.props.float === "left")
            return (
                <div className="featureTile">
                    {img}
                    {content}
                </div>
            )
        else
            return (
                <div className="featureTile">
                    {content}
                    {img}
                </div>
            )
    }
}

class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [
                {
                    placement: 'bottom',
                    title: 'Stuck Anywhere?',
                    body: "We're there to help you.",
                    imgSrc: process.env.PUBLIC_URL + "/images/start-page/profile.jpg",
                    text: 'Step 1'
                },
                {
                    placement: 'bottom',
                    title: 'Am I progressing in right direction?',
                    body: 'Seek guidance from Industry Experts',
                    imgSrc: process.env.PUBLIC_URL + "/images/start-page/guide.jpg",
                    text: 'Step 2'
                },
                {
                    placement: 'bottom',
                    title: 'Can I be an expert one Day?',
                    body: "You can't be expert of all but can be aware about all. We'll be there to help you become expert of what you like and to know what's happening around the tech world.",
                    imgSrc: process.env.PUBLIC_URL + "/images/start-page/roadmap.jpg",
                    text: 'Step 3'
                }

            ],
            features: [
                {
                    title: "Trust",
                    content: "Verified experienced guides taking learners through an effective roadmap. These roadmaps are crafted out of their own rich experience earned from the years of great work.",
                    imgSrc: process.env.PUBLIC_URL + "/images/start-page/trust.jpg",
                },
                {
                    title: "Focus",
                    content: "Learners are protected from confusion arising out of new technologies emerging all the time",
                    imgSrc: process.env.PUBLIC_URL + "/images/start-page/focus.jpg",
                },
                {
                    title: "Consistency",
                    content: "Along with learning at their own pace, learners are supported by learning groups, these groups interact regularly through conference calls. This helps in progressing faster, staying motivated, and embracing interpersonal skills that are critical to be effective in the complex domain of software development.",
                    imgSrc: process.env.PUBLIC_URL + "/images/start-page/persistence.jpg",
                },
                {
                    title: "Speed",
                    content: "AI powered support framework, that helps the learners move ahead when they get stuck, along with access to facilitators through conference calls",
                    imgSrc: process.env.PUBLIC_URL + "/images/start-page/speed.jpg",
                },
                {
                    title: "Growth",
                    content: "Possibility to work as a facilitator, that helps in improving the conceptual understanding, along with the growth in different soft skills like listening, communication and problem solving",
                    imgSrc: process.env.PUBLIC_URL + "/images/start-page/growth.jpg",
                },
                {
                    title: "Opportunity",
                    content: "Opportunity to build interesting solutions as a development partner, while being facilitated by industry experts. This helps in improving problem solving capabilities, strengthening personal brand, and it may also lead to employment opportunities, or may be starting their own business.",
                    imgSrc: process.env.PUBLIC_URL + "/images/start-page/opportunity.jpg",
                }
            ]
        };
    }
    render() {

        return (<div className="mainpage" id='start_page'>
            <h1>Anyone can become a software developer</h1>
            <p>Irrespective of age, prior education, existing profession, marital status etc.</p>
            <div id="steps">
                {this.state.steps.map((step, i) => {
                    return <StepTile key={i} title={step.title} id={i} content={step.body} imgSrc={step?.imgSrc} />;
                })}
            </div>
            <div id="signupLogin">
                <SignUp signUpApis={this.props.signUpApis} getLessonProgressEmailAndUserName={this.props.getLessonProgressEmailAndUserName} />
                <Login loginApis={this.props.loginApis} getLessonProgressEmailAndUserName={this.props.getLessonProgressEmailAndUserName} />
            </div>
            <div>
                {this.state.features.map((feature, i) => {
                    return <FeatureTile key={i} title={feature.title} content={feature.content} imgSrc={feature.imgSrc} float={i % 2 === 0 ? "left" : "right"} />
                })}
            </div>
            <div className="footer">
                <section class="call-to-action text-white text-center" id="contactus">
                    <div class="contact-info container position-relative" id="contactinfo">
                        <div class="section-overlay-layer">
                            <div class="container">
                                <div class="row contact-links">

                                    <div class="col-sm-4 contact-link-box col-xs-12">
                                        <div class="icon-container"><span class="icon-basic-mail colored-text"></span></div>
                                        <a href="mailto:sakhilearn@gmail.com" class="strong">sakhilearn@gmail.com</a>
                                    </div>

                                    <div class="col-sm-4 contact-link-box col-xs-12">
                                        <div class="icon-container"><span class="icon-basic-geolocalize-01 colored-text"></span></div>
                                        <a href="https://www.google.com/maps/place/SG+Beta+Tower/@28.667001,77.3814773,17z/data=!3m1!4b1!4m5!3m4!1s0x390cf0740ec8d2cf:0x5ef5cff2a183e57!8m2!3d28.6670086!4d77.3836584" class="strong">
                                            21, SG Beta Tower, Secor 3, Vasundhara, Ghaziabad, UP, India 201012 </a>
                                    </div>

                                    <div class="col-sm-4 contact-link-box col-xs-12">
                                        <div class="icon-container"><span class="icon-social-twitter colored-text"></span></div>
                                        <a href="https://twitter.com/sakhilearn" class="strong">@sakhilearn</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>)
    }
}

export default About;