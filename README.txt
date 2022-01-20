Ajay Sandhu (101185232) Assignment 4

Instructions to run:
    Node, NPM and MongoDB need to be installed in order to run application.
    Once/If they are both installed, use command "npm install" in order to 
    download the needed node_modules folder. 

    The mongoDB daemon must be running in order for the application to work
    correctly. It does not necessarily matter what directory the daemon is run
    in, but it has to be run on the MongoDB default port of 27017 so that the
    daemon is running on URL mongodb://localhost:27017/.
    
    In order to get the daemon running, navigate a (preferably different) 
    terminal window to the directory which holds the folder which you would
    like to hold the database data and run the command  "mongod --dbpath=<database folder>" 
    where <database folder> is the folder in the current directory which you would
    like to hold the database in.
    
    Then once the daemon runs, in another terminal window, use the command 
    "node database-initializer.js" in order to fill the database with users data. 
    The initializer creates a database with the name 'a4' and creates a collection 
    'users' which is filled with 10 user documents.
    
    Then, in the command line enter "node server.js". Once server.js is running, 
    open a browser window and enter in the link "http://localhost:3000". 
    This should land you on a homepage with a welcome message...

Design Decisions:
    The routes for "/login", "/register", "/logout" are all found in the server.js file.
    The routes for "/users" are found in the user-router.js file.
    The routes for "/orders" are found in the order-router.js file.

    For database queries, the Mongoose is used.
    Within the mongoDB database there will exist 3 different collections:
        1. The "users" collection stores the user profile data
        2. The "orders" collection stores the order data
            -> In order to access the orders for each particular user, the order 
                documents store the User ID of the user who purchased it...
        3. The "session" collection stores the session data