const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/generate-schedule', (req, res) => {
  const { people } = req.body;
  const daysInMonth = 30;
  const schedule = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const morningPerson = people[Math.floor(Math.random() * people.length)];
    const afternoonPerson = people[Math.floor(Math.random() * people.length)];

    schedule.push({ day: i, morning: morningPerson, afternoon: afternoonPerson });
  }

  res.json(schedule);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
