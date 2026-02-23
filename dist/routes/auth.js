"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/signup', (0, validation_1.validateRequest)(validation_1.signupSchema), authController_1.signup);
router.post('/login', (0, validation_1.validateRequest)(validation_1.loginSchema), authController_1.login);
router.get('/profile', auth_1.authenticate, authController_1.getProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map