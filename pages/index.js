import React, { Component } from 'react';

class StartPage extends Component {

    moveToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    submitForm() {
      let name, email, phone
      name = document.querySelector('#name').value
      email = document.querySelector('#email').value
      phone = document.querySelector('#phone').value
    //   if (this.state.emails.find(email => email === this.email.value)) {
    //     alert("Account with this email altready exists");
    //     return;
    // }
    // if (this.password.value !== this.confirmPassword.value) {
    //     alert("Passwords didn't match");
    //     return;
    // }
    let newUserData = JSON.stringify({
        "email": email,
        "name": name,
        "phone": Number(phone)
    });
      let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: newUserData,
            redirect: 'follow'
        };

        fetch('https://i6xoslx3bi.execute-api.ap-south-1.amazonaws.com/dev', requestOptions)
            .then(response => response.text())
            .then(response => {
                let result = JSON.parse(response);
                if (result.statusCode === 200) {
                    alert('success')
                }
            })
            .catch(error => {
                alert("Account Creation Failed");
                console.log('error', error)
            });
    } 

    render() {
        return (<div>
            <div className="mainpage" id='start_page'>
                <div id="title"><h1>Want to learn to Code?</h1></div>
                <div id="subtitle"><p>Learn to Code with Our Mentorship Programme</p></div>
                <div id="main">
                    {/* {window.screen.width < 768 && <SignUp signUpApis={this.props.signUpApis} getLessonProgressEmailAndUserName={this.props.getLessonProgressEmailAndUserName} />} */}
                    <div id="content">
                        <div id="content-head">What is this Programme About?</div>
                        <div id="content-info">
                            <p>In today's digital world content is available for free to learn any skill but you need guidance to learn a skill. So you can start learning coding with our Mentorship Programme</p>

                            <p>This programme will give you skills, so that you can work with us on live projects and be ready to earn.</p>

                            <p>Here's what you are going to get from this course:</p>
                            <ul>
                                <li>Daily Mentorship</li>
                                <li>One-on-one Guidance</li>
                                <li>Earn Cashbacks while learning</li>
                                <li>Learn while doing live projects</li>
                            </ul>
                        </div>
                    </div>
                    <div id="signup">
                        <div id="signupBody">
                            <div className="title">Join the waitlist now</div>
                            <input type="text" id="name" label="Your Name" required />
                            <input type="email" id="email" name="email" required />
                            <input type="phone" id="phone" name="phone" required />
                            <button onClick={this.submitForm}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}

export default StartPage;