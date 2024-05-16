import React, { useEffect } from 'react';
import 'owl.carousel/dist/assets/owl.carousel.css'; // Updated import statement
import 'owl.carousel';

const TestimonialsCarousel = () => {
  useEffect(() => {
    // Initialize the Owl Carousel when the DOM content is loaded
    document.addEventListener('DOMContentLoaded', function () {
      const owlCarouselElement = document.querySelector('.owl-carousel1');

      if (owlCarouselElement) {
        $(owlCarouselElement).owlCarousel({
          loop: true,
          center: true,
          margin: 0,
          responsiveClass: true,
          nav: false,
          responsive: {
            0: {
              items: 1,
              nav: false,
            },
            680: {
              items: 2,
              nav: false,
              loop: false,
            },
            1000: {
              items: 3,
              nav: true,
            },
          },
        });
      }
    });

    return () => {
      // Clean up the Owl Carousel when the component unmounts
      const owlCarouselElement = document.querySelector('.owl-carousel1');
      if (owlCarouselElement) {
        $(owlCarouselElement).trigger('destroy.owl.carousel');
      }
    };
  }, []);

  return (
    <div className="gtco-testimonials">
      <h2>Testimonials Carousel - Cards Comments</h2>
      <div className="owl-carousel owl-carousel1 owl-theme">
        <div>
          <div className="card text-center">
            <img
              className="card-img-top"
              src="https://images.unsplash.com/photo-1572561300743-2dd367ed0c9a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=eyJhcHBfaWQiOjF9&ixlib=rb-1.2.1&q=50&w=300"
              alt=""
            />
            <div className="card-body">
              <h5>
                Ronne Galle <br />
                <span> Project Manager </span>
              </h5>
              <p className="card-text">
                “Nam libero tempore, cum soluta nobis est eligendi optio cumque
                nihil impedit quo minus id quod maxime placeat.”
              </p>
            </div>
          </div>
        </div>
        {/* Add more testimonials as needed */}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
