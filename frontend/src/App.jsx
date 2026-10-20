import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
const API_URL = import.meta.env.VITE_API_URL || 'https://restaurant-order-table-management-1dm6.onrender.com/api';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data, data.token);
        navigate('/menu');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <p><label>Email: <input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label></p>
        <p><label>Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label></p>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
}

function Register({ onLoginSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_URL + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data, data.token);
        navigate('/menu');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server error');
    }
  }

  return (
    <div>
      <h2>Register</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <p><label>Name: <input type="text" value={name} onChange={e => setName(e.target.value)} required /></label></p>
        <p><label>Email: <input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label></p>
        <p><label>Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label></p>
        <p>
          <label>Role: </label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </p>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
}

function Menu({ onAddToCart, user }) {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const navigate = useNavigate();

  async function fetchMenu() {
    let url = API_URL + '/menu?';
    if (search) url += 'search=' + encodeURIComponent(search) + '&';
    if (category) url += 'category=' + encodeURIComponent(category) + '&';
    if (vegOnly) url += 'veg=true&';
    try {
      const res = await fetch(url);
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      alert('Failed to load menu');
    }
  }

  useEffect(() => {
    fetchMenu();
  }, [category, vegOnly]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this item?')) return;
    try {
      const res = await fetch(API_URL + '/menu/' + id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      if (res.ok) {
        alert('Item deleted');
        fetchMenu();
      } else {
        alert('Failed to delete item');
      }
    } catch (err) {
      alert('Server error');
    }
  }

  return (
    <div>
      <h2>Restaurant Menu</h2>
      <form onSubmit={e => { e.preventDefault(); fetchMenu(); }}>
        <input type="text" placeholder="Search food..." value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit">Search</button>
      </form>
      <p>
        <label>Category: </label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Starters">Starters</option>
          <option value="Main Course">Main Course</option>
          <option value="Breads & Rice">Breads & Rice</option>
          <option value="Desserts & Beverages">Desserts & Beverages</option>
          <option value="Desserts">Desserts</option>
          <option value="Beverages">Beverages</option>
        </select>
        {' '}
        <label><input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)} /> Veg Only</label>
      </p>
      <div>
        {menuItems.length === 0 ? <p>No menu items found</p> : menuItems.map(item => (
          <div key={item._id}>
            <hr />
            {item.imageUrl && <img src={item.imageUrl} alt={item.name} width="150" />}
            <h3>{item.name}</h3>
            <p>Category: {item.category} | Price: Rs. {item.price}</p>
            <p>{item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'} | {item.isAvailable ? 'Available' : 'Out of Stock'}</p>
            <button onClick={() => navigate('/menu/' + item._id)}>View Details</button>
            {' '}
            {item.isAvailable && user && user.role === 'customer' && (
              <button onClick={() => onAddToCart(item)}>Add to Cart</button>
            )}
            {user && user.role === 'admin' && (
              <span>
                {' '}
                <button onClick={() => navigate('/admin/menu/' + item._id + '/edit')}>Edit</button>
                {' '}
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuItemDetail({ onAddToCart, user }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(API_URL + '/menu/' + id);
        const data = await res.json();
        if (res.ok) setItem(data);
        else setError(data.message || 'Item not found');
      } catch (err) {
        setError('Server error');
      }
    }
    fetchItem();
  }, [id]);

  if (error) return <div><p>{error}</p><button onClick={() => navigate('/menu')}>Back</button></div>;
  if (!item) return <p>Loading...</p>;

  return (
    <div>
      <h2>{item.name}</h2>
      {item.imageUrl && <img src={item.imageUrl} alt={item.name} width="200" />}
      <p>Category: {item.category} | Price: Rs. {item.price}</p>
      <p>{item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'} | {item.isAvailable ? 'Available' : 'Out of Stock'}</p>
      {item.isAvailable && user && user.role === 'customer' && (
        <button onClick={() => onAddToCart(item)}>Add to Cart</button>
      )}
      {' '}
      <button onClick={() => navigate('/menu')}>Back to Menu</button>
    </div>
  );
}

function Cart({ cart, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTables() {
      try {
        const res = await fetch(API_URL + '/tables');
        const data = await res.json();
        setTables(data);
        if (data.length > 0) setSelectedTable(data[0]._id);
      } catch (err) {
        alert('Failed to load tables');
      }
    }
    fetchTables();
  }, []);

  let subtotal = 0;
  for (let i = 0; i < cart.length; i++) subtotal += cart[i].price * cart[i].quantity;
  const gst = Number((subtotal * 0.05).toFixed(2));
  const grandTotal = Number((subtotal + gst).toFixed(2));

  async function handlePlaceOrder() {
    if (!selectedTable) return alert('Please select a table');
    setLoading(true);
    try {
      const res = await fetch(API_URL + '/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({
          tableId: selectedTable,
          items: cart.map(item => ({ menuItemId: item._id, quantity: item.quantity }))
        })
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        alert('Order placed successfully!');
        onClearCart();
        navigate('/my-orders');
      } else {
        alert(data.message || 'Failed to place order');
      }
    } catch (err) {
      setLoading(false);
      alert('Server error');
    }
  }

  if (cart.length === 0) return <div><h2>Your Cart</h2><p>Cart is empty</p><button onClick={() => navigate('/menu')}>Menu</button></div>;

  return (
    <div>
      <h2>Your Cart</h2>
      <table border="1">
        <thead>
          <tr><th>Item</th><th>Price</th><th>Quantity</th><th>Total</th><th>Action</th></tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>Rs. {item.price}</td>
              <td>
                <button onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}>-</button>
                <span> {item.quantity} </span>
                <button onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}>+</button>
              </td>
              <td>Rs. {item.price * item.quantity}</td>
              <td><button onClick={() => onRemoveItem(item._id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Subtotal: Rs. {subtotal} | GST (5%): Rs. {gst}</p>
      <h3>Grand Total: Rs. {grandTotal}</h3>
      <p>
        <label>Select Table: </label>
        <select value={selectedTable} onChange={e => setSelectedTable(e.target.value)}>
          {tables.map(t => <option key={t._id} value={t._id}>Table {t.tableNumber} (Capacity: {t.capacity})</option>)}
        </select>
      </p>
      <button onClick={handlePlaceOrder} disabled={loading}>{loading ? 'Placing...' : 'Place Order'}</button>
      {' '}
      <button onClick={onClearCart}>Clear Cart</button>
    </div>
  );
}

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchOrders() {
    try {
      const res = await fetch(API_URL + '/orders/my', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      alert('Failed to load orders');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleCancel(id) {
    if (!window.confirm('Cancel order?')) return;
    try {
      const res = await fetch(API_URL + '/orders/' + id + '/cancel', {
        method: 'PATCH',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      const data = await res.json();
      if (res.ok) {
        alert('Order cancelled');
        fetchOrders();
      } else {
        alert(data.message || 'Failed to cancel');
      }
    } catch (err) {
      alert('Server error');
    }
  }

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 ? <p>No orders yet.</p> : (
        <table border="1">
          <thead>
            <tr><th>Order ID</th><th>Table</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.table ? order.table.tableNumber : 'N/A'}</td>
                <td>{order.items.map((i, idx) => <div key={idx}>{i.name} x {i.quantity}</div>)}</td>
                <td>Rs. {order.grandTotal}</td>
                <td>{order.status}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => navigate('/orders/' + order._id)}>Details</button>
                  {order.status === 'Placed' && <button onClick={() => handleCancel(order._id)}>Cancel</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrder() {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(API_URL + '/orders/my', {
          headers: { Authorization: 'Bearer ' + token }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find(o => o._id === id);
          if (found) return setOrder(found);
        }
        const singleRes = await fetch(API_URL + '/orders/' + id, {
          headers: { Authorization: 'Bearer ' + token }
        });
        const singleData = await singleRes.json();
        if (singleRes.ok) setOrder(singleData);
        else setError(singleData.message || 'Order not found');
      } catch (err) {
        setError('Server error');
      }
    }
    fetchOrder();
  }, [id]);

  if (error) return <div><p>{error}</p><button onClick={() => navigate(-1)}>Back</button></div>;
  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h2>Order Details</h2>
      <p>Order ID: {order._id} | Status: {order.status} | Table: {order.table ? order.table.tableNumber : 'N/A'}</p>
      <table border="1">
        <thead>
          <tr><th>Item</th><th>Price</th><th>Qty</th><th>Total</th></tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td><td>Rs. {item.price}</td><td>{item.quantity}</td><td>Rs. {item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Subtotal: Rs. {order.subtotal} | GST: Rs. {order.gst}</p>
      <h3>Grand Total: Rs. {order.grandTotal}</h3>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(API_URL + '/admin/dashboard', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        });
        const data = await res.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        alert('Failed to load stats');
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>No stats available</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Total Orders Today: {stats.todayOrdersCount} | Total Revenue Today: Rs. {stats.todayRevenue}</p>
      <h3>Top Selling Items</h3>
      {stats.topItems && stats.topItems.length > 0 ? (
        <table border="1">
          <thead><tr><th>Item</th><th>Quantity Sold</th><th>Revenue</th></tr></thead>
          <tbody>
            {stats.topItems.map((item, idx) => (
              <tr key={idx}><td>{item.name}</td><td>{item.totalSold}</td><td>Rs. {item.totalRevenue}</td></tr>
            ))}
          </tbody>
        </table>
      ) : <p>No top items</p>}
      <h3>Sales by Category</h3>
      {stats.categorySales && stats.categorySales.length > 0 ? (
        <table border="1">
          <thead><tr><th>Category</th><th>Quantity</th><th>Total Sales</th></tr></thead>
          <tbody>
            {stats.categorySales.map((cat, idx) => (
              <tr key={idx}><td>{cat.category}</td><td>{cat.totalQuantity}</td><td>Rs. {cat.totalSales}</td></tr>
            ))}
          </tbody>
        </table>
      ) : <p>No category sales</p>}
    </div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    let url = API_URL + '/orders';
    if (statusFilter) url += '?status=' + statusFilter;
    try {
      const res = await fetch(url, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      alert('Failed to load orders');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  async function handleStatusChange(orderId, newStatus) {
    try {
      const res = await fetch(API_URL + '/orders/' + orderId + '/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Status updated');
        fetchOrders();
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      alert('Server error');
    }
  }

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h2>Manage Orders</h2>
      <label>Filter: </label>
      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
        <option value="">All Orders</option>
        <option value="Placed">Placed</option>
        <option value="Preparing">Preparing</option>
        <option value="Served">Served</option>
        <option value="Paid">Paid</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <br /><br />
      {orders.length === 0 ? <p>No orders found</p> : (
        <table border="1">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Table</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user ? order.user.name : 'Unknown'}</td>
                <td>{order.table ? order.table.tableNumber : 'N/A'}</td>
                <td>{order.items.map((i, idx) => <div key={idx}>{i.name} x {i.quantity}</div>)}</td>
                <td>Rs. {order.grandTotal}</td>
                <td>{order.status}</td>
                <td>
                  {order.status === 'Placed' && (
                    <span>
                      <button onClick={() => handleStatusChange(order._id, 'Preparing')}>Prepare</button>
                      {' '}
                      <button onClick={() => handleStatusChange(order._id, 'Cancelled')}>Cancel</button>
                    </span>
                  )}
                  {order.status === 'Preparing' && (
                    <span>
                      <button onClick={() => handleStatusChange(order._id, 'Served')}>Serve</button>
                      {' '}
                      <button onClick={() => handleStatusChange(order._id, 'Cancelled')}>Cancel</button>
                    </span>
                  )}
                  {order.status === 'Served' && (
                    <button onClick={() => handleStatusChange(order._id, 'Paid')}>Paid</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AdminTables() {
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchTables() {
    try {
      const res = await fetch(API_URL + '/tables');
      const data = await res.json();
      setTables(data);
      setLoading(false);
    } catch (err) {
      alert('Failed to load tables');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTables();
  }, []);

  async function handleAddTable(e) {
    e.preventDefault();
    try {
      const res = await fetch(API_URL + '/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({ tableNumber: Number(tableNumber), capacity: Number(capacity) })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Table added');
        setTableNumber('');
        setCapacity('');
        fetchTables();
      } else {
        alert(data.message || 'Failed to add table');
      }
    } catch (err) {
      alert('Server error');
    }
  }

  async function handleDeleteTable(id) {
    if (!window.confirm('Delete table?')) return;
    try {
      const res = await fetch(API_URL + '/tables/' + id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      if (res.ok) {
        alert('Table deleted');
        fetchTables();
      } else {
        alert('Failed to delete table');
      }
    } catch (err) {
      alert('Server error');
    }
  }

  if (loading) return <p>Loading tables...</p>;

  return (
    <div>
      <h2>Manage Tables</h2>
      <form onSubmit={handleAddTable}>
        <label>Table Number: <input type="number" value={tableNumber} onChange={e => setTableNumber(e.target.value)} required /></label>
        {' '}
        <label>Capacity: <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} required /></label>
        {' '}
        <button type="submit">Add Table</button>
      </form>
      <hr />
      {tables.length === 0 ? <p>No tables</p> : (
        <table border="1">
          <thead><tr><th>Table Number</th><th>Capacity</th><th>Action</th></tr></thead>
          <tbody>
            {tables.map(table => (
              <tr key={table._id}>
                <td>Table {table.tableNumber}</td>
                <td>{table.capacity} Persons</td>
                <td><button onClick={() => handleDeleteTable(table._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AdminMenuForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [price, setPrice] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      async function fetchItem() {
        try {
          const res = await fetch(API_URL + '/menu/' + id);
          const data = await res.json();
          if (res.ok) {
            setName(data.name || '');
            setCategory(data.category || 'Main Course');
            setPrice(data.price || '');
            setIsVeg(data.isVeg !== undefined ? data.isVeg : true);
            setIsAvailable(data.isAvailable !== undefined ? data.isAvailable : true);
            setImageUrl(data.imageUrl || '');
          }
        } catch (err) {
          alert('Failed to fetch item');
        }
      }
      fetchItem();
    }
  }, [id, isEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(isEdit ? API_URL + '/menu/' + id : API_URL + '/menu', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({ name, category, price: Number(price), isVeg, isAvailable, imageUrl })
      });
      const data = await res.json();
      if (res.ok) {
        alert(isEdit ? 'Item updated' : 'Item added');
        navigate('/menu');
      } else {
        alert(data.message || 'Error saving item');
      }
    } catch (err) {
      alert('Server error');
    }
  }

  return (
    <div>
      <h2>{isEdit ? 'Edit Food Item' : 'Add Food Item'}</h2>
      <form onSubmit={handleSubmit}>
        <p><label>Name: <input type="text" value={name} onChange={e => setName(e.target.value)} required /></label></p>
        <p>
          <label>Category: </label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="Starters">Starters</option>
            <option value="Main Course">Main Course</option>
            <option value="Breads & Rice">Breads & Rice</option>
            <option value="Desserts & Beverages">Desserts & Beverages</option>
            <option value="Desserts">Desserts</option>
            <option value="Beverages">Beverages</option>
          </select>
        </p>
        <p><label>Price: <input type="number" value={price} onChange={e => setPrice(e.target.value)} required /></label></p>
        <p><label><input type="checkbox" checked={isVeg} onChange={e => setIsVeg(e.target.checked)} /> Vegetarian</label></p>
        <p><label><input type="checkbox" checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} /> Available</label></p>
        <p><label>Image URL: <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} /></label></p>
        <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
        {' '}
        <button type="button" onClick={() => navigate('/menu')}>Cancel</button>
      </form>
    </div>
  );
}

function KitchenScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchKitchenOrders() {
    try {
      const res = await fetch(API_URL + '/orders', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data.filter(o => o.status === 'Placed' || o.status === 'Preparing'));
      }
      setLoading(false);
    } catch (err) {
      alert('Failed to load orders');
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchKitchenOrders();
    const interval = setInterval(fetchKitchenOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  async function updateStatus(orderId, newStatus) {
    try {
      const res = await fetch(API_URL + '/orders/' + orderId + '/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchKitchenOrders();
      else alert('Failed to update status');
    } catch (err) {
      alert('Server error');
    }
  }

  if (loading) return <p>Loading kitchen...</p>;

  return (
    <div>
      <h2>Kitchen Screen</h2>
      <button onClick={fetchKitchenOrders}>Refresh</button>
      <br /><br />
      {orders.length === 0 ? <p>No active kitchen orders</p> : (
        <table border="1">
          <thead>
            <tr><th>Order ID</th><th>Table</th><th>Items</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>Table {order.table ? order.table.tableNumber : 'N/A'}</td>
                <td>{order.items.map((i, idx) => <div key={idx}>{i.name} x {i.quantity}</div>)}</td>
                <td>{order.status}</td>
                <td>
                  {order.status === 'Placed' && (
                    <button onClick={() => updateStatus(order._id, 'Preparing')}>Start Preparing</button>
                  )}
                  {order.status === 'Preparing' && (
                    <button onClick={() => updateStatus(order._id, 'Served')}>Mark Served</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function handleLoginSuccess(userData, token) {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  function handleAddToCart(item) {
    const existing = cart.find(c => c._id === item._id);
    if (!existing) {
      setCart([...cart, { ...item, quantity: 1 }]);
    } else {
      setCart(cart.map(c => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c));
    }
    alert('Added to cart');
  }

  function handleUpdateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart(cart.map(item => item._id === itemId ? { ...item, quantity: newQuantity } : item));
  }

  function handleRemoveItem(itemId) {
    setCart(cart.filter(item => item._id !== itemId));
  }

  function handleClearCart() {
    setCart([]);
  }

  const cartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  return (
    <BrowserRouter>
      <div>
        <Navbar user={user} onLogout={handleLogout} cartCount={cartCount} />
        <Routes>
          <Route path="/" element={<Navigate to="/menu" />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/menu" element={<Menu onAddToCart={handleAddToCart} user={user} />} />
          <Route path="/menu/:id" element={<MenuItemDetail onAddToCart={handleAddToCart} user={user} />} />
          <Route path="/cart" element={<ProtectedRoute user={user}><Cart cart={cart} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onClearCart={handleClearCart} /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute user={user}><MyOrders /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute user={user}><OrderDetail /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute user={user} adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute user={user} adminOnly={true}><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/tables" element={<ProtectedRoute user={user} adminOnly={true}><AdminTables /></ProtectedRoute>} />
          <Route path="/admin/menu/new" element={<ProtectedRoute user={user} adminOnly={true}><AdminMenuForm /></ProtectedRoute>} />
          <Route path="/admin/menu/:id/edit" element={<ProtectedRoute user={user} adminOnly={true}><AdminMenuForm /></ProtectedRoute>} />
          <Route path="/admin/kitchen" element={<ProtectedRoute user={user} adminOnly={true}><KitchenScreen /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/menu" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;