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
var initialization_retry_exports = {};
__export(initialization_retry_exports, {
  calculateInitializationRetryDelayMs: () => calculateInitializationRetryDelayMs
});
module.exports = __toCommonJS(initialization_retry_exports);
const INITIALIZATION_RETRY_DELAY_MS = 6e4;
const MAX_INITIALIZATION_RETRY_DELAY_MS = 5 * INITIALIZATION_RETRY_DELAY_MS;
function calculateInitializationRetryDelayMs(retryCount) {
  const attempts = Math.max(1, retryCount);
  if (attempts <= 3) {
    return INITIALIZATION_RETRY_DELAY_MS * attempts;
  }
  return MAX_INITIALIZATION_RETRY_DELAY_MS;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  calculateInitializationRetryDelayMs
});
//# sourceMappingURL=initialization-retry.js.map
