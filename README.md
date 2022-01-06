<img src="https://github.com/christianrehn/GCQuadCombineTest/blob/master/screenshots/220106_GCQuadCombineTest_OneShot.png" width="1024">

# GCQuad Combine Test

The idea comes from the Trackman Combine test. The quality of your shots is rated using the shots gained approach.

All you need is QCQuad, GC3 or QC2 connected to FSX2020 and the "GCQuad Combine Test" program installed on your
computer. In FSX2020 you have to start the Practice Range. Every last shot data is automatically exported to folder C:
/Program Files (x86)
/Foresight Sports Experience/System/LastShot.CSV The "GCQuad Combine Test" program reads this file and displays some
shot data together with the points you get from the shots gained rating and the Trackman score.

## Usage

Select one of the Predefined Drills:
<img src="https://github.com/christianrehn/GCQuadCombineTest/blob/master/screenshots/220106_GCQuadCombineTest_SelectDrill.png" width="1024">

You can also create your own drill or edit existing drills:
<img src="https://github.com/christianrehn/GCQuadCombineTest/blob/master/screenshots/220106_GCQuadCombineTest_EditDrillConfiguration.png" width="1024">

## Inaccuracies

* I do not have shots gained values for carry distances so the shots gained for total distances are used to compute
  shots gained for carry distances.
* I do not have the formulas to calculate the Trackman scores but approximations so there might be a small delta
  compared to the original Trackman score calculation.
* I think the offline value in LastShot.CSV is the total offline, not the carry offline that I would need to calculate
  shots gained rating and the Trackman score. But it is the best approximation I currently have.

## Ideas for the next versions:

* Save shot history.
* Add rating that is similar to Trackman Combine Test for Drives.
* Show overview/report like Trackman "Test Center or Combine report". Create links to share reports.
* Improve splash screen.

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
  system):
    * update version number in package.json
    * yarn clean && yarn install && yarn make
* check for outdated packages: yarn outdated
* upgrade packages: yarn upgrade

## To Fix

* "Warning: A component is changing an uncontrolled input to be controlled." when entering a number for radius in end
  ground types table.
* Change to edit configuration takes very long under Windows (not under mac os)
