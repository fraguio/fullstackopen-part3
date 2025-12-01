const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const phoneNumberCustomValidator = {
  validator: function (number) {
    return /^(\d{2}|\d{3})-\d+$/.test(number);
  },
  message: (props) =>
    `${props.value} is not a valid phone number. It must be 8 or more characters in length and follow the format 'XX-XXXXXXXX' or 'XXX-XXXXXXX' where X are digits.`,
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: phoneNumberCustomValidator,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
