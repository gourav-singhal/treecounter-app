import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Text } from 'react-native';
import SupportButton from './SupportButton';
import TreecounterHeader from './TreecounterHeader';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import SvgContainer from '../Common/SvgContainer';
import CardLayout from '../Common/Card';
import stylesHome from '../../styles/user-home';
import stylesPublicPage from '../../styles/public-page';

import {
  getProfileTypeName,
  isMyself,
  isUserFollower,
  amISupporting
} from './utils';

class PublicTreeCounter extends React.Component {
  constructor(props) {
    super(props);

    this.onFollowChanged = this.onFollowChanged.bind(this);
    this.onPlantProjectSelected = this.onPlantProjectSelected.bind(this);
    this.onRegisterSupporter = this.onRegisterSupporter.bind(this);
    this.state = {
      svgData: {}
    };
  }

  //------------------------------------------------------------------------------------------------------------
  // ACTION METHODS
  //------------------------------------------------------------------------------------------------------------
  onFollowChanged() {
    if (null !== this.props.currentUserProfile) {
      isUserFollower(this.props.treecounter, this.props.currentUserProfile)
        ? this.props.unfollowSubscribeAction(this.props.treecounter.id)
        : this.props.followSubscribeAction(this.props.treecounter.id);
    } else {
      this.props.route('app_login');
    }
  }

  onPlantProjectSelected(selectedPlantProjectId) {
    this.props.selectPlantProjectIdAction(selectedPlantProjectId);
    this.props.route('app_donateTrees');
  }

  onRegisterSupporter() {
    this.props.supportTreecounterAction(this.props.treecounter);
    this.props.route('app_donateTrees');
  }

  componentWillReceiveProps(nextProps) {
    const treecounter = nextProps.treecounter;
    if (treecounter) {
      let svgData = {
        id: treecounter.id,
        target: treecounter.countTarget,
        planted: treecounter.countPlanted,
        community: treecounter.countCommunity,
        personal: treecounter.countPersonal,
        targetComment: treecounter.targetComment,
        targetYear: treecounter.targetYear,
        type: treecounter.userProfile.type
      };
      this.setState({ svgData });
    }
  }
  render() {
    const { treecounter, currentUserProfile } = this.props;
    if (null === treecounter) {
      return <LoadingIndicator />;
    }

    const { userProfile, displayName: caption } = treecounter;
    const { type: profileType, image: logo } = userProfile;
    const isUserFollowerBool = isUserFollower(treecounter, currentUserProfile);
    const isUserLoggedIn = null !== currentUserProfile;
    const showFollow = !isMyself(treecounter, currentUserProfile);

    const supportProps = {
      active: !amISupporting(treecounter, currentUserProfile),
      isUserLoggedIn,
      caption
    };
    const headerProps = {
      caption,
      profileType: getProfileTypeName(profileType),
      logo,
      isUserFollowerBool,
      isUserLoggedIn,
      showFollow
    };
    const tpoProps = {
      plantProjects: userProfile.plantProjects,
      defaultPlantProjectId: null,
      tpoName: caption
    };

    return (
      <ScrollView>
        <View style={stylesPublicPage.header}>
          <TreecounterHeader
            {...headerProps}
            followChanged={this.onFollowChanged}
          />
          {'tpo' !== userProfile.type &&
            !isMyself(treecounter, currentUserProfile) && (
              <SupportButton
                {...supportProps}
                onRegisterSupporter={this.onRegisterSupporter}
              />
            )}
        </View>
        <View style={stylesHome.svgContainer}>
          <SvgContainer {...this.state.svgData} />
        </View>
        <View>
          {'tpo' === userProfile.type &&
          1 <= tpoProps.plantProjects.length ? null : userProfile.synopsis1 || // /> //   onSelect={this.onPlantProjectSelected} //   {...tpoProps} // <TpoDonationPlantProjectSelector
          userProfile.synopsis2 ? (
            <CardLayout>
              <Text style={stylesHome.footerText}>{userProfile.synopsis1}</Text>
            </CardLayout>
          ) : null}
        </View>
      </ScrollView>
    );
  }
}

PublicTreeCounter.propTypes = {
  treecounter: PropTypes.object,
  currentUserProfile: PropTypes.object,
  followSubscribeAction: PropTypes.func,
  unfollowSubscribeAction: PropTypes.func,
  selectPlantProjectIdAction: PropTypes.func,
  supportTreecounterAction: PropTypes.func,
  route: PropTypes.func
};

export default PublicTreeCounter;