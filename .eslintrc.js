module.exports = {
    root: true,

    extends: [
        'airbnb-base/legacy',
    ],

    env: {
        browser: true,
        es6: true,
        node: true
    },

    globals: {
        document: false,
        escape: false,
        navigator: false,
        unescape: false,
        window: false,
        describe: true,
        before: true,
        it: true,
        expect: true,
        sinon: true,
    },

    parser: "babel-eslint",

    plugins: [],

    rules: {
        'import/prefer-default-export': 0,
        'indent': ['error', 4],
        'object-curly-spacing': ['error', 'never'],
        'no-restricted-syntax': 0,
        'no-await-in-loop': 0,
        'no-mixed-operators': 0,
        'no-inner-declarations': 0,
        'func-names': 0,
        'comma-dangle': ['error', 'always-multiline'],

        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    },
};
