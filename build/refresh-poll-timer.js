"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var refresh_poll_timer_exports = {};
__export(refresh_poll_timer_exports, {
  RefreshPollTimer: () => RefreshPollTimer
});
module.exports = __toCommonJS(refresh_poll_timer_exports);
class RefreshPollTimer {
  /**
   * Create a timer using the adapter's lifecycle-managed timeout functions.
   *
   * @param setTimeout Schedules a one-shot callback and returns its handle.
   * @param clearTimeout Cancels a scheduled callback.
   */
  constructor(setTimeout, clearTimeout) {
    this.setTimeout = setTimeout;
    this.clearTimeout = clearTimeout;
  }
  timeout;
  generation = 0;
  /**
   * Replace the pending timeout with a new one-shot callback.
   *
   * @param callback Runs after the delay unless canceled.
   * @param milliseconds Delay before the callback runs.
   */
  schedule(callback, milliseconds) {
    this.clear();
    const generation = this.generation;
    this.timeout = this.setTimeout(() => {
      if (generation !== this.generation) {
        return;
      }
      this.timeout = void 0;
      callback();
    }, milliseconds);
  }
  /** Cancel the timeout and invalidate callbacks already dispatched by the runtime. */
  clear() {
    this.generation++;
    this.clearTimeout(this.timeout);
    this.timeout = void 0;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RefreshPollTimer
});
//# sourceMappingURL=refresh-poll-timer.js.map
