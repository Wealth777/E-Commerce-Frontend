import { useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity } from '../../store/cartActions';
import { useTheme } from '../../context/ThemeContext';
import { ShoppingBag } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const Icon = {
  ArrowLeft: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...p}>
      <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Trash: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...p}>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" />
    </svg>
  ),
  Minus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  Plus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  Shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...p}>
      <path d="M12 2 4 6v5c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6l-8-4z" />
      <path d="M9.5 12.5 11 14l3.5-4" strokeLinecap="round" />
    </svg>
  ),
  Truck: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...p}>
      <path d="M1 3h15v11H1zM16 8h3l3 4v2h-6zM5.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </svg>
  ),
  Tag: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...p}>
      <path d="M20 12V7a2 2 0 0 0-2-2h-5l-7 7 7 7 7-7z" />
      <circle cx="14" cy="8" r="1.5" />
    </svg>
  ),
  Sparkle: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} {...p}>
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
    </svg>
  ),
};

function formatNaira(n) {
  return `₦${n.toLocaleString("en-NG")}`;
}

const Cart = () => {
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const navigate = useNavigate();


  // theme classes
  const shell = isDark
    ? "bg-[#0b0c0f] text-zinc-100"
    : "bg-[#f6f7fb] text-zinc-900";
  const card = isDark
    ? "bg-zinc-900/60 ring-1 ring-white/10 backdrop-blur-xl"
    : "bg-white/80 ring-1 ring-zinc-900/5 backdrop-blur-xl";
  const subtle = isDark ? "text-zinc-400" : "text-zinc-500";
  const divider = isDark ? "border-white/10" : "border-zinc-200";

  const TAX_PER_VENDOR = 10;

  // GROUP BY VENDOR
  const groupedCart = useMemo(() => {
    return Object.values(
      items.reduce((acc, item) => {
        const vendorId = item.vendorId || "unknown";

        if (!acc[vendorId]) {
          acc[vendorId] = {
            vendorId,
            vendorName: item.vendorName || "Unknown Vendor",
            items: [],
          };
        }

        acc[vendorId].items.push(item);
        return acc;
      }, {})
    );
  }, [items]);

  const vendorCount = groupedCart.length;

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0),
    [items]
  );

  // const tax = subtotal > 100000 || subtotal === 0 ? 0 : 10;

  // const total = Math.max(0, subtotal + tax);

  const totalTax = TAX_PER_VENDOR * vendorCount;

  const total = subtotal + totalTax;

  const freeShipProgress = Math.min(100, Math.round((subtotal / 100000) * 100));

  const updateQty = (id, q) => {
    if (q <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: q }));
    }
  };

  const remove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className={`min-h-screen ${shell} antialiased`}>
      {/* ambient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -left-24 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-sky-500/15 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        {/* top bar */}
        <div className="mb-8 flex items-center justify-between">
          <button
            className={`group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${isDark ? "bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 ring-1 ring-white/10" : "bg-white/70 hover:bg-white text-zinc-600 ring-1 ring-zinc-900/5"}`}
            onClick={() => navigate('/products')}
          >
            <Icon.ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            Back
          </button>
        </div>

        {/* header */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">Your Cart</h1>
            <p className={`mt-1 text-sm ${subtle}`}>{items.length} {items.length === 1 ? "item" : "items"} • Free returns within 14 days</p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${isDark ? "bg-zinc-900/70 ring-1 ring-white/10" : "bg-white/70 ring-1 ring-zinc-900/5"}`}>
              <Icon.Shield className="h-3.5 w-3.5" /> Secure checkout
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${isDark ? "bg-zinc-900/70 ring-1 ring-white/10" : "bg-white/70 ring-1 ring-zinc-900/5"}`}>
              <Icon.Truck className="h-3.5 w-3.5" /> 2–3 day delivery
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
          {/* left: items */}
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className={`${card} rounded-[28px] p-10 text-center shadow-sm`}>
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 ring-1 ring-violet-500/20">
                  <Icon.Tag className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">Your cart is empty</h3>
                <p className={`mx-auto mt-1 max-w-sm text-sm ${subtle}`}>Discover curated pieces with timeless design and premium materials.</p>
                <button
                  onClick={() => navigate('/products')}
                  className="mt-5 inline-flex items-center gap-2 justify-center rounded-xl bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Start shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className={`${card} group relative overflow-hidden rounded-[24px] p-4 shadow-sm transition hover:shadow-md sm:p-5`}
                >
                  <div className="flex gap-4 sm:gap-5">
                    {/* image */}
                    <div className="relative h-[112px] w-[112px] shrink-0 overflow-hidden rounded-2xl sm:h-[128px] sm:w-[128px]">
                      <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />

                      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
                    </div>

                    {/* details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-[15px] font-semibold leading-6 sm:text-[16px]">{item.name}</h3>
                          <p className={`mt-0.5 text-xs ${subtle}`}>{item.variant}</p>
                          {!item.inStock && (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 ring-1 ring-amber-500/20">
                              Low stock
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-[15px] font-semibold leading-6">{formatNaira((item.price || 0) * item.quantity)}</p>
                          <p className={`text-[12px] ${subtle}`}>{formatNaira(item.price)} each</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {/* qty stepper */}
                        <div className={`inline-flex items-center gap-1 rounded-xl p-1 ring-1 ${isDark ? "bg-white/5 ring-white/10" : "bg-zinc-100 ring-zinc-200"}`}>
                          <button
                            onClick={() => updateQty(item.id, Math.max(0, item.quantity - 1))}
                            className={`grid h-8 w-8 place-items-center rounded-lg transition hover:scale-105 active:scale-95 ${isDark ? "hover:bg-white/10" : "hover:bg-white"}`}
                            aria-label="Decrease"
                          >
                            <Icon.Minus className="h-4 w-4" />
                          </button>
                          <div className="min-w-[2.5rem] text-center text-sm font-medium tabular-nums">{item.quantity}</div>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className={`grid h-8 w-8 place-items-center rounded-lg transition hover:scale-105 active:scale-95 ${isDark ? "hover:bg-white/10" : "hover:bg-white"}`}
                            aria-label="Increase"
                          >
                            <Icon.Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toast.success("Saved for later")}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${isDark ? "text-zinc-300 hover:bg-white/5" : "text-zinc-600 hover:bg-zinc-100"}`}
                          >
                            Save for later
                          </button>
                          <button
                            onClick={() => remove(item.id)}
                            className="group/btn inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-500/10"
                          >
                            <Icon.Trash className="h-3.5 w-3.5 transition group-hover/btn:-translate-y-0.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* subtle gradient border glow on hover */}
                  <div className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition group-hover:opacity-100" style={{ boxShadow: "inset 0 0 0 1px rgba(139,92,246,.25)" }} />
                </article>
              ))
            )}

            {/* trust row */}
            <div className={`${card} rounded-2xl px-4 py-3 sm:px-5`}>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5"><Icon.Shield className="h-3.5 w-3.5" /> 256-bit SSL</span>
                <span className="inline-flex items-center gap-1.5"><Icon.Truck className="h-3.5 w-3.5" /> Trackable tax</span>
                <span className="inline-flex items-center gap-1.5"><Icon.Tag className="h-3.5 w-3.5" /> Price match guarantee</span>
              </div>
            </div>
          </div>

          {/* right: summary */}
          <aside className="lg:sticky lg:top-6">
            <div className={`${card} overflow-hidden rounded-[28px] shadow-sm`}>
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[17px] font-semibold">Order Summary</h3>
                  <span className={`text-xs ${subtle}`}>{items.reduce((n, i) => n + i.quantity, 0)} items</span>
                </div>

                {/* promo */}
                <div className="mt-5">
                  <div className={`mt-6 space-y-3 border-t pt-5 text-sm ${divider}`}>
                    <Row label="Subtotal" value={formatNaira(subtotal)} />
                    <Row label="tax" value={totalTax === 0 ? "Free" : formatNaira(totalTax)} subtle={totalTax === 0} />
                    {/* {discount > 0 && <Row label="Discount" value={`- ${formatNaira(discount)}`} accent />} */}
                  </div>

                  <div className={`mt-5 flex items-center justify-between border-t pt-5 ${divider}`}>
                    <span className="text-[15px] font-semibold">Total</span>
                    <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-[22px] font-bold tracking-tight text-transparent">
                      {formatNaira(total)}
                    </span>
                  </div>

                  <button
                    disabled={items.length === 0}
                    onClick={() => navigate('/checkout')}
                    className="group relative mt-5 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-green-700 px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] transition hover:-translate-y-[1px] hover:shadow-[0_12px_32px_-10px_rgba(0,0,0,0.55)] disabled:opacity-50 dark:bg-white dark:text-zinc-900"
                  >
                    <span className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-600/0 via-fuchsia-600/0 to-sky-600/0 opacity-0 transition group-hover:opacity-100" />
                    Proceed to Checkout
                  </button>

                  <p className={`mx-auto mt-3 max-w-[32ch] text-center text-[12px] leading-relaxed ${subtle}`}>
                    By continuing, you agree to our Terms and acknowledge our Privacy Policy. Prices in NGN.
                  </p>
                </div>

                {/* express pay */}
                {/* <div className={`border-t p-4 sm:p-5 ${divider} ${isDark ? "bg-white/[0.02]" : "bg-zinc-50/60"}`}>
                  <p className={`mb-2 text-center text-[12px] ${subtle}`}>Or pay with</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["Paystack", "Flutterwave", "Apple Pay"].map((m) => (
                      <button
                        key={m}
                        onClick={() => toast.success(`Open ${m}`)}
                        className={`h-10 rounded-xl text-xs font-medium ring-1 transition hover:-translate-y-[1px] ${isDark ? "bg-zinc-900/60 ring-white/10 hover:bg-zinc-900" : "bg-white ring-zinc-200 hover:bg-zinc-50"}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div> */}
              </div>

              {/* help card */}
              <div className={`${card} mt-4 rounded-2xl p-4`}>
                <div className="flex items-start gap-3">
                  <div className={`grid h-9 w-9 place-items-center rounded-xl ${isDark ? "bg-white/5" : "bg-zinc-900/5"}`}>
                    <Icon.Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Need help?</p>
                    <p className={`mt-0.5 text-xs ${subtle}`}>Chat with us — average reply time is under 2 minutes.</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

function Row({ label, value, subtle = false, accent = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className={subtle ? "text-zinc-500" : "text-zinc-600 dark:text-zinc-300"}>{label}</span>
      <span className={accent ? "font-medium text-emerald-600" : "font-medium"}>{value}</span>
    </div>
  );
}

export default Cart;