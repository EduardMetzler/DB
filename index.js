const fs = require("fs");

const obj = {
  name: "test"
};

fs.writeFileSync("data.json", JSON.stringify([obj]));

fs.readFile("data.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file from disk:", err);
    return;
  }
  try {
    const customer = JSON.parse(jsonString);
    console.log(customer, "sssssssssssss");
    console.log("Customer address is:", customer[0].name);
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});
