/**
 * Rate limiting middleware for Express
 * Limits the number of requests from a single IP address
 */

// Simple in-memory store for rate limiting
// In production, use Redis or another distributed store
const ipRequestCounts = new Map();
const ipBlockList = new Map();

/**
 * Rate limiter middleware
 * @param {Object} options - Rate limiter options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.maxRequests - Maximum number of requests allowed in the time window
 * @param {number} options.blockDuration - Duration to block IP after exceeding limit (in milliseconds)
 */
const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes by default
  const maxRequests = options.maxRequests || 100; // 100 requests per windowMs by default
  const blockDuration = options.blockDuration || 60 * 60 * 1000; // 1 hour by default
  
  // Clean up old entries periodically
  setInterval(() => {
    const now = Date.now();
    
    // Clean up request counts
    for (const [ip, data] of ipRequestCounts.entries()) {
      if (now - data.startTime > windowMs) {
        ipRequestCounts.delete(ip);
      }
    }
    
    // Clean up block list
    for (const [ip, blockUntil] of ipBlockList.entries()) {
      if (now > blockUntil) {
        ipBlockList.delete(ip);
      }
    }
  }, windowMs);
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Check if IP is blocked
    if (ipBlockList.has(ip)) {
      const blockUntil = ipBlockList.get(ip);
      if (now < blockUntil) {
        const remainingMs = blockUntil - now;
        const remainingMins = Math.ceil(remainingMs / 60000);
        return res.status(429).json({
          success: false,
          message: `Too many requests. Please try again in ${remainingMins} minute(s).`
        });
      } else {
        ipBlockList.delete(ip);
      }
    }
    
    // Initialize or update request count
    if (!ipRequestCounts.has(ip)) {
      ipRequestCounts.set(ip, {
        count: 1,
        startTime: now
      });
    } else {
      const data = ipRequestCounts.get(ip);
      
      // Reset if window has passed
      if (now - data.startTime > windowMs) {
        data.count = 1;
        data.startTime = now;
      } else {
        data.count += 1;
      }
      
      // Block IP if too many requests
      if (data.count > maxRequests) {
        ipBlockList.set(ip, now + blockDuration);
        return res.status(429).json({
          success: false,
          message: 'Too many requests. Please try again later.'
        });
      }
    }
    
    next();
  };
};

/**
 * Stricter rate limiter for authentication endpoints
 */
const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 requests per 15 minutes
  blockDuration: 60 * 60 * 1000 // 1 hour block
});

module.exports = {
  rateLimiter,
  authRateLimiter
};
