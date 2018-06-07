import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import CardLayout from '../Common/Card/CardLayout';
import Tabs from '../Common/Tabs';
import Map from '../Common/EsriMap/Map';
import MapLayerSelector from './MapLayerSelector';
import ExploreForm from '../../server/formSchemas/explore';

export default class Explore extends Component {
  static data = {
    tabs: [
      {
        name: 'Map',
        id: 'map'
      },
      {
        name: 'Leaderboards',
        id: 'leaderboards'
      }
    ]
  };

  constructor() {
    super();
    this.state = {
      activeTab: ''
    };
    this.onTabChange = this.onTabChange.bind(this);
  }

  onTabChange(tab) {
    console.log(tab);
    this.setState({
      activeTab: tab
    });
  }

  render() {
    return (
      <div className={'card-width'}>
        <CardLayout>
          <Tabs data={Explore.data.tabs} onTabChange={this.onTabChange}>
            {this.state.activeTab === Explore.data.tabs[0].id ? (
              <div>
                <div className="explore-checkbox">
                  <MapLayerSelector
                    mapLayers={ExploreForm.mapLayers}
                    activeMapLayers={ExploreForm.activeMapLayers}
                  />
                </div>
                <Map />
              </div>
            ) : null}
          </Tabs>
        </CardLayout>
      </div>
    );
  }
}
