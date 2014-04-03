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
        previousActiveIndex: activeIndex,
        direction: this.getDirection(activeIndex, nextProps.activeIndex)
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

  getActiveIndex: function () {
    return this.props.activeIndex != null ? this.props.activeIndex : this.state.activeIndex;
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
    var activeIndex = this.getActiveIndex(),
        isActive = (i === activeIndex),
        isPreviousActive = this.state.previousActiveIndex != null &&
            this.state.previousActiveIndex === i;

    return utils.cloneWithProps(
        child,
        {
          active: isActive,
          ref: child.props.ref,
          key: child.props.key,
          index: i,
          animateOut: isPreviousActive,
          animateIn: isActive && this.state.previousActiveIndex != null,
          direction: this.state.direction,
          onAnimateOutEnd: isPreviousActive ? this.handleItemAnimateOutEnd: null
        }
      );
  },

  shouldComponentUpdate: function() {
    // Defer any updates to this component during the `onSelect` handler.
    return !this._isChanging;
  },

  handleSelect: function (index) {
    var previousActiveIndex;

    if (this.props.onSelect) {
      this._isChanging = true;
      this.props.onSelect(index);
      this._isChanging = false;
    }

    if (this.props.activeIndex == null && index !== this.getActiveIndex()) {
      previousActiveIndex = this.getActiveIndex();
      this.setState({
        activeIndex: index,
        previousActiveIndex: previousActiveIndex,
        direction: this.getDirection(previousActiveIndex, index)
      });
    }
  }
});

export default = Carousel;