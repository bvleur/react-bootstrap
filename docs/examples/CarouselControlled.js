/** @jsx React.DOM */

var key = 1;

function renderCarousel () {
  var carouselInstance = (
    <Carousel activeKey={key} onSelect={handleSelect}>
      <CarouselItem key={1}>Slide 1</CarouselItem>
      <CarouselItem key={2}>Slide 2</CarouselItem>
    </Carousel>
  );
  React.renderComponent(carouselInstance, mountNode);
}

function handleSelect (selectedKey) {
  //alert('selected ' + selectedKey);
  key = selectedKey;
  renderCarousel();
}

renderCarousel();