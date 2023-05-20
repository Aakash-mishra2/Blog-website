const express = require('express');
const router = express.Router();
const DUMMY_USERS = [
    {
        id: 34,
        name: "Aakash "
    }
];
router.get('/:userID', (req, res, next) => {
    const usID = req.params.userID;

    const users = DUMMY_USERS.find(user => {
        return user.id = usID;
    });
    res.json({ users });
});
module.exports = router;