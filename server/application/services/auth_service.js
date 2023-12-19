const User = require("../models/login_model.js");

const validate_user = async (username, password) => {
    const user = await User.findOne({ username, password });
    return user;
};

module.exports = {
    validate_user,
};