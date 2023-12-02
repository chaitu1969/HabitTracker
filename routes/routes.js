const router = require("express").Router();
const Habit = require("../model/HabitModel");

// Utility function to find the date and return the string date
function getD(n) {
  let d = new Date();
  d.setDate(d.getDate() + n);
  var newDate = d.toLocaleDateString("pt-br").split("/").reverse().join("-");
  var day;
  switch (d.getDay()) {
    case 0:
      day = "Sun";
      break;
    case 1:
      day = "Mon";
      break;
    case 2:
      day = "Tue";
      break;
    case 3:
      day = "Wed";
      break;
    case 4:
      day = "Thu";
      break;
    case 5:
      day = "Fri";
      break;
    case 6:
      day = "Sat";
      break;
  }
  return { date: newDate, day };
}

// Route to fetch all habits from the database
router.get("/", async (req, resp) => {
  try {
    const habits = await Habit.find()
      .select("-updatedAt -createdAt -__v")
      .sort({ _id: -1 });
    const days = [0, 1, 2, 3, 4, 5, 6].map(getD);
    resp.render("habit", { habit: habits, days });
  } catch (err) {
    console.error(err);
    resp.status(500).send("Error fetching habits");
  }
});

// Route to add or update a habit
router.post("/habit", async (req, resp) => {
  const { content } = req.body;
  try {
    let habit = await Habit.findOne({ content: content });
    const today = new Date().toISOString().slice(0, 10);

    if (!habit) {
      // Create New Habit
      let newHabit = new Habit({
        content,
        dates: [{ date: today, complete: "none" }],
      });
      await newHabit.save();
    } else {
      // Update Existing Habit Status
      let dates = habit.dates;
      const dateExists = dates.some((item) => item.date === today);

      if (!dateExists) {
        dates.push({ date: today, complete: "none" });
        habit.dates = dates;
        await habit.save();
      } else {
        console.log("Habit already inserted in Database");
      }
    }

    resp.redirect("back");
  } catch (err) {
    console.error(err);
    resp.status(500).send("Error processing habit");
  }
});

// Route to update habit status per day
router.get("/habitStatus", async (req, resp) => {
  const { date: d, id } = req.query;

  try {
    const habit = await Habit.findById(id);
    if (!habit) {
      return resp.status(404).send("Habit not found");
    }

    let found = habit.dates.some((item) => item.date === d);
    if (!found) {
      habit.dates.push({ date: d, complete: "yes" });
    } else {
      habit.dates = habit.dates.map((item) => {
        if (item.date === d) {
          return {
            ...item,
            complete:
              item.complete === "yes"
                ? "no"
                : item.complete === "no"
                ? "none"
                : "yes",
          };
        }
        return item;
      });
    }

    await habit.save();
    resp.redirect("back");
  } catch (err) {
    console.error("Habit status not updated", err);
    resp.status(500).send("Error updating habit status");
  }
});

// Route to delete a habit
router.get("/:id", async (req, resp) => {
  const id = req.params.id;

  // Validate ObjectId
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return resp.status(400).send("Invalid ID format");
  }

  try {
    const habitToDelete = await Habit.findOneAndDelete({ _id: id });
    if (!habitToDelete) {
      return resp.status(404).send("Habit not found");
    }
    resp.redirect("/");
  } catch (err) {
    console.error(err);
    resp.status(500).send("Error deleting habit");
  }
});

// Route to handle favicon.ico requests
router.get("/favicon.ico", (req, res) => res.status(204).end());

module.exports = router;
