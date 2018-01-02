import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import { updateObject, checkValidity } from '../../shared/utility';
import * as actions from '../../store/actions/index';

class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Mail Address'
        },
        value: '',
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false
      }
    },
    isSignup: true
  }

  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath('/');
    }
  }

  inputChangedHandler = (e, controlName) => {
    const updatedControls = updateObject(this.state.controls, {
      [controlName]: updateObject(this.state.controls[controlName], {
        value: e.target.value,
        valid: checkValidity(e.target.value, this.state.controls[controlName].validation),
        touched: true
      })
    });

    this.setState({ controls: updatedControls });
  }

  submitHandler = (e) => {
    e.preventDefault();

    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return {
        isSignup: !prevState.isSignup
      };
    });
  }

  render() {
    const formElements = [];

    for (let key in this.state.controls) {
      formElements.push({
        id: key,
        config: this.state.controls[key]
      })
    }

    let form = formElements.map(formElement => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        changed={(e) => this.inputChangedHandler(e, formElement.id)}
        shouldValidate={formElement.config.validation}
        invalid={!formElement.config.valid}
        touched={formElement.config.touched} />
    ));

    if (this.props.loading) {
      form = <Spinner />;
    }

    const errorMessage = this.props.error ? <p>{this.props.error.message}</p> : null;
    const authRedirect = this.props.isAuth ? <Redirect to={this.props.authRedirectPath} /> : null;

    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {form}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button
          btnType="Danger"
          clicked={this.switchAuthModeHandler}
        >SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuth: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);