import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, MessageSquare, Users, Calendar, Menu, LayoutDashboard, LogOut, Ticket } from 'lucide-react';
import AddProductDialog from './addProduct';

const Sidebar = () => {
    const navigate = useNavigate();
    const { sellerId } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        img: '',
        category: '',
        rating: 0,
        productId: '',
        inStockValue: 0,
        soldStockValue: 0
    });
    const location = useLocation();

    // Set initial state based on screen size and update on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) { // lg breakpoint
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        // Set initial state
        handleResize();

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard />, path: `/admin/${sellerId}` },
        { name: 'Products', icon: <Package />, path: `/admin/products/${sellerId}` },
        { name: 'Orders', icon: <ShoppingBag />, path: `/admin/orders/${sellerId}` },
        { name: 'Complaints', icon: <MessageSquare />, path: `/admin/complaints/${sellerId}` },
        { name: 'Customers', icon: <Users />, path: `/admin/customers/${sellerId}` },
        { name: 'Calendar', icon: <Calendar />, path: `/admin/calendar/${sellerId}` },
        { name: 'Coupons', icon: <Ticket />, path: `/seller/coupons/${sellerId}` },
    ];

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) { // Only allow toggle on smaller screens
            setIsOpen(!isOpen);
        }
    };

    const generateProductId = () => {
        const randomId = Math.floor(100000 + Math.random() * 900000).toString();
        setProductData({...productData, productId: randomId});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({...productData, [name]: value});
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('https://merabestie-backend.onrender.com/admin/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ sellerId })
            });
            
            if(response.ok) {
                navigate('/seller/login');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleSubmit = async (productData) => {
        try {
            console.log(productData)
            const response = await fetch('https://merabestie-backend.onrender.com/create-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });
            
            if(response.ok) {
                setShowDialog(false);
                setProductData({
                    name: '',
                    price: '',
                    img: '',
                    category: '',
                    rating: 0,
                    productId: '',
                    inStockValue: 0,
                    soldStockValue: 0
                });
            }
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <>
            {/* Toggle button for small screens */}
            <button 
                onClick={toggleSidebar}
                className="fixed top-4 left-4 p-2 rounded-lg hover:bg-pink-200 lg:hidden z-50"
            >
                <Menu size={24} />
            </button>

            {showDialog && (
            <AddProductDialog
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                onSubmit={handleSubmit}
            />
            )}

            <div className={`fixed left-0 top-0 h-screen bg-pink-50 shadow-lg transition-all duration-300 flex flex-col 
                lg:translate-x-0 lg:w-64
                ${isOpen ? 'w-64' : 'w-20'}`}
            >
                <div className="flex items-center p-4">
                    {isOpen && (
                        <div className="text-2xl font-bold text-gray-800">
                            Mera Bestie
                        </div>
                    )}
                </div>

                <div className="flex-grow flex items-center">
                    <ul className="space-y-2 p-4 w-full">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center p-2 rounded-lg transition-colors
                                        ${location.pathname === item.path 
                                            ? 'bg-pink-200 text-pink-800' 
                                            : 'text-gray-700 hover:bg-pink-100'}
                                        ${isOpen ? 'justify-start space-x-4' : 'justify-center'}`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    {isOpen && <span>{item.name}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-auto">
                    <div className={`p-4 ${isOpen ? 'block' : 'hidden'}`}>
                        <p className="text-center text-gray-600 mb-2">
                            Please, manage your products through the button below.
                        </p>
                        <button 
                            onClick={() => setShowDialog(true)}
                            className="w-full bg-pink-300 text-white py-2 rounded hover:bg-pink-400 mb-2"
                        >
                            + Add Product
                        </button>
                        
                        <Link 
                            to="/" 
                            className="w-full flex items-center justify-center bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-2"
                        >
                            Go to Website
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded hover:bg-red-600"
                        >
                            <LogOut className="mr-2" size={18} />
                            Logout
                        </button>
                    </div>

                    <footer className={`text-center text-gray-500 text-sm p-4 ${isOpen ? 'block' : 'hidden'}`}>
                        Mera Bestie Admin Dashboard © 2024
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Sidebar;