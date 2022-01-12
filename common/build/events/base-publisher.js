"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
var Publisher = /** @class */ (function () {
    function Publisher(client) {
        var _this = this;
        this.publish = function (data) {
            return new Promise(function (resolve, reject) {
                _this.client.publish(_this.subject, JSON.stringify(data), function (err) {
                    if (err) {
                        return reject(err);
                    }
                    console.log('Event Published to Subject ' + _this.subject);
                    resolve();
                });
            });
        };
        this.client = client;
    }
    return Publisher;
}());
exports.Publisher = Publisher;
