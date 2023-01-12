var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");

var AccountModel = require("../models/account");
const PAGE_SIZE = 2;
router.get("/", (req, res, next) => {
  var page = req.query.page;
  if (page) {
    page = parseInt(page);
    var start = (page - 1) * PAGE_SIZE;

    AccountModel.find({})
      .skip(start)
      .limit(PAGE_SIZE)
      .then((data) => res.json(data))
      .catch((error) => res.status(500).json("Loi server"));
  } else {
    AccountModel.find({})
      .then((data) => res.json(data))
      .catch((error) => res.status(500).json("Loi server"));
  }
});
router.post("/register", (req, res, next) => {
  const { username, password } = req.body;
  AccountModel.findOne({
    username: username,
  })
    .then((data) => {
      if (data) {
        res.json("Tai khoan da ton tai");
      } else {
        for (let index = 0; index < 20; index++) {
          AccountModel.create({
            username: username + index,
            password,
          });
        }
      }
    })
    .then((data) => {
      res.json("Tao tai khoan thanh cong");
    })
    .catch(() => {
      res.status(500).json("Tao that bai");
    });
});
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  AccountModel.findOne({ username, password })
    .then((data) => {
      if (data) {
        var token = jwt.sign({ _id: data._id }, "mk");
        res.json({ message: "Thanh cong", token });
      } else res.json("Danh nhap that bai");
    })
    .catch((err) => {
      res.status(500).json("Loi server");
    });
});
router.put("/:id", (req, res, next) => {
  var id = req.params.id;
  AccountModel.findByIdAndUpdate(id, {
    ...req.body,
  })
    .then((data) => res.json("Cap nhat thanh cong"))
    .catch((error) => res.status(500).json("Loi server"));
});
router.delete("/:id", (req, res, next) => {
  var id = req.params.id;
  AccountModel.deleteOne({
    _id: id,
  })
    .then((data) => res.json("Xoa thanh cong"))
    .catch((error) => res.status(500).json("Loi server"));
});

router.get(
  "/private/:token",
  (req, res, next) => {
    try {
      var token = req.params.token;
      var ketqua = jwt.verify(token, "mk");
      if (ketqua) {
        next();
      }
    } catch (error) {
      res.json("Ban phai login");
    }
  },
  (req, res, next) => {
    res.json("4hoangvua la tao");
  }
);
module.exports = router;
