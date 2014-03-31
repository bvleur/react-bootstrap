/** @jsx React.DOM */

import React                 from './react-es6';
import classSet              from './react-es6/lib/cx';
import ReactTransitionEvents from './react-es6/lib/ReactTransitionEvents';

var CarouselItem = React.createClass({
  getDefaultProps: function () {
    return {
      animation: true
    };
  },

  handleAnimateOutEnd: function () {
    if (typeof this.props.onAnimateOutEnd === 'function') {
      this.props.onAnimateOutEnd(this.props.key);
    }
  },

  componentDidUpdate: function (prevProps) {
    if (!this.props.active && prevProps.active) {
      ReactTransitionEvents.addEndEventListener(
        this.getDOMNode(),
        this.handleAnimateOutEnd
      );
    }
  },

  render: function () {
    var classes = {
      'item': true,
      'active': this.props.active && !this.props.animateIn,
      'next': this.props.active && this.props.animateIn,
      'direction': this.props.direction,
    };

    return this.transferPropsTo(
      <div className={classSet(classes)}>
        {this.props.children}
      </div>
    );
  }
});

export default = CarouselItem;