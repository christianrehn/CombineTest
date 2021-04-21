#GCQuad Combine Test
The Idea comes from the Trackman Combine test.
The quality of your shots is rated using the shots gained approach.

All you need is QCQuad connected to FSX2020 and this programm installed on your computer.
In FSX2020 the shot data must be exported to folder C:/Program Files (x86)/Foresight Sports Experience/System/LastShot.CSV
The GCQuad Combine Test App reads the data from this file and displays some shot data togeter with the points you get from the shots gained rating.

##Technical Details
This program has been built using Electron and React.

After cloning the repo you can:
* start the program from source execute: yarn start
* build a new executable version execute: yarn make

##TODOs:
* Shots gained rating for Driver
* Select between Total and Carry (currently only carry is used)
* Overview after last shot
* Enter directory to watch for LastShot.CSV
