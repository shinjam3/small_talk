# A Real-Time Group Chat Web App: Small Talk (2023)

[![Small Talk Demo](http://img.youtube.com/vi/Lid9BZy_-t0/0.jpg)](http://www.youtube.com/watch?v=Lid9BZy_-t0 "Small Talk Demo")

## Video demo (for best video quality, please select 720p):

- https://youtu.be/Lid9BZy_-t0

## Key Functionalities:

- Register/sign in to unique accounts.
- Add other and remove users from a friends list.
- Create private group chats with multiple friends and send messages.
- Experience real-time messaging through WebSockets.
- Group chats and messages are saved in a MongoDB database for future logins.

## Software Used:

HTML, CSS, JavaScript, React (Hooks, Context API), MongoDB, Node.js (Express), WebSocket API (Socket.IO), JWT, bcrypt, Jest, HTTP Cookies

## Preparations before downloading and running the project:

- Please set up a local or cloud (Atlas) MongoDB database if you haven't already.
- Please have Node.js installed. I am currently using Node.js version 18.60.0 for this project.
- Note: the code in this repository does not support Heroku deployment.

## To run the project, please follow these steps in sequence, carefully or the program will not work properly:

1. Download the .zip file from this repository. Extract the .zip file and you will see two folders: "frontend" and "backend".
2. On the command prompt/terminal, go to the "frontend" directory and do the following steps:
   - run "npm i" to install the dependencies. Do not close this terminal.
   - set environment variable "REACT_APP_API_URL" to "http://localhost:5000"
   - Note: use command "set" for Windows or "export" for macOS. For example: >> set CLIENT_URL=http://localhost:3000
3. Open a second terminal for the "backend" directory and do the following steps:
   - run "npm i" to install the dependencies. Do not close this or the previous terminal.
   - set environment variables ST_JWTPRIVATEKEY to any string, "CLIENT_URL" to "http://localhost:3000" and "ST_DB" to your MongoDB URI.
   - Note: use command "set" for Windows or "export" for macOS. For example: >> set st_jwtprivatekey=st_key
4. Afterwards, in the "frontend" terminal, run "npm start" to run the front-end website.
5. Finally, in the "backend" terminal, run "node server.js" to run the back-end server.
6. To close the program on the terminals, simply close both terminals and the internet browser that is running the front-end.

## To run tests:

1. On the terminal, set environment variables "NODE_ENV" to "test", "ST_JWTPRIVATEKEY" to any string, and "ST_DB" to your MongoDB URI (a new database URI for testing is recommended).
   - Note: use command "set" for Windows and "export" for macOS.
   - For example: >> set NODE_ENV=test.
1. To run tests for the API routes, go to the "backend" directory on the terminal and run "npm test".
   - Note: the tests will not affect the code or keep test data in the database.
1. To exit tests, hold the "Ctrl" and "c" keys in the terminal (windows) or the "Ctrl" and "z" keys (macOS).
