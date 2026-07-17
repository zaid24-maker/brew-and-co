const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Hot Drinks', 'Cold Drinks', 'Pastries', 'Snacks']
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;