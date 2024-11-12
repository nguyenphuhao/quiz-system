
export default () => {
  return {
    port: +process.env.PORT || 3000,
    db: {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      protocol: process.env.REDIS_PROTOCOL,
    },
    queue: {
      limiter: {
        max: +process.env.QUEUE_RATE_LIMITER_MAX,      // Max number of jobs processed
        duration: +process.env.QUEUE_RATE_LIMITER_DURATION, // per duration in milliseconds
      },
      defaultJobOptions: {
        attempts: +process.env.QUEUE_DEFAULT_JOB_MAX_ATTEMPTS,
        removeOnComplete: true,
        removeOnFail: true,
        backoff: {
          type: process.env.QUEUE_DEFAULT_JOB_BACKOFF_STRATEGY,
          delay: +process.env.QUEUE_DEFAULT_JOB_BACKOFF_DELAY
        }
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPRIRES_IN
    },
    userSettings: {
      hashSalt: +process.env.USER_HASH_SALT,
      autoActivate: +process.env.USER_AUTO_ACTIVATE || 0
    }
  }
};
