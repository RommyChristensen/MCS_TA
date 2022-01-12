"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
var Listener = /** @class */ (function () {
    function Listener(client) {
        var _this = this;
        this.ackWait = 5 * 1000;
        this.subscriptionOptions = function () {
            return _this.client.subscriptionOptions()
                .setDeliverAllAvailable()
                .setManualAckMode(true)
                .setAckWait(_this.ackWait)
                .setDurableName(_this.queueGroupName);
        };
        this.listen = function () {
            var subscription = _this.client.subscribe(_this.subject, _this.queueGroupName, _this.subscriptionOptions());
            subscription.on('message', function (msg) {
                console.log("Message received : " + _this.subject + " / " + _this.queueGroupName);
                var parsedData = _this.parseMessage(msg);
                _this.onMessage(parsedData, msg);
            });
        };
        this.parseMessage = function (message) {
            var data = message.getData();
            return typeof data === 'string'
                ? JSON.parse(data)
                : JSON.parse(data.toString('utf-8'));
        };
        this.client = client;
    }
    return Listener;
}());
exports.Listener = Listener;
