/* eslint-disable react/jsx-boolean-value,react-native/no-color-literals */
import React, {Component} from 'react';
import {Text, View, Dimensions, Image, Platform, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import MapView, {
  Marker,
  Polygon,
  ProviderPropType,
PROVIDER_GOOGLE} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Config from 'react-native-config';

import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {iosSearchGrey} from '../../assets';
import RoundedButton from '../Common/Button/RoundButton.native';
import {PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {NotificationManager} from 'react-notifications';
import i18n from '../../locales/i18n';
import EStyleSheet from 'react-native-extended-stylesheet';
// import {context} from '../../config';
import buttonStyles from '../../styles/common/button.native';
import markerImage from '../../assets/images/tree.png'
// const {googleApiKey} = context;
const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = null; //37.78825;
const LONGITUDE = null; //-122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let id = 0;


const styles = EStyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
    marginBottom: 30,
    position: 'relative'
  },
  fullScreenContainer: {
    flex: 1,
    marginTop: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
    position: 'relative'
  },
  map: {
    flex: 1
  },
  inputContainerFullScreen: {
    top: -25,
    position: 'absolute',
    width: '94%',
    left: '3%',
    borderRadius: 20 ,
    borderLeftWidth: 1,
    borderRightWidth: 2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: '#ffff'
  },
  inputContainer: {
    bottom: -25,
    position: 'absolute',
    width: '94%',
    left: '2.5%',
    borderRadius: 20 ,
    borderLeftWidth: 0.5,
    borderRightWidth: 1,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    // borderRadius: '50%',
    backgroundColor: '#ffff'
  },
  btnLocation: {
    position: 'absolute',
    bottom: 50,
    right: 10,
    backgroundColor: '#fff',
    borderColor: '#fff'
  },
  btnDeleteFullScreen: {
    position: 'absolute',
    bottom: 145,
    width: 50,
    height: 50,
    right: 10,
    backgroundColor: '#fff',
    borderColor: '#fff'
  },
  btnLocationFullScreen: {
    position: 'absolute',
    bottom: 85,
    width: 50,
    height: 50,
    right: 10,
    backgroundColor: '#fff',
    borderColor: '#fff'
  },
  btnFullScreen: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#fff',
    borderColor: '#fff'
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%'
  },
  markerFullScreen: {
    height: 48,
    width: 48,
    // top: -20
  },
  marker: {
    height: 48,
    width: 48,
    // top: -20
  },
  actionButtonTouchableFullScreen: {
    bottom: '4%'
  }
});

const mapStyle = [
  {
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#f5f5f5'
      }
    ]
  },
  {
    'elementType': 'labels.icon',
    'stylers': [
      {
        'visibility': 'off'
      }
    ]
  },
  {
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#616161'
      }
    ]
  },
  {
    'elementType': 'labels.text.stroke',
    'stylers': [
      {
        'color': '#f5f5f5'
      }
    ]
  },
  {
    'featureType': 'administrative.land_parcel',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#bdbdbd'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#eeeeee'
      }
    ]
  },
  {
    'featureType': 'poi',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#757575'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#e5e5e5'
      }
    ]
  },
  {
    'featureType': 'poi.park',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9e9e9e'
      }
    ]
  },
  {
    'featureType': 'road',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#ffffff'
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#757575'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#dadada'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#616161'
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9e9e9e'
      }
    ]
  },
  {
    'featureType': 'transit.line',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#e5e5e5'
      }
    ]
  },
  {
    'featureType': 'transit.station',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#eeeeee'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [
      {
        'color': '#c9c9c9'
      }
    ]
  },
  {
    'featureType': 'water',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'color': '#9e9e9e'
      }
    ]
  }
]
function getQueryVariable(query, variable) {
  if(!query){
    return  null;
  }
  let vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return parseFloat(decodeURIComponent(pair[1]));
    }
  }
  console.log('Query variable %s not found', variable);
}

export function encodeFormData(mode, mapPoint) {
  console.log('map point in encodeFormData',mapPoint, mode)
  if(!mapPoint){
    return '';
  }
  if(mode) {
    if(mode === 'single-tree' && Array.isArray(mapPoint) && mapPoint.length){
      return `geoLatitude=${mapPoint[0].coordinate.latitude}&geoLongitude=${mapPoint[0].coordinate.longitude}`
    }
    else if(mode === 'multiple-trees' && mapPoint && mapPoint.coordinates) {
      const data = mapPoint.coordinates.map((cord) => {
        return [
          cord.latitude, cord.longitude
        ]
      });
      data.push(data[0]);
      return {
        'type': 'Polygon',
        'coordinates': [data]
      }
    }
    return null;
  }
  else{
    return null;
  }
}
export function decodeFormData(mode, mapPoint) {
  console.log('map point in decodeFormData',mapPoint, mode)
  if(!mapPoint){
    return null;
  }

  if(mode) {
    if(mode === 'single-tree' && mapPoint){
      return [{
        coordinate:{
          latitude: getQueryVariable(mapPoint, 'geoLatitude'),
          longitude: getQueryVariable(mapPoint, 'geoLongitude'),
          key: 1
        }
      }];
      // return point;
    }
    else if(mode === 'multiple-trees' && mapPoint && mapPoint.coordinates && mapPoint.type === 'Polygon'){
      const item = {};
      item.coordinates = mapPoint.coordinates[0].map(items => {
        return {
          latitude: items[0],
          longitude: items[1]
        }
      });
      return item;
    }
  }
  return  mode === 'single-tree' ? [] : null;
}

class MapboxMap extends Component {
  constructor(props) {
    super(props);
    this.mapRef = null;
    this.isSingleTree = this.props.mode === 'single-tree';
    const { geoLocation, mode, geometry } = this.props;
    const marker = this.isSingleTree && geoLocation ? decodeFormData(mode, geoLocation) : null;
    this.state = {
      pointInView: null,
      coordinates: null,
      location: null,
      shouldDisplayListView: true,
      region: {
        latitude: getQueryVariable(geoLocation, 'geoLatitude'),
        longitude: getQueryVariable(geoLocation, 'geoLongitude'),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      polygons: [],
      editing: !this.isSingleTree && !Array.isArray(geometry) ? decodeFormData(mode, geometry) : null,
      creatingHole: false,
      markers: marker || [],
    };

  }

  componentDidMount() {
    this.gotoLocation();
  }

  componentWillReceiveProps(nextProps) {
    this.onPropsUpdate(nextProps);
  }
  onPropsUpdate = (nextProps) => {
    if(!nextProps.fullScreen){

      const { geoLocation, mode, geometry } = nextProps;
      const marker = this.isSingleTree && geoLocation ? decodeFormData(mode, geoLocation) : null;
      const state = {
        region: {
          latitude: getQueryVariable(geoLocation, 'geoLatitude'),
          longitude: getQueryVariable(geoLocation, 'geoLongitude'),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        },
        editing: !this.isSingleTree && !Array.isArray(geometry) ? decodeFormData(mode, geometry) : null,
        markers: marker || [],
      };
     setTimeout(() => {
       this.setState({
         ...state
       }, () => {
         this.gotoLocation();
       })
     }, 1000)
    }

  };

  onDoublePress = (e) => {
    if (this.props.onPress && !this.props.fullScreen) {
      this.props.onPress(e)
    }
    return null;
  };
  onPress(e) {
    // const isSingleTree = this.props.mode === 'single-tree';
    if (this.props.onPress) {
      this.props.onPress(e)
    } else if(!this.isSingleTree) {
      const {editing, creatingHole} = this.state;
      console.log(this.isSingleTree, {editing, creatingHole})

      if (!editing) {
        this.setState({
          editing: {
            id: id++,
            coordinates: [e.nativeEvent.coordinate],
            holes: []
          }
        });
      } else if (!creatingHole) {
        this.setState({
          editing: {
            ...editing,
            coordinates: [...editing.coordinates, e.nativeEvent.coordinate]
          }
        });
      } else {
        const holes = [...editing.holes];
        holes[holes.length - 1] = [
          ...holes[holes.length - 1],
          e.nativeEvent.coordinate
        ];
        this.setState({
          editing: {
            ...editing,
            id: id++, // keep incrementing id to trigger display refresh
            coordinates: [...editing.coordinates],
            holes
          }
        });
      }
    }

  }

  gotoCurrentLocation = location => {
    if (this.map) {
      this.map.animateToRegion(location);
    }
  };
  onRegionChange = region => {

    if(this.props.fullScreen && this.isSingleTree) {
      this.setState({
        region:{
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
      });
      this.setState({
        markers: [
          // ...this.state.markers,
          {
            coordinate: {
              latitude: region.latitude,
              longitude: region.longitude,
            },
            key: id++,
          },
        ],
      });
    }
  };

  renderPolygon() {
    const mapOptions = {
      scrollEnabled: this.props.fullScreen,
      // cacheEnabled: !this.props.fullScreen,
      liteMode: !this.props.fullScreen,
      rotateEnabled: this.props.fullScreen,
      zoomEnabled: this.props.fullScreen,
      // loadingEnabled: false,
      showsUserLocation: false
    };
    const { editing, region: {latitude, longitude}, markers } = this.state;
    console.log({
      editing, latitude, longitude, markers, Config, isSingleTree: this.isSingleTree, mode: this.props.mode
    });
    if (editing) {
      mapOptions.scrollEnabled = false;
      mapOptions.onPanDrag = e => this.onPress(e);
    }
    if ((latitude && longitude)) {
      mapOptions.initialRegion ={
        ... this.state.region
      }
    }
    return (
      <MapView
        // mapType={'standard'}
        ref={ref => (this.map = ref)}
        provider={PROVIDER_GOOGLE}
        //provider={this.props.provider}
        style={[this.props.mapStyle, styles.map]}
        // initialRegion={this.state.region}
        onPress={e => this.onPress(e)}
        onDoublePress={e => this.onDoublePress(e)}
        onLongPress={e => this.onDoublePress(e)}
        onMarkerPress={e => this.onDoublePress(e)}
        onRegionChangeComplete={this.onRegionChange}
        customMapStyle={mapStyle}

        {...mapOptions}
      >
        {this.props.mode === 'multipal-tree' && this.state.polygons.map(polygon => (
          <Polygon
            key={polygon.id}
            coordinates={polygon.coordinates}
            holes={polygon.holes}
            strokeColor="#F00"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1}

          />
        ))}
        {editing && (
          <Polygon
            key={editing.id}
            coordinates={editing.coordinates}
            holes={editing.holes}
            strokeColor="#000"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1}
            tappable
          />
        )}

        {
          !this.props.fullScreen && this.state.markers.map(marker => (
          <Marker
            // image={markerImage}
            key={marker.key}
            coordinate={marker.coordinate}
          >
            <Image style={this.props.fullScreen ? styles.marker : styles.marker} source={markerImage} />
          </Marker>
        ))}
        {
          this.props.fullScreen && !this.isSingleTree && this.state.editing && this.state.editing.coordinates.map((marker, index) => (
          <Marker
            // image={markerImage}
            key={index}
            coordinate={marker}
          >
            <Image style={this.props.fullScreen ? styles.marker : styles.marker} source={markerImage} />
          </Marker>
        ))}
      </MapView>
    );
  }

  removeData = () => {
    this.setState({
      markers: [],
      editing: null
    })
  };
  goto = () => {
    if(!this.props.fullScreen){
      if (this.props.onPress) {
        this.props.onPress()
      }
    }
    else {
      this.getMyLocation();
    }
  };
  gotoLocation = () => {
    if(!this.props.fullScreen && this.state.markers && this.state.markers.length){
      this.gotoCurrentLocation({
        latitude: this.state.markers[0].coordinate.latitude,
        longitude: this.state.markers[0].coordinate.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      });
    }
    else if(this.state.marker && this.state.marker.length <= 0 && this.isSingleTree) {
      this.getMyLocation();
    }
    else if(!this.isSingleTree || !this.state.region.latitude) {
      this.getMyLocation();
    }

  };

  getMyLocation = () => {
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      })
    ).then((/*response*/) => {
      Geolocation.getCurrentPosition(
        location => {
          let {latitude, longitude} = location.coords;
          const region = {
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          };
          this.setState({
            region
          }, () => {
            this.gotoCurrentLocation(region);
          })

          // Temporary added comment for prevent moving map to current location DO NOT REMOVE code
          // if(this.props.fullScreen && this.state.marker && this.state.marker.length){
          //   this.gotoCurrentLocation({
          //     latitude: this.state.markers[0].latitude,
          //     longitude: this.state.markers[0].longitude,
          //     latitudeDelta: LATITUDE_DELTA,
          //     longitudeDelta: LONGITUDE_DELTA
          //   });
          // }
          // else {
          //   // this.setState({
          //   //   region
          //   // }, () => {
          //   //   this.gotoCurrentLocation(region);
          //   // })
          // }
          // console.log({
          //   region,
          //   Sta: this.state.region,
          //   marker: this.state.markers
          // })

        },
        (/*location*/) => {
          NotificationManager.error(
            i18n.t('label.location_permission_denied'),
            i18n.t('label.error'),
            5000
          );
        }
      );
    });
  };

  renderComp = (render) => {
    const { fullScreen, onPress } = this.props;
    if(!fullScreen){
      return (
        <TouchableOpacity onPress={onPress}>
          {render}
        </TouchableOpacity>
      )
    }
    else {
      return render
    }
  };

  render() {
    const { fullScreen, onContinue, mode, onPress } = this.props;
    const inputProps = fullScreen ? {
      onFocus: () => {
        this.setState({
          shouldDisplayListView: true
        })
      },
      onBlur: () => {
        this.setState({
          shouldDisplayListView: false
        })
      },
      editable: true,
    } : {
      editable: false,
      onFocus: onPress,
      onPress: onPress
    };
    // inputProps.style = styles.inputStyle
    // const isSingleTree = this.props.mode === 'single-tree';
    return (
      <View style={fullScreen ? styles.fullScreenContainer : styles.container}>
        {
          this.renderComp(this.renderPolygon())
        }
        {
          fullScreen && this.isSingleTree &&
          <View style={styles.markerFixed}>
            <Image style={fullScreen ? styles.markerFullScreen : styles.marker} source={markerImage} />
          </View>
        }
        {
          this.renderComp(
            (
              <View style={fullScreen ? styles.inputContainerFullScreen : styles.inputContainer}>
                <GooglePlacesAutocomplete
                  listViewDisplayed={this.state.shouldDisplayListView}
                  keyboardShouldPersistTaps={'always'}
                  placeholder={i18n.t('label.map_search_placeholder')}
                  minLength={2}
                  autoFocus={false}
                  fetchDetails={true}
                  // listViewDisplayed="auto"
                  returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                  keyboardAppearance={'light'}
                  styles={{
                    textInputContainer: {
                      borderTopWidth: 0,
                      borderBottomWidth: 0,
                      width: '100%',
                      borderRadius: 20 ,
                      backgroundColor: '#ffff'
                    },
                    textInput: {
                      marginLeft: 0,
                      marginTop: 0,
                      marginBottom: 0,
                      marginRight: 0,
                      height: 44,
                      fontSize: 16,
                      borderRadius: 20 ,
                    },
                    predefinedPlacesDescription: {
                      color: '#1faadb'
                    }
                  }}
                  debounce={200}
                  nearbyPlacesAPI="GooglePlacesSearch"
                  query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: Config.googleApiKey,
                    language: 'en' // language of the results
                  }}
                  currentLocation={false}
                  renderLeftButton={() => (
                    <Image
                      source={iosSearchGrey}
                      style={{
                        width: 19,
                        height: 19,
                        marginLeft: 12,
                        marginTop: 12,
                        resizeMode: 'cover'
                      }}
                    />
                  )}
                  onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    this.gotoCurrentLocation({
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA
                    });
                  }}
                  textInputProps={inputProps}
                />
              </View>
            )
          )
        }

        {
          !!(this.state.markers.length || this.state.editing) && !this.isSingleTree &&
          <RoundedButton
            buttonStyle={fullScreen ? styles.btnDeleteFullScreen : styles.btnLocation}
            onClick={this.removeData}
          >
            <Icon name="delete" size={fullScreen ? 24 : 18} color="#000000"/>
          </RoundedButton>
        }
        {
          fullScreen &&
          <RoundedButton
            buttonStyle={fullScreen ? styles.btnLocationFullScreen : styles.btnLocation}
            onClick={this.goto}
          >
            <Icon name="my-location" size={fullScreen ? 24 : 18} color="#000000"/>
          </RoundedButton>
        }

        {fullScreen &&
        <TouchableOpacity
          style={[buttonStyles.actionButtonTouchableFullScreen, styles.actionButtonTouchableFullScreen]}
          onPress={() => {
            setTimeout(() => {
              if(onContinue){
                onContinue(
                  this.state.mode === 'single-tree' ? encodeFormData( mode, this.state.markers) : `geoLatitude=${this.state.region.latitude}&geoLongitude=${this.state.region.longitude}`,
                  encodeFormData( mode, this.state.editing),
                  mode
                )
              }
            }, 500)

          }}
        >
          <View style={buttonStyles.actionButtonView}>
            <Text style={buttonStyles.actionButtonText}>
              {i18n.t('label.continue')}
            </Text>
          </View>
        </TouchableOpacity>}
      </View>
    );
  }
}

MapboxMap.propTypes = {
  mapStyle: PropTypes.object,
  onContinue: PropTypes.func.isRequired,
  navigation: PropTypes.func.isRequired,
  onPress: PropTypes.func,
  fullScreen: PropTypes.bool,
  location: PropTypes.any,
  geometry: PropTypes.any,
  geoLocation: PropTypes.any,
  mode: PropTypes.any,
  provider: ProviderPropType
};

MapboxMap.defaultProps = {
  fullScreen: false,
  onPress: null,
  location: {
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  }
};

export default MapboxMap;