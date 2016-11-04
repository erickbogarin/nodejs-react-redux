import React from 'react'
import timezones from '../../data/timezones';
import map from 'lodash/map';
import classnames from 'classnames';

import TextFieldGroup from '../common/TextFieldGroup';
import validateInput from '../../../server/shared/validations/signup';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      timezone: '',
      errors: {},
      isLoading: false
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    const { errors } = this.state;
    const options = map(timezones, (val, key) =>
      <option key={val} value={val}x>{key}</option>
    );
    return (
      <form onSubmit={this.onSubmit}>
        <h1>Join our community!</h1>

        <TextFieldGroup
          error={errors.username}
          value={this.state.username}
          field="username"
          onChange={this.onChange}
          label="Username"
        />

        <TextFieldGroup
          error={errors.email}
          value={this.state.email}
          field="email"
          onChange={this.onChange}
          label="Email"
        />

        <TextFieldGroup
          error={errors.password}
          value={this.state.password}
          field="password"
          onChange={this.onChange}
          label="Password"
          type="password"
        />

        <TextFieldGroup
          error={errors.passwordConfirmation}
          value={this.state.passwordConfirmation}
          field="passwordConfirmation"
          onChange={this.onChange}
          label="Password Confirmation"
          type="password"
        />
        <div className={classnames("form-group", { 'has-error': errors.timezone })}>
          <label className="control-label">Timezone</label>
          <select
            value={this.state.timezone}
            onChange={this.onChange}
            name="timezone"
            className="form-control"
          >
            <option value="" disabled>Choose Your Timezone</option>
            {options}
          </select>
          {errors.timezone && <span className="help-block">{errors.timezone}</span>}
        </div>

        <div className="form-group">
          <button disabled={ this.state.isLoading } className="btn btn-primary btn-lg">
            Sign up
          </button>
        </div>
      </form>
    );
  }

  onChange(e) {
    this.setState({ [e.target.name] : e.target.value });
  }

  isValid() {
    const { errors, isValid } = validateInput(this.state);

    if (!isValid) {
      this.setState({ errors });
    }

    return isValid;
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true });
      this.props.userSignupRequest(this.state).then(
        () => {
          this.context.router.push('/');
        },
        ({ data }) => this.setState({ errors: data, isLoading: false })
      );
    }
  }

}

SignupForm.propTypes = {
  userSignupRequest: React.PropTypes.func.isRequired
}

SignupForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default SignupForm;
