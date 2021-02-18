import React from 'react';
import Chokidar, {FSWatcher} from 'chokidar';
import './MainPage.scss';
import Toggle from '@/app/componensts/Toggle/Toggle';

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
            <div className="main-page__header">
                <h3> Alarms </h3>
                <button> +</button>
            </div>
            <ul className="alarms-holder">
                {
                    mockAlarms.map((alarm: Alarm) => (
                        <li className="alarm-item">
                            <div>
                                <p className="alarm-item__time"> {alarm.time} </p>
                                <p className="alarm-item__label"> {alarm.label} </p>
                            </div>

                            <div className="alarm-item__toggle">
                                <Toggle/>
                            </div>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

export default MainPage;
