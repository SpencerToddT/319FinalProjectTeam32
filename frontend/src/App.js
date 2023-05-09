import { useState, useEffect } from "react";
import { Categories } from "./Categories";

function App() {

  const [updatedShop, setUpdated] = useState(false);
  const [view, setView] = useState(5);
  const [product, setProduct] = useState([]);
  const [oneProduct, setOneProduct] = useState([]);
  const [viewer1, setViewer1] = useState(false);
  const [viewer2, setViewer2] = useState(false);
  const [viewer4, setViewer4] = useState(false);
  const [checked4, setChecked4] = useState(false);
  const [index, setIndex] = useState(0);
  const [updatePrice, setPrice] = useState(0);
  const [ProductsCategory, setProductsCategory] = useState(product);
  const [query, setQuery] = useState("");
  const [ProductsUnfiltered, setProductsUnfiltered] = useState(product);
  const [cart, setCart] = useState([]);
  const [singleCart, setCartSingle] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [addNewProduct, setAddNewProduct] = useState({
    _id: 0,
    title: "",
    price: 0.0,
    description: "",
    category: "",
    image: "http://127.0.0.1:4000/images/",
  });

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    getAllProducts();
  }, [checked4]);

  useEffect(() => {
    total();
  }, [cart]);

  function orderSent()
  {
    setView(5);
    setCart([]);
    setCartSingle([]);
    setCartTotal(0);
    clearFilter();
    alert("Purchase Successfull\nHappy Adventuring");
  }
  
  const total = () => {
    let totalVal = 0;
    for (let i = 0; i < cart.length; i++) {
      totalVal += cart[i].price;
    }
    setCartTotal(totalVal);
  }

  function inSingle(el) {
    for(let i = 0; i < singleCart.length; i++)
    {
      if(el._id == singleCart[i]._id)
      {
        return true;
      }
    }
    return false;
  }

  const addToCart = (el) => {
    setCart([...cart, el]);
    if(!inSingle(el))
    {
      addToSingleCart(el);
    }
  }

  const addToSingleCart = (el) => {
    setCartSingle([...singleCart, el]);
  }
  
  const removeFromCart = (el) => {
        let itemFound = false;
        const updatedCart = cart.filter((cartItem) => {
          if (cartItem._id === el._id && !itemFound) {
            itemFound = true;
            return false;
          }
          return true;
        });
        if (itemFound) {
          setCart(updatedCart);
        }
        if(howManyofThis(el._id) == 1)
        {
          removeSingle(el._id);
        }
  }
  
  const removeSingle = (idNum) => {
    setCartSingle((singleCart) =>
      singleCart.filter((item) => item._id !== idNum)
    );
  }

  function howManyofThis(id) {
    let hmot = cart.filter((cartItem) => cartItem._id === id);
    return hmot.length;
  }

  function handleClick(tag) {
    console.log("Step 4 : in handleClick", tag);
    let filtered = product.filter((cat) => cat.category === tag);
    setProductsCategory(filtered);
    // ProductsCategory = filtered;
    console.log("Step 5 : ", product.length, ProductsCategory.length);
  }

  function clearFilter() {
    setProductsCategory(ProductsUnfiltered);
    setQuery("");
  }

  const handleChangeS = (e) => {
    setQuery(e.target.value);
    console.log(
      "Step 6 : in handleChange, Target Value :",
      e.target.value,
      " QueryValue :",
      query
    );
    const results = product.filter((eachProduct) => {
      if (e.target.value === "") return ProductsCategory;
      return eachProduct.title
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setProductsCategory(results);
  }

  function getAllProducts() {
    fetch("http://localhost:4000/products")
      .then((response) => response.json())
      .then((data) => {
        console.log("Show Catalog of Products :");
        console.log(data);
        setProduct(data);
        setProductsCategory(data);
        setProductsUnfiltered(data);
      });
    setViewer1(!viewer1);
    setUpdated(true);
  }

  function handleUpdate(evt) {
    setPrice(evt.target.value);
  }

  function handleChange(evt) {
    const value = evt.target.value;
    if (evt.target.name === "_id") {
      setAddNewProduct({ ...addNewProduct, _id: value });
    } else if (evt.target.name === "title") {
      setAddNewProduct({ ...addNewProduct, title: value });
    } else if (evt.target.name === "price") {
      setAddNewProduct({ ...addNewProduct, price: value });
    } else if (evt.target.name === "description") {
      setAddNewProduct({ ...addNewProduct, description: value });
    } else if (evt.target.name === "category") {
      setAddNewProduct({ ...addNewProduct, category: value });
    } else if (evt.target.name === "image") {
      const temp = value;
      setAddNewProduct({ ...addNewProduct, image: temp });
    }
  }

  function handleOnSubmit(e) {
    e.preventDefault();
    console.log(e.target.value);
    fetch("http://localhost:4000/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addNewProduct),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Post a new product completed");
        console.log(data);
        if (data) {
          //const keys = Object.keys(data);
          const value = Object.values(data);
          alert(value);
        }
      });
      setUpdated(false);
  }

  function getOneByOneProductNext() {
    if (product.length > 0) {
      if (index === product.length - 1) setIndex(0);
      else setIndex(index + 1);
      if (product.length > 0) setViewer4(true);
      else setViewer4(false);
    }
  }

  function getOneByOneProductPrev() {
    if (product.length > 0) {
      if (index === 0) setIndex(product.length - 1);
      else setIndex(index - 1);
      if (product.length > 0) setViewer4(true);
      else setViewer4(false);
    }
  }

  function deleteOneProduct(deleteid) {
    console.log("Product to delete :", deleteid);
    fetch("http://localhost:4000/delete/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: deleteid }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Delete a product completed : ", deleteid);
        console.log(data);
        if (data) {
          const keys = Object.keys(data);
          const value = Object.values(data);
          alert(value);
        }
      });
    setChecked4(!checked4);
    setUpdated(false);
  }

  function updateOneProduct(updateid) {
    console.log("Product to update :", updateid, " at price ", updatePrice);
    fetch("http://localhost:4000/update/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: updateid, price: updatePrice}),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Update a product completed : ", updateid);
        console.log(data);
        if (data) {
          const keys = Object.keys(data);
          const value = Object.values(data);
          alert(value);
        }
      });
      setChecked4(!checked4);
  }


//Helper Renders ==================================================================================
const cartItems = singleCart.map((el) => (
  <div>
  <div key={el._id} className="relative py-0 border-black border-solid border-4 m-4 grid grid-cols-2 bg-black overscroll-y-auto rounded-lg">
    <div className="grid bg-gray-600 w-full place-items-center rounded-l-md">
      <img class="img-fluid w-4/5 my-2 border-white border-solid border-8 rounded-md" src={el.image} />
    </div>
    <div className="flex justify-center items-center text-3xl text-center font-mono tracking-tight text-black-600 bg-green-200 rounded-r-md">
      <div classname="">
        <div className="">
          <h1 className="my-3">{howManyofThis(el._id)} <span className="underline">{el.title}</span></h1>
        </div>
        <div className="">
          <h1>Total: ${(el.price * howManyofThis(el._id)).toFixed(2)}</h1>
        </div>
      </div>
      <div className="absolute flex justify-between p-3 bg-green-400 w-1/2 right-0 bottom-0 rounded-br-md">
        <button  type="button" onClick={() => removeFromCart(el)}>-</button>
        <p className="mt-1 text-sm text-black">{howManyofThis(el._id)}</p>
        <button type="button" variant="light" onClick={() => addToCart(el)}>+</button>
      </div>
    </div>
  </div>
  <div>
    <br></br>
  </div>
  </div>
));

const render_products = (ProductsCategory) => {
  return (
    <div className="category-section fixed mb-20">
      {console.log("Step 3 : in render_products ")}
      <h2
        className="text-3xl font-extrabold tracking-tight text-green-400 category-title"
      >
        Items ({ProductsCategory.length})
      </h2>
      <div
        className="m-6 p-3 mb-20 mt-10 ml-0 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-10"
        style={{ maxHeight: "800px", overflowY: "scroll", paddingBottom: "100%"}}
      >
        {/* Loop Products */}
        {ProductsCategory.map((product, index) => (
          <div>
          <div key={index} className="relative shadow-lg">
            <div
              className="min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden lg:aspect-none group-hover:-translate-y-2 h-auto"
            >
              <img
                alt="Product Image"
                src={product.image}
                  />
            </div>
            <div className="flex justify-between p-3">
              <div>
                <h3 className="text-sm text-gray-700">
                  <a href={product.href}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    <span style={{ fontSize: "16px", fontWeight: "600" }}>
                      {product.title}
                    </span>
                  </a>
                  <p className="italic tracking-tight text-blue-400">{product.category}</p>
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {" "}{product.description}
                </p>
              </div>
              <p
                className="text-sm font-medium text-green-600"
              >
                ${product.price.toFixed(2)}
              </p>
            </div>
            
          </div>
          <div className="flex justify-between p-3 bg-green-400 rounded-b-lg">
              <button  type="button" onClick={() => removeFromCart(product)}>-</button>
              <p className="mt-1 text-sm text-black">{howManyofThis(product._id)}</p>
              <button type="button" variant="light" onClick={() => addToCart(product)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
// End of Helper Renders ----------------------------------------------------------------------------------------


//View Renders ==================================================================================
  const render_shop = () => {
    return (
      <div>
        {" "}
        <div className="flex justify-center pt-2">
        <h3 className="font-semibold text-2xl">Items in cart</h3>
        </div>
        <hr className="w-48 h-1 mx-auto bg-green-300 rounded"></hr>
        <div>{cartItems}</div>
        <div className="flex justify-center pt-2">
          <p className="px-5 text-2xl font-semibold tracking-tight text-black-600 text-center">
            Cart Total: <span className="italic">${Number((cartTotal).toFixed(2))}</span>
          </p>
          </div>
          <div className="flex justify-center pt-2 mb-5">
          <button 
          className="inline-block bg-blue-400 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mt-2"
          onClick={() => setView(5)}>
            Return</button>
          <button 
          className="inline-block bg-blue-400 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mt-2" 
          onClick={orderSent}> 
            Confirm</button>
        </div>
          
      </div>
    );
  }

  const render_app = () => {
    return (
      <div className="flex fixed flex-row mb-20">
        {console.log("Step 2 : ReturnApp :", product.length, ProductsCategory.length)}
        <div className="h-screen bg-gray-700 p-3 xl:basis-1/5 rounded-tr-3xl" style={{ minWidth: "80%" }}>
          <div className="px-6 py-4 mb-20">
            <h1 className="text-3xl mb-2 font-bold text-white">
              {" "}
              Final Project
            </h1>
            <p className="text-gray-700 text-white mb-10">
              by {" "}
              <b style={{ color: "white" }}>
                Kyle Kohl & Spencer Thiele
              </b>
            </p>
            <div className="">
              {Categories ? <p className="text-white underline">Types </p> : ""}
              {Categories.map((tag) => (
                <button
                  key={tag}
                  className="inline-block bg-blue-400 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mt-2"
                  onClick={() => {
                    handleClick(tag);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="py-5">
              <input type="search" value={query} onChange={handleChangeS} />
            </div>
            <div className="pb-2">
            <button
                className="inline-block bg-blue-400 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mt-2"
                onClick={() => {
                  clearFilter();
                }}
              >
                Clear Filters
              </button>
            </div>
            <div className="py-10 px-2">
              <button
                className="bg-green-400 px-12 mt-2 rounded-lg"
                onClick={() => {
                  setView(6);
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
        <div className="ml-5 p-10 xl:basis-4/5 mb-24">
          {console.log(
            "Before render :", 
            product.length,
            ProductsCategory.length
          )}
          {render_products(ProductsCategory)}
        </div>
      </div>
    );
  }

  const render_add = () => {
    return (
      <div>
        <div className="flex justify-center pt-2">
        <h3 className="font-semibold text-2xl">Add a new product</h3>
        </div>
        <hr className="w-48 h-1 mx-auto bg-green-300 rounded"></hr>
        <form action="">
          <label className="bg-blue-300 ml-1 pl-3 pr-5 rounded-l-lg">ID:</label>
          <input className="ml-3 shadow-md mb-4"
            type="number"
            placeholder="id?"
            name="_id"
            value={addNewProduct._id}
            onChange={handleChange}
          />
          <br />
          <label className="bg-blue-300 ml-1 pl-3 pr-5 rounded-l-lg">Title</label>
          <input className="ml-3 shadow-md mb-4"
            type="text"
            placeholder="title?"
            name="title"
            value={addNewProduct.title}
            onChange={handleChange}
          />
          <br />
          <label className="bg-blue-300 ml-1 pl-3 pr-5 rounded-l-lg">Price</label>
          <input className="ml-3 shadow-md mb-4"
            type="number"
            placeholder="price?"
            name="price"
            value={addNewProduct.price}
            onChange={handleChange}
          />
          <br />
          <label className="bg-blue-300 ml-1 pl-3 pr-5 rounded-l-lg">Description:</label>
          <input className="ml-3 shadow-md mb-4"
            type="text"
            placeholder="description?"
            name="description"
            value={addNewProduct.description}
            onChange={handleChange}
          />
          <br />
          <label className="bg-blue-300 ml-1 pl-3 pr-5 rounded-l-lg">Category:</label>
          <input className="ml-3 shadow-md mb-4"
            type="text"
            placeholder="category?"
            name="category"
            value={addNewProduct.category}
            onChange={handleChange}
          />
          <br />
          <label className="bg-blue-300 ml-1 pl-3 pr-5 rounded-l-lg">Image:</label>
          <input className="ml-3 shadow-md mb-4"
            type="text"
            placeholder="image?"
            name="image"
            value={addNewProduct.image}
            onChange={handleChange}
          />
          <br />
          <div className="flex justify-center pt-2">
          <button className="px-8 ml-1 py-1 mb-4 rounded-lg bg-green-400" type="submit" onClick={handleOnSubmit}>
            submit
          </button>
          </div>
        </form>
      </div>
    );
  }

  const render_delete = () => {
    return (
      <div>
        <div className="flex justify-center pt-2">
        <h3 className="font-semibold text-2xl">Delete one product</h3>
        </div>
        <hr className="w-48 h-1 mx-auto bg-green-300 rounded"></hr>
        <div className="flex justify-center pt-2">
        <label className="text-align-center bg-blue-300 ml-1 pl-3 pr-5 rounded-t-lg">Activate</label>
        </div>
        <div className="flex justify-center pt-2">
        <input className="shadow-lg mb-4"
          type="checkbox"
          id="acceptdelete"
          name="acceptdelete"
          checked={checked4}
          onChange={(e) => setChecked4(!checked4)}
        />
        </div>
        <div className="w-50 container px-4 mx-auto flex flex-wrap items-center justify-between">
        <button className="bg-green-400 px-12 mt-2 rounded-lg" onClick={() => getOneByOneProductPrev()}>Prev</button>
        <button className="bg-green-400 px-12 mt-2 rounded-lg" onClick={() => getOneByOneProductNext()}>Next</button>
        <button className="bg-green-400 px-12 mt-2 rounded-lg" onClick={() => deleteOneProduct(product[index]._id)}>
          Delete
        </button>
        </div>
        {checked4 && (
          <div className="relative py-0 border-black border-solid border-4 m-4 grid grid-cols-3 bg-blue-200 overscroll-y-auto place-items-center" key={product[index]._id}>
            <img class="img-fluid m-10 m-10 border-white border-solid border-8 border-line" src={product[index].image} /> <br />
            <div className="mr-20 text-1xl text-center font-medium tracking-tight text-black-600 ">
              <h1 className="mt-3"><b>ID</b><br /> {product[index]._id}</h1> <br />
              <h1><b>Title</b><br /> {product[index].title}</h1> <br />
              <h1><b>Category</b><br /> {product[index].category}</h1> <br />
              <h1><b>Price</b><br /> {product[index].price}</h1> <br />
            </div>
          </div>
        )}

      </div>
    );
  }

  const render_update = () => {
    return (
      <div>
        <div className="flex justify-center pt-2">
        <h3 className="font-semibold text-2xl">Update a products price</h3>
        </div>
        <hr className="w-48 h-1 mx-auto bg-green-300 rounded"></hr>
        <div className="flex justify-center pt-2">
        <label className="text-align-center bg-blue-300 ml-1 pl-3 pr-5 rounded-t-lg">Activate</label>
        </div>
        <div className="flex justify-center pt-2">
        <input className="shadow-lg mb-4"
          type="checkbox"
          id="acceptdelete"
          name="acceptdelete"
          checked={checked4}
          onChange={(e) => setChecked4(!checked4)}
        />
        </div>
        <div className="w-50 container px-4 mx-auto flex flex-wrap items-center justify-between">
        <button className="bg-green-400 px-12 mt-2 rounded-lg" onClick={() => getOneByOneProductPrev()}>Prev</button>
        <button className="bg-green-400 px-12 mt-2 rounded-lg" onClick={() => getOneByOneProductNext()}>Next</button>
        <button className="bg-green-400 px-12 mt-2 rounded-lg" onClick={() => updateOneProduct(product[index]._id)}>
          Update
        </button>
        </div>
        {checked4 && (
          <div>
          <div className="relative py-0 border-black border-solid border-4 m-4 grid grid-cols-3 bg-blue-200 overscroll-y-auto place-items-center" key={product[index]._id}>
            <img class="img-fluid m-10 m-10 border-white border-solid border-8 border-line" src={product[index].image} /> <br />
            <div className="mr-20 text-1xl text-center font-medium tracking-tight text-black-600 ">
              <h1 className="mt-3"><b>ID</b><br /> {product[index]._id}</h1> <br />
              <h1><b>Title</b><br /> {product[index].title}</h1> <br />
              <h1><b>Category</b><br /> {product[index].category}</h1> <br />
              <h1><b>Price</b><br /> {product[index].price}</h1> <br />
            </div>
          </div>
          <label className="bg-blue-300 ml-1 pl-3 pr-5 rounded-l-lg">New Price</label>
          <input className="ml-3 shadow-md mb-4"
            type="number"
            placeholder="price?"
            name="price"
            value={updatePrice}
            onChange={handleUpdate}
          />
          </div>
        )}
      </div>
    );
  }

  const render_about = () => {
    return (
      <div>
        <div className="flex justify-center pt-2">
        <h3 className="font-semibold text-lg">Kyle Kohl and Spencer Thiele</h3>
        </div>
        <div className="flex justify-center pt-2">
        <h3 className="font-semibold text-lg">k12@iastate.edu   stthiele@iastate.edu</h3>
        </div>
        <hr className="w-48 h-1 mt-2 mx-auto bg-green-300 rounded"></hr>
        <div className="flex justify-center pt-2">
        <h3 className="font-semibold text-lg">COMS 319: Construction of User Interfaces</h3>
        </div>
        <div className="flex justify-center pt-2">
        <h3 className="font-semibold text-lg">Dr. Abraham N. Aldaco Gastelum</h3>
        </div>
        <div className="flex justify-center pt-2">
        <h3 className="font-semibold text-lg">aaldaco@iastate.edu</h3>
        </div>
        <div className="flex justify-center pt-2">
        <h3 className="font-semibold text-lg">4/30/2023</h3>
        </div>
        <hr className="w-48 h-1 mt-2 mx-auto bg-green-300 rounded"></hr>
        <div className="flex justify-center pt-2">
        <div className="flex justify-center pt-2 flex-wrap w-3/6">
          <p className="text-center">Welcome to Team 32's Final Project Phase 2! Please import our AllProducts.json file into Mongo to view products.
          I hope you enjoy browsing our selection!
          </p>
        </div>
        </div>
      </div>
    );
  }

  const render_nav = () => {
    return (
      <div className="bg-gradient-to-b from-blue-400 to-green-200 mb-8">
        <div className="flex justify-center pt-2">
        <h1 className="font-serif font-bold text-3xl">Magic Mart</h1>
        </div>
        <div className="flex justify-center">
        <h1 className="font-serif font-bold leading-relaxed pb-3">Team 32</h1>
        </div>
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <button className="bg-white px-12 mt-2 rounded-t-lg" type="button" onClick={() => setView(5)}>Shop</button>
          <button className="bg-white px-12 mt-2 rounded-t-lg" type="button" onClick={() => setView(1)}>Add</button>
          <button className="bg-white px-12 mt-2 rounded-t-lg" type="button" onClick={() => setView(2)}>Delete</button>
          <button className="bg-white px-12 mt-2 rounded-t-lg" type="button" onClick={() => setView(3)}>Update</button>
          <button className="bg-white px-12 mt-2 rounded-t-lg" type="button" onClick={() => setView(4)}>About Us</button>
        </div>
      </div>
    )
  }
  // End of Renders -----------------------------------------------------------------------------------------


  //View return
  if(view == 0)
  {
    return (
      <div>
        {render_nav()}
      </div>
    );
  }
  else if(view == 1)
  {
    return (
      <div>
        {render_nav()}
        {render_add()}
      </div>
    );
  }
  else if(view == 2)
  {
    return (
      <div>
        {render_nav()}
        {render_delete()}
      </div>
    );
  }
  else if(view == 3)
  {
    return (
      <div>
        {render_nav()}
        {render_update()}
      </div>
    );
  }
  else if(view == 4)
  {
    return (
      <div>
        {render_nav()}
        {render_about()}
      </div>
    );
  }
  else if(view == 5)
  {
    if(updatedShop == false)
    {
      getAllProducts();
    }
    return (
      <div>
        {render_nav()}
        {render_app()}
      </div>
    );
  }
  else if(view == 6)
  {
    return (
      <div>
        {render_nav()}
        {render_shop()}
      </div>
    );
  }
}

export default App;
