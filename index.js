require("dotenv").config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

morgan.token("body", (req, res) => {
  if (req.method === "POST") return JSON.stringify(req.body);
  return " ";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(express.static("dist"));

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  Person.countDocuments({}).then((count) => {
    response.send(
      `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`
    );
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).json({ error: "Person not found" });
    }
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
