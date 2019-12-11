import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Redemption from '../../components/Redemption/index';
import { currentUserProfileSelector } from '../../selectors';
import { updateRoute } from '../../helpers/routerHelper';
import {
  validateCodeAction,
  setRedemptionCodeAction
} from '../../actions/redemptionAction';
import i18n from '../../locales/i18n.js';

function RedemptionContainer(props) {
  return (
    <Redemption
      navigation={props.navigation}
      validateCodeAction={validateCodeAction}
      setRedemptionCode={setRedemptionCodeAction}
    />
  );
}

RedemptionContainer.navigationOptions = {
  header: null
};

const mapStateToProps = state => {
  return {
    userProfile: currentUserProfileSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      route: (routeName, id, params, navigation) => dispatch =>
        updateRoute(routeName, navigation || dispatch, id, params)
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(
  RedemptionContainer
);

RedemptionContainer.propTypes = {
  match: PropTypes.object,
  route: PropTypes.func,
  userProfile: PropTypes.object,
  setRedemptionCode: PropTypes.func,
  setAccessDenied: PropTypes.func,
  navigation: PropTypes.any,
  location: PropTypes.object
};
