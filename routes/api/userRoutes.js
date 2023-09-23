const router = require('express').Router();
const {
    createUser,
    getUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    friend,
    unfriend,
  } = require('../../controllers/userController');
  
// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router
.route('/:userId')
.get(getSingleUser)
.put(updateUser)
.delete(deleteUser)

// /api/users/:userId/friends/:friendId
router
.route('/:userId/friends/:friendId')
.post(friend)
.delete(unfriend)

module.exports = router;