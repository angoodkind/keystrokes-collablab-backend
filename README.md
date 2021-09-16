# keystrokes-collablab-backend

This is the socket.io server for a chat interface built in React to be run on AWS EC2 for a JATOS study.

To get started, clone the repo and run `npm install`. Then run `nodemon` to start the server locally and edit / observe changes in real time. That's it!

NOTE: You do not need to start the server locally for the study to work on AWS EC2; the server is already being hosted on Heroku at keystrokes-collablab.herokuapp.com. 

If you edit code, you can deploy your edited code through the Heroku CLI. You can also follow common instructions online to host this code yourself on Heroku or another platform like Firebase or AWS.

About the files/directories:
.gitignore => Tells GitHub what files to not commit to github if you include paths to it. E.g. node_modules is not on GitHub becauses I added /node_modules to the gitignore.

Procfile => This file gives Heroku instructions on how to deploy code.

index.js => This is where the actual server code is.

package-lock.json and package.json => These files contain information about the packages that were installed.


