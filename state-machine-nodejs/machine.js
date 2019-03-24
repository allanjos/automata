const STATE_UNDEFINED = "STATE_UNDEFINED";
const STATE_NOT_STARTED = "STATE_NOT_STARTED";
const STATE_1 = "STATE_1";
const STATE_2 = "STATE_2";
const STATE_3 = "STATE_3";
const STATE_END = "STATE_END";

var StateMachine = {
    currenState: STATE_NOT_STARTED,
    previousState: STATE_UNDEFINED,
    transitionTable: [],
    stopRequested: false
};

StateMachine.callbackState1 = function() {
    console.log("callbackState1()");
};

StateMachine.callbackState2 = function() {
    console.log("callbackState2()");
};

StateMachine.callbackState3 = function() {
    console.log("callbackState3()");
};

StateMachine.callbackFinish = function() {
    console.log("callbackFinish()");

    this.stop();
};

StateMachine.init = function() {
    if (this.initialized) {
        console.log('State machine already initialized.');

        return;
    }

    this.currenState = STATE_NOT_STARTED;

    this.transitionTable = {
        STATE_NOT_STARTED: {next: STATE_1, callbacks: [StateMachine.callbackState1]},
        STATE_1: {next: STATE_2, callbacks: [StateMachine.callbackState2]},
        STATE_2: {next: STATE_3, callbacks: [StateMachine.callbackState3]},
        STATE_3: {next: STATE_END, callbacks: [StateMachine.callbackState3]},
        STATE_END: {next: STATE_NOT_STARTED, callbacks: [StateMachine.callbackFinish]}
    }

    this.initialized = true;
}

StateMachine.processState = function() {
    console.log('processState()');

    // Lock common resources

    var state = this.transitionTable[this.currenState];

    console.log('State entry: ' + JSON.stringify(state));
    console.log('Next state: ' + state.next);

    var self = this;

    state.callbacks.forEach(function(item) {
        var callback = (item).bind(self);

        callback();
    });

    this.currenState = state.next;

    // Unlock common resources
}

StateMachine.start = function() {
    if (!this.initialized) {
        this.init();
    }

    while (!this.stopRequested) {
        console.log('CURRENT STATE: ' + this.currenState);

        this.processState();
    }
}

StateMachine.stop = function() {
    this.stopRequested = true;

    this.initialized = false;
}

function main() {
    console.log('main()');

    StateMachine.start();
}

main();