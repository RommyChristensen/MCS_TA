"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subjects = void 0;
var Subjects;
(function (Subjects) {
    // USER EVENTS
    Subjects["UserCreated"] = "user:created";
    Subjects["UserUpdated"] = "user:updated";
    Subjects["UserVerified"] = "user:verified";
    Subjects["UserCompleted"] = "user:completed";
    Subjects["UserConfirmed"] = "user:confirmed";
    Subjects["UserUpdatePP"] = "user:updatepp";
    Subjects["UserUpdateProfile"] = "user:updateprofile";
    // CATEGORY EVENTS
    Subjects["CategoryCreated"] = "category:created";
    Subjects["CategoryUpdated"] = "category:updated";
    Subjects["CategoryDeleted"] = "category:deleted";
    // JOB EVENTS
    Subjects["JobCreated"] = "job:created";
    Subjects["JobUpdated"] = "job:updated";
    Subjects["JobDeleted"] = "job:deleted";
    Subjects["JobCancelled"] = "job:cancelled";
    Subjects["JobDone"] = "job:done";
    Subjects["JobExpired"] = "job:expired";
    Subjects["JobStatusUpdated"] = "job:statusupdated";
    // ORDER EVENTS
    Subjects["OrderCreated"] = "order:created";
    Subjects["OrderUpdated"] = "order:updated";
    Subjects["OrderCancelled"] = "order:cancelled";
    Subjects["OrderExpired"] = "order:expired";
    Subjects["OrderRequested"] = "order:requested";
    Subjects["OrderRejected"] = "order:rejected";
    Subjects["OrderAccepted"] = "order:accepted";
    Subjects["OrderOnprogress"] = "order:onprogress";
    Subjects["OrderOnlocation"] = "order:onlocation";
    Subjects["OrderDone"] = "order:done";
    Subjects["OrderConfirmed"] = "order:confirmed";
    Subjects["OrderReviewed"] = "order:reviewed";
    Subjects["OrderAutoConfirmed"] = "order:autoconfirmed";
    Subjects["OrderAutoCancelled"] = "order:autocancelled";
    Subjects["OrderPaid"] = "order:paid";
    Subjects["OrderPaidPending"] = "order:paidpending";
    // RATING REVIEW EVENTS
    Subjects["RatingReviewCreated"] = "ratingreview:created";
    // PAYMENT EVENTS
    Subjects["PaymentSuccess"] = "payment:success";
    Subjects["PaymentFailed"] = "payment:failed";
    // NOTIF EVENTS
    Subjects["MessageNotification"] = "message:notification";
})(Subjects = exports.Subjects || (exports.Subjects = {}));
;
// cd ta-auth && npm update @ta-vrilance/common && cd ../ta-expiration && npm update @ta-vrilance/common && cd ../ta-jobs-category && npm update @ta-vrilance/common && cd ../ta-orders && npm update @ta-vrilance/common && cd ../ta-payments && npm update @ta-vrilance/common && cd ../ta-rating-review && npm update @ta-vrilance/common && cd ../ta-search-recommendations && npm update @ta-vrilance/common && cd ../
