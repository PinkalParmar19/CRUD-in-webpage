const express = require("express");
const path = require("path");
const MenuItemAccessor = require("./db/MenuItemAccessor.js");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors()); // policy for set and get data
app.use(express.json());
app.use(express.static("public"));

app.get("/items", function (req, res) {
  // read items from Mongo and return them
  MenuItemAccessor.getAllItems(function (err, data) {
    if (err) {
      res.status(500);
      res.send("<p>ERROR: could not read data</p>"); // Content-type is automatically inferred
    } else {
      res.status(200);
      res.json(data); // same as res.send(JSON.stringify(data))
    }
  });
});

app.post("/items/:itemID([0-9]+)$", function (req, res) {
  console.log(req.body);
  MenuItemAccessor.addItem(req.body, function (resp) {
    if (resp == false) {
      res.status(409);
      res.send("<p>ERROR: could not read data</p>");
    } else {
      MenuItemAccessor.itemExists(req.body, function (exists) {
        if (exists === true) {
          res.status(200);
          res.json(1);
        } else {
          res.status(409);
          res.send("<p>ERROR: could not read data</p>");
        }
      });
    }
  });
});

app.put("/items/:itemID([0-9]+)$", function (req, res) {
  MenuItemAccessor.updateItem(req.body, function (resq) {
    let itu = req.body;
    console.log(itu);
    if (resq == true) {
      MenuItemAccessor.getItemByID(req.body.id, function (result) {
        let pass = true;
        console.log(result);
        if (result !== null) {
          let jsonData = result;
          console.log(jsonData + "json data");
          pass = pass && jsonData !== null;
          console.log(pass);
          pass = pass && jsonData.FirstName === itu.FirstName;
          console.log(pass);
          pass = pass && jsonData.LastName === itu.LastName;
          console.log(pass);
          pass = pass && jsonData.Email === itu.Email;
          console.log(pass);
          pass = pass && jsonData.PhoneNumber === itu.PhoneNumber;
          console.log(pass);
        }
        console.log(pass);
        if (pass == true) {
          res.status(200);
          res.json(1);
        } else {
          res.status(409);
          res.send("<p>ERROR: could not read data</p>");
        }
      });
    }
  });
});

app.delete("/items/:itemID([0-9]+)$", function (req, res) {
  let obj = {
    id: parseInt(req.params.itemID),
  };
  console.log(obj);
  MenuItemAccessor.deleteItem(obj, function (result) {
    if (result === true) {
      MenuItemAccessor.itemExists(obj, function (exists) {
        if (exists === false) {
          res.status(200);
          res.json(1);
        } else {
          res.status(400);
          res.send("<p>ERROR: could not read data</p>");
        }
      });
    } else {
      res.status(400);
      res.send("<p>ERROR: could not read data</p>");
    }
  });
});

app.use(function (req, res, next) {
  res.status(404).sendFile(path.resolve("./public/404.html"));
});

// start the server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
