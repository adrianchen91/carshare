import User from "../../models/user";

exports.register = function (req, res) {
  const email = req.body.email;
  const mobile = req.body.mobile;
  const password = req.body.password;

  let user = new User({
    email: email,
    mobile: mobile,
    password: password,
  });

  var errs = user.validateSync();
  if (errs) {
    res.status(400).send(errs);
  } else {
    user.save((err, saved) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(saved._id);
      }
    });
  }
}