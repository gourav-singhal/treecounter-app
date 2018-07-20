import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { login } from '../../actions/authActions';
import { updateRoute } from '../../helpers/routerHelper';
import Login from '../../components/Authentication/Login/index';

class LoginContainer extends React.Component {
  onPress = () => {
    let result = this.refs.loginContainer.refs.loginForm.validate();
    console.log(result);
    let value = this.refs.loginContainer.refs.loginForm.getValue();
    if (value) {
      this.onClick(value);
    }
  };

  onClick(value) {
    this.props.login(value);
  }

  render() {
    return (
      <Login
        ref={'loginContainer'}
        onPress={this.onPress}
        updateRoute={(routeName, id) =>
          this.props.route(routeName, id, this.props.navigation)
        }
      />
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      login,
      route: (routeName, id, navigation) => dispatch =>
        updateRoute(routeName, navigation || dispatch, id)
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(LoginContainer);

LoginContainer.propTypes = {
  login: PropTypes.func,
  route: PropTypes.func,
  navigation: PropTypes.object.isRequired
};
