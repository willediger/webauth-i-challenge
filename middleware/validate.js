function validate(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    next({
      status: 400,
      message: "No credentials provided."
    });
  }
}

module.exports = validate;
