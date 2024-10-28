import React from "react";
import "./header.css";
import { Link } from "react-router-dom";
import BucketImg from "../../assets/Cart.svg";

const Header = () => {
  return (
    <header className="header">
      <div className="header__box container">
        <h1 className="logo">Final Project</h1>
        <ul className="menu">
          <li>
            <Link to="/" className="menu__link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="menu__link">
              About
            </Link>
          </li>
          <li>
            <Link to="/contacts" className="menu__link">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/bucket" className="menu__link">
              <img src={BucketImg} alt="" className="" />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
