<img src="https://github.com/christianrehn/GCQuadCombineTest/blob/master/screenshots/210421_GCQuadCombineTest.png" width="1024">

# GCQuad Combine Test

The idea comes from the Trackman Combine test. The quality of your shots is rated using the shots gained approach.

All you need is QCQuad connected to FSX2020 and the "GCQuad Combine Test" program installed on your computer. In FSX2020
you have to start the Practice Range. Every last shot data is automatically exported to folder C:/Program Files (x86)
/Foresight Sports Experience/System/LastShot.CSV The "GCQuad Combine Test" program reads this file and displays some
shot data togeter with the points you get from the shots gained rating.

## To Fix

* Edit configuration takes very long
* Edit Configuration must be scrollable
* Style Edit Configuration
* New Configuarions are not complete -> error when opening the Drill

## Ideas for the next version:

* Add rating that is similar to Trackman Combine Test for pitches.
* Improve splash screen.
* Show overview/report like Trackman "Test Center report" after last shot
* Save shot history and create links to share them
* Should start full screen
* Start page scroll bar should be right without margin
* Delete Config does not work
* Installer looks ugly -> change

* Shots gained rating for tee shots with the driver
* Select between Total and Carry (currently only carry is used)
* Enter directory to watch for LastShot.CSV

# For Developers

## Technical Details

This program has been built using Electron, React and Typescript. You can define new Tests (distances, green size, yards
or meter, ...) in file src/data/TestsConfiguration.json

After cloning the repo you can:

* start the program from source: yarn start
* build a new executable version (using both maker-squirrel (my preferred installer) and maker-wix on a MS Windows
  system): yarn install && yarn make
* check for outdated packages: yarn outdated
* upgrade packages: yarn upgrade
