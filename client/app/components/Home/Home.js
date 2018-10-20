import React, { Component } from 'react';
import 'whatwg-fetch';

import { setInStorage, getFromStorage } from '../../utils/storage';

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpEmail: '',
      signUpPassword: '',
    };

    this.onTextBoxChangeSignInEmail = this.onTextBoxChangeSignInEmail.bind(this);
    this.onTextBoxChangeSignInPassword = this.onTextBoxChangeSignInPassword.bind(this);
    this.onTextBoxChangeSignUpEmail = this.onTextBoxChangeSignUpEmail.bind(this);
    this.onTextBoxChangeSignUpPassword = this.onTextBoxChangeSignUpPassword.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.logout = this.logout.bind(this);
  }

  onTextBoxChangeSignInEmail(event){
    this.setState({ signInEmail: event.target.value });
  }

  onTextBoxChangeSignInPassword(event){
    this.setState({ signInPassword: event.target.value });
  }

  onTextBoxChangeSignUpEmail(event){
    this.setState({ signUpEmail: event.target.value });
  }

  onTextBoxChangeSignUpPassword(event){
    this.setState({ signUpPassword: event.target.value });
  }

  onSignUp(){
    const { signUpEmail, signUpPassword } = this.state;
    this.setState({ isLoading: true });

    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-type' : 'application/json'
      },
      body: JSON.stringify({
        email: signUpEmail,
        password: signUpPassword,
      }),
    }).then(res => res.json())
    .then(json => {
      console.log('json', json);
      if(json.success) {
        this.setState({
          signUpError: json.message,
          isLoading: false,
          signUpEmail: '',
          signUpPassword: '',
        });
      } else {
        this.setState({
          signUpError: json.message,
          isLoading: false,
        });
      }
    });
  }

  onSignIn(){
    const { signInEmail, signInPassword } = this.state;

    this.setState({ isLoading: true });

    fetch('/api/account/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: signInEmail, password: signInPassword })
    }).then(res => res.json())
    .then(json => {
      console.log('json', json);
      if(json.success){
        setInStorage('the_main_app', { token: json.token });
        this.setState({ signInError: json.message, isLoading: false, signInPassword: '', signInemail: '', token: json.token });
      } else {
        this.setState({
          signInError: json.message,
          isLoading: false
        });
      }
    });
  }

  logout(){
    this.setState({ isLoading: true });

    const obj = getFromStorage('the_main_app');
    if(obj && obj.token){
      const { token } = obj;
      fetch('/api/account/logout?token='+token)
      .then(res => res.json())
      .then(json => {
        if(json.success){
          this.setState({ token: '', isLoading: false });
        } else {
          this.setState({ isLoading: false });
        }
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  componentDidMount(){
    const obj = getFromStorage('the_main_app');
    if(obj && obj.token){
      const { token } = obj;

      fetch('/api/account/verify?token='+token)
      .then(res=> res.json())
      .then(json =>{
        if(json.success){
          this.setState({ token, isLoading: false });
        } else {
          this.setState({ isLoading: false });
        }
      });
    } else {
      this.setState({ isLoading: false });
    }
  }

  render(){
    const { isLoading, token, signInError, signInEmail, signInPassword, signUpEmail, signUpError, signUpPassword } = this.state;

    if(isLoading){
      return (<div><p>Loading . . .</p></div>);
    }

    if(!token){
      return (
        <div>
          <div>
            { signInError ? (<p>{signInError}</p>) : null }

            <p>Sign In</p>
            <input type="email" placeholder="Email" value={signInEmail} onChange={this.onTextBoxChangeSignInEmail}/>
            <br/>
            <input type="password" placeholder="****" value={signInPassword} onChange={this.onTextBoxChangeSignInPassword}/>
            <br/>
            <button onClick={this.onSignIn}>Sign In</button>
          </div>

          <br/>
          <br/>

          <div>
            { signUpError ? (<p>{signUpError}</p>) : null }

            <p>Sign Up</p>
            <input type="email" placeholder="Email" value={signUpEmail} onChange={this.onTextBoxChangeSignUpEmail}/>
            <br/>
            <input type="password" placholder="****" value={signUpPassword} onChange={this.onTextBoxChangeSignUpPassword}/>
            <br/>
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>
        </div>
      );
    }

    return(
      <div>
        <p>Account</p>
        <button onClick={this.logout} >Logout</button>
      </div>
    );
  }
}

export default Home;
