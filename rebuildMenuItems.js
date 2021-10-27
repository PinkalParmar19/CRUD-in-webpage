/*
 * Script to create the 'menuitems' collection in the 'restaurantdb' database.
 * Note that any existing data will be lost.
 *
 * You can run this script in two ways:
 *   1. In a command window, enter: mongo rebuildMenuItems.js
 *   2. In a Mongo shell, enter: load('rebuildMenuItems.js')
 */
db = connect('localhost:27017/ContactList_Original');
db.contactList.drop(); // start with a new collection
db.contactList.insertMany(
[
   {
      "Id":1,
      "FirstName":"Pinkal",
      "LastName":"Parmar",
      "Email":"Pinkal@gmail.com",
      "PhoneNumber":"1234567890"
   },
   {
      "Id":2,
      "FirstName":"John",
      "LastName":"Doe",
      "Email":"JohnDoe@gmail.com",
      "PhoneNumber":"0321456789"
   },
   {
      "Id":3,
      "FirstName":"Steve",
      "LastName":"Brown",
      "Email":"SteveBrown@gmail.com",
      "PhoneNumber":"0123456789"
   },
   {
      "Id":4,
      "FirstName":"Jeff",
      "LastName":"White",
      "Email":"JeffWhite@gmail.com",
      "PhoneNumber":"0147258369"
   },
   {
      "Id":5,
      "FirstName":"Alex",
      "LastName":"Brown",
      "Email":"AlexBrown@gmail.com",
      "PhoneNumber":"0123654789"
   }
]
);
