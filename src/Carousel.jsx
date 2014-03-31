/** @jsx React.DOM */

import React          from './react-es6';
import classSet       from './react-es6/lib/cx';
import BootstrapMixin from './BootstrapMixin';
import utils          from './utils';

var Carousel = React.createClass({
  mixins: [BootstrapMixin],

  propTypes: {
    slide: React.PropTypes.bool,
    indicators: React.PropTypes.bool,
    onSelect: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      slide: true,
      interval: 5000,
      pause: 'hover',
      wrap: true
    };
  },

  getInitialState: function () {
    var defaultActiveKey = this.props.defaultActiveKey;

    if (defaultActiveKey == null) {
      var children = this.props.children;
      defaultActiveKey =
        Array.isArray(children) ? children[0].props.key : children.props.key;
    }

    return {
      activeKey: defaultActiveKey,
      previousActiveKey: null,
      direction: null
    };
  },

  getIndexOfChildKey: function (key) {
    var index;

    if (!this.props.children) {
      return -1;
    }
    if (!Array.isArray(this.props.children)) {
      return (this.props.children.props.key === key) ?
        0 : -1;
    }

    this.props.children.forEach(function (child, i) {
      if (index === null && child.props.key === key) {
        index = i;
      }
    });

    return index;
  },

  getDirection: function (activeKey, nextKey) {
    var indexA = this.getIndexOfChildKey(activeKey);
    var indexB = this.getIndexOfChildKey(nextKey);

    if (indexA === indexB) {
      return null;
    }

    return indexA > indexB ?
      'left' : 'right';
  },

  componentWillReceiveProps: function (nextProps) {
    var activeKey = this.getActiveKey();

    if (nextProps.activeKey != null && nextProps.activeKey !== activeKey) {
      this.setState({
        previousActiveKey: this.props.activeKey,
        direction: this.getDirection(activeKey, this.props.activeKey)
      });
    }
  },

  next: function () {

  },

  pause: function () {
    this.isPaused = true;
    clearTimeout(this.timeout);
  },

  play: function () {
    this.isPaused = false;
    if (this.props.slide && this.props.interval) {
      setTimeout(this.next, this.props.interval);
    }
  },

  render: function () {
    var classes = {
      carousel: true,
      slide: this.props.slide
    };

    return this.transferPropsTo(
      <div
        className={classSet(classes)}
        onMouseOver={this.handleMouseOver}
        onMouesOut={this.handleMouseOut}>
        <div className="carousel-inner" ref="inner">
          {utils.modifyChildren(this.props.children, this.renderItem)}
        </div>
      </div>
    );
  },

  getActiveKey: function () {
    return this.props.activeKey != null ? this.props.activeKey : this.state.activeKey;
  },

  handleItemAnimateOutEnd: function (key) {
    if (key === this.state.previousActiveKey) {
      this.setState({
        previousActiveKey: null
      });
    }
  },

  renderItem: function (child) {
    var activeKey = this.getActiveKey(),
        isActive = (child.props.key === activeKey),
        isPreviousActive = this.state.previousActiveKey != null &&
            this.state.previousActiveKey === child.props.key;

    return utils.cloneWithProps(
        child,
        {
          active: isActive,
          ref: child.props.ref,
          key: child.props.key,
          animateOut: isPreviousActive,
          animateIn: isActive && this.state.previousActiveKey != null,
          direction: this.state.direction,
          onAnimateOutEnd: isPreviousActive ? this.handleItemAnimateOutEnd: null
        }
      );
  },

  shouldComponentUpdate: function() {
    // Defer any updates to this component during the `onSelect` handler.
    return !this._isChanging;
  },

  handleSelect: function (key) {
    var previousActiveKey;

    if (this.props.onSelect) {
      this._isChanging = true;
      this.props.onSelect(key);
      this._isChanging = false;
    } else if (key !== this.getActiveKey()) {
      previousActiveKey = this.getActiveKey();
      this.setState({
        activeKey: key,
        previousActiveKey: previousActiveKey,
        direction: this.getDirection(previousActiveKey, key)
      });
    }
  }
});

export default = Carousel;