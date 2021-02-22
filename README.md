# A group chat web application: Small Talk (2021)

## You can try Small Talk right now to send messages with your friends and family:
* https://smalltalk-jjs.herokuapp.com/

## Video demo (for best video quality, please select 720p):
* https://youtu.be/Lid9BZy_-t0

## Key Functionalities:
* Register/sign in to unique accounts.
* Add other and remove users from a friends list.
* Create private group chats with multiple friends and send messages.
* Experience real-time messaging through WebSockets.
* Group chats and messages are saved in a MongoDB database for future logins.

## Software Used: 
HTML, CSS, JavaScript, React (Hooks, Context API), MongoDB, Node.js (Express), WebSocket API (Socket.IO), JWT, bcrypt, Jest

## Preparations before downloading and running the project:
* Please set up a local or cloud (Atlas) MongoDB database if you haven't already.
* Please have Node.js installed. I am currently using Node.js version 12.16.3 for this project.
* Note: the code in this repository does not support Heroku deployment.

## To run the project, please follow these steps in sequence, carefully or the program will not work properly:
1. Download the .zip file from this repository. Extract the .zip file and you will see two folders: "small_talk_frontend" and "small_talk_backend".
1. On the command prompt/terminal, set environment variables "NODE_ENV" to "development", "st_jwtprivatekey" to "st_key", and "st_db" to your MongoDB URI.
   * Note: use command "set" for Windows or "export" for macOS.
   * For example: >> set NODE_ENV=development.
1. Open a command terminal and go to the "small_talk_frontend" directory, then run "npm i" to install the dependencies. You can ignore the "vulnerabilities" in the terminal if you see any. Do not close this terminal.
1. Open a second terminal for the "small_talk_backend" directory, then run "npm i" to install the dependencies. Do not close this or the previous terminal.
1. Afterwards, in the "small_talk_frontend" terminal, run "npm start" to run the front-end website.
1. Finally, in the "small_talk_backend" terminal, run "node server.js" to run the back-end server.
1. To close the program on the terminals, simply close both terminals and the internet browser that is running the front-end.

## To run tests:
1. On the terminal, set environment variables "NODE_ENV" to "test", "st_jwtprivatekey" to "st_key", and "st_db" to your MongoDB URI (a new database URI for testing is recommended).
   * Note: use command "set" for Windows and "export" for macOS.
   * For example: >> set NODE_ENV=test.
1. To run tests for the API routes, go to the "small_talk_backend" directory on the terminal and run "npm test".
   * Note: the tests will not affect the code or keep test data in the database.
1. To exit tests, hold the "Ctrl" and "c" keys in the terminal (windows) or the "Ctrl" and "z" keys (macOS).
