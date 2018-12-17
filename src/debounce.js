const DEFAULT_WAIT = 300;
const DEFAULT_WAIT_BETWEEN = 0;
const DEFAULT_PROP = '$wasyncDebounce';

const INACTIVE = 1;
const WAITING = 2;
const RUNNING = 3;


/**
 * Implements the Async Debounce pattern.
 *
 * It helps you call asynchronous functions only once at a time.
 *
 * See the README
 *
 * @param wait {number} Milliseconds to wait before running
 * @param waitBetween {number} Milliseconds to wait between two consecutive
 *                             runs
 * @constructor
 */
export function Debounce(
    {
        wait = DEFAULT_WAIT,
        waitBetween = DEFAULT_WAIT_BETWEEN,
    } = {},
) {
    const self = this;

    self.state = INACTIVE;
    self.next = undefined;

    /**
     * Generates an asynchronously debounced function
     *
     * @param validate {function} Validation function. If the return value is
     *                            false-ish then the operation is canceled,
     *                            otherwise the return value is passed as first
     *                            parameter of run()
     * @param prepare {function} Immediately invoked in order to prepare the
     *                           UI for the imminent load (like enable the
     *                           loader)
     * @param run {function} The function that does the action. It can return
     *                       a promise. It will be called with the output of
     *                       validate() after wait milliseconds
     * @param success {function} Called with the value returned/resolved by
     *                           run() in case of success
     * @param failure {function} Called with the exception/rejection value
     *                           raised by run()
     * @param cleanup {function} Does the opposite of prepare(), when all
     *                           is finished
     * @returns {Function} Returned function is a composition of all provided
     *                     hooks, in such a way that each of the hook is called
     *                     exactly when it should be (according to the logic
     *                     explained in the README).
     */
    self.func = function ({
        validate,
        prepare,
        run,
        success,
        failure,
        cleanup,
    }) {
        if (!run) {
            throw new Error(
                '"run" function is not defined! That is the point of this '
                + 'Debounce class, so you probably are doing something wrong',
            );
        }

        return function () {
            const stack = {
                this: this,
                args: arguments,
                hooks: {
                    validate,
                    prepare,
                    run,
                    success,
                    failure,
                    cleanup,
                },
            };

            stack.params = self.validate(stack);

            if (!stack.params) {
                return;
            }

            if (self.state === INACTIVE) {
                self.prepare(stack);
            }

            self.next = stack;

            if (self.state === INACTIVE) {
                self.wait();
            }
        };
    };

    /**
     * Runs the validation hook. If no hook is provided then just return an
     * empty object.
     *
     * @private
     * @param validate {function|undefined} Validation hook
     * @param this_ {object} Object to bind the validation hook to
     * @param args {array} Arguments to call the function with
     */
    self.validate = function ({hooks: {validate}, this: this_, args}) {
        let v = {};

        if (validate) {
            v = validate.apply(this_, args);
        }

        return v;
    };

    /**
     * Runs the prepare hook, if defined
     *
     * @private
     * @param prepare {function|undefined} Prepare hook
     * @param this_ {object} Object to bind the prepare hook to
     */
    self.prepare = function ({hooks: {prepare}, this: this_}) {
        if (prepare) {
            prepare.apply(this_);
        }
    };

    /**
     * Go into waiting state and call the run function after the given amount
     * of time. Expects to be called from the "INACTIVE" state.
     *
     * @private
     */
    self.wait = function () {
        self.state = WAITING;
        setTimeout(function () {
            self.run();
        }, wait);
    };

    /**
     * Runs the run hook, wait for the result and then trigger the finishing
     * sequence (re-run if new run available, otherwise success/failure hooks
     * then cleanup).
     *
     * It is expected that the run hook might not always return a Promise, or
     * might just return a Promise-like but with not the exact API we need. For
     * this reason, it passes through Promise.resolve()/Promise.reject().
     *
     * @private
     */
    self.run = function () {
        self.state = RUNNING;

        const stack = this.next;
        const {
            this: this_,
            params,
            hooks: {
                run,
                success,
                failure,
                cleanup,
            },
        } = stack;

        let prom;

        try {
            prom = Promise.resolve(run.call(this_, params));
        } catch (e) {
            prom = Promise.reject(e);
        }

        prom
            .then(function () {
                if (success) {
                    success.apply(this_, arguments);
                }
            })
            .catch(function () {
                if (failure) {
                    failure.apply(this_, arguments);
                }
            })
            .finally(() => {
                if (self.next === stack) {
                    try {
                        if (cleanup) {
                            cleanup.apply(this_);
                        }
                    } finally {
                        self.state = INACTIVE;
                    }
                } else {
                    setTimeout(() => self.run(), waitBetween);
                }
            });
    };
}


/**
 * Independently of how you define your "classes" in JS ('cause you got a hell
 * lot of options there), if you use Debounce.func() directly you'll only get
 * one instance of Debounce. Which means that if you have two instances of your
 * "object" at once then they are going to conflict and this is going to cause
 * trouble.
 *
 * This is then a convenience class that will automatically create a new
 * instance every time the calling "this" changes. The instance will be added
 * as a property to "this" so it can be retrieved by further calls.
 *
 * @param wait {number} Milliseconds to wait before running
 * @param waitBetween {number} Milliseconds to wait between two consecutive
 *                             runs
 * @param prop {string} Name of the property to store the Debounce instance
 *                      into
 * @constructor
 */
export function ObjectDebounce(
    {
        wait = DEFAULT_WAIT,
        waitBetween = DEFAULT_WAIT_BETWEEN,
        prop = DEFAULT_PROP,
    } = {},
) {
    const self = this;

    /**
     * Wrapper around Debounce.func() that will automatically handle Debounce
     * instances.
     *
     * @param validate {function}
     * @param prepare {function}
     * @param run {function}
     * @param success {function}
     * @param failure {function}
     * @param cleanup {function}
     * @returns {function(): *}
     */
    self.func = function ({
        validate,
        prepare,
        run,
        success,
        failure,
        cleanup,
    }) {
        return function () {
            if (!this[prop]) {
                this[prop] = new Debounce({wait, waitBetween});
            }

            const deb = this[prop];
            const func = deb.func({
                validate,
                prepare,
                run,
                success,
                failure,
                cleanup,
            });

            return func.apply(this, arguments);
        };
    };
}
