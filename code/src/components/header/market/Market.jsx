import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../store/features/products";
import Flickity from "flickity";
import "flickity/dist/flickity.css";
import "./market.css";
import { Link } from "react-router-dom";

const Market = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const flickityRef = useRef(null);

  useEffect(() => {
    const limit = 194;
    const skip = 0;

    dispatch(fetchProducts({ sort: sortBy, limit, skip }));
  }, [dispatch, sortBy]);

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [
        ...new Set(products.map((product) => product.category)),
      ];
      setCategories(uniqueCategories);
    }
  }, [products]);

  const getFilteredProducts = () => {
    const productsCopy = [...products];
    let filtered = selectedCategory
      ? productsCopy.filter((product) => product.category === selectedCategory)
      : productsCopy;

    return filtered.sort((a, b) => {
      const valueA =
        sortBy === "title" ? a.title : sortBy === "price" ? a.price : a.stock;
      const valueB =
        sortBy === "title" ? b.title : sortBy === "price" ? b.price : b.stock;

      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      } else if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      } else {
        return 0;
      }
    });
  };

  const filteredProducts = getFilteredProducts();
  const start = (currentPage - 1) * 12;
  const end = start + 12;
  const displayedProducts = filteredProducts.slice(start, end);
  const isNextPageAvailable = filteredProducts.length > end;

  useEffect(() => {
    if (flickityRef.current) {
      const flkty = new Flickity(flickityRef.current, {
        cellAlign: "left",
        contain: true,
      });

      return () => {
        flkty.destroy();
      };
    }
  }, [categories]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalPrice = (price, discount) => {
    const numericPrice = parseFloat(price);
    const numericDiscount = parseFloat(discount) || 0;

    let disc = numericPrice * (numericDiscount / 100);
    let res = numericPrice - disc;
    return res.toFixed(2);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <main className="main container">
      <div className="title__box">
        <div className="title__box--light"></div>
        <p className="title__box--title">Categories</p>
      </div>

      <h3 className="categories__title">Browse By Category</h3>
      <div className="categories" ref={flickityRef}>
        <button
          className="btn__categorie"
          onClick={() => setSelectedCategory("")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            className="btn__categorie"
            key={category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="title__box">
        <div className="title__box--light"></div>
        <p className="title__box--title">Our Products</p>
      </div>

      <div className="filter">
        <h3 className="categories__title">Explore Our Products</h3>

        <div className="filter__otherside">
          <div className="filter__top">
            <select
              className="btn__option"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Sort by Title</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
            </select>

            <button
              className="btn__order"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              Toggle Sort Order
            </button>
          </div>
          <div className="pagination">
            <button
              className="btn__pagination"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Back
            </button>
            <button
              className="btn__pagination"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={!isNextPageAvailable}
            >
              Forward
            </button>
          </div>
        </div>
      </div>

      <div className="market">
        <ul className="cards">
          {displayedProducts.map((product) => (
            <Link
              to={`/cardwin/${product.id}`}
              className="card"
              key={product.id}
            >
              <img src={product.thumbnail} alt="" className="card__img" />
              <p className="card__title">{truncateText(product.title, 20)}</p>
              <p className="card__desc">
                {truncateText(product.description, 20)}
              </p>
              <p className="card__stock">{product.stock} items</p>
              <p className="card__price">${product.price}</p>
              <p className="card__price--total">
                ${totalPrice(product.price, product.discountPercentage)}
              </p>
            </Link>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Market;
