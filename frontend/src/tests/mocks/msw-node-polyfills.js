/**
 * MSW Node Polyfills
 *
 * This file provides polyfills needed for MSW to work in Node.js environment.
 *
 * Note: This file must be imported before any MSW-related imports.
 */

// Polyfill for TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill for TransformStream
class MockTransformStream {
  constructor() {
    this.readable = {};
    this.writable = {};
  }
}

global.TransformStream = MockTransformStream;

// Polyfill for ReadableStream
class MockReadableStream {
  constructor() {
    this.locked = false;
  }

  getReader() {
    return {
      read: () => Promise.resolve({ done: true, value: undefined }),
      releaseLock: () => {}
    };
  }
}

global.ReadableStream = global.ReadableStream || MockReadableStream;

// Polyfill for WritableStream
class MockWritableStream {
  constructor() {
    this.locked = false;
  }

  getWriter() {
    return {
      write: () => Promise.resolve(),
      close: () => Promise.resolve(),
      releaseLock: () => {}
    };
  }
}

global.WritableStream = global.WritableStream || MockWritableStream;

// Polyfill for BroadcastChannel
class MockBroadcastChannel {
  constructor(channel) {
    this.channel = channel;
    this.onmessage = null;
  }

  postMessage(message) {
    // No-op in tests
  }

  close() {
    // No-op in tests
  }
}

global.BroadcastChannel = MockBroadcastChannel;
