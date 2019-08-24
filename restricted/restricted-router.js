const express = require("express");
const validate = require("../middleware/validate.js");

const router = express.Router();

router.get("/*", validate, async (req, res, next) => {
  res.status(200).json("success");
});

router.post("/*", validate, async (req, res, next) => {
  res.status(200).json("success");
});

router.put("/*", validate, async (req, res, next) => {
  res.status(200).json("success");
});

router.delete("/*", validate, async (req, res, next) => {
  res.status(200).json("success");
});

module.exports = router;
