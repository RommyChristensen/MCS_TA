"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Created"] = "created";
    OrderStatus["Accepted"] = "accepted";
    OrderStatus["Rejected"] = "rejected";
    OrderStatus["Cancelled"] = "cancelled";
    OrderStatus["Done"] = "done";
    OrderStatus["OnLocation"] = "onlocation";
    OrderStatus["Progress"] = "progress";
    OrderStatus["Reviewed"] = "reviewed";
    OrderStatus["Expired"] = "expired";
    OrderStatus["Confirmed"] = "confirmed";
    OrderStatus["Paid"] = "paid";
    OrderStatus["PaidPending"] = "paidpending";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
