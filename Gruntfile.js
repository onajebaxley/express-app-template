'use strict';

const { Directory } = require('@vamship/grunt-utils');

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
    '   [default]         : Shows this Grunt help message.                           \n' +
    '                                                                                \n' +
    '   all               : Performs standard pre-commit/push activities. Runs       \n' +
    '                       prettier on all source files, then runs eslint, and then \n' +
    '                       executes all tests against the source files. Consider    \n' +
    '                       executing the test:all:dev task as well to ensure that   \n' +
    '                       the development workflow is not broken.                  \n' +
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
    '           [opt5]        [unit]   : Executes server side unit tests against all \n' +
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
    '                                                                                \n' +
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
    '         e2e|all]:     The type of test to execute is specified by the first    \n' +
    '         [dev|build]   sub target (client/server/api/e2e/all), and the files to \n' +
    '                       test (dev/build) is specified by the second subtarget.   \n' +
    '                       The first sub target is mandatory.                       \n' +
    '                       If the "build" subtarget is specified, sources must      \n' +
    '                       already be built and ready for testing in the build      \n' +
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
        working: {
            server: {
                views: null,
                routes: null
            }
        },
        node_modules: null,
        coverage: null,
        dist: null
    });

    // Shorthand references to key folders.
    const SRC = PROJECT.getChild('src');
    const DIST = PROJECT.getChild('dist');
    const LOGS = PROJECT.getChild('logs');
    const TEST = PROJECT.getChild('test');
    const DOCS = PROJECT.getChild('docs');
    const NODE_MODULES = PROJECT.getChild('node_modules');
    const COVERAGE = PROJECT.getChild('coverage');
    const WORKING = PROJECT.getChild('working');

    /* ------------------------------------------------------------------------
     * Grunt task configuration
     * ---------------------------------------------------------------------- */
    grunt.initConfig({
        /**
         * Configuration for grunt-contrib-clean, which is used to:
         *  - Remove temporary files and folders.
         */
        clean: {
            dist: [DIST.getAllFilesPattern()],
            working: [WORKING.getAllFilesPattern()],
            coverage: [COVERAGE.getAllFilesPattern()],
            logs: [LOGS.getAllFilesPattern('log')],
            docs: [DOCS.getAllFilesPattern('html'),
                DOCS.getAllFilesPattern('css'),
                DOCS.getAllFilesPattern('txt'),
                DOCS.getAllFilesPattern('js')]
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
                        cwd: SRC.path,
                        src: ['**'],
                        dest: WORKING.getChild('server').path
                    },
                    {
                        expand: true,
                        cwd: PROJECT.path,
                        src: ['.ebextensions/**'],
                        dest: WORKING.path
                    },
                    {
                        expand: false,
                        cwd: PROJECT.path,
                        src: ['package.json'],
                        dest: WORKING.path
                    },
                    {
                        expand: false,
                        cwd: PROJECT.path,
                        src: ['Dockerfile'],
                        dest: WORKING.path
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
         * Configuration for grunt-jsdoc, which is used to:
         *  - Generate code documentation.
         */
        jsdoc: {
            options: {
                destination: DOCS.path,
                template: NODE_MODULES.getFilePath('docdash')
            },
            src: ['package.json', 'README.md', SRC.getAllFilesPattern('js')]
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
                debug: true,
                logs: {
                    out: LOGS.getFilePath('out.log'),
                    err: LOGS.getFilePath('err.log')
                }
            },
            dev: {
                options: {
                    node_env: 'development',
                    script: SRC.getFilePath('index.js')
                }
            },
            prod: {
                options: {
                    node_env: 'production',
                    script: SRC.getFilePath('index.js')
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
     * Pre check in task. Performs default tasks prior to commit/push, including:
     *  - Beautifying files
     *  - Linting files
     *  - Building sources
     *  - Testing build artifacts
     *  - Cleaning up build results
     */
    grunt.registerTask('all', [
        'format',
        'lint',
        'test:unit',
        'build',
        'clean'
    ]);

    /**
     * Create distribution package task. Creates a new distribution of the app,
     * ready for deployment.
     */
    grunt.registerTask('package', [
        'format',
        'lint',
        'test:unit',
        'test:api',
        'test:e2e',
        'build'
        // 'compress:default'
    ]);

    /**
     * Test task - executes client only tests, server only tests or end to end
     * tests based on the test type passed in. Tests may be executed against
     * dev code or build artifacts.
     */
    grunt.registerTask(
        'test',
        'Executes tests (unit/api/e2e/all) against sources',
        (testType) => {
            testType = testType || 'unit';
            let knownTestTypes = ['unit', 'api', 'e2e'];
            let startServer = false;
            let task;

            if (knownTestTypes.indexOf(testType) >= 0) {
                task = `mocha_istanbul:${testType}`;
                startServer = testType !== 'unit' && !grunt.option('no-server');

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
                if (startServer) {
                    grunt.task.run('express:dev');
                }
                grunt.task.run(task);
                if (startServer) {
                    grunt.task.run('express:dev:stop');
                }
            } else {
                grunt.log.error(`Unrecognized test type: [${testType}]`);
                grunt.log.warn('Type "grunt help" for help documentation');
            }
        }
    );

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
                    tasks.push('test:unit');
                    tasks.push('test:api');
                    tasks.push('test:e2e');
                    tasks.push('build');
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
     *  - Combines and minifies all server side .js files
     *  - Builds the Docker image
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

            grunt.task.run('clean:dist');
            grunt.task.run('clean:working');
            grunt.task.run('clean:logs');
            grunt.task.run('clean:docs');
            grunt.task.run('copy:compile');
            if (!isDebugMode) {
                // grunt.task.run('uglify:compile');
            }

            grunt.task.run('clean:coverage');
            // TODO: Add grunt-docker-build task
        }
    );

    /**
     * Shows help information on how to use the Grunt tasks.
     */
    grunt.registerTask('help', 'Displays grunt help documentation', function() {
        grunt.log.writeln(HELP_TEXT);
    });

    /**
     * Alias for the eslint task.
     */
    grunt.registerTask('lint', ['eslint:dev']);

    /**
     * Alias for the prettier task.
     */
    grunt.registerTask('format', ['prettier']);

    /**
     * Documentation task - generates documentation for the project.
     */
    grunt.registerTask('docs', ['jsdoc']);

    /**
     * Default task. Shows help information.
     */
    grunt.registerTask('default', ['help']);
};
