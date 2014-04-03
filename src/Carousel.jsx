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
    controls: React.PropTypes.bool,
    pauseOnHover: React.PropTypes.bool,
    wrap: React.PropTypes.bool,
    onSelect: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      slide: true,
      interval: 5000,
      pauseOnHover: true,
      wrap: true
    };
  },

  getInitialState: function () {
    var defaultActiveIndex = this.props.defaultActiveIndex;

    if (defaultActiveIndex == null) {
      defaultActiveIndex = 0;
    }

    return {
      activeIndex: defaultActiveIndex,
      previousActiveIndex: null,
      direction: null
    };
  },

  getDirection: function (indexA, indexB) {
    if (indexA === indexB) {
      return null;
    }

    return indexA > indexB ?
      'left' : 'right';
  },

  getNumberOfItems: function () {
    if (!this.props.children) {
      return 0;
    }

    if (!Array.isArray(this.props.children)) {
      return 1;
    }

    return this.props.children.length;
  },

  componentWillReceiveProps: function (nextProps) {
    var activeIndex = this.getActiveIndex();

    if (nextProps.activeIndex != null && nextProps.activeIndex !== activeIndex) {
      this.setState({
        previousActiveIndex: this.props.activeIndex,
        direction: this.getDirection(activeIndex, this.props.activeIndex)
      });
    }
  },

  next: function () {
    var index = this.getIndexOfChildKey(this.getActiveIndex()),
        nextActiveIndex;

    index += 1;

    if (nextActiveIndex != null) {
      this.handleSelect(nextActiveIndex);
    }
  },

  pause: function () {
    this.isPaused = true;
    clearTimeout(this.timeout);
  },

  play: function () {
    this.isPaused = false;
    this.waitForNext();
  },

  waitForNext: function () {
    if (!this.isPaused && this.props.slide && this.props.interval) {
      setTimeout(this.next, this.props.interval);
    }
  },

  handleMouseOver: function () {
    if (this.props.pauseOnHover) {
      this.pause();
    }
  },

  handleMouseOut: function () {
    if (this.props.pauseOnHover) {
      this.play();
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

    this.waitForNext();
  },

  renderItem: function (child, i) {
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
          index: i,
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
    }

    if (this.props.activeKey == null && key !== this.getActiveKey()) {
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