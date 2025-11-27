export default function OrderSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">

      {/* Success Animation */}
      <div className="success-animation">
        <div className="circle">
          <svg
            className="tick"
            viewBox="0 0 52 52"
          >
            <path d="M14 27 l8 8 l16 -16" fill="none" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <h1 className="text-3xl text-emerald-400 font-bold">Order Successful!</h1>
      <p className="text-slate-300">We will deliver to your address soon.</p>

      <a href="/orders" className="btn bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-md">
        View Orders
      </a>
    </div>
  );
}
