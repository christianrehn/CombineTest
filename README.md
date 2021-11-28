<img src="https://github.com/christianrehn/GCQuadCombineTest/blob/master/screenshots/210421_GCQuadCombineTest.png" width="1024">

# GCQuad Combine Test
The idea comes from the Trackman Combine test.
The quality of your shots is rated using the shots gained approach.

All you need is QCQuad connected to FSX2020 and the "GCQuad Combine Test" program installed on your computer.
In FSX2020 you have to start the Practice Range. Every last shot data is automatically exported to folder C:/Program Files (x86)/Foresight Sports Experience/System/LastShot.CSV
The "GCQuad Combine Test" program reads this file and displays some shot data togeter with the points you get from the shots gained rating.

## Technical Details
This program has been built using Electron, React and Typescript.
You can define new Tests (distances, green size, yards or meter, ...) in file src/data/TestsConfiguration.json

After cloning the repo you can:
* start the program from source: yarn start
* build a new executable version (using both maker-squirrel and maker-wix): yarn make

## Ideas for the next version:
* Shots gained rating for tee shots with the driver
* Select between Total and Carry (currently only carry is used)
* Overview after last shot
* Enter directory to watch for LastShot.CSV
