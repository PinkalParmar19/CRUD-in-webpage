const fs = require("fs");
const dataSource = "./dataset/ContactList_Original.json";

const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const mongodbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

exports.getAllItems = getAllItems;
exports.itemExists = itemExists;
exports.getItemByID = getItemByID;
exports.addItem = addItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
exports.getAllItems1 = getAllItems1;

function getAllItems(callback) {
  let data = "";
  MongoClient.connect(url, mongodbOptions, function (err, client) {
    if (err) {
      throw err;
    }
    let db = client.db("ContactList_Original");
    let collection = db.collection("contactList");

    collection.find({}).toArray(function (err, docs) {
      if (err) {
        throw err;
      }
      data = docs;
      if (data == null) {
        callback(err, null);
      } else {
        callback(null, data);
      }
      // close the connection
      client.close();
    });
  });
}
function getAllItems1(callback) {
  fs.readFile(
    "./dataset/ContactList_Original.json",
    "utf8",
    function (err, data) {
      if (err !== null) {
        callback(err, null);
      } else {
        // no error
        callback(null, JSON.parse(data));
      }
    }
  );
}

function itemExists(item, callback) {
  getAllItems(function (err, data) {
    if (data !== null) {
      let exists = false;
      for (let i = 0; i < data.length; i++) {
        if (item.id == data[i].Id) {
          exists = true;
          //   callback(exists);
          break;
        }
      }
      callback(exists);
    }
  });
}
function itemExistsForAdd(item, callback) {
  getAllItems(function (err, data) {
    if (data !== null) {
      let exists = false;
      for (let i = 0; i < data.length; i++) {
        if (item.Id == data[i].Id) {
          exists = true;
          //   callback(exists);
          break;
        }
      }
      callback(exists);
    }
  });
}

function getItemByID(id, callback) {
  getAllItems(function (err, data) {
    if (data !== null) {
      let res = null;
      for (let i = 0; i < data.length; i++) {
        if (id == data[i].Id) {
          res = data[i];
          break;
        }
      }
      //console.log(res);
      callback(res);
    }
  });
}

function addItem(item, callback) {
  let flag = false;
  itemExistsForAdd(item, function (res) {
    if (res == true) {
      callback(flag);
    } else {
      getAllItems(function (err, data) {
        if (data !== null) {
          // let jsonData = data;
          // jsonData.push(item);
          // fs.writeFile(dataSource, JSON.stringify(jsonData), "utf8", function (err) {
          //     if (err) {
          //         callback(flag);
          //     }
          //     flag = true;
          //     callback(flag);
          // });
          MongoClient.connect(url, mongodbOptions, function (err, client) {
            if (err) {
              throw err;
            }

            let db = client.db("ContactList_Original");
            let collection = db.collection("contactList");
            var myobj = item;
            // console.log(myobj);
            collection.insertOne(myobj, function (err, res) {
              if (err) {
                callback(flag);
                throw err;
              }
              //console.log(res);
              flag = true;
              callback(flag);
              client.close();
            });
          });
        }
      });
    }
  });
}

function updateItem(item, callback) {
  let flag = false;
  itemExists(item, function (res) {
    if (res == false) {
      callback(flag);
    } else {
      getAllItems(function (err, data) {
        if (data != null) {
          MongoClient.connect(url, mongodbOptions, function (err, client) {
            if (err) {
              throw err;
            }
            //console.log(item);
            let db = client.db("ContactList_Original");
            let collection = db.collection("contactList");
            let itmID = item.id;
            var myquery = { itmID };
            var newvalues = { $set: item };
            // console.log(newvalues);
            collection.findOneAndUpdate(
              { Id: itmID },
              newvalues,
              { upsert: false },
              function (err, res) {
                //console.log(res);
                if (err) {
                  callback(flag);
                }
                flag = true;
                callback(flag);
                client.close();
              }
            );
          });
        }
      });
    }
  });
}

function deleteItem(item, callback) {
  let flag = false;
  itemExists(item, function (res) {
    if (res == false) {
      callback(flag);
    } else {
      getAllItems(function (err, data) {
        if (data != null) {
          // let jsonData = data;
          let itmId = item.id;
          MongoClient.connect(url, mongodbOptions, function (err, client) {
            if (err) {
              throw err;
            }
            let db = client.db("ContactList_Original");
            let collection = db.collection("contactList");

            var myquery = { Id: itmId };
            collection.deleteOne(myquery, function (err, obj) {
              if (err) throw err;
              // callback(flag);
              client.close();
            });
            flag = true;
            callback(flag);
          });
        }
      });
    }
  });
}
