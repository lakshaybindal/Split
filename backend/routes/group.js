const express = require("express");
const { Group } = require("../db");
const { User } = require("../db");

const app = express();
app.use(express.json());
const Router = express.Router();
const zod = require("zod");
const auth = require("../middleware");
const groupSchema = zod.object({
  name: zod.string(),
  users: zod.array(zod.string()),
});

Router.post("/create", auth, async (req, res) => {
  // const check = groupSchema.safeParse(req.body);
  const exist = await Group.findOne({ name: req.body.name });
  if (exist) {
    return res.status(400).json({ msg: "Invalid Data" });
  }
  const name = req.body.name;
  let members = req.body.members;
  const newgroup = await Group.create({ name, members });
  const userId = req.userId;
  newgroup.members.push({
    userId: userId,
    gets: [],
    owed: [],
  });
  members = [...members, { userId, gets: [], owed: [] }];
  newgroup.members.forEach((member) => {
    const filteredmember = members.filter((m) => m.userId != member.userId);
    member.gets = filteredmember.map((m) => {
      return { userId: m.userId, amount: 0 };
    });

    member.owed = filteredmember.map((m) => {
      return { userId: m.userId, amount: 0 };
    });
  });
  await newgroup.save();
  res.json({ msg: "New group created", groupid: newgroup._id });
});

Router.get("/list", auth, async (req, res) => {
  const filter = req.query.filter || "";

  const groups = await Group.find({
    $or: [
      {
        name: {
          $regex: filter,
        },
      },
    ],
  });
  // console.log(g);
  const filteredgroups = groups.filter((g) =>
    g.members.some((p) => p.userId == req.userId)
  );

  res.json({ groups: filteredgroups });
});

Router.get("/mygroup", auth, async (req, res) => {
  const groupId = req.query.id;
  const userId = req.userId;

  async function findUser(id) {
    const userCurrent = await User.findOne({ _id: id });
    return userCurrent.fName + " " + userCurrent.lName;
  }

  const group = await Group.findOne({
    _id: groupId,
  });
  const user = group.members.find((u) => u.userId.toString() === userId);
  if (!user) return res.status(400).json({});
  const myOwedTransaction = await Promise.all(
    user.owed
      .filter((o) => o.amount > 0)
      .map(async (o) => {
        const name = await findUser(o.userId);
        return { name: name, amount: o.amount, userId: o.userId };
      })
  );
  const myGetsTransaction = await Promise.all(
    user.gets
      .filter((g) => g.amount > 0)
      .map(async (g) => {
        const name = await findUser(g.userId);
        return { name: name, amount: g.amount, userId: g.userId };
      })
  );
  res.json({
    myId: userId,
    groupName: group.name,
    owed: myOwedTransaction,
    gets: myGetsTransaction,
  });
});
module.exports = Router;
