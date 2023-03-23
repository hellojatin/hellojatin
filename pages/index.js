import React, { Component } from 'react';

class StartPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            phone: '',
            success: false
        }
    }

    moveToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    validateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        alert("You have entered an invalid email address!")
        return (false)
    }

    submitForm = () => {
        let name, email, phone
        name = this.state.name.trim()
        email = this.state.email.trim()
        phone = this.state.phone.trim()

        if (name == "") {
            alert('plese enter your name')
            return
        }

        if (!this.validateEmail(email))
            return

        if (phone == "") {
            alert('plese enter your Mobile Number')
            return
        }
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
                    this.setState({ 
                        success: true,
                        name: '',
                        email: '',
                        phone: '' 
                    })
                    setTimeout(() => { this.setState({ success: false }) }, 5000)
                }
            })
            .catch(error => {
                alert("Account Creation Failed");
                console.log('error', error)
            });
    }

    handleName = (e) => {
        this.setState({ name: e.target.value })
    }

    handleEmail = (e) => {
        this.setState({ email: e.target.value })
    }

    handlePhone = (e) => {
        this.setState({ phone: e.target.value })
    }

    render() {
        return (<div>
            {this.state.success ? <div className="mainpage" id='start_page'> <div id="title"><h1>Congratulations, registeration succesful</h1></div> </div> : <div className="mainpage" id='start_page'>
                <div id="title"><h1>Want to learn to code?</h1></div>
                <div id="subtitle"><p>Learn to Code with Our Mentorship Programme</p></div>
                <div id="main">
                    <div id="signup-mobile">
                        <div id="signupBody">
                            <div className="title">Join the waitlist now</div>
                            <div className='add-form'>
                                <input type="text" name='name' placeholder="Your Name" value={this.state.name} onChange={this.handleName} />
                                <input type="email" name='email' placeholder='Enter your Email' value={this.state.email} onChange={this.handleEmail} />
                                <input type="phone" name='phone' placeholder='Enter your Mobile Number' value={this.state.phone} onChange={this.handlePhone} />
                                <button onClick={this.submitForm}>Submit</button>
                            </div>
                        </div>
                    </div>
                    <div id="content">
                        <div id="content-head">What is this Programme About?</div>
                        <div id="content-info">
                            <p>In today's digital world content is available for free to learn any skill but you need guidance to learn a skill. So you can start learning coding with our Mentorship Programme</p>

                            <p>This programme will give you skills, so that you can work with us on live projects and be ready to earn.</p>

                            <p>Here's what you are going to get from this course:</p>
                            <ul>
                                <li>Daily Mentorship</li>
                                <li>One-on-one Guidance</li>
                                <li>Earn CashRewards while learning</li>
                                <li>Learn while doing live projects</li>
                            </ul>
                        </div>
                    </div>
                    <div id="signup">
                        <div id="signupBody">
                            <div className="title">Join the waitlist now</div>
                            <div className='add-form'>
                                <input type="text" name='name' placeholder="Your Name" value={this.state.name} onChange={this.handleName} />
                                <input type="email" name='email' placeholder='Enter your Email' value={this.state.email} onChange={this.handleEmail} />
                                <input type="phone" name='phone' placeholder='Enter your Mobile Number' value={this.state.phone} onChange={this.handlePhone} />
                                <button onClick={this.submitForm}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>)
    }
}

export default StartPage;