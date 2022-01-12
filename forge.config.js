module.exports = {
    packagerConfig: {
        icon: "src/assets/icons/win/icon.ico",
        asar: true
        // ignore: [
        //     ".idea",
        //     "screenshots",
        //     "test",
        //     "TrackmanData",
        //     ".babelrc",
        //     ".editorconfig",
        //     ".eslintrc.json",
        //     ".gitignore",
        //     ".prettierrc.json",
        //     ".stylelintrc.json",
        //     "_config.yml",
        //     "BingSiteAuth.xml",
        //     "google5aed1ca278ecb5f4.html",
        //     "README.md",
        //     "robots.txt",
        //     "sitemap.txt",
        //     "sitemap.xml",
        //     "tsconfig.json",
        //     "yarn.lock",
        //     //     ".+.test.js",
        //     //     ".*.env",
        // ]
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            platforms: ["win32"],
            config: {
                iconUrl: __dirname + "/src/assets/icons/win/icon.ico",
                loadingGif: __dirname + "/src/assets/icon-green.gif",
                noMsi: false,
                setupIcon: __dirname + "/src/assets/icons/win/icon.ico",
                skipUpdateIcon: true
            }
        },
        {
            name: "@electron-forge/maker-wix",
            platforms: ["win32"],
            config: {
                icon: __dirname + "/src/assets/icons/win/icon.ico",
                ui: {
                    chooseDirectory: true,
                    images: {
                        background: __dirname + "/src/assets/wix/background.bmp",
                        banner: __dirname + "/src/assets/wix/banner.bmp"
                    }
                },
            }
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: ["darwin", "win32"],
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
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'christianrehn',
                    name: 'GCQuadCombineTest'
                },
                authToken: process.env.GITHUB_TOKEN,
                draft: false,
                prerelease: false
            }
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
                },
                "port": 3011,
                "loggerPort": 9011
            }
        ]
    ]
}
