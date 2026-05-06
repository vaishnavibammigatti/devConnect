const express = require("express");
const requestRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = requestRouter;
