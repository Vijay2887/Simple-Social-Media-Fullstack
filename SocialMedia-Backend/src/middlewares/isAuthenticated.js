const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else {
    return res.status(400).send({ msg: "Please Authenticate first" });
  }
};

export default isAuthenticated;
