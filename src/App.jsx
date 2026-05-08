import { useState } from 'react'
import './index.css'

function CartDrawer({ open, onClose }) {
  return (
    <>
      <div className={`drawer-overlay${open ? ' is-open' : ''}`} onClick={onClose} />
      <aside className={`drawer${open ? ' is-open' : ''}`}>
        <div className="drawer__header">
          <span className="drawer__title">Carrito</span>
          <button className="drawer__close" onClick={onClose}>✕</button>
        </div>
        <div className="drawer__body">
          <iframe
            src="/carrito/"
            title="Carrito"
            className="drawer__iframe"
          />
        </div>
      </aside>
    </>
  )
}

const NAV = ['Productos', 'Accesorios', 'Consumibles', 'Tecnología', 'Historia']

// ── Configuración de la API del carrito ──────────────────────────
const CART_API_URL = 'https://TU_API_AQUI/carrito/agregar'  // reemplazar
const CART_API_TOKEN = 'TU_TOKEN_AQUI'                       // reemplazar

async function addToCartApi(codigo) {
  const res = await fetch(CART_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CART_API_TOKEN}`,
    },
    body: JSON.stringify({ codigo }),
  })
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}
// ─────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    id: 'RGEN000769',
    name: 'Adaptador 1/2 a 1/4 Hex - Hikoki',
    price: '10,38',
    img: 'https://placehold.co/200x200/f5f5f5/999?text=Adaptador+1%2F2',
  },
  {
    id: 'RGEN000770',
    name: 'Adaptador 3/4 a 1/2 105mm - Hikoki',
    price: '31,87',
    img: 'https://placehold.co/200x200/f5f5f5/999?text=Adaptador+3%2F4',
  },
  {
    id: 'RGEN000792',
    name: 'Adaptador a SDS-Plus de 13mm Hex - Hikoki',
    price: '141,97',
    img: 'https://placehold.co/200x200/f5f5f5/999?text=SDS-Plus+13mm',
  },
  {
    id: 'RESP006768',
    name: 'Adaptador Corona SDS Max 450mm Hex - Hikoki',
    price: '138,42',
    img: 'https://placehold.co/200x200/f5f5f5/999?text=SDS+Max+450mm',
  },
  {
    id: 'RESP006767',
    name: 'Adaptador Corona SDS Plus 115mm - Hikoki',
    price: '106,48',
    img: 'https://placehold.co/200x200/f5f5f5/999?text=SDS+Plus+115mm',
  },
  {
    id: 'RGEN000793',
    name: 'Adaptador SDS Max a SDS Plus - Hikoki',
    price: '130,14',
    img: 'https://placehold.co/200x200/f5f5f5/999?text=SDS+Max%2FPlus',
  },
  {
    id: 'RESP005774',
    name: 'Soporte para Multiples Herramientas de Velcro Hikoki 93x93 MSU93D',
    price: '28,39',
    img: 'https://placehold.co/200x200/f5f5f5/999?text=MSU93D',
  },
]

function Header({ onCartOpen }) {
  return (
    <header className="header">
      <div className="header__inner">
        <a href="/" className="header__logo">HiKOKI</a>
        <nav>
          {NAV.map(label => (
            <a
              key={label}
              href="#"
              className={`nav-link${label === 'Accesorios' ? ' active' : ''}`}
            >
              {label}
            </a>
          ))}
        </nav>
        <button className="cart-btn" onClick={onCartOpen} aria-label="Abrir carrito">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>
    </header>
  )
}

function ProductCard({ product }) {
  const [status, setStatus] = useState('idle') // idle | loading | ok | error

  async function handleAdd() {
    setStatus('loading')
    try {
      await addToCartApi(product.id)
      setStatus('ok')
      setTimeout(() => setStatus('idle'), 1500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  const btnLabel = {
    idle:    '+ Agregar al carrito',
    loading: 'Agregando…',
    ok:      '✓ Agregado',
    error:   '✕ Error, reintentar',
  }[status]

  return (
    <div className="card">
      <div className="card__image">
        <img src={product.img} alt={product.name} loading="lazy" />
      </div>
      <div className="card__body">
        <span className="card__code">Código: {product.id}</span>
        <p className="card__name">{product.name}</p>
        <div className="card__price">
          <span>U$S {product.price}</span>
          <span className="card__iva">+ 21%</span>
        </div>
        <button
          className={`add-to-cart-btn add-to-cart-btn--${status}`}
          onClick={handleAdd}
          disabled={status === 'loading'}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <Header onCartOpen={() => setDrawerOpen(true)} />
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main className="page">
        <a className="breadcrumb" href="#">← Volver a categorías</a>
        <h1 className="page-title">Adaptadores</h1>
        <p className="product-count">{PRODUCTS.length} productos</p>
        <div className="product-grid">
          {PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </main>
    </>
  )
}
