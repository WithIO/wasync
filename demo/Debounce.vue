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

function doTheSearch({search}) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(`You searched "${search}"`), 1000);
    });
}

export default {
    data() {
        return {
            search: '',
            result: '',
            loading: false,
            callList: [],
            errorList: [],
            returnError: false,
        };
    },

    watch: {
        search: new ObjectDebounce().func({
            validate(search) {
                return {search};
            },
            prepare() {
                this.loading = true;
            },
            run({search}) {
                if (this.returnError) {
                    throw new Error(`Error on "${search}"`);
                } else {
                    this.callList.unshift({search});
                }

                return doTheSearch({search});
            },
            success(result) {
                this.result = result;
            },
            failure(error) {
                this.errorList.unshift(error.message);
            },
            cleanup() {
                this.loading = false;
            },
        })
    },
}
</script>
