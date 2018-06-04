'use strict';

var _folder = require('wysknd-lib').folder;
const { Directory } = require('@vamship/grunt-utils');

// TODO: 1. Consolidate dependencies on multiple Project tree systems
// 2. Validate tasks: clean, bump, package, build

// -------------------------------------------------------------------------------
//  Help documentation
// -------------------------------------------------------------------------------
// prettier-ignore
var HELP_TEXT =
    '--------------------------------------------------------------------------------\n' +
    ' Defines tasks that are commonly used during the development process. This      \n' +
    ' includes tasks for linting, building and testing.                              \n' +
    '                                                                                \n' +
    ' Supported Tasks:                                                               \n' +
    '   [default]         : Performs standard pre-commit/push activities. Runs       \n' +
    '                       prettier on all source files (html and css files are     \n' +
    '                       also beautified), then runs eslint, and then executes all\n' +
    '                       tests against the source files. Consider executing       \n' +
    '                       the test:all:dev task as well to ensure that the         \n' +
    '                       development workflow is not broken.                      \n' +
    '                                                                                \n' +
    '   help              : Shows this help message.                                 \n' +
    '                                                                                \n' +
    '   clean             : Cleans out all build artifacts and other temporary files \n' +
    '                       or directories.                                          \n' +
    '                                                                                \n' +
    '   monitor:[opt1]:   : Monitors files for changes, and triggers actions based   \n' +
    '           [opt2]:     on specified options. Supported options are as follows:  \n' +
    '           [opt3]:       [lint]   : Executes eslint with default options against\n' +
    '           [opt4]:                  all source files.                           \n' +
    '           [opt5]:       [client] : Executes client side unit tests against all \n' +
    '           [opt6]                   source files.                               \n' +
    '                         [unit]   : Executes server side unit tests against all \n' +
    '                                    server source files.                        \n' +
    '                         [api]    : Executes http request test against server   \n' +
    '                                    routes. This task will automatically launch \n' +
    '                                    the web server prior to running the tests,  \n' +
    '                                    and shutdown the server after the tests have\n' +
    '                                    been executed.                              \n' +
    '                         [e2e]    : Executes end to end tests against all source\n' +
    '                                    files. This task will automatically launch  \n' +
    '                                    the web server prior to running tests, and  \n' +
    '                                    shut down the server after the tests have   \n' +
    '                                    been executed.                              \n' +
    '                         [build]  : Performs a full build/test cycle. This      \n' +
    '                                    includes linting, building and testing of   \n' +
    '                                    all build artifacts (unit and e2e). If this \n' +
    '                                    task is specified, all others will be       \n' +
    '                                    ignored.                                    \n' +
    '                                                                                \n' +
    '                       Multiple options may be specified, and the triggers will \n' +
    '                       be executed in the order specified. If a specific task   \n' +
    '                       requires a web server to be launched, this will be done  \n' +
    '                       automatically.                                           \n' +
    '                       An exception to the above statement is when client       \n' +
    '                       testing is chosen as the post change action. Client tests\n' +
    '                       cannot be combined with any other task, and will run     \n' +
    '                       individually.                                            \n' +
    '                                                                                \n' +
    '   lint              : Executes eslint against all source files.                \n' +
    '   format            : Beautifies all javascript files in the project.          \n' +
    '                                                                                \n' +
    '   build:[debugMode] : Builds all of the source files and deploys the results   \n' +
    '                       to the build folder. If the "debugMode" sub target is    \n' +
    '                       specified, or, the --debug-mode option is specified, the \n' +
    '                       build will be executed without any optimization. In      \n' +
    '                       addition to speeding up the build process, this option   \n' +
    '                       has the effect of making the build artifact easier to    \n' +
    '                       read and troubleshoot.                                   \n' +
    '                                                                                \n' +
    '   test:[unit|api    : Executes tests against source files or build artifacts.  \n' +
    '     server|e2e|all]:  The type of test to execute is specified by the first    \n' +
    '         [dev|build]   sub target (client/server/api/e2e/all), and the files to \n' +
    '                       test (dev/build) is specified by the second subtarget.   \n' +
    '                       The first sub target is mandatory.                       \n' +
    '                       If the "build" subtarget is specified, sources must      \n' +
    '                       already be built and ready for testing int the build     \n' +
    '                       directory.                                               \n' +
    '                       If required by the tests, an instance of express will be \n' +
    '                       started prior to executing the tests.                    \n' +
    '                       If [all] is used as the test type, all four tests        \n' +
    '                       (client, server, api and e2e) wll be executed.          \n' +
    '                                                                                \n' +
    '   bump:[major|minor]: Updates the version number of the package. By default,   \n' +
    '                       this task only increments the patch version number. Major\n' +
    '                       and minor version numbers can be incremented by          \n' +
    '                       specifying the "major" or "minor" subtask.               \n' +
    '                                                                                \n' +
    '   package           : Prepares the application for deployment by creating a    \n' +
    '                       distribution package.                                    \n' +
    '                                                                                \n' +
    ' Supported Options:                                                             \n' +
    '   --debug-mode      : When set to true, forces builds to take place in debug   \n' +
    '                       mode (no minification). This option overrides settings   \n' +
    '                       from sub targets.                                        \n' +
    '   --no-server       : When set to true, does not launch an express instance    \n' +
    '                       prior to running tests, even if the tests require an     \n' +
    '                       express instance to be present. In such cases, it is     \n' +
    "                       the user's responsibility to make sure that an express   \n" +
    '                       is running for the test suite.                           \n' +
    '                                                                                \n' +
    ' IMPORTANT: Please note that while the grunt file exposes tasks in addition to  \n' +
    ' ---------  the ones listed below (no private tasks in grunt yet :( ), it is    \n' +
    '            strongly recommended that just the tasks listed below be used       \n' +
    '            during the dev/build process.                                       \n' +
    '                                                                                \n' +
    '--------------------------------------------------------------------------------';
module.exports = function(grunt) {
    /* ------------------------------------------------------------------------
     * Initialization of dependencies.
     * ---------------------------------------------------------------------- */
    //Time the grunt process, so that we can understand time consumed per task.
    require('time-grunt')(grunt);

    //Load all grunt tasks by reading package.json.
    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '!@vamship/grunt-utils']
    });

    /* ------------------------------------------------------------------------
     * Build configuration parameters
     * ---------------------------------------------------------------------- */
    var packageConfig = grunt.file.readJSON('package.json') || {};

    /* ------------------------------------------------------------------------
     * Project structure and static parameters.
     * ---------------------------------------------------------------------- */
    const PROJECT = Directory.createTree('./', {
        src: null,
        test: {
            unit: null,
            api: null,
            e2e: null
        },
        docs: null,
        logs: null,
        node_modules: null,
        coverage: null
    });

    // Shorthand references to key folders.
    const SRC = PROJECT.getChild('src');
    const TEST = PROJECT.getChild('test');
    // const DOCS = PROJECT.getChild('docs');
    // const NODE_MODULES = PROJECT.getChild('node_modules');
    const COVERAGE = PROJECT.getChild('coverage');

    var PRJ_FS = {
        appName: packageConfig.name || '__UNKNOWN__',
        appVersion: packageConfig.version || '__UNKNOWN__',
        // prettier-ignore
        tree: {
                                 /* ------------------------------ */
                                 /* <ROOT>                         */
            server: {
                                 /*  |--- server                   */
                views: null      /*  |   |--- views                */,
                routes: null     /*  |   |--- routes               */
            }                    /*  |                             */,
            client: {
                                 /*  |--- client                   */
                css: null        /*  |   |--- css                  */,
                js: null         /*  |   |--- js                   */,
                img: null        /*  |   |--- img                  */,
                lib: null        /*  |   |--- lib                  */
            }                    /*  |                             */,
            test: {
                                 /*  |--- test                     */
                client: null     /*  |   |--- client               */,
                e2e: null        /*  |   |--- e2e                  */,
                server: null     /*  |   |--- server               */,
                http: null       /*  |   |--- http                 */
            }                    /*  |                             */,
            logs: null           /*  |--- logs                     */,
            working: {
                                 /*  |--- working                  */
                server: {
                                 /*  |   |--- server               */
                    views: null  /*  |   |   |--- views            */,
                    routes: null /*  |   |   |--- routes           */
                }                /*  |   |                         */,
                client: {
                                 /*  |   |--- client               */
                    css: null    /*  |   |   |--- css              */,
                    js: null     /*  |   |   |--- js               */,
                    img: null    /*  |   |   |--- img              */,
                    lib: null    /*  |   |   |--- lib              */,
                    views: null  /*  |   |   |--- views            */
                }                /*  |   |                         */
            }                    /*  |   |                         */,
            coverage: null       /*  |   |--- coverage             */,
            dist: null           /*  |   |--- dist                 */,
            '.sass-cache': null  /*  |   |--- .sass-cache          */
        }                        /* ------------------------------ */
    };

    PRJ_FS.ROOT = _folder.createFolderTree('./', PRJ_FS.tree);
    PRJ_FS.bannerText =
        '/*! [' +
        PRJ_FS.appName +
        ' v' +
        PRJ_FS.appVersion +
        '] Built: <%= grunt.template.today("yyyy-mm-dd HH:MM a") %> */\n';
    PRJ_FS.publishArchive = PRJ_FS.appName + '_' + PRJ_FS.appVersion + '.zip';

    // This is the root url prefix for the app, and represents the path
    // (relative to root), where the app will be available.
    // This value should remain unchanged if the app does not sit behind a
    // proxy. If a proxy is present (that routes to the app based on URL
    // values), this value should be tweaked to include the proxy path.
    PRJ_FS.proxyPrefix = ''; //+ PRJ_FS.appName;

    (function _createTreeRefs(parent, subTree) {
        for (var folder in subTree) {
            var folderName = folder.replace('.', '_');
            parent[folderName] = parent.getSubFolder(folder);

            var children = subTree[folder];
            if (typeof children === 'object') {
                _createTreeRefs(parent[folder], children);
            }
        }
    })(PRJ_FS.ROOT, PRJ_FS.tree);

    // Shorthand references to key folders.
    var SERVER = PRJ_FS.ROOT.server;
    var CLIENT = PRJ_FS.ROOT.client;
    //var TEST = PRJ_FS.ROOT.test;
    var LOGS = PRJ_FS.ROOT.logs;
    var DIST = PRJ_FS.ROOT.dist;
    var WORKING = PRJ_FS.ROOT.working;
    var SERVER_BUILD = WORKING.server;
    var CLIENT_BUILD = WORKING.client;

    /* ------------------------------------------------------------------------
     * Grunt task configuration
     * ---------------------------------------------------------------------- */
    grunt.initConfig({
        /**
         * Configuration for grunt-contrib-clean, which is used to:
         *  - Remove temporary files and folders.
         */
        clean: {
            dist: [DIST.getPath()],
            sassCache: [PRJ_FS.ROOT['_sass-cache'].getPath()],
            coverage: [COVERAGE.path],
            logs: [LOGS.getChildPath('*')]
            // workingJs: {
            //     src: [ CLIENT_BUILD.js.allFilesPattern() ],
            //     filter: function(path) {
            //         return !path.match(/(app.min.js$)/);
            //     }
            // },
            // workingStyles: {
            //     src: [ CLIENT_BUILD.css.allFilesPattern() ],
            //     filter: function(path) {
            //         return !path.match(/app.min.css$/);
            //     }
            // },
            // workingLib: {
            //     src: [ CLIENT_BUILD.lib.allFilesPattern() ],
            //     filter: function(path) {
            //         // Delete everything except for files that will
            //         // be required in a production deployment.
            //         return  !path.match(/\/lib\/font-awesome$/i) &&
            //                 !path.match(/\/lib\/font-awesome\/fonts($|\/.*\.(woff|woff2|ttf|svg|eot|otf)$)/i) &&
            //                 !path.match(/\/lib\/font-awesome\/css($|\/.*\.min\.css$)/i) &&

            //                 !path.match(/\/lib\/material-design-icons$/i) &&
            //                 !path.match(/\/lib\/material-design-icons\/iconfont($|\/.*\.css$)/i) &&
            //                 !path.match(/\/lib\/material-design-icons\/iconfont($|\/.*\.(woff|woff2|ttf|svg|eot|otf|ijmap)$)/i) &&

            //                 true;
            //     }
            // },
            // workingViews: {
            //     src: [ CLIENT_BUILD.views.allFilesPattern() ]
            // }
        },

        /**
         * Configuration for grunt-contrib-copy, which is used to:
         *  - Copy files to a distribution folder during build.
         */
        copy: {
            compile: {
                files: [
                    {
                        expand: true,
                        cwd: SERVER.getPath(),
                        src: ['**'],
                        dest: SERVER_BUILD.getPath()
                    },
                    {
                        expand: true,
                        cwd: CLIENT.getPath(),
                        src: ['**'],
                        dest: CLIENT_BUILD.getPath()
                    },
                    {
                        expand: true,
                        cwd: PRJ_FS.ROOT.getPath(),
                        src: [LOGS.getChildPath('.keep')],
                        dest: WORKING.getPath()
                    },
                    {
                        expand: true,
                        cwd: PRJ_FS.ROOT.getPath(),
                        src: ['.ebextensions/**'],
                        dest: WORKING.getPath()
                    },
                    {
                        expand: false,
                        cwd: PRJ_FS.ROOT.getPath(),
                        src: ['package.json'],
                        dest: WORKING.getPath()
                    },
                    {
                        expand: false,
                        cwd: PRJ_FS.ROOT.getPath(),
                        src: ['server.js'],
                        dest: WORKING.getPath()
                    }
                ]
            }
        },

        /**
         * Configuration for grunt-contrib-concat, which is used to:
         *  - Combine one or more files into a single file.
         */
        // concat: {
        //     options: {},
        //     css: {
        //         src: CLIENT_BUILD.css.allFilesPattern('css'),
        //         dest: CLIENT_BUILD.css.getChildPath('app.min.css')
        //     }
        // },

        /**
         * Configuration for grunt-contrib-compress, which is used to:
         *  - Create compressed archives of build artifacts.
         */
        compress: {
            options: {},
            default: {
                options: {
                    mode: 'zip',
                    archive: DIST.getChildPath(PRJ_FS.publishArchive)
                },
                files: [
                    {
                        cwd: WORKING.getPath(),
                        // .ebextensions is for elastic beanstalk. If the directory
                        // does not exists, this will have no impact.
                        src: ['**/*', '.ebextensions/*'],
                        expand: true
                    }
                ]
            }
        },

        /**
         * Configuration for grunt-browserify, which is used to:
         *  - Combine all CommonJS modules for the browser into a single
         *    javascript file.
         */
        browserify: {
            compile: {
                src: CLIENT_BUILD.js.getChildPath('app.js'),
                dest: CLIENT_BUILD.js.getChildPath('app.min.js'),
                options: {}
            }
        },

        /**
         * Configuration for grunt-contrib-uglify, which is used to:
         *  - Minify the compiled application js file
         */
        uglify: {
            compile: {
                files: [
                    {
                        src: CLIENT_BUILD.js.getChildPath('app.min.js'),
                        dest: CLIENT_BUILD.js.getChildPath('app.min.js')
                    }
                ]
            }
        },

        /**
         * Configuration for grunt-mocha-istanbul, which is used to:
         *  - Execute server side node.js tests
         *  - Test web server API by making http requests to the server
         *  - Provide code coverage information
         */
        mocha_istanbul: {
            options: {
                reportFormats: ['text-summary', 'html'],
                reporter: 'spec',
                colors: true
            },
            default: [TEST.getChild('unit').getAllFilesPattern('js')],
            unit: [TEST.getChild('unit').getAllFilesPattern('js')],
            api: [TEST.getChild('api').getAllFilesPattern('js')],
            e2e: [TEST.getChild('e2e').getAllFilesPattern('js')]
        },

        /**
         * Configuration for grunt-contrib-compass, which is used to:
         *  - Convert all SASS files into css files.
         */
        compass: {
            options: {
                importPath: CLIENT_BUILD.css.getPath(),
                relativeAssets: true,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            compile: {
                options: {
                    sassDir: CLIENT_BUILD.css.getPath(),
                    cssDir: CLIENT_BUILD.css.getPath()
                }
            }
        },

        /**
         * Configuration for grunt-contrib-cssmin, which is used to:
         *  - Combine and minify one or more css files into a single css file.
         */
        cssmin: {
            options: {
                banner: PRJ_FS.bannerText
            },
            compile: {
                src: CLIENT_BUILD.css.getChildPath('app.min.css'),
                dest: CLIENT_BUILD.css.getChildPath('app.min.css')
            }
        },

        /**
         * Configuration for grunt-prettier, which is used to:
         *  - Format javascript source code
         */
        prettier: {
            files: {
                src: [
                    'README.md',
                    'Gruntfile.js',
                    SRC.getAllFilesPattern('js'),
                    TEST.getAllFilesPattern('js')
                ]
            }
        },

        /**
         * Configuration for grunt-eslint, which is used to:
         *  - Lint source and test files.
         */
        eslint: {
            dev: [
                'Gruntfile.js',
                SRC.getAllFilesPattern('js'),
                TEST.getAllFilesPattern('js')
            ]
        },

        /**
         * Configuration for grunt-contrib-watch, which is used to:
         *  - Monitor all source/test files and trigger actions when these
         *    files change.
         */
        watch: {
            allSources: {
                files: [SRC.getAllFilesPattern(), TEST.getAllFilesPattern()],
                tasks: []
            }
        },

        /**
         * Configuration for grunt-express-server, which is used to:
         *  - Start an instance of the express server for the purposes of
         *    running tests.
         */
        express: {
            options: {
                debug: true
            },
            dev: {
                options: {
                    node_env: 'development',
                    script: SERVER.getChildPath('server.js')
                }
            },
            build: {
                options: {
                    node_env: 'test',
                    script: SERVER_BUILD.getChildPath('server.js')
                }
            }
        },

        /**
         * Configuration for grunt-bump, which is used to:
         *  - Update the version number on package.json
         */
        bump: {
            options: {
                push: false
            }
        },

        /**
         * Configuration for grunt-env, which is used to:
         *  - Set or unset environment variables
         */
        env: {
            dev: {
                TEST_MODE: 'dev'
            },
            build: {
                TEST_MODE: 'build'
            }
        }
    });

    /* ------------------------------------------------------------------------
     * Task registrations
     * ---------------------------------------------------------------------- */

    /**
     * Default task. Performs default tasks prior to commit/push, including:
     *  - Beautifying files
     *  - Linting files
     *  - Building sources
     *  - Testing build artifacts
     *  - Cleaning up build results
     */
    grunt.registerTask('default', [
        'format',
        'lint',
        'build',
        // 'test:client:build',
        'test:unit',
        'test:api',
        'test:e2e',
        'clean'
    ]);

    /**
     * Create distribution package task. Creates a new distribution of the app,
     * ready for deployment.
     */
    grunt.registerTask('package', [
        'format',
        'lint',
        'build',
        // 'test:client:build',
        'test:unit',
        'test:api',
        'test:e2e',
        'compress:default'
    ]);

    /**
     * Test task - executes client only tests, server only tests or end to end
     * tests based on the test type passed in. Tests may be executed against
     * dev code or build artifacts.
     */
    grunt.registerTask('test', 'Executes tests (unit/api/e2e/all) against sources', (testType) => {
        testType = testType || 'unit';
        let knownTestTypes = ['unit', 'api', 'e2e'];
        let task;

        if (knownTestTypes.indexOf(testType) >= 0) {
            task = `mocha_istanbul:${testType}`;

            const testSuite = grunt.option('test-suite');
            if (typeof testSuite === 'string' && testSuite.length > 0) {
                const path = TEST.getChild(testType).getFilePath(testSuite);
                grunt.log.writeln(`Running test suite: [${testSuite}]`);
                grunt.log.writeln(`Tests will be limited to: [${path}]`);
                grunt.config.set(`mocha_istanbul.${testType}`, path);
            }
        } else if (testType === 'all') {
            knownTestTypes.forEach((type) => {
                grunt.task.run(`test:${type}`);
            });
        }

        if (task) {
            grunt.task.run(task);
        } else {
            grunt.log.error(`Unrecognized test type: [${testType}]`);
            grunt.log.warn('Type "grunt help" for help documentation');
        }
    });

    // Monitor task - track changes on different sources, and enable auto
    // execution of tests if requested.
    //  - If no arguments are specified, just launch web server with auto
    //    refresh capabilities.
    //  - If arguments are specified (see help) execute the necessary actions
    //    on changes.
    grunt.registerTask(
        'monitor',
        'Monitors source files for changes, and performs actions as necessary',
        function() {
            var tasks = [];
            var runClientTests = false;

            // Process the arguments (specified as subtasks).
            for (var index = 0; index < arguments.length; index++) {
                var arg = arguments[index];

                if (arg === 'lint') {
                    tasks.push('eslint:dev');
                } else if ('client' === arg) {
                    grunt.log.error('Monitoring client has not been implemented');
                    // grunt.log.warn(
                    //     'When client side tests are chosen, monitoring will not run any other tasks'
                    // );
                    // tasks.slice(0, 0);
                    // tasks.push('test:client:monitor');
                    // runClientTests = true;
                    // break;
                } else if ('api' === arg) {
                    tasks.push('test:api');
                } else if ('unit' === arg) {
                    tasks.push('test:unit');
                } else if ('e2e' === arg) {
                    tasks.push('test:e2e');
                } else if ('build' === arg) {
                    grunt.log.warn(
                        'When the build subtask is specified, all other task options will be ignored'
                    );
                    tasks.slice(0, 0);
                    tasks.push('eslint:dev');
                    tasks.push('build');
                    // tasks.push('test:client:build');
                    tasks.push('test:unit');
                    tasks.push('test:api');
                    tasks.push('test:e2e');
                    break;
                } else {
                    // Unrecognized argument.
                    grunt.log.warn('Unrecognized argument: %s', arg);
                }
            }

            grunt.log.writeln('Tasks to run on change: [' + tasks + ']');
            if (runClientTests) {
                tasks.forEach(function(task) {
                    grunt.task.run(task);
                });
            } else if (tasks.length > 0) {
                grunt.config.set('watch.allSources.tasks', tasks);
                grunt.task.run('watch:allSources');
            } else {
                grunt.log.error('No tasks specified to execute on change');
            }
        }
    );

    /**
     * Build task - performs a compilation on all source files
     *  - Combines and compresses all client side .js files
     *  - Compiles angular.js html templates
     *  - Compiles all stylesheet files from .scss to .css
     */
    grunt.registerTask(
        'build',
        'Performs a full build of all source files, preparing it for packaging/publication',
        function(target) {
            var isDebugMode =
                grunt.option('debug-mode') || target === 'debug-mode';
            if (isDebugMode) {
                grunt.log.writeln('Executing build in debug mode');
            }

            // grunt.task.run('clean:dist'); // TODO: confirm
            // grunt.task.run('clean:working');
            grunt.task.run('copy:compile');
            grunt.task.run('browserify:compile');
            grunt.task.run('compass:compile');
            //grunt.task.run('concat:css');
            if (!isDebugMode) {
                grunt.task.run('uglify:compile');
                grunt.task.run('cssmin:compile');
            }

            // grunt.task.run('clean:workingJs');
            // grunt.task.run('clean:workingStyles');
            // grunt.task.run('clean:sassCache'); // TODO: confirm
            // grunt.task.run('clean:coverage'); // TODO: confirm
            // grunt.task.run('clean:workingLib');
            // grunt.task.run('clean:workingViews');
        }
    );

    /**
     * Shows help information on how to use the Grunt tasks.
     */
    grunt.registerTask('help', 'Displays grunt help documentation', function() {
        grunt.log.writeln(HELP_TEXT);
    });

    /**
     * Alias for the prettier task.
     */
    grunt.registerTask('format', ['prettier']);

    /**
     * Alias for the eslint task.
     */
    grunt.registerTask('lint', ['eslint:dev']);
};
