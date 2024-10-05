import React, { useEffect, useState } from "react";
import {debounce} from "lodash";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    let result = await fetch("https://retail-ease-backend-qf94.vercel.app/products", {
      headers: {
        authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    setProducts(result);
  };

  const deleteProduct = async (id) => {
    let result = await fetch(`https://retail-ease-backend-qf94.vercel.app/product/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`, // Add authorization header
      },
    });
    result = await result.json();
    if (result.deletedCount > 0) { // Check if any document was deleted
      alert("Product deleted successfully!");
      getProducts(); // Refresh product list
    } else {
      alert("Failed to delete product");
    }
  };

  const debouncedSearchHandle = debounce(async (key) => {
    if (key) {
      let result = await fetch(`https://retail-ease-backend-qf94.vercel.app/search/${key}`, {
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      result = await result.json();
      if (result) {
        setProducts(result);
      }
    } else {
      getProducts();
    }
  }, 300); // 300ms debounce delay
  
  const searchHandle = (event) => {
    debouncedSearchHandle(event.target.value);
  };

  return (
    <div className="product-list">
      <h3>Product List</h3>
      <input
        className="search-product-box"
        type="text"
        placeholder="Search Product"
        onChange={searchHandle}
      />
      <ul>
        <li>S. No</li>
        <li>Name</li>
        <li>Price</li>
        <li>Category</li>
        <li>Operation</li>
      </ul>
      {products.length > 0 ? (
        products.map((item, index) => (
          <ul key={item._id}>
            <li>{index + 1}</li>
            <li>{item.name}</li>
            <li>{item.price}</li>
            <li>{item.category}</li>
            <li>
              <button onClick={() => deleteProduct(item._id)}>Delete</button>
              <Link to={"/update/" + item._id}>Update</Link>
            </li>
          </ul>
        ))
      ) : (
        <h1>No Result Found</h1>
      )}
    </div>
  );
};

export default ProductList;
