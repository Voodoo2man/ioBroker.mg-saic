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
var vehicle_object_ids_exports = {};
__export(vehicle_object_ids_exports, {
  indexExistingVehicleObjectIds: () => indexExistingVehicleObjectIds,
  resolveVehicleObjectId: () => resolveVehicleObjectId
});
module.exports = __toCommonJS(vehicle_object_ids_exports);
function indexExistingVehicleObjectIds(objectIds) {
  var _a;
  const result = /* @__PURE__ */ new Map();
  for (const objectId of objectIds) {
    const match = /^vehicles\.([A-Za-z0-9_-]{1,64})$/.exec(objectId);
    if (!match) {
      continue;
    }
    const key = match[1].toLowerCase();
    const existing = (_a = result.get(key)) != null ? _a : [];
    if (!existing.includes(match[1])) {
      existing.push(match[1]);
      existing.sort();
      result.set(key, existing);
    }
  }
  return result;
}
function resolveVehicleObjectId(vehicleObjectIds, vin) {
  var _a;
  const existingIds = vehicleObjectIds.get(vin.toLowerCase());
  return (_a = existingIds == null ? void 0 : existingIds[0]) != null ? _a : vin;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  indexExistingVehicleObjectIds,
  resolveVehicleObjectId
});
//# sourceMappingURL=vehicle-object-ids.js.map
