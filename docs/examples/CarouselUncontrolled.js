/** @jsx React.DOM */

var carouselInstance = (
    <Carousel defaultActiveIndex={0}>
      <CarouselItem key={1}>Slide 1 content</CarouselItem>
      <CarouselItem key={2}>Slide 2 content</CarouselItem>
    </Carousel>
  );

React.renderComponent(carouselInstance, mountNode);