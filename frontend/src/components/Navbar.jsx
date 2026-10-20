import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout, cartCount }) {
    const navigate = useNavigate();

    const logout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <div>
            <h2>Restaurant Order System</h2>

            <Link to="/menu">Menu</Link> {' | '}

            {user && user.role === 'customer' && (
                <>
                    <Link to="/cart">Cart ({cartCount})</Link> {' | '}
                    <Link to="/my-orders">My Orders</Link> {' | '}
                </>
            )}

            {user && user.role === 'admin' && (
                <>
                    <Link to="/admin/dashboard">Dashboard</Link> {' | '}
                    <Link to="/admin/orders">Manage Orders</Link> {' | '}
                    <Link to="/admin/tables">Manage Tables</Link> {' | '}
                    <Link to="/admin/menu/new">Add Food Item</Link> {' | '}
                    <Link to="/admin/kitchen">Kitchen Screen</Link> {' | '}
                </>
            )}

            {user ? (
                <>
                    <span>
                        Logged in as: {user.name} ({user.role})
                    </span>
                    {' '}
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link> {' | '}
                    <Link to="/register">Register</Link>
                </>
            )}

            <hr />
        </div>
    );
}

export default Navbar;