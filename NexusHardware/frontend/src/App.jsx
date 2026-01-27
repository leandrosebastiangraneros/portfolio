import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Dashboard from './components/Dashboard';
import StarBackground from './components/StarBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [view, setView] = useState('store'); // 'store' or 'dashboard'
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setError("Error de Conexión con el Servidor");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (view === 'store') {
      fetchProducts();
    }
  }, [view]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);

    // Auto-close cart after 3 seconds for smoother UX (optional, but professional)
    setTimeout(() => setIsCartOpen(false), 4000);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    const productIds = cart.map(item => item.id);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_ids: productIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en la compra');
      }

      const data = await response.json();
      alert(`¡Compra Exitosa! ${data.message || ''}`);
      setCart([]);
      fetchProducts(); // Refresh stock
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <StarBackground />
      <div className="atmosphere-overlay">
        <div className="grain"></div>
        <div className="scanlines"></div>
      </div>

      <div className="min-h-screen relative z-10 font-main text-gray-100 flex flex-col">
        <Navbar
          currentView={view}
          onViewChange={setView}
          cartCount={cart.length}
          toggleCart={() => setIsCartOpen(!isCartOpen)}
        />

        {/* Floating Cart Modal / Slide-over */}
        {isCartOpen && (
          <div className="relative z-50">
            <Cart
              cartItems={cart}
              onCheckout={handleCheckout}
              onRemove={removeFromCart}
              checkoutDisabled={checkoutLoading}
            />
            {/* Backdrop for cart close */}
            <div
              className="fixed inset-0"
              onClick={() => setIsCartOpen(false)}
            ></div>
          </div>
        )}

        {view === 'store' && <Hero />}

        <main className="flex-grow container mx-auto px-6 py-8">
          {view === 'dashboard' ? (
            <Dashboard />
          ) : (
            <>
              {/* Store Header Section */}
              {view === 'store' && (
                <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-4">
                  <h2 className="text-2xl font-display font-bold tracking-widest text-white">
                    LATEST_ARRIVALS
                  </h2>
                  <div className="text-xs font-mono text-gray-500">
                    SHOWING {products.length} UNITS
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative mb-6 text-center backdrop-blur-md" role="alert">
                  <strong className="font-bold">SYSTEM_ERROR: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-2xl text-accent-purple animate-pulse font-mono flex items-center gap-3">
                    <span className="inline-block w-3 h-3 bg-accent-purple rounded-full animate-bounce"></span>
                    LOADING_INVENTORY...
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {products.map(product => (
                    <div key={product.id} className="relative group">
                      <ProductCard
                        name={product.name}
                        price={product.price}
                        category={product.category}
                        image_url={product.image_url}
                        onAddToCart={() => addToCart(product)}
                      />
                      {/* Stock Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className={`px-2 py-1 text-[10px] font-mono font-bold rounded-sm border ${product.stock > 0 ? 'bg-black/80 border-green-500/50 text-green-400' : 'bg-red-900/80 border-red-500 text-red-200'}`}>
                          {product.stock > 0 ? `STOCK: ${product.stock}` : 'OUT_OF_STOCK'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;
