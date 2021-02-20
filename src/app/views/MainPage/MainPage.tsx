import React from 'react';
import Chokidar, {FSWatcher} from 'chokidar';
import './MainPage.scss';

/**
 * ERROR in ./node_modules/fsevents/fsevents.node 1:0
 * Module parse failed: Unexpected character '�' (1:0)
 *
 * npm rebuild fsevents --update-binary
 */
type Alarm = {
    label: string;
    message: string;
    time: string;
}

const startWatcher = (path: string): void => {
    const onWatcherReady = () => {
        console.info('From here can you check for real changes, the initial scan has been completed.');
    }

    const watcher: FSWatcher = Chokidar.watch(path, {
        ignored: /[\/\\]\./,
        persistent: true
    });

    watcher
        .on('add', function (path) {
            console.log('File', path, 'has been added');
        })
        .on('addDir', function (path) {
            console.log('Directory', path, 'has been added');
        })
        .on('change', function (path) {
            console.log('File', path, 'has been changed');
        })
        .on('unlink', function (path) {
            console.log('File', path, 'has been removed');
        })
        .on('unlinkDir', function (path) {
            console.log('Directory', path, 'has been removed');
        })
        .on('error', function (error) {
            console.log('Error happened', error);
        })
        .on('ready', onWatcherReady)
        .on('raw', function (event: string, path: string, details: any): void {
            // This event should be triggered everytime something happens.
            console.log('Raw event info:', event, path, details);
        });
}

const MainPage = () => {
    const mockAlarms = [
        {
            label: 'Alarm',
            message: 'Some text message!',
            time: '10:50',
        },
    ];

    startWatcher("/Users/rehn/WebstormProjects/ApproachShot/tmp");

    return (
        <div className="main-page">
            <div className="main-page-left"
                 style={{
                     float: "left",
                     width: 500,
                     minWidth: 300,
                     height: "100%",
                     paddingTop: 20,
                 }}>
                <div className="main-page__header">
                    <h3> Next Challenge </h3>
                </div>
                <div style={{
                    marginTop: 100,
                    backgroundColor: "white",
                    color: "#234050",
                    textAlign: "center",
                    width: "70%",
                    paddingTop: 50,
                    paddingBottom: 50,
                    display: "inline-block"
                }}>
                    <p style={{fontSize: 120,}}>60</p>
                    <p style={{fontSize: 60,}}>Meter</p>
                </div>
                {/*<ul className="alarms-holder">*/}
                {/*    {*/}
                {/*        mockAlarms.map((alarm: Alarm) => (*/}
                {/*            <li className="alarm-item">*/}
                {/*                <div>*/}
                {/*                    <p className="alarm-item__time"> {alarm.time} </p>*/}
                {/*                    <p className="alarm-item__label"> {alarm.label} </p>*/}
                {/*                </div>*/}

                {/*                <div className="alarm-item__toggle">*/}
                {/*                    <Toggle/>*/}
                {/*                </div>*/}
                {/*            </li>*/}
                {/*        ))*/}
                {/*    }*/}
                {/*</ul>*/}
            </div>
            <div className="main-page-right"
                 style={{
                     float: "left",
                     minWidth: 700,
                     height: "100%",
                     borderColor: "white",
                     borderStyle: "solid",
                     borderLeftWidth: 5,
                     paddingTop: 20
                 }}>
                <div className="main-page__header">
                    <h3> Last Shot </h3>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
