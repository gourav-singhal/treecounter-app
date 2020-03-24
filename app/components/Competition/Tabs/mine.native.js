/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  Dimensions
} from 'react-native';
import styles from '../../../styles/competition/competition-master.native';
import CompetitionSnippet from '../CompetitionSnippet.native';
import PropTypes from 'prop-types';
import { trees, empty } from './../../../assets';
import i18n from '../../../locales/i18n';
import ContentLoader from 'react-native-content-loader';
import { Rect } from 'react-native-svg';
import colors from '../../../utils/constants';
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const MineCompetitions = props => {
  const [showAllCompetitions, setShowAllCompetitions] = useState([]);
  const [refreshing, setrefreshing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const onRefresh = () => {
    setrefreshing(true);
    props
      .fetchMineCompetitions()
      .then(() => {
        setrefreshing(false);
      })
      .catch(() => {
        setrefreshing(false);
      });
  };

  const CompetitionLoader = () => (
    <ContentLoader
      height={HEIGHT}
      width={WIDTH}
      speed={2}
      primaryColor="#f3f3f3"
      secondaryColor="#ecebeb"
    >
      <Rect x="30" y="3" rx="10" ry="10" width="85%" height="180" />
      <Rect x="30" y="190" rx="10" ry="10" width="35%" height="20" />
      <Rect x="30" y="215" rx="10" ry="10" width="85%" height="20" />
      <Rect x="30" y="240" rx="10" ry="10" width="75%" height="20" />
      <Rect x="30" y="270" rx="10" ry="10" width="85%" height="180" />
      <Rect x="30" y="460" rx="10" ry="10" width="35%" height="20" />
      <Rect x="30" y="490" rx="10" ry="10" width="85%" height="20" />
      <Rect x="30" y="520" rx="10" ry="10" width="75%" height="20" />
    </ContentLoader>
  );

  const getAllCompetitions = () => {
    props.fetchMineCompetitions();
  };

  useEffect(() => {
    if (props.allCompetitions.length < 1) {
      getAllCompetitions();
    }
    let showAllCompetitionsArr = [];

    if (props.allCompetitions.length > 0) {
      props.allCompetitions.forEach(val => {
        if (val.category === 'mine') {
          val.competitions.forEach(comp => {
            showAllCompetitionsArr.push(comp);
          });
        }
      });
    }
    setShowAllCompetitions(showAllCompetitions =>
      showAllCompetitions.concat(showAllCompetitionsArr)
    );
    setLoading(false);
  }, [props.allCompetitions]);

  const _keyExtractor = item => item.id.toString();
  const _renderItem = ({ item }) => (
    <CompetitionSnippet
      key={'competition' + item.id}
      cardStyle={styles.cardStyle}
      onMoreClick={id => props.onMoreClick(id, item.name)}
      leaveCompetition={id => props.leaveCompetition(id)}
      enrollCompetition={id => props.enrollCompetition(id)}
      editCompetition={props.editCompetition}
      competition={item}
      type="mine"
    />
  );

  const EmptyContainer = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 64 }}>
        <Image source={empty} style={{ height: 186, width: 240, alignSelf: 'center', opacity: 0.7 }} />
        <Text style={[styles.headerTitle, { marginTop: 12 }]}> {i18n.t('label.no_competitions')}</Text>
      </View>
    )
  }
  return (
    <FlatList
      data={showAllCompetitions}
      keyExtractor={item => _keyExtractor(item)}
      renderItem={item => _renderItem(item)}
      onRefresh={() => onRefresh()}
      refreshing={refreshing}
      ListEmptyComponent={() => EmptyContainer()}
      style={{ paddingBottom: 60, backgroundColor: colors.WHITE }}
      ListHeaderComponent={() => {
        return (
          <View style={styles.headerView}>
            <Text style={styles.headerTitle}>
              {showAllCompetitions.length > 0
                ? i18n.t('label.mine_compeition_tab_header')
                : i18n.t('label.mine_compeition_tab_header_null')}
            </Text>
            <Image
              source={trees}
              style={{ height: 60, flex: 1 }}
              resizeMode="contain"
            />
          </View>
        );
      }}
      ListFooterComponent={() => {
        return isLoading ? CompetitionLoader() : null;
      }}
    />
  );
};

export default MineCompetitions;

MineCompetitions.propTypes = {
  allCompetitions: PropTypes.any,
  onMoreClick: PropTypes.any,
  leaveCompetition: PropTypes.any,
  enrollCompetition: PropTypes.any,
  onCreateCompetition: PropTypes.any,
  editCompetition: PropTypes.any
};
