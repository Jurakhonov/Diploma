import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Flickity from "flickity";
import "flickity/dist/flickity.css";

import "./cardWin.css";

const CardWin = () => {
  const { products, loading, error } = useSelector((state) => state.products);
  const { id } = useParams();

  const flickityRef = useRef(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalPrice = (price, discount) => {
    const numericPrice = parseFloat(price);
    const numericDiscount = parseFloat(discount) || 0;

    let disc = numericPrice * (numericDiscount / 100);
    let res = numericPrice - disc;
    return res.toFixed(2);
  };

  const product = products.find((product) => product.id.toString() === id);

  if (!product) return <div>Product not found</div>;

  const [count, setCount] = useState(0);

  const add = (setCount, need, max) => {
    if (need < max) {
      return setCount(need + 1);
    }
    return need;
  };

  const take = (setCount, need) => {
    if (need > 0) {
      return setCount(need - 1);
    }
    return 0;
  };

  const relatedProducts = products.filter(
    (prod) => prod.category === product.category && prod.id !== product.id // Ensure not to include the current product
  );

  useEffect(() => {
    if (flickityRef.current) {
      const flkty = new Flickity(flickityRef.current, {
        cellAlign: "left",
        contain: true,
        pageDots: false,
        wrapAround: true,
      });

      return () => {
        flkty.destroy();
      };
    }
  }, [relatedProducts]);

  return (
    <div className="cardWin container">
      <div className="choice">
        <Swiper
          className="swiper"
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 3000 }}
          navigation
          loop={true}
          speed={2000}
        >
          {product.images.map((image, index) => (
            <SwiperSlide className="swiper__slide" key={index}>
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="card__images"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="card__data">
          <p className="card__title">{product.title}</p>
          <p className="card__descptn">{product.description}</p>
          <p className="card__stock">{product.stock} items</p>
          <p className="card__price">${product.price}</p>
          <p className="card__price--total">
            ${totalPrice(product.price, product.discountPercentage)}
          </p>
          <div className="bucket__add">
            <div className="bucket__count">
              <button
                className="add__btn"
                onClick={() => {
                  take(setCount, count);
                }}
              >
                -
              </button>
              <p className="add__num">{count}</p>
              <button
                className="add__btn second"
                onClick={() => {
                  add(setCount, count, product.stock);
                }}
              >
                +
              </button>
            </div>
            <button className="add">Buy Now</button>
          </div>
        </div>
      </div>
      <div className="choice__other">
        <div className="title__box">
          <div className="title__box--light"></div>
          <p className="title__box--title">Related Item</p>
        </div>
      </div>
      <Swiper
        className="related__swiper"
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 3000 }}
        navigation
        loop={true}
        speed={2000}
        slidesPerView={"auto"}
        spaceBetween={30}
      >
        {relatedProducts.map((prod) => (
          <SwiperSlide key={prod.id} className="related__card">
            <Link to={`/cardwin/${prod.id}`} className="related__card--link">
              <img
                src={prod.thumbnail}
                alt={prod.title}
                className="related__card__img"
              />
              <p className="related__card__title">{prod.title}</p>
              <p className="related__card__desc card__descptn">
                {prod.description}
              </p>
              <p className="related__card__stock card__stock">
                {prod.stock} items
              </p>
              <p className="related__card__price card__price">${prod.price}</p>
              <p className="card__price--total related__card__price--total">
                ${totalPrice(prod.price, prod.discountPercentage)}
              </p>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardWin;
