const fs = require("fs");
var prompt = require("prompt");
prompt.start();

let localStorageGlobal = {};
const newAddress = () => {
  fs.readFile("localStorage.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      localStorageGlobal = JSON.parse(jsonString);
      fs.writeFileSync("localStorage.json", JSON.stringify(localStorageGlobal));
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
};

fs.readFile("localStorage.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file from disk:", err);
    return;
  }
  try {
    localStorageGlobal = JSON.parse(jsonString);
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});

if (!localStorageGlobal.address) {
  prompt.get(["address"], function(err, result) {
    if (result.address === "/register") {
      const registerData = {
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        password: undefined
      };
      register(registerData);
    } else if (result.address === "/login") {
      logIn();
    } else if (result.address === "/logout") {
      logout();
    } else if (result.address === "/usersList") {
      usersList();
    } else if (result.address === "/profileDelete") {
      profileDelete();
    } else if (result.address === "/menu") {
      menu();
    } else {
      console.log("error 404");
      newAddress();
    }
  });
}

const menu = () => {
  console.log("***Please select***");
  console.log("/login");
  console.log("/register");
  console.log("/logout");
  console.log("/usersList");
  console.log("/profileDelete");

  newAddress();
};

const register = data => {
  prompt.get([...Object.keys(data)], function(err, result) {
    data = result;

    if (result.firstName.length < 1) {
      console.log("Too short first Name");
      register(data);
    } else if (result.lastName.length < 1) {
      console.log("Too short last Name");
      register(data);
    } else if (!result.email.includes("@")) {
      console.log("Enter an email");
      register(data);
    } else if (result.password.length < 6) {
      console.log("Too short password");
      register(data);
    } else {
      fs.readFile("data.json", "utf8", (err, jsonString) => {
        if (err) {
          console.log("Error reading file from disk:", err);
          return;
        }
        try {
          const customer = JSON.parse(jsonString);

          let exist;
          customer.forEach(element => {
            if (element.email.slice(0) === data.email.slice(0)) {
              exist = element.email;
            }
          });

          if (exist) {
            console.log("Your email already registered");
            register(data);
          } else {
            data.id = (Math.floor(Math.random() * 999) + 100).toString();
            customer.push(data);
            fs.writeFileSync("data.json", JSON.stringify(customer));
            console.log("You are registered");

            fs.readFile("localStorage.json", "utf8", (err, jsonString) => {
              if (err) {
                console.log("Error reading file from disk:", err);
                return;
              }
              try {
                (localStorageGlobal.token =
                  data.id +
                  "." +
                  (Math.floor(Math.random() * 999) + 100)).toString();
                fs.writeFileSync(
                  "localStorage.json",
                  JSON.stringify(localStorageGlobal)
                );
              } catch (err) {
                console.log("Error parsing JSON string:", err);
              }
            });

            logIn();
          }
        } catch (err) {
          console.log("Error parsing JSON string:", err);
        }
      });
    }
  });
};

const logIn = () => {
  if (localStorageGlobal.token) {
    fs.readFile("data.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("Error reading file from disk:", err);
        return;
      }
      try {
        const customer = JSON.parse(jsonString);
        customer.forEach(element => {
          if (element.id === localStorageGlobal.token.slice(0, 3)) {
            console.log(
              `Hallo ${element.firstName} ${element.lastName} it is you'r dashboard`
            );
            newAddress();
          }
        });
      } catch (err) {
        console.log("Error parsing JSON string:", err);
      }
    });
  } else {
    let userData = {};
    prompt.get(["email", "password"], function(err, result) {
      userData.email = result.email;
      userData.password = result.password;

      fs.readFile("data.json", "utf8", (err, jsonString) => {
        if (err) {
          console.log("Error reading file from disk:", err);
          return;
        }
        try {
          const customer = JSON.parse(jsonString);
          customer.forEach(element => {
            if (
              element.email === userData.email &&
              element.password === userData.password
            ) {
              console.log(
                `Hallo ${element.firstName} ${element.lastName} it is you'r dashboard`
              );
              fs.readFile("localStorage.json", "utf8", (err, jsonString) => {
                if (err) {
                  console.log("Error reading file from disk:", err);
                  return;
                }
                try {
                  (localStorageGlobal.token =
                    element.id +
                    "." +
                    (Math.floor(Math.random() * 999) + 100)).toString();
                  fs.writeFileSync(
                    "localStorage.json",
                    JSON.stringify(localStorageGlobal)
                  );
                } catch (err) {
                  console.log("Error parsing JSON string:", err);
                }
              });
            }
          });
        } catch (err) {
          console.log("Error parsing JSON string:", err);
        }
      });
    });
  }
};

const logout = () => {
  fs.readFile("localStorage.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      console.log("You are logged out");
      fs.writeFileSync("localStorage.json", JSON.stringify({}));
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
};

const usersList = () => {
  if (!localStorageGlobal.token) {
    console.log("Please login!");
    newAddress();
  } else {
    fs.readFile("data.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("Error reading file from disk:", err);
        return;
      }
      try {
        const customer = JSON.parse(jsonString);
        customer.forEach(element => {
          if (element.id === localStorageGlobal.token.slice(0, 3)) {
            if (element.admin) {
              console.log(customer);
              newAddress();
            } else {
              console.log("Access denied");
              newAddress();
            }
          }
        });
      } catch (err) {
        console.log("Error parsing JSON string:", err);
      }
    });
  }
};

const profileDelete = () => {
  if (!localStorageGlobal.token) {
    console.log("Please login!");
    newAddress();
  } else {
    fs.readFile("data.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("Error reading file from disk:", err);
        return;
      }
      try {
        const customer = JSON.parse(jsonString);
        for (let i = 0; i < customer.length; i++) {
          if (customer[i].id === localStorageGlobal.token.slice(0, 3)) {
            customer.splice(i, 1);
            fs.writeFileSync("data.json", JSON.stringify(customer));
            fs.readFile("localStorage.json", "utf8", (err, jsonString) => {
              if (err) {
                console.log("Error reading file from disk:", err);
                return;
              }
              try {
                console.log("You are logged out");
                fs.writeFileSync("localStorage.json", JSON.stringify({}));
              } catch (err) {
                console.log("Error parsing JSON string:", err);
              }
            });
          }
        }
      } catch (err) {
        console.log("Error parsing JSON string:", err);
      }
    });
  }
};
