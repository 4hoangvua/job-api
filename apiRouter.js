const express = require("express");

const router = express.Router();

router.get("/4hoangvua", (req, res) => {
  res.send("4hoangvua la tao cc");
});
router.post("/", (req, res) => {
  res.json("post ");
  console.log(req.body);
});
router.get("/:id", (req, res) => {
  res.send("4hoangvua la tao" + req.params.id);
});
module.exports = router;
