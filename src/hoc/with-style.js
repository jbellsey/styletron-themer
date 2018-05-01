import React from 'react';
import assignDeep from 'assign-deep';
import {getDisplayName} from '../utils';

/* eslint-disable react/prop-types */

/**
 * HoC for styling a Styled component (or any component
 *   that intelligently response to a "style" prop)
 *
 * usage:
 *   const PinkButton = withStyle({color: 'pink'})(Button);
 *   <PinkButton />
 *
 */

const withStyle = style => RootComponent => {
  class WithStyleHoC extends React.Component {
    static displayName = `WithStyle_${getDisplayName(RootComponent)}`
    render() {
      const {style: userStyle, ...props} = this.props,
            mergedStyle = userStyle ? assignDeep({}, style, userStyle) : style;
      return <RootComponent style={mergedStyle} {...props} />;
    }
  }
  return WithStyleHoC;
};

export {withStyle};

