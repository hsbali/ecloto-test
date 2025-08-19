import { useEffect, useMemo, useState } from "react";

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

const QuantitySelector = ({ item, onChange, onAdd, onRemove, width }) => {
  return (
    <div className={`flex`}>
      <button
        className={`bg-red-500 text-white w-6 h-6 rounded-sm ${
          width === "full" && "w-10 h-10"
        }`}
        onClick={() => onRemove(item)}
      >
        -
      </button>
      <input
        type="number"
        className={`outline-none focus:ring-2 ring-offset-2 rounded-md w-6 text-center mx-1 ${
          width === "full" && "grow"
        }`}
        value={item.quantity}
        onChange={(e) => onChange(e, item)}
      />
      <button
        className={`bg-green-500 text-white w-6 h-6 rounded-sm ${
          width === "full" && "w-10 h-10"
        }`}
        onClick={() => onAdd(item)}
      >
        +
      </button>
    </div>
  );
};

export default function Home() {
  const [cartItems, setCartItems] = useState([]);

  const onChangeProductQuantity = (e, product) => {
    let { value: quantity } = e.target;

    if (quantity < 1) {
      quantity = 0;
    }

    setCartItems((prev) => {
      if (quantity === 0) {
        return prev.filter((x) => x.id !== product.id);
      } else {
        return prev.map((x) =>
          x.id === product.id ? { ...x, quantity: quantity } : x
        );
      }
    });
  };

  const addProductToCart = (product) => {
    setCartItems((prev) => {
      const productIndex = prev.findIndex((x) => x.id === product.id);

      if (productIndex !== -1) {
        return prev.map((x, i) =>
          i === productIndex ? { ...x, quantity: x.quantity + 1 } : x
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeProductToCart = (product) => {
    setCartItems((prev) => {
      const productQuantity = prev.find((x) => x.id === product.id)?.quantity;

      if (productQuantity === 1) {
        return prev.filter((x) => x.id !== product.id);
      } else {
        return prev.map((x) =>
          x.id === product.id ? { ...x, quantity: x.quantity - 1 } : x
        );
      }
    });
  };

  const totalValue = useMemo(() => {
    return cartItems.reduce((sum, x) => {
      return sum + x.price * x.quantity;
    }, 0);
  }, [cartItems]);

  useEffect(() => {
    if (totalValue < THRESHOLD) {
      setCartItems((prev) => prev.filter((x) => x.id !== FREE_GIFT.id));
    } else {
      if (!cartItems.some((x) => x.id === FREE_GIFT.id)) {
        setCartItems((prev) => [...prev, { ...FREE_GIFT, quantity: 1 }]);
      }
    }
  }, [totalValue]);

  return (
    <main className="container mx-auto my-8">
      <h1 className="text-4xl font-extrabold text-center">Shopping Cart</h1>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Products</h2>
        <div className="grid grid-cols-12 gap-4">
          {PRODUCTS.map((product) => {
            const cartItem = cartItems.find((x) => x.id === product.id);

            return (
              <div
                key={product.id}
                className="col-span-12 md:col-span-6 lg:col-span-3 bg-white rounded-md shadow-md p-3"
              >
                <h3 className="font-bold mb-2">{product.name}</h3>
                <p className="mb-2">${product.price}</p>
                {!!cartItem ? (
                  <QuantitySelector
                    item={cartItem}
                    onChange={onChangeProductQuantity}
                    onAdd={addProductToCart}
                    onRemove={removeProductToCart}
                    width="full"
                  />
                ) : (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 w-full cursor-pointer"
                    onClick={() => addProductToCart(product)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Cart Summary</h2>
        <div className="bg-white rounded-md shadow-md p-4">
          <div className="flex items-center justify-between py-2 border-b-1 mb-3">
            <span className="font-bold">Subtotal:</span>
            <span className="font-extrabold">${totalValue}</span>
          </div>
          {totalValue < THRESHOLD ? (
            <div className="bg-blue-100 rounded-md p-3">
              <div className="mb-2">
                Add ${THRESHOLD - totalValue} more to get a FREE Wireless Mouse!
              </div>
              <div className="relative">
                <div className="bg-gray-300 h-4 rounded-full"></div>
                <div
                  className={`absolute bg-blue-500 rounded-full h-4 top-0 transition-all`}
                  style={{ width: `${(totalValue * 100) / THRESHOLD}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div>You got a free {FREE_GIFT.name}!</div>
          )}
        </div>
      </div>
      <div className=" mb-4">
        {cartItems.length !== 0 && (
          <h2 className="text-2xl font-bold mb-2">Cart Items</h2>
        )}
        {!!cartItems.length ? (
          <>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-md shadow-md flex flex-col items-center justify-center p-4 mb-3"
              >
                <div className="w-full flex items-center justify-center">
                  <div className="grow">
                    <div className="mb-0.5">{item.name}</div>
                    <div className="text-gray-500">
                      ${item.price} x {item.quantity}
                    </div>
                  </div>
                  {item.id !== FREE_GIFT.id ? (
                    <QuantitySelector
                      item={item}
                      onChange={onChangeProductQuantity}
                      onAdd={addProductToCart}
                      onRemove={removeProductToCart}
                    />
                  ) : (
                    <span className="bg-green-200 text-green-700 text-sm px-3 py-1 rounded-full">
                      FREE GIFT
                    </span>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="bg-white rounded-md shadow-md flex flex-col items-center justify-center py-6 px-4">
            <div className="text-gray-600 text-lg font-semibold mb-2">
              Your Cart is Empty
            </div>
            <p className="text-gray-400">Add some products to see them here!</p>
          </div>
        )}
      </div>
    </main>
  );
}
