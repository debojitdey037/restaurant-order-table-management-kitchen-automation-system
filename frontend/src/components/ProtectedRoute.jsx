import React from 'react'
import {Navigate} from 'react-router-dom'

function ProtectedRouter({user,adminOnly=false,children}) {
    if (!user) {
    return <Navigate to="/login" />;
    }
    if (adminOnly === true && user.role !== 'admin') {
    return <Navigate to="/menu" />;
    }
    return children;
}

export default ProtectedRouter