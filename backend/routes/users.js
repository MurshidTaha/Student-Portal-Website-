const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getUsers } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/all', auth, authorize('admin'), getUsers);

// Avatar upload
router.post('/upload-avatar', auth, upload.single('avatar'), (req, res) => {
    res.json({ success: true, fileUrl: req.file.path });
});

module.exports = router;