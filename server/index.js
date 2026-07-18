require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const adminAuth = require('./middleware/adminAuth');
const Order = require('./models/Order');
const cors = require('cors');
const app = express();
app.use(express.json());
const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL, // set this on Render to your Vercel URL
].filter(Boolean); // removes undefined if CLIENT_URL not set

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (Postman, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
    credentials: true,
}));


app.get('/', (req, res) => {
    res.send('Coffee shop server is alive and well!');
});

// ─── Menu (Public reads, adminAuth writes) ──────────────────

app.get('/api/menu', async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
        }
        const menu = await MenuItem.find(filter);
        res.json(menu);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

app.get('/api/menu/:id', async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// 🧠 CONCEPT: Menu write routes are now admin-only
app.post('/api/menu', adminAuth, async (req, res) => {
    try {
        const newItem = new MenuItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

app.put('/api/menu/:id', adminAuth, async (req, res) => {
    try {
        const updatedItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

app.delete('/api/menu/:id', adminAuth, async (req, res) => {
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// ─── Auth ──────────────────────────────────────────────────

app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User created', userId: savedUser._id });
    } catch (err) {
        if (err.code === 11000 || err.message.includes('E11000')) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// 🧠 CONCEPT: Login now includes isAdmin in token + response so the frontend
//    can gate the Admin dashboard without an extra API call
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ message: 'Login successful', token, isAdmin: user.isAdmin });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// ─── Orders (user) ─────────────────────────────────────────

app.post('/api/orders', auth, async (req, res) => {
    try {
        const { items } = req.body;
        let totalPrice = 0;

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) return res.status(404).json({ message: `Menu item not found: ${item.menuItem}` });
            totalPrice += menuItem.price * item.quantity;
        }

        const newOrder = new Order({ user: req.userId, items, totalPrice });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

app.get('/api/orders/myorders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).populate('items.menuItem');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// ─── Admin Routes ───────────────────────────────────────────

// Dashboard stats
app.get('/api/admin/stats', adminAuth, async (req, res) => {
    try {
        const [totalOrders, menuItemCount, allOrders] = await Promise.all([
            Order.countDocuments(),
            MenuItem.countDocuments(),
            Order.find()
        ]);

        const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalPrice, 0);
        const pendingOrders = allOrders.filter(o => o.status === 'pending').length;

        res.json({ totalOrders, totalRevenue, menuItemCount, pendingOrders });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// All orders
app.get('/api/admin/orders', adminAuth, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'email')
            .populate('items.menuItem', 'name price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Update order status
app.put('/api/admin/orders/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Order not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// ─── Start Server ───────────────────────────────────────────

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err);
    });
