export enum Subjects {
    // USER EVENTS
    UserCreated = 'user:created',
    UserUpdated = 'user:updated',
    UserVerified = 'user:verified',
    UserCompleted = 'user:completed',
    UserConfirmed = 'user:confirmed',
    UserUpdatePP = 'user:updatepp',
    UserUpdateProfile = 'user:updateprofile',

    // CATEGORY EVENTS
    CategoryCreated = 'category:created',
    CategoryUpdated = 'category:updated',
    CategoryDeleted = 'category:deleted',

    // JOB EVENTS
    JobCreated = 'job:created',
    JobUpdated = 'job:updated',
    JobDeleted = 'job:deleted',
    JobCancelled = 'job:cancelled',
    JobDone = 'job:done',
    JobExpired = 'job:expired',
    JobStatusUpdated = 'job:statusupdated',

    // ORDER EVENTS
    OrderCreated = 'order:created',
    OrderUpdated = 'order:updated',
    OrderCancelled = 'order:cancelled',
    OrderExpired = 'order:expired',
    OrderRequested = 'order:requested',
    OrderRejected = 'order:rejected',
    OrderAccepted = 'order:accepted',
    OrderOnprogress = 'order:onprogress',
    OrderOnlocation = "order:onlocation",
    OrderDone = 'order:done',
    OrderConfirmed = 'order:confirmed',
    OrderReviewed = 'order:reviewed', 
    OrderAutoConfirmed = 'order:autoconfirmed',
    OrderAutoCancelled = 'order:autocancelled',
    OrderPaid = 'order:paid',
    OrderPaidPending = 'order:paidpending',

    // RATING REVIEW EVENTS
    RatingReviewCreated = 'ratingreview:created',

    // PAYMENT EVENTS
    PaymentSuccess = 'payment:success',
    PaymentFailed = 'payment:failed',

    // NOTIF EVENTS
    MessageNotification = 'message:notification',
};

// cd ta-auth && npm update @ta-vrilance/common && cd ../ta-expiration && npm update @ta-vrilance/common && cd ../ta-jobs-category && npm update @ta-vrilance/common && cd ../ta-orders && npm update @ta-vrilance/common && cd ../ta-payments && npm update @ta-vrilance/common && cd ../ta-rating-review && npm update @ta-vrilance/common && cd ../ta-search-recommendations && npm update @ta-vrilance/common && cd ../