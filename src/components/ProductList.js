import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    let result = await fetch(
      "https://retail-ease-backend-qf94.vercel.app/products",
      {
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );
    result = await result.json();
    setProducts(result);
  };

  const deleteProduct = async (id) => {
    let result = await fetch(
      `https://retail-ease-backend-qf94.vercel.app/product/${id}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );
    result = await result.json();
    if (result.deletedCount > 0) {
      alert("Product deleted successfully!");
      getProducts();
    } else {
      alert("Failed to delete product");
    }
  };

  const debouncedSearchHandle = debounce(async (key) => {
    if (key) {
      let result = await fetch(
        `https://retail-ease-backend-qf94.vercel.app/search/${key}`,
        {
          headers: {
            authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
      result = await result.json();
      if (result) {
        setProducts(result);
      }
    } else {
      getProducts();
    }
  }, 300);

  const searchHandle = (event) => {
    debouncedSearchHandle(event.target.value);
  };

  return (
    <div
      className="product-list"
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "auto",
        overflowX: "hidden", // Hide horizontal overflow
      }}
    >
      <h3
        style={{
          textAlign: "center",
          fontSize: "24px",
          marginBottom: "20px",
        }}
      >
        Product List
      </h3>
      <input
        className="search-product-box"
        type="text"
        placeholder="Search Product"
        onChange={searchHandle}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <ul
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          backgroundColor: "lightblue",
          fontWeight: "bold",
          borderBottom: "2px solid #ccc",
          flexWrap: "wrap", // Allow wrapping on small screens
        }}
      >
        <li style={{ flex: 1, minWidth: "50px" }}>S. No</li>
        <li style={{ flex: 3, minWidth: "120px" }}>Name</li>
        <li style={{ flex: 2, minWidth: "80px" }}>Price</li>
        <li style={{ flex: 3, minWidth: "100px" }}>Category</li>
        <li style={{ flex: 2, minWidth: "100px" }}>Operation</li>
      </ul>
      {products.length > 0 ? (
        products.map((item, index) => (
          <ul
            key={item._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #ddd",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <li style={{ flex: 1, minWidth: "50px" }}>{index + 1}</li>
            <li style={{ flex: 3, minWidth: "120px" }}>{item.name}</li>
            <li style={{ flex: 2, minWidth: "80px" }}>Rs{item.price}</li>
            <li style={{ flex: 3, minWidth: "100px" }}>{item.category}</li>
            <li style={{ flex: 2, minWidth: "100px" }}>
              <button
                onClick={() => deleteProduct(item._id)}
                style={{
                  padding: "5px 10px",
                  marginRight: "10px",
                  marginBottom:"1px",
                  backgroundColor: "red",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
              <Link
                to={"/update/" + item._id}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "5px",
                }}
              >
                Update
              </Link>
            </li>
          </ul>
        ))
      ) : (
        <h1
          style={{
            textAlign: "center",
            color: "red",
            marginTop: "20px",
          }}
        >
          No Result Found
        </h1>
      )}
    </div>
  );
};

export default ProductList;
