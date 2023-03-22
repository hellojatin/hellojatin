import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import "./signup.css";
import ReactGA from 'react-ga';

const NavigateToHome = ({ nav, role }) => {
    const navigate = useNavigate();

    if (nav) {
        navigate('/agile-sd/roadmap1/foundation/Zone-1');
    }

    return (
        <></>
    );
}

// import React, { useState } from 'react';
// import UserPool from "../UserPool";
// import { Form, FormGroup, Label, Input, Button } from "reactstrap";

// const SignUp = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const onSubmit = event => {
//         event.preventDefault();

//         UserPool.signUp(email, password, [], null, (err, data) => {
//             if (err) console.error(err);
//             console.log(data);
//         });
//     };

//     return (
//         <div id="signup">
//             <h1>Sign up to start your journey</h1>
//             <Form onSubmit={onSubmit}>
//                 <Input
//                     id="signupEmail"
//                     name="email"
//                     placeholder="Enter your email ID"
//                     type="email"
//                     value={email}
//                     onChange={event => setEmail(event.target.value)}
//                 />

//                 {/* <Input
//                     id="signupUserName"
//                     name="UserName"
//                     placeholder="Enter your User Name"
//                     type="text"
//                     innerRef={(input) => this.userName = input}
//                 /> */}
//                 <Input
//                     id="signupPassword"
//                     name="password"
//                     placeholder="Enter password"
//                     type="password"
//                     value={password}
//                     onChange={event => setPassword(event.target.value)}
//                 />
//                 {/* <Input
//                     id="signupConfirmPassword"
//                     name="confirmPassword"
//                     placeholder="Re-Enter your password"
//                     type="password"
//                     innerRef={(input) => this.confirmPassword = input}
//                 /> */}
//             <Button type="submit" color="primary">
//                 Create Your Account
//             </Button>
//             {/* <input
//                 value={email}
//                 onChange={event => setEmail(event.target.value)}
//             />

//             <input
//                 value={password}
//                 onChange={event => setPassword(event.target.value)}
//             />

//             <button type='submit'>Signup</button> */}
//         </Form>
//     </div >
//   );
// };

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emails: [],
            navigate: false
        }
        this.signUpAccount = this.signUpAccount.bind(this);
    }
    componentDidMount() {
        fetch(this.props.signUpApis.getEmails)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        emails: result
                    });
                }
            )
    }
    signUpAccount(event) {
        event.preventDefault();
        let isEmpty = this.checkEmptyValues();
        if (isEmpty)
            return;
        if (this.state.emails.find(email => email === this.email.value)) {
            alert("Account with this email altready exists");
            return;
        }
        if (this.password.value !== this.confirmPassword.value) {
            alert("Passwords didn't match");
            return;
        }
        var newUserData = JSON.stringify({
            "emailId": this.email.value,
            "name": this.userName.value,
            "password": this.password.value,
            "role": "Learner"
        });
        this.sendSignUpToServerAndReportToUser(newUserData, this.email.value, this.userName.value);
    }

    checkEmptyValues() {
        if (this.email.value.trim() === "") {
            alert("Please Enter your Email ID");
            return true;
        }
        if (this.userName.value.trim() === "") {
            alert("Please Enter your User Name");
            return true;
        }
        if (this.password.value.length < 8) {
            alert("Your password must contain atleast 8 characters");
            return true;
        }
        return false;
    }

    sendSignUpToServerAndReportToUser(dataToSend, email, userName) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: dataToSend,
            redirect: 'follow'
        };

        fetch(this.props.signUpApis.createUser, requestOptions)
            .then(response => response.text())
            .then(response => {
                let result = JSON.parse(response);
                if (result.statusCode === 200) {
                    const lessonProgress = [];
                    this.props.getLessonProgressEmailAndUserName(lessonProgress, email, userName);
                    ReactGA.event({
                        category: 'Start Page',
                        action: 'Sign Up'
                    });
                    this.setState({
                        navigate: true
                    })
                }
            })
            .catch(error => {
                alert("Account Creation Failed");
                console.log('error', error)
            });
    }

    render() {
        return (
            <div id="signup">
                <div id="signupBody">
                    <div className="title">Start your free course now:</div>
                    <Form onSubmit={this.signUpAccount}>
                        <Input
                            className="signUpInput"
                            id="signupEmail"
                            name="email"
                            placeholder="Enter your email ID"
                            type="email"
                            innerRef={(input) => this.email = input}
                        />
                        <Input
                            className="signUpInput"
                            id="signupUserName"
                            name="UserName"
                            placeholder="Enter your User Name"
                            type="text"
                            innerRef={(input) => this.userName = input}
                        />
                        <Input
                            className="signUpInput"
                            id="signupPassword"
                            name="password"
                            placeholder="Enter password"
                            type="password"
                            innerRef={(input) => this.password = input}
                        />
                        <Input
                            className="signUpInput"
                            id="signupConfirmPassword"
                            name="confirmPassword"
                            placeholder="Re-Enter your password"
                            type="password"
                            innerRef={(input) => this.confirmPassword = input}
                        />
                        <Button type="submit" color="primary">
                            Let's start your course
                        </Button>
                    </Form>
                </div>
                <NavigateToHome nav={this.state.navigate} />
            </div>
        )
    }
}

export default SignUp;