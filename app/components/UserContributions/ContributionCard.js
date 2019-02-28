import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';
import Lightbox from 'react-images';
import { Link } from 'react-router-dom';

import { getImageUrl, getLocalRoute } from '../../actions/apiRouting';
import TextSpan from '../Common/Text/TextSpan';
import i18n from '../../locales/i18n.js';
import { updateRoute } from '../../helpers/routerHelper';

export default class ContributionCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lightboxIsOpen: false,
      currentImage: 0,
      viewExpanded: false
    };
  }

  closeLightbox = () => this.setState({ lightboxIsOpen: false });

  openLightbox = () => this.setState({ lightboxIsOpen: true });

  gotoPrevious = () =>
    this.setState({
      currentImage: this.state.currentImage - 1
    });
  gotoNext = () =>
    this.setState({
      currentImage: this.state.currentImage + 1
    });

  onViewExpanded = () =>
    this.setState({
      viewExpanded: !this.state.viewExpanded
    });
  treeCountLine(treeCount, treeSpecies) {
    return treeCount + ' ' + (treeSpecies ? treeSpecies : '');
  }

  plantProjectLine(plantProjectName, country) {
    return (plantProjectName ? plantProjectName + ', ' : '') + country;
  }

  donateActionLine(isGift, plantDate, givee, giveeSlug) {
    return isGift
      ? [
          <TextSpan>{'Gifted on ' + plantDate + ' to '}</TextSpan>,
          <TextSpan
            onPress={() =>
              updateRoute(getLocalRoute('app_treecounter'), {
                treeCounterId: giveeSlug
              })
            }
          >
            {givee}
          </TextSpan>
        ]
      : 'Donated on ' + plantDate;
  }

  tpoLine(tpoName) {
    return tpoName ? 'Planted by ' + tpoName : '';
  }

  plantActionLine(plantDate, registrationDate) {
    return 'Planted on ' + plantDate + ', Added on ' + registrationDate;
  }

  dedicateActionLine = (isGift, givee, giveeSlug) => {
    return isGift
      ? [
          <TextSpan>Dedicated to</TextSpan>,
          <TextSpan
            onPress={() =>
              updateRoute(getLocalRoute('app_treecounter'), {
                treeCounterId: giveeSlug
              })
            }
          >
            {' ' + givee}
          </TextSpan>
        ]
      : '';
  };

  redeemActionLine(redemptionCode, redemptionDate, givee, giveeSlug) {
    return redemptionCode && giver
      ? [
          <TextSpan>{'Given on ' + redemptionDate + ' by '}</TextSpan>,
          <TextSpan
            onPress={() =>
              updateRoute(getLocalRoute('app_treecounter'), {
                treeCounterId: giveeSlug
              })
            }
          >
            {givee}
          </TextSpan>
        ]
      : redemptionCode
        ? 'Redeemed on ' + redemptionDate
        : 'Dedicated on ' +
          redemptionDate +
          (givee
            ? [
                <TextSpan>{' by '}</TextSpan>,
                <TextSpan
                  onPress={() =>
                    updateRoute(getLocalRoute('app_treecounter'), {
                      treeCounterId: giveeSlug
                    })
                  }
                >
                  {givee}
                </TextSpan>
              ]
            : '');
  }
  render() {
    let { contribution } = this.props;
    let imagesArray =
      contribution.category === 'contributions'
        ? contribution.contributionImages.map(image => {
            return { src: getImageUrl('contribution', 'medium', image.image) };
          })
        : '';
    let seeLabel = classnames('see-more-label-style', {
      'see-more__active': this.state.viewExpanded
    });
    let {
      treeCount,
      treeSpecies,
      plantProjectName,
      country,
      isGift,
      plantDate,
      givee,
      giveeSlug,
      tpoName,
      isPending,
      mayUpdate,
      cardType,
      contributionType,
      category,
      registrationDate,
      redemptionCode,
      redemptionDate
    } = contribution;
    // let imagesArray = contribution.contributionImages.map(image => {
    //   return { src: getImageUrl('contribution', 'medium', image.image) };
    // });
    // let seeLabel = classnames('see-more-label-style', {
    //   'see-more__active': this.state.viewExpanded
    // });

    let treeCountLine = this.treeCountLine(treeCount, treeSpecies);
    let plantProjectLine = this.plantProjectLine(plantProjectName, country);
    let donateActionLine = this.donateActionLine(
      isGift,
      plantDate,
      givee,
      giveeSlug
    );
    let tpoLine = this.tpoLine(tpoName);
    let plantActionLine = this.plantActionLine(plantDate, registrationDate);
    let dedicateActionLine = this.dedicateActionLine(givee, giveeSlug);
    let redeemActionLine = this.redeemActionLine(
      redemptionCode,
      redemptionDate,
      givee,
      giveeSlug
    );
    let labelColor = cardType === 'pending' ? '#e6e6e6' : '#95c243';
    let borderColor =
      contributionType == 'donation'
        ? '#95c243'
        : treeCount > 1
          ? '#68aeec'
          : '#ec6453';
    return category === 'contributions' && contributionType === 'donation' ? (
      <div>
        <div
          style={{
            borderLeft:
              '5px solid ' +
              (contribution.contributionType == 'donation'
                ? '#95c243'
                : contribution.treeCount > 1
                  ? '#68aeec'
                  : '#ec6453')
          }}
          key={`contribution-${contribution.id}`}
          className={`contribution-container__card ${
            contribution.contributionType
          }`}
        >
          <div className="contribution-container__left-column">
            {treeCountLine ? (
              <TextSpan strong={true}>{treeCountLine}</TextSpan>
            ) : null}

            {plantProjectLine ? <TextSpan>{plantProjectLine}</TextSpan> : null}
            {donateActionLine ? <TextSpan>{donateActionLine}</TextSpan> : null}
            {tpoLine ? <TextSpan>{tpoLine}</TextSpan> : null}
            {/*<TextSpan strong={true}>*/}
            {/*{contribution.treeCount + ' '}*/}
            {/*{contribution.treeSpecies ? contribution.treeSpecies : ''}*/}
            {/*{i18n.t('label.tree')}*/}
            {/*</TextSpan>*/}
            {/*<TextSpan>*/}
            {/*{contribution.geoLatitude + ', ' + contribution.geoLongitude}*/}
            {/*</TextSpan>*/}
            {/*<TextSpan>*/}
            {/*{moment(new Date(contribution.plantDate)).format('DD MMM YYYY')}*/}
            {/*</TextSpan>*/}
            {/*{imagesArray.length ? (*/}
            {/*<a onClick={this.openLightbox}>{i18n.t('label.pictures')}</a>*/}
            {/*) : null}*/}
            {/*<Lightbox*/}
            {/*currentImage={this.state.currentImage}*/}
            {/*images={imagesArray}*/}
            {/*isOpen={this.state.lightboxIsOpen}*/}
            {/*onClose={this.closeLightbox}*/}
            {/*onClickNext={this.gotoNext}*/}
            {/*onClickPrev={this.gotoPrevious}*/}
            {/*/>*/}
          </div>
          <div className="contribution-container__right-column">
            {contribution.category === 'contributions'
              ? contribution.contributionMeasurements
                  .slice(0, 3)
                  .map(measurement => (
                    <TextSpan key={measurement.id}>
                      {contribution.plantDate === measurement.measurementDate
                        ? i18n.t('label.planting_day')
                        : new Date(
                            measurement.measurementDate
                          ).toLocaleDateString() +
                          (measurement.diameter + 'cm').padStart(10) +
                          (
                            (measurement.height / 100).toFixed(1) + 'm'
                          ).padStart(10)}
                    </TextSpan>
                  ))
              : null}
            {contribution.category === 'contributions' &&
            contribution.contributionMeasurements.length > 3 ? (
              <div className={seeLabel} onClick={this.onViewExpanded}>
                {this.state.viewExpanded
                  ? i18n.t('label.see_less')
                  : '+ ' + i18n.t('label.see_more')}
              </div>
            ) : null}
            {this.state.viewExpanded &&
            contribution.category === 'contributions'
              ? contribution.contributionMeasurements
                  .slice(3)
                  .map(measurement => (
                    <TextSpan key={measurement.id}>
                      {new Date(
                        measurement.measurementDate
                      ).toLocaleDateString() +
                        (measurement.diameter + 'cm').padStart(10) +
                        ((measurement.height / 100).toFixed(1) + 'm').padStart(
                          10
                        )}
                    </TextSpan>
                  ))
              : null}
            {!isPending ? (
              <TextSpan>
                {' '}
                {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
              </TextSpan>
            ) : (
              <Link
                to={getLocalRoute('app_editTrees', {
                  contribution: contribution.id
                })}
              >
                {i18n.t('label.update')}
              </Link>
            )}
          </div>
        </div>
        <hr className="contribution-container__partition" />
      </div>
    ) : category === 'contributions' && contributionType === 'planting' ? (
      <div>
        <div
          style={{
            borderLeft:
              '5px solid ' +
              (contribution.contributionType == 'donation'
                ? '#95c243'
                : contribution.treeCount > 1
                  ? '#68aeec'
                  : '#ec6453')
          }}
          key={`contribution-${contribution.id}`}
          className={`contribution-container__card ${
            contribution.contributionType
          }`}
        >
          <div className="contribution-container__left-column">
            {treeCountLine ? (
              <TextSpan strong={true}>{treeCountLine}</TextSpan>
            ) : null}
            {plantProjectLine ? <TextSpan>{plantProjectLine}</TextSpan> : null}
            {plantActionLine ? <TextSpan>{plantActionLine}</TextSpan> : null}
            {dedicateActionLine ? (
              <TextSpan>{dedicateActionLine}</TextSpan>
            ) : null}
          </div>
          <div className="contribution-container__right-column">
            {contribution.category === 'contributions'
              ? contribution.contributionMeasurements
                  .slice(0, 3)
                  .map(measurement => (
                    <TextSpan key={measurement.id}>
                      {contribution.plantDate === measurement.measurementDate
                        ? i18n.t('label.planting_day')
                        : new Date(
                            measurement.measurementDate
                          ).toLocaleDateString() +
                          (measurement.diameter + 'cm').padStart(10) +
                          (
                            (measurement.height / 100).toFixed(1) + 'm'
                          ).padStart(10)}
                    </TextSpan>
                  ))
              : null}
            {contribution.category === 'contributions' &&
            contribution.contributionMeasurements.length > 3 ? (
              <div className={seeLabel} onClick={this.onViewExpanded}>
                {this.state.viewExpanded
                  ? i18n.t('label.see_less')
                  : '+ ' + i18n.t('label.see_more')}
              </div>
            ) : null}
            {this.state.viewExpanded &&
            contribution.category === 'contributions'
              ? contribution.contributionMeasurements
                  .slice(3)
                  .map(measurement => (
                    <TextSpan key={measurement.id}>
                      {new Date(
                        measurement.measurementDate
                      ).toLocaleDateString() +
                        (measurement.diameter + 'cm').padStart(10) +
                        ((measurement.height / 100).toFixed(1) + 'm').padStart(
                          10
                        )}
                    </TextSpan>
                  ))
              : null}
            {!isPending ? (
              <TextSpan>
                {' '}
                {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
              </TextSpan>
            ) : (
              <Link
                to={getLocalRoute('app_editTrees', {
                  contribution: contribution.id
                })}
              >
                {i18n.t('label.update')}
              </Link>
            )}
          </div>
        </div>
        <hr className="contribution-container__partition" />
      </div>
    ) : category === 'gifts' ? (
      <div>
        <div
          style={{
            borderLeft:
              '5px solid ' +
              (contribution.contributionType == 'donation'
                ? '#95c243'
                : contribution.treeCount > 1
                  ? '#68aeec'
                  : '#ec6453')
          }}
          key={`contribution-${contribution.id}`}
          className={`contribution-container__card ${
            contribution.contributionType
          }`}
        >
          <div className="contribution-container__left-column">
            {treeCountLine ? <TextSpan>{treeCountLine}</TextSpan> : null}
            {plantProjectLine ? <TextSpan>{plantProjectLine}</TextSpan> : null}
            {redeemActionLine ? <TextSpan>{redeemActionLine}</TextSpan> : null}
            {tpoLine ? <TextSpan>{tpoLine}</TextSpan> : null}
          </div>
          <div className="contribution-container__right-column">
            {contribution.category === 'contributions'
              ? contribution.contributionMeasurements
                  .slice(0, 3)
                  .map(measurement => (
                    <TextSpan key={measurement.id}>
                      {contribution.plantDate === measurement.measurementDate
                        ? i18n.t('label.planting_day')
                        : new Date(
                            measurement.measurementDate
                          ).toLocaleDateString() +
                          (measurement.diameter + 'cm').padStart(10) +
                          (
                            (measurement.height / 100).toFixed(1) + 'm'
                          ).padStart(10)}
                    </TextSpan>
                  ))
              : null}
            {contribution.category === 'contributions' &&
            contribution.contributionMeasurements.length > 3 ? (
              <div className={seeLabel} onClick={this.onViewExpanded}>
                {this.state.viewExpanded
                  ? i18n.t('label.see_less')
                  : '+ ' + i18n.t('label.see_more')}
              </div>
            ) : null}
            {this.state.viewExpanded &&
            contribution.category === 'contributions'
              ? contribution.contributionMeasurements
                  .slice(3)
                  .map(measurement => (
                    <TextSpan key={measurement.id}>
                      {new Date(
                        measurement.measurementDate
                      ).toLocaleDateString() +
                        (measurement.diameter + 'cm').padStart(10) +
                        ((measurement.height / 100).toFixed(1) + 'm').padStart(
                          10
                        )}
                    </TextSpan>
                  ))
              : null}
            {!isPending ? (
              <TextSpan>
                {' '}
                {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
              </TextSpan>
            ) : (
              <Link
                to={getLocalRoute('app_editTrees', {
                  contribution: contribution.id
                })}
              >
                {i18n.t('label.update')}
              </Link>
            )}
          </div>
        </div>
        <hr className="contribution-container__partition" />
      </div>
    ) : null;
  }
}

ContributionCard.propTypes = {
  contribution: PropTypes.object.isRequired
};
