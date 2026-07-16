require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const Order = require('./models/Order');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Coffee shop server is alive and well!');
});

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

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(item);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

app.post('/api/menu', auth, async (req, res) => {
    try {
        const newItem = new MenuItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message })
    }
});


// 🧠 CONCEPT: auth middleware runs BEFORE the route handler
//    If no valid token → returns 401 and the route handler never runs
app.put('/api/menu/:id', auth, async (req, res) => {
    try {
        const updatedItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

app.delete('/api/menu/:id', auth, async (req, res) => {
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email: email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        res.status(201).json({ message: 'User created', userId: savedUser._id });
    } catch (err) {
        if (err.code === 11000 || err.message.includes('E11000')) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ message: 'Login successful', token: token });

    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

app.post('/api/orders', auth, async (req, res) => {
    try {
        const { items } = req.body;

        let totalPrice = 0;

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) {
                return res.status(404).json({ message: `Menu item not found: ${item.menuItem}` });
            }
            totalPrice += menuItem.price * item.quantity;
        }

        const newOrder = new Order({
            user: req.userId,
            items: items,
            totalPrice: totalPrice
        });

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
