const express = require("express");
const auth = require("../middleware");
const { User, Expense, Group } = require("../db");
const router = express.Router();

router.post("/add", auth, async (req, res) => {
  let { desc, amount, participants, paidBy } = req.body;

  const groupId = req.query.id;
  const group = await Group.findById(groupId);

  await Expense.create({
    desc: desc,
    groupId: groupId,
    amount: amount,
    participants: participants,
    paidBy: paidBy,
  });

  // const payer = group.members.find((g)=>g.userId===paidBy);
  const payer = group.members.find((p) => p.userId == paidBy);
  // console.log(payer);
  participants = participants.filter((p) => p.userId !== paidBy);
  participants.forEach((p) => {
    const pget = payer.gets.find((v) => v.userId == p.userId);
    // console.log(pget);
    pget.amount += p.amount;
  });
  participants.forEach((r) => {
    const p = group.members.find((x) => x.userId == r.userId);
    const powed = p.owed.find((g) => g.userId == paidBy);
    powed.amount += r.amount;
  });
  for (let i = 0; i < participants.length; i++) {
    const pget = payer.gets.find((g) => g.userId == participants[i].userId);
    const powed = payer.owed.find((g) => g.userId == participants[i].userId);
    const participant = group.members.find(
      (m) => m.userId == participants[i].userId
    );
    const participantGet = participant.gets.find((g) => g.userId == paidBy);
    const participantOwed = participant.owed.find((o) => o.userId == paidBy);
    if (pget.amount > powed.amount) {
      participantOwed.amount = pget.amount - powed.amount;
      participantGet.amount = 0;
      pget.amount -= powed.amount;
      powed.amount = 0;
    } else if (pget.amount === powed.amount) {
      pget.amount = 0;
      powed.amount = 0;
      participantGet.amount = 0;
      participantOwed.amount = 0;
    } else {
      participantGet.amount = powed.amount - pget.amount;
      participantOwed.amount = 0;
      powed.amount -= pget.amount;
      pget.amount = 0;
    }
  }
  await group.save();
  res.json({ group });
});

router.get("/splits", auth, async (req, res) => {
  const groupId = req.query.id;
  let expenses = await Expense.find({});
  expenses = expenses.filter((e) => e.groupId.toString() == groupId);
  async function getUserName(id) {
    const user = await User.findById(id);
    return `${user.fName}  ${user.lName}`;
  }
  const splits = await Promise.all(
    expenses.map(async (e) => {
      const name = await getUserName(e.paidBy);
      return {
        name: name,
        desc: e.desc,
        amount: e.amount,
        participants: e.participants,
      };
    })
  );
  console.log(splits);
  res.json({ splits: splits });
});
router.post("/settle", async (req, res) => {
  const id = req.query.id;
  console.log(id);
  const { from, to, amount } = req.body;
  if (amount <= 0) {
    return res.sendStatus(403);
  }
  const group = await Group.findById(id);
  const fromUser = group.members.find((m) => m.userId.toString() == from);
  const toUser = group.members.find((m) => m.userId == to);
  const toInFromUser = fromUser.owed.find((m) => m.userId == to);
  if (amount > toInFromUser.amount) {
    return res.sendStatus(403);
  }
  toInFromUser.amount -= amount;

  const fromInToUser = toUser.gets.find((m) => m.userId == from);

  fromInToUser.amount -= amount;
  await group.save();
  res.json({ msg: "Settled Up" });
});

module.exports = router;
