import { useState, useEffect, useCallback } from 'react';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import PCBuilder from './components/PCBuilder';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Login from './components/Login';
import WhatsAppButton from './components/common/WhatsAppButton';
import API_URL from './config';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('store');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    fetch(`${API_URL}/products`)
      .then(response => {
        if (!response.ok) throw new Error('Response failed');
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Unable to establish connection with inventory node.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (view === 'store') fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
    setIsCartOpen(true);
    // Eliminé el cierre automático para permitir que el usuario vea la interacción con el carrito
    // setTimeout(() => setIsCartOpen(false), 2500); 
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    const orderData = {
      product_ids: cart.map(item => item.id),
      purchase_type: "INDIVIDUAL"
    };

    fetch(`${API_URL}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Checkout transaction failed');
        return res.json();
      })
      .then(data => {
        // Simple success feedback
        alert(`TRANSACTION APPROVED.\nID: ${data.transaction_id}`);
        setCart([]);
        setIsCartOpen(false);
        // Refresh products to show updated stock
        fetchProducts();
      })
      .catch(err => {
        console.error(err);
        alert("TRANSACTION ERROR: Could not process request.");
      })
      .finally(() => {
        setIsCheckingOut(false);
      });
  };

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUsername(user);
    setView('dashboard');
  };

  // Guardián de Autenticación que implementé para proteger el dashboard
  if (view === 'dashboard' && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-void text-txt-primary font-sans selection:bg-accent selection:text-black">
        <Navbar currentView={view} onViewChange={setView} cartCount={cart.length} toggleCart={() => setIsCartOpen(!isCartOpen)} />
        <Login onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void text-txt-primary font-sans selection:bg-accent selection:text-black flex flex-col">
      <Navbar
        currentView={view}
        onViewChange={setView}
        cartCount={cart.length}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
      />

      {/* Modal del Carrito - Ahora con props funcionales que conecté */}
      {isCartOpen && (
        <Cart
          cartItems={cart}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
          onRemove={removeFromCart}
          checkoutDisabled={isCheckingOut}
        />
      )}

      {/* Deployment Feature: WhatsApp Floating Action Button */}
      <WhatsAppButton />

      <main className="grow">
        {view === 'store' && (
          <>
            <Hero />

            <section id="store-section" className="container mx-auto px-4 md:px-6 py-20 max-w-7xl">
              {/* Header Grid */}
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-8">
                <div>
                  <h2 className="font-display font-bold text-3xl text-white mb-2 tracking-wide">
                    CATALOG
                  </h2>
                  <p className="text-txt-secondary text-sm max-w-md">
                    Browse high-performance components verified for compatibility.
                  </p>
                </div>

                {/* Filtros tipo "Píldora" (Simulados para la demo) */}
                <div className="flex gap-2 mt-6 md:mt-0 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                  {['All', 'Processors', 'Graphics', 'Memory', 'Storage'].map((filter, i) => (
                    <button key={filter} className={`
                                px-4 py-2 rounded-full border text-xs font-medium transition-all whitespace-nowrap
                                ${i === 0 ? 'bg-white text-black border-white' : 'border-white/10 text-txt-dim hover:text-white hover:border-white/30'}
                             `}>
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error State */}
              {error && (
                <div className="bg-error/5 border border-error/20 text-error p-8 rounded-xl text-center font-mono text-sm max-w-2xl mx-auto mb-12">
                  <span className="block text-2xl mb-2">⚠</span>
                  {error}
                </div>
              )}

              {/* Loading State */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-[400px] bg-white/5 rounded-xl"></div>
                  ))}
                </div>
              ) : (
                /* Grilla de Productos */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => addToCart(product)}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {view === 'builder' && <PCBuilder onAddToCart={addToCart} />}
        {view === 'dashboard' && <AdminPanel username={username} />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
