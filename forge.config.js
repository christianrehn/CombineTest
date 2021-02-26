module.exports = {
    packagerConfig: {
        icon: "src/assets/icons/win/icon.ico",
        ignore: [
            "data",
            "out",
            "build",
            ".+.test.js",
            ".*.env",
            ".eslintrc",
            ".gitignore",
            "README.md",
            "yarn.lock",
            ".jshintrc",
            ".babelrc"
        ]
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                setupIcon: __dirname + "/src/assets/icons/win/icon.ico",
                skipUpdateIcon: true
            }
        },
        {
            name: "@electron-forge/maker-wix",
            config: {
                icon: __dirname + "/src/assets/icons/win/icon.ico",
                ui: {
                    chooseDirectory: true,
                    // images: {
                    //     background: "[...]/path/to/background-493x312.bmp",
                    //     banner: "[...]/path/to/banner-493x58.bmp"
                    // }
                },
            }
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: [
                "darwin"
            ],
            config: {
                icon: "src/assets/icons/mac/icon.icns"
            }
        },
        {
            name: "@electron-forge/maker-deb",
            config: {}
        },
        {
            name: "@electron-forge/maker-rpm",
            config: {}
        }
    ],
    plugins: [
        [
            "@electron-forge/plugin-webpack",
            {
                mainConfig: "./webpack.main.config.js",
                renderer: {
                    config: "./webpack.renderer.config.js",
                    entryPoints: [
                        {
                            html: "./src/index.html",
                            js: "./src/renderer.tsx",
                            name: "main_window"
                        }
                    ]
                }
            }
        ]
    ]
}
