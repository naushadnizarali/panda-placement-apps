import React, { Component } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import styles from '../clientSetion/clientSection.module.css';

class SlickCarousel extends Component {
  render() {
    const settings = {
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      easing: 'ease',
      responsive: [
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 3,
          },
        },
      ],
    };

    return (
      <div>
        <Slider {...settings} className={styles.slider_images}>
          <div>
            <img
              src="https://superio-appdir.vercel.app/_next/image?url=%2Fimages%2Fclients%2F1-4.png&w=96&q=75"
              alt="Image 1"
            />
          </div>
          <div>
            <img
              src="https://superio-appdir.vercel.app/_next/image?url=%2Fimages%2Fclients%2F1-5.png&w=96&q=75"
              alt="Image 2"
            />
          </div>
          <div>
            <img
              src="https://superio-appdir.vercel.app/_next/image?url=%2Fimages%2Fclients%2F1-6.png&w=96&q=75"
              alt="Image 3"
            />
          </div>
          <div>
            <img
              src="https://superio-appdir.vercel.app/_next/image?url=%2Fimages%2Fclients%2F1-7.png&w=96&q=75"
              alt="Image 4"
            />
          </div>
          <div>
            <img
              src="https://superio-appdir.vercel.app/_next/image?url=%2Fimages%2Fclients%2F1-1.png&w=96&q=75"
              alt="Image 5"
            />
          </div>
          <div>
            <img
              src="https://superio-appdir.vercel.app/_next/image?url=%2Fimages%2Fclients%2F1-6.png&w=96&q=75"
              alt="Image 6"
            />
          </div>
          <div>
            <img
              src="https://superio-appdir.vercel.app/_next/image?url=%2Fimages%2Fclients%2F1-7.png&w=96&q=75"
              alt="Image 7"
            />
          </div>
        </Slider>
      </div>
    );
  }
}

export default SlickCarousel;
