const { StatusCodes } = require("http-status-codes");
const permission = (req, res, next) => {
  if (req.user.userId === req.params.id || req.user.role === "QuanTri") {
    next();
  } else {
    res
      .status(StatusCodes.FORBIDDEN)
      .json(
        "The client is authenticated but doesn't have permission to access the resource."
      );
  }
};
module.exports = permission;
