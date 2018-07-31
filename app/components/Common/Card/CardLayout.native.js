import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styles from '../../../styles/common/card';
const CardLayout = ({ children, style }) => (
  <View style={[style, styles.cardContainer]}>{children}</View>
);

CardLayout.propTypes = {
  children: PropTypes.node,
  style: PropTypes.any
};

export default CardLayout;
