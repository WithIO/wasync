<template>
    <div class="debounce">
        <div>
            <input type="text" v-model="search">
        </div>

        <ul>
            <li><label>
                <input type="checkbox" v-model="returnError">
                Return error
            </label></li>
            <li>Search = {{ search }}</li>
            <li>Result = {{ result }}</li>
            <li>Loading = {{ loading }}</li>
            <li>
                Call list
                <ul>
                    <li v-for="(call, idx) of callList" :key="idx">
                        {{ call }}
                    </li>
                </ul>
            </li>
            <li>
                Error list
                <ul>
                    <li v-for="error of errorList" :key="error">
                        {{ error }}
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import {ObjectDebounce} from "../src";

/**
 * Mock API that will simply echo back the search query after 1 second.
 */
function doTheSearch({search}) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(`You searched "${search}"`), 1000);
    });
}

export default {
    data() {
        return {
            /**
             * Current search query
             */
            search: '',

            /**
             * "API" output
             */
            result: '',

            /**
             * Indicates if there is currently a search ongoing
             */
            loading: false,

            /**
             * Manually kept list of calls made to run()
             */
            callList: [],

            /**
             * Manually kept list of errors returned while calling run()
             */
            errorList: [],

            /**
             * Forces run() to return an error
             */
            returnError: false,
        };
    },

    watch: {
        /**
         * Reacts to changes in the search string in order to call the API
         * and return the new results
         */
        search: new ObjectDebounce().func({
            /**
             * Transforms the search value into the parameters that will be
             * passed to run()
             */
            validate(search) {
                return {search};
            },

            /**
             * Sets the loading flag
             */
            prepare() {
                this.loading = true;
            },

            /**
             * Calls the API and returns the result, unless the error mode is
             * enabled in which case an exception is raised.
             */
            run({search}) {
                if (this.returnError) {
                    throw new Error(`Error on "${search}"`);
                } else {
                    this.callList.unshift({search});
                }

                return doTheSearch({search});
            },

            /**
             * In case of success, set the result
             */
            success(result) {
                this.result = result;
            },

            /**
             * In case of error, append the error to the list
             * @param error
             */
            failure(error) {
                this.errorList.unshift(error.message);
            },

            /**
             * Removes the loading flag
             */
            cleanup() {
                this.loading = false;
            },
        })
    },
}
</script>
