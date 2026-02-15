const express = require('express');
const router = express.Router();

router.get('/feed', (req, res) => {
    res.send("this is the feed page");
});

module.exports = router;