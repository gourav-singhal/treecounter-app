import React from 'react';
import PropTypes from 'prop-types';

import i18n from '../../locales/i18n';
import { loadProject } from '../../actions/loadTposAction';
import { queryParamsToObject } from '../../helpers/utils';
import { SafeAreaView, View, Text } from 'react-native';
import styles from '../../styles/selectplantproject/selectplantproject-full';
import PlantProjectDetails from './PlantProjectDetails';
import FullHeightButton from '../Common/Button/FullHeightButton';
import { ScrollView } from 'react-native';
import { right_arrow_button } from '../../assets';
import PlantProjectSnippetDetails from './PlantProjectSnippetDetails.native';
import scrollStyle from '../../styles/common/scrollStyle.native';
import { connect } from 'react-redux';
import LoadingIndicator from '../Common/LoadingIndicator.native';
import { bindActionCreators } from 'redux';
import NumberFormat from '../Common/NumberFormat.native';
// import TabContainer from '../../containers/Menu/TabContainer';
/**
 * see: https://github.com/Plant-for-the-Planet-org/treecounter-platform/wiki/Component-PlantProjectFull
 */
class PlantProjectFull extends React.Component {
  async componentWillReceiveProps(nextProps) {
    try {
      console.log('plantproject while receive props', nextProps.plantProject);
      if (nextProps.plantProject && !nextProps.plantProject.tpoData) {
        // we dont have the details in store, fetch it
        const plantProject = await this.props.loadProject(
          nextProps.plantProject,
          {}
        );
        console.log('fetched details plantproject in full', plantProject);
        // this.setState({ plantProject });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async componentDidMount() {
    try {
      console.log('plantproject while did mount', this.props.plantProject);
      if (this.props.plantProject && !this.props.plantProject.tpoData) {
        // we dont have the details in store, fetch it
        const plantProject = await this.props.loadProject(
          this.props.plantProject,
          {}
        );
        console.log('fetched details plantproject in full', plantProject);
        // this.setState({ plantProject });
      }
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    let { plantProject } = this.props;

    if (!plantProject || !plantProject.tpoData) return <LoadingIndicator />;
    console.log('rendering with project:', plantProject);
    const {
      images,
      description,
      homepageUrl: homepageUrl,
      homepageCaption: homepageCaption,
      videoUrl: videoUrl,
      geoLocation,
      plantProjectImages,
      url,
      linkText,
      tpoName,
      ndviUid
    } = plantProject;
    let tpo = plantProject.tpoData || {};
    const detailsProps = {
      description,
      images,
      homepageUrl,
      homepageCaption,
      videoUrl,
      mapData: queryParamsToObject(geoLocation),
      plantProjectImages,
      url,
      linkText,
      ndviUid,
      tpo
    };

    const navigation = this.props.navigation;
    const backgroundColor = 'white';

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[
            scrollStyle.styleContainer,
            {
              backgroundColor: backgroundColor
            }
          ]}
        >
          <PlantProjectSnippetDetails
            key={'projectFull' + plantProject.id}
            showMoreButton={false}
            clickable={false}
            plantProject={plantProject}
            onSelectClickedFeaturedProjects={id => this.props.selectProject(id)}
            tpoName={tpoName}
            selectProject={this.props.selectProject}
            navigation={navigation}
          />

          {/* <View style={styles.horizontalRule} /> */}
          <View style={styles.plantProjectDetails}>
            <PlantProjectDetails
              currentUserProfile={this.props.currentUserProfile}
              navigation={navigation}
              {...detailsProps}
            />
          </View>
        </ScrollView>
        {plantProject.allowDonations ? (
          <View style={styles.bottomActionArea}>
            <View style={styles.centeredContentContainer}>
              <View>
                <Text style={[styles.cost]}>
                  {/* {formatNumber(
                    plantProject.treeCost,
                    null,
                    plantProject.currency
                  )} */}
                  <NumberFormat
                    data={plantProject.treeCost}
                    currency={plantProject.currency}
                  />
                </Text>
              </View>

              <Text style={[styles.costPerTree]}>
                {i18n.t('label.cost_per_tree')}
              </Text>
            </View>
            <FullHeightButton
              buttonStyle={styles.squareButton}
              onClick={() => this.props.selectProject(plantProject.id)}
              image={right_arrow_button}
            >
              {i18n.t('label.donate')}
            </FullHeightButton>
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}

PlantProjectFull.propTypes = {
  plantProject: PropTypes.object.isRequired,
  projectClear: PropTypes.func,
  showNextButton: PropTypes.bool,
  onNextClick: PropTypes.func,
  selectProject: PropTypes.func,
  onBackClick: PropTypes.func
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      loadProject
    },
    dispatch
  );
};
export default connect(null, mapDispatchToProps)(PlantProjectFull);
