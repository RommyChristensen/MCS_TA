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
    // RATING REVIEW EVENTS
    Subjects["RatingReviewCreated"] = "ratingreview:created";
    // PAYMENT EVENTS
    Subjects["PaymentSuccess"] = "payment:success";
    Subjects["PaymentFailed"] = "payment:failed";
})(Subjects = exports.Subjects || (exports.Subjects = {}));
;
