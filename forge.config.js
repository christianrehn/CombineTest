module.exports = {
    packagerConfig: {
        icon: "src/assets/icons/win/icon.ico",
        asar: false
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            platforms: ["win32"],
            config: {
                iconUrl: __dirname + "/src/assets/icons/win/icon.ico",
                loadingGif: __dirname + "/src/assets/icon-green.gif",
                setupIcon: __dirname + "/src/assets/icons/win/icon.ico",
                skipUpdateIcon: true
            }
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: ["darwin"],
            config: {
                icon: "src/assets/icons/mac/icon.icns"
            }
        },
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'christianrehn',
                    name: 'CombineTest'
                },
                authToken: process.env.GITHUB_TOKEN,
                draft: false,
                prerelease: false
            }
        }
    ],
    plugins: [
        {
            name: "@electron-forge/plugin-webpack",
            config: {
                devContentSecurityPolicy: 'default-src \'self\' \'unsafe-inline\' data:; script-src \'self\' \'unsafe-eval\' \'unsafe-inline\' data:',
                mainConfig: "./webpack.main.config.js",
                renderer: {
                    config: "./webpack.renderer.config.js",
                    nodeIntegration: true, // Implies `target: 'electron-renderer'` for all entry points
                    entryPoints: [
                        {
                            html: "./src/index.html",
                            js: "./src/renderer.tsx",
                            name: "main_window"
                        }
                    ]
                },
                "port": 3011,
                "loggerPort": 9011
            }
        }
    ]
}
