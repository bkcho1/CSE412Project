# CSE412Project
Getting Started Guide:
1. Install node.js and npm on your repsective OS (you have to look this up yourself, I'm not going to show it here)
2. Install git on your respective OS and configure your ASU email and name on it (like previous step I'm not going to show how to do it here)
3. Install postgreSQL on your respective OS and download pgadmin alongside it, open pgadmin when done
4. In pgadmin, open the server and login with the credintials you created during install, once in right click on the Login/Group Roles tab and create a new role
5. Name the role dd_user and set the password to doogiedoos and in the privleges tab give the dd_user Can login? and Superuser? privleges, once done click save
6. Open a directory of your choosing and run "git clone https://github.com/bkcho1/CSE412Project.git"
7. After above steps, in terminal run "npm install electron electronmon sequelize ejs express pg pg-hstore"
8. You can now freely edit the project and to run it in terminal you type: "npx elextronmon ."

# Pushing Changes to the Github Repo:
1. Save the files in the project directory
2. In terminal type, "git add ."
3. Next, type "git commit -m "a message you want to put here""
4. Finally, type "git push"

# TO-DO List (edit as needed):
1. Main Menu GUI
2. Scheduling GUI
3. Help Page (maybe)
4. Customers GUI
5. PostGreSQL backend database
