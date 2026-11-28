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
var credentials_exports = {};
__export(credentials_exports, {
  clearDeprecatedNativeCredentials: () => clearDeprecatedNativeCredentials,
  getLoginPasswordCredential: () => getLoginPasswordCredential
});
module.exports = __toCommonJS(credentials_exports);
function getLoginPasswordCredential(credential, getCredentialForm) {
  if (credential.type !== "custom" || !credential.values || typeof credential.values !== "object") {
    throw new Error("A custom Login/Password credential is required");
  }
  const values = credential.values;
  if (getCredentialForm(values) !== "login" || typeof values.login !== "string" || !values.login.trim() || typeof values.password !== "string" || !values.password) {
    throw new Error("The selected credential must contain a login and password");
  }
  return { accountIdentifier: values.login.trim(), password: values.password };
}
async function clearDeprecatedNativeCredentials(config, updateConfig) {
  if (!config.accountIdentifier && !config.password) {
    return true;
  }
  try {
    await updateConfig({ accountIdentifier: "", password: "" });
    config.accountIdentifier = "";
    config.password = "";
    return true;
  } catch {
    return false;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  clearDeprecatedNativeCredentials,
  getLoginPasswordCredential
});
//# sourceMappingURL=credentials.js.map
