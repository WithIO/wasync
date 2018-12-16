<template>
    <div class="debounce">
        <div>
            <input type="text" v-model="search">
        </div>

        <ul>
            <li>Search = {{ search }}</li>
            <li>Result = {{ result }}</li>
            <li>Loading = {{ loading }}</li>
            <li>
                Call list
                <ul>
                    <li v-for="call of callList" :key="call">{{ call }}</li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
import {ObjectDebounce} from "../src";

function doTheSearch({search}) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(`You searched ${search}`), 1000);
    });
}

export default {
    data() {
        return {
            search: '',
            result: '',
            loading: false,
            callList: [],
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
                this.callList.unshift({search});
                return doTheSearch({search});
            },
            success(result) {
                this.result = result;
            },
            cleanup() {
                this.loading = false;
            },
        })
    },
}
</script>
