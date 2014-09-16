title: Codeweekend DB Workshop
author:
  name: Lewis Ellis
  twitter: LewisJEllis
  url: http://LewisJEllis.com
output: workshop4.html
controls: true

--

# MongoDB 101

--

### Make sure you have:

* Node.js ready to go
* The files for this workshop downloaded
  - See http://the-dining-philosophers.github.io/code-weekend
* Some sort of text editor, with those files open
* MongoDB installed

--

### Topics to cover:

* MongoDB: what, why, how
* MongoDB: Querying, inserting, etc
* MongoDB with NodeJS: why, how
* Saving and retrieving notes and payments
* Maybe more

--

### Hopefully you're comfortable with:

- Node.js basics
- Storing data in sessions
- Creating and processing forms

We're using the finishing point from Workshop 3 as today's starting point. Like before, we have milestones to jump to if you get behind or need to copy/paste something.

We'll start by going over the application from the end of Workshop 3 to make sure everyone is familiar. If you did not attend Workshop 3, you should still be okay.

--

### Background: MongoDB

* Schemaless
  * Don't have to define the structure
  * Easy for dumping relatively unstructured data
* Document-based - 'NoSQL'
  * Worse for heavily relational data
* Popular replacement for SQL
  * Lots of debate

--

### What we'll ultimately build

By the end of this session, our application will be able to:
* Connect and talk to MongoDB
* Store notes in the database, not the session
* Record a payment history in the database
* Display notes/payments from above

--

### Milestone 0 - Console commands

* Run 'mongo'
* Use, Show, Drop, etc
* Insert, Find
* Remove, Update

--

### Milestone 1

* Get the Node.js Mongodb driver going
  * `npm install --save mongodb`
* View records from the database

--

### Background

* Why Node.js and MongoDB play well together
* Ways for Node.js to talk to MongoDB
  * mongodb: raw driver
  * mongoose: ORM

--

### Connecting and querying:

    var Db = mongo.Db;
    var Server = mongo.Server;
    var db = new Db('codeweekend',
      new Server('localhost', '27017', {auto_reconnect: true}, {}),
      {safe: true}
    );
    db.open(function(){});

    db.collection('test').find().toArray(...);

--

### Milestone 2

* Store notes in the database
* Retrieve notes from the database
* Stop using the session to store everything

--

### Milestone 3

* Record each Venmo payment in the database
* Show payments list on Venmo dashboard

--

# Questions?
