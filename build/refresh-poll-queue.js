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
var refresh_poll_queue_exports = {};
__export(refresh_poll_queue_exports, {
  RefreshPollQueue: () => RefreshPollQueue
});
module.exports = __toCommonJS(refresh_poll_queue_exports);
class RefreshPollQueue {
  inProgress = false;
  queued = false;
  /** Start a poll or record a pending refresh when one is already active. */
  request() {
    if (this.inProgress) {
      this.queued = true;
      return false;
    }
    this.inProgress = true;
    return true;
  }
  /** Whether a refresh request is waiting for the active poll. */
  get hasQueuedRefresh() {
    return this.queued;
  }
  /** Clear a queued request after it has been handled or shutdown begins. */
  clearQueuedRefresh() {
    this.queued = false;
  }
  /**
   * Release the poll and immediately start any request queued during finalization.
   *
   * @param stopping Whether adapter shutdown prevents new polls.
   * @param runQueuedRefresh Starts the queued poll.
   */
  finish(stopping, runQueuedRefresh) {
    this.inProgress = false;
    if (stopping || !this.queued) {
      return;
    }
    this.queued = false;
    runQueuedRefresh();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RefreshPollQueue
});
//# sourceMappingURL=refresh-poll-queue.js.map
