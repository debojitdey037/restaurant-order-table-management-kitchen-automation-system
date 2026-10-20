const express = require("express");
const router = express.Router();
const {
      getTables,
      createTable,
      updateTable,
      deleteTable
} = require("../controllers/tableController")
const {protect,adminOnly} = require("../middleware/authMiddleware")

router.get('/',getTables);
router.post('/',protect,adminOnly,createTable);
router.put('/:id',protect,adminOnly,updateTable);
router.delete('/:id',protect,adminOnly,deleteTable);

module.exports = router;