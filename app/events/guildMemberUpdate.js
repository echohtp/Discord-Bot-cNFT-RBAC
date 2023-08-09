const User = require('../models/userModel');
const axios = require('axios')


const ROLE_MESSAGES = {
    '1138248311845953561': {
        "💻": "developer",
        "🎨": "artist",
        "📝": "writer",
        "🎦": "video",
        "📸": "photographer"
    }
};

module.exports = async (before, after) => {

    const config = {
        headers: { Authorization: `Bearer ${process.env.UNDERDOG_API_KEY}` }
    }

    console.log("before")
    console.log(before.roles.cache)
    console.log("after")

};
