import React, { Component, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { Form, Input, Button } from "reactstrap";
import ReactGA from "react-ga";

const Login = (props) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    const handleLogin = (e) => {
        e.preventDefault();
        ReactGA.event({
            category: 'Start Page',
            action: 'Login'
        });
        fetch(`${props.loginApis.loginUser}?email=${email.trim()}&password=${password}`)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.authorized) {
                        props.getLessonProgressEmailAndUserName(result.lessonProgress, email.trim(), result.name);
                        if (result.role === "Learner")
                            navigate('/agile-sd/roadmap1/foundation/Zone-1');
                        else if (result.role === "Facilitator")
                            navigate('/facilitator');

                    }
                    else
                        alert("Incorrect email or password");
                }
            )
    }
    return (
        <div id="login">
            <Form id="loginForm" onSubmit={handleLogin}>
                <Input
                    className="loginElement"
                    placeholder="Enter your email ID"
                    name="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <Input
                    className="loginElement"
                    placeholder="Enter password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <Button className="loginElement" id="loginAction" type="submit" color="primary">
                    Login
                </Button>
            </Form>
        </div>
    );
}

export default Login;