const express = require("express");
const jwtsecret = require("../config");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User, Group } = require("../db");
const zod = require("zod");
const app = express();
const auth = require("../middleware");
app.use(express.json());
const signupschema = zod.object({
  username: zod.string(),
  fName: zod.string(),
  lName: zod.string(),
  pswd: zod.string(),
});
const signinschema = zod.object({
  username: zod.string(),
  pswd: zod.string(),
});
router.post("/signup", async (req, res) => {
  const { username, fName, lName, pswd } = req.body;
  const user = await User.findOne({ username: username });
  const check = signupschema.safeParse(req.body);
  if (user || !check.success) {
    return res.status(400).json({ msg: "Invalid data" });
  }

  const newUser = await User.create({ username, fName, lName, pswd });
  const token = jwt.sign({ userId: newUser._id }, jwtsecret);
  res.json({ msg: "User created successfully", token: token });
});

router.post("/signin", async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username: username });
  const check = signinschema.safeParse(req.body);
  if (!user || !check.success) {
    return res.status(400).json({ msg: "Invalid data" });
  }
  const token = jwt.sign({ userId: user._id }, jwtsecret);
  res.json({ token: token });
});

router.get("/list", auth, async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        fName: {
          $regex: filter,
          $options: "i",
        },
      },
      {
        lName: {
          $regex: filter,
          $options: "i",
        },
      },
    ],
  });
  const filteredusers = users.filter((u) => u._id.toString() != req.userId);

  res.json({ users: filteredusers });
});

router.get("/groupusers", auth, async (req, res) => {
  const groupId = req.query.id;
  const group = await Group.findById(groupId);
  const members = group.members;
  async function getUsers(mem) {
    const user = await User.findById(mem.userId);
    return { userId: user._id.toString(), name: user.fName + " " + user.lName };
  }
  let member = await Promise.all(group.members.map(getUsers));
  // console.log(member);
  res.json({ member: member });
});

module.exports = router;
