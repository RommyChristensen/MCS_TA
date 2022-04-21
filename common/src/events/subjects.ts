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
    OrderDone = 'order:done',
    OrderConfirmed = 'order:confirmed',
    OrderReviewed = 'order:reviewed', 
    OrderAutoConfirmed = 'order:autoconfirmed',

    // RATING REVIEW EVENTS
    RatingReviewCreated = 'ratingreview:created',
};
