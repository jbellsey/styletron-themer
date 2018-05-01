import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyletronContext} from './contexts';

export default class StyletronProvider extends Component {

  state = {styletron: null}

  static getDerivedStateFromProps({styletron}) {
    if (styletron)
      return {styletron};
  }

  render() {
    return (
      <StyletronContext.Provider value={this.state.styletron}>
        {this.props.children}
      </StyletronContext.Provider>
    );
  }
}

StyletronProvider.propTypes = {
  styletron: PropTypes.object,
  children:  PropTypes.node
};
