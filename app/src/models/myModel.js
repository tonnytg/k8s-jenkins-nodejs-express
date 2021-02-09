const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    user: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
    },
    createAt: {
        type: Date,
        require: true,
    },
});
mongoose.model('Message', MessageSchema);