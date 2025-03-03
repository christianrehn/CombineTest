![One shot](screenshots/220106_CombineTest_OneShot.png)

## Background

The idea comes from
the [Trackman Combine test](https://www.dennissalesgolf.com/golf-drills-and-practice-blogs/2016/3/6/trackman-combine-test-benchmark-your-game)
. The quality of each of your shots is rated with a score between 0 and 100. Because I do not own a Trackman but a
[GCQuad](https://www.foresightsports.com/gcquad-quadrascopic-launch-monitor)
from [Foresight Sports](https://www.foresightsports.com) I decided to implement my own "Combine Test" program that
delivers (nearly)
the same score numbers as the original Trackman Combine. As the algorithms to calculate combine scores are not public I
collected as much Trackman data as I could find and analysed the combine score calculation with Excel. The results of
this analysis are the parameters for the linear functions of the score calculation in my program that.

In addition my "Combine Test" program also rates each shot using
the [shots gained approach](https://www.pgatour.com/news/2016/05/31/strokes-gained-defined.html) which is explained in
detail in [Mark Broadie's Book Every Shot Counts](https://www.amazon.com/-/es/Mark-Broadie/dp/1592407501).

## Alternative for iPhone and iPad: TrajectoryX (without FSX2020)

<a href="https://trajectoryx.com"><img src="screenshots/TrajectoryX_transparentBackground.png" alt="App Store" width="400"/></a>

Instead of installing the Combine Test App under Microsoft Windows you can use my
new [TrajectoryX](https://trajectoryx.com)
[iOS-App](https://apps.apple.com/app/trajectoryx/id6502289160?platform=iphone)
that provides the same drill functionality without FSX2020.
You can install this [iOS-App](https://apps.apple.com/app/trajectoryx/id6502289160?platform=iphone) on your iPhone,
iPad (or MacBook) and take it with you on the outdoor range or even on the golf course.

<a href="https://apps.apple.com/app/trajectoryx/id6502289160?platform=iphone"><img src="screenshots/appstore.png" alt="App Store" width="400"/></a>

## Prerequisites to run my "Combine Test"

All you need is [QCQuad](https://www.foresightsports.com/gcquad-quadrascopic-launch-monitor)
, [QuadMAX](https://www.foresightsports.com/pages/quadmax)
, [GC3](https://www.foresightsports.com/gc3)
, [QC2](https://shop.foresightsports.com/collections/certified-pre-owned-gc-launch-monitors/products/cpo-gc2)
or [GCHawk](https://www.foresightsports.com/gchawk) connected to [FSX2020](https://www.foresightsports.com/fsx2020) and
my 100% free and open source "Combine Test"
program installed on your computer (my software could be easily modified to support other launch monitors, it just needs
some ball and club data like carry distance or offline per shot in a CSV file or I could also provide an additional
technical interface).

In [FSX2020](https://www.foresightsports.com/fsx2020) you have to start the Practice Range and enable "Write Shots CSV"
in the
Settings: [FSX2020 User Manual - General Settings](https://www.foresightsports.com/fsx-2020-user-manual#:~:text=Write%20Shots%20CSV%3A%20When%20enabled,game%20to%20assist%20with%20aim)

Every last shot data is now automatically exported to folder
"C:/Program Files (x86)/Foresight Sports Experience/System/LastShot.CSV"

The "Combine Test" program reads this file and displays some shot data together with the points you get from the shots
gained rating and the Trackman score.

If you have a 2 or more monitor setup (beamer + monitor or beamer + laptop display) you can run FSX2020 on the beamer to
see the range and the ball flights and run the QCQuadCombineTest on the other monitor to see the ball/club data, shots
gained and Trackman score.

## Install

Create from source (see below) or just download and install
the [Latest Release](https://github.com/christianrehn/CombineTest/releases) named CombineTest-X.Y.Z.Setup.exe where
X.Y.Z is the release number. As of version 1.2.6 self-update functionallity has been implemented. Updates are
automatically downloaded and installed on the next start of the application.

When you see the "Windows protected your PC" message click on "More info" and "Run anyway" because I did not pay
Microsoft for a code validation certificate.

## Usage

Open app settings and select the method to read the shots CSV file that is written by FSX2020:
![Open settings](screenshots/221112_CombineTest_OpenSettings.png)
IMPORTANT: if you use shots update type "Event (read all shots)" or "Polling" in version 2.4.0 you must first start a
range session in FSX2020 and if the session has been created you can select a drill.
This is necessary because for those shots update types the FSX2020 session json file is used instead of the last shot
csv file. Therefore the latest session file has to be created before you select a drill. You do not have to start a new
session in case you restart a drill or change to a different drill. Just make sure that if you start a drill no new
session file will be created else the Combine Test App is confused by the mixture of session files. This will be
improved in the next version.

![Open settings](screenshots/221112_CombineTest_EditAppSettings.png)

Create a new Player:
![Create player 1](screenshots/220912_CombineTest_CreatePlayer1.png)
![Create player 2](screenshots/220912_CombineTest_CreatePlayer2.png)
![Create player 3](screenshots/220912_CombineTest_CreatePlayer3.png)
![Create player 4](screenshots/220912_CombineTest_CreatePlayer4.png)

Select one of the players:
![Select player](screenshots/220912_CombineTest_SelectPlayer.png)

Select one of the predefined drill configurations:
![Predefined drills](screenshots/220912_CombineTest_SelectDrill.png)

Or add a new drill configurations or edit existing ones:
![Edit drill configuration](screenshots/220912_CombineTest_EditDrillConfiguration.png)

Execute the shots and see the dispersion and Shots Gained and Trackman Scores for the last stroke:
![One shot done](screenshots/220106_CombineTest_OneShotDone.png)

Or for all shots in current session (without dispersion):
![All shots](screenshots/220106_CombineTest_AllShots.png)

### Shots Update Type

Starting from version 2.4 you can select between different shots update types:

#### Event - read only latest shot

This was the only shots update type before versions 2.4.
Whenever a change in the shots CSV file written by FSX2020 is detected the Combine Test App is triggert and the latest
shot (first data row in file) is considered to be a new shot in the current session.
For me this works fine but some people reported that it takes up to 20 seconds until the lates shot data is displayed
and they reported that sometimes shots are even "lost" because the Combine Test App only considers the first data row
for each trigger
event.

#### Event - read all shots

Whenever a change is detected in the current session JSON file by FSX2020 (you can find all session JSON files in the
SessionData directory under "C:/Program Files (x86)/Foresight Sports Experience/SessionData/") the Combine Test App is
triggert and the all shots are read and all new shots are added to the current session.
The idea of this shots update type is that still events are used to trigger the Combine Test App but all shots are read
so that shots are cannot get "lost".

#### Polling

The polling shots update type should be used if events are not triggered reliably on your computer.
Polling always has to read all shots so there is no "read only latest shot" for polling.
If you select this shots update type you also have to set the polling intervall. The shorter the intervall the better is
the response of the Combine Test App but this also increases the load on your computer. After every polling intervall
the current session JSON file has to be read and parsed completely in order to check for new shot data.

### Drill Type

Starting from version 2.0 you can select between different drill types:

#### Trackman Combine and Shots gained

This drill type is what you already know from the Trackman Combine Test.
You have a target and try to shoot as near as possible to the target.
The lower the distance to the target the higher the score.

#### Spin

The Spin type is completely different.
As you can already guess from the name you have to produce a lot of spin to get a high score.
Each spin drill defines a landing area in percent or meter/yard.
If your ball lands outside this corridor you get a zero score.
If your ball is inside this corridor you get a score that depends on the total spin you created with your shot.
The drill configuration defines the spin per meter/yard that you have to create in order to get a score of 100.
If you create more or less spin you get a higher or lower score.
The score is linearly dependent on the generated spin.
So if you only create half of the predefined target spin per meter/yard you only get a score of 50.
If you create two times the predefined target spin per meter/yard you get a score of 200.

In addition to the positive scores you can configure negative scores for coasting. The idea of the sprin drill is to
generate "stopping power" (see for example https://wedgecraft.com). Therefore a long coasting should be avoided and
leads to
negative score if "Consider coasting behavior" is enabled in a spin drill's configuration. If enabled you can define the
maximum coasting that does not lead to a reduced score and the amount of additional coasting that leads to a score of
-1.

#### Target Circle

This drill type is more like "Trackman Combine and Shots gained" but with another score computation.
The Target Circle drills are good for Pitch training.
The drill configuration defines two circles, one for a score of 100 (for example 2 yards or 1.8 meter) and one for a
score of zero (for example 11 yards or 10 meter) in metes/yards or percent and target distances
(for example from 30-65 yards or 28-60 meters).
If your shot is outside or on the 0 score cirecle you get a score of 0.
Between the 0 and the 100 score circle you get a score between 0 and 100. The score distribution is linear.
Inside the 100 score circle the linear distribution is continued so that you get a score greater than 100.

#### As Few Strokes As Possible

Starting from version 3 you can play this variation of the target circle drill. If your shot lands in the target
circle you are allowed to progress to the next distance. If not you can configure what happens:
Retry the same distance again, drop back to previous distance, drop back to first distance or restart the drill.
The aim of the game is to hit as few shots as possible to finish all distances.

## Track your golf training data

Maybe you also want to check out my 100% free iOS-App: [Golf Logbook](https://christianrehn.github.io/golf-logbook/)

## Known inaccuracies

* I do not have shots gained values for carry distances so the shots gained for total distances are used to compute
  shots gained for carry distances.
* I do not have the formulas to calculate the Trackman scores but approximations so there might be a small delta
  compared to the original Trackman score calculation. But all Trackman scores that I have to develop and test my
  calculation (more than 300 shots)  are identical.
* The offline value in LastShot.CSV is the total offline, not the carry offline that I would
  need to calculate shots gained rating and the Trackman score. But currently it is the best approximation I
  have.

## Please support me

### With your data

Please support me by sharing your Trackman scores with me (if possible in Excel format). The more data I have the better
my score calcualtion gets. To share it create a branch in this GitHub repo or mail it to golf.logbook@gmail.com.

## Ideas for the next versions

* Show version number in app.
* Show additional club/ball data so you do not have to switch to FSX2020 to see them.
* Show overview/report like Trackman "Test Center or Combine report". Create links to share reports.
* Add rating that is similar to Trackman Combine Test for Drives.
* Shots gained rating for tee shots with the driver

* Improve splash screen.
* Installer looks ugly -> change
* Select between Total and Carry (currently only carry is used)
* Enter directory to watch for LastShot.CSV

## For Developers

### Technical Details

This program has been built using Node v22, Electron v6, React v18 and Typescript v4. You can define new Tests (
distances, green size, yards or meter, ...) in file src/data/TestsConfiguration.json

After cloning the repo you can:

* start the program from source: yarn start
* build a new executable version using maker-squirrel on a MS Windows system:
    * update version number in package.json
    * yarn clean && yarn ci && yarn make
    * in order to yarn electron-forge publish to the github repo the environment variable GITHUB_TOKEN has to be set
      because it is used in forge.config.js
    * add new versions for auto-update to updates.json file
* check for outdated packages: yarn outdated
* upgrade electron-forge: yarn upgrade -D electron@latest
* to see console logs of main in production add --enable-logging command line option

### To Fix

* "Warning: A component is changing an uncontrolled input to be controlled." when entering a number for radius in end
  ground types table.
* Change to edit configuration takes very long under Windows (not under mac os)
