import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export default async function OrdersPage() {
  const user = await getAuthUser();
  if (!user) return <p className="text-center text-red-500 mt-10">You must login to view orders.</p>;

  await connectDB();
  let orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).lean(); // lean removes toJSON issue

  if (!orders.length) return <p className="text-center text-gray-500 mt-10">No orders yet.</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">

      <h1 className="text-3xl font-bold mb-4">📦 My Orders</h1>

      {orders.map((order, i) => (
        <OrderCard key={i} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }) {
  const shortId = String(order._id).slice(-6);  //  FIXED 🔥

  const total = order.total || order.totalPrice || 0;
  const statusColor = {
    pending: "bg-yellow-500",
    processing: "bg-blue-500",
    shipped: "bg-purple-500",
    delivered: "bg-emerald-500"
  }[order.status || "pending"];

  return (
    <div className="bg-white border border-black/10 shadow-md rounded-xl p-5 space-y-4">

      {/* ORDER HEADING */}
      <div className="flex justify-between items-center">
        <p className="font-semibold">Order #{shortId}</p>
        <span className={`px-3 py-1 text-xs text-white rounded-full ${statusColor}`}>
          {order.status || "Pending"}
        </span>
      </div>

      {/* DATE */}
      <p className="text-xs text-gray-500">
        Ordered On: {new Date(order.createdAt).toLocaleDateString()}
      </p>

      {/* PRODUCTS */}
      <div className="space-y-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <img src={item.imageUrl} className="w-14 h-14 rounded-lg object-cover border" />
            <div className="flex-1">
              <p className="font-semibold">{item.title}</p>
              <p className="text-xs text-gray-500">Qty: {item.qty}</p>
            </div>
            <p className="text-blue-600 font-semibold">₹{item.price * item.qty}</p>
          </div>
        ))}
      </div>

      <hr/>

      {/* TOTAL */}
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span className="text-green-600">₹{total}</span>
      </div>

      {/* DELIVERY DETAILS */}
      <details className="mt-3">
        <summary className="cursor-pointer text-sm text-blue-600 font-medium">
          View Delivery Details ▼
        </summary>

        <div className="mt-2 text-sm bg-gray-50 p-3 rounded-lg">
          <p><b>Name:</b> {order.address?.fullName}</p>
          <p><b>Phone:</b> {order.address?.phone}</p>
          <p><b>Address:</b> {order.address?.house}, {order.address?.city}, {order.address?.state} - {order.address?.pin}</p>
        </div>
      </details>
    </div>
  );
}

