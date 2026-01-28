import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Login from './components/Login';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [view, setView] = useState('store');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    fetch(`http://localhost:8000/products`)
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
        setError("Error connecting to server. Ensure backend is running.");
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
    setTimeout(() => setIsCartOpen(false), 3000);
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
      const response = await fetch(`http://localhost:8000/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_ids: productIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Purchase failed');
      }

      const data = await response.json();
      alert(`Purchase Successful! ${data.message || ''}`);
      setCart([]);
      fetchProducts();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUsername(user);
    setView('dashboard');
  };

  // Guardia de Autenticación para el Dashboard
  useEffect(() => {
    if (view === 'dashboard' && !isAuthenticated) {
      // Si intento acceder al dashboard sin autenticación, ¿me quedo en la tienda o muestro el login?
      // Para este flujo, dejo que la lógica de renderizado maneje mostrar el componente Login
    }
  }, [view, isAuthenticated]);

  if (view === 'dashboard' && !isAuthenticated) {
    return (
      <>
        <Navbar
          currentView={view}
          onViewChange={setView}
          cartCount={cart.length}
          toggleCart={() => setIsCartOpen(!isCartOpen)}
        />
        <Login onLogin={handleLogin} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans flex flex-col">
      <Navbar
        currentView={view}
        onViewChange={setView}
        cartCount={cart.length}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
      />

      {/* Modal del Carrito */}
      {isCartOpen && (
        <div className="relative z-50">
          <Cart
            cartItems={cart}
            onCheckout={handleCheckout}
            onRemove={removeFromCart}
            checkoutDisabled={checkoutLoading}
          />
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          ></div>
        </div>
      )}

      {view === 'store' && <Hero />}

      <main className="flex-grow container mx-auto px-6 py-8">
        {view === 'dashboard' ? (
          <AdminPanel username={username} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700">
              <h2 className="text-3xl font-bold text-slate-100">
                Latest Arrivals
              </h2>
              <div className="text-sm text-slate-400">
                Showing {products.length} products
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6 text-center">
                <strong>Error: </strong>
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-xl text-blue-500 animate-pulse font-medium">
                  Loading Inventory...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
