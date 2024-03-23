"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeLabel = exports.getIssueNummber = exports.labelPresent = exports.getCurrentLabels = exports.labelIssue = void 0;
var core = __importStar(require("@actions/core"));
var auth_1 = require("./auth");
/**
 * getArgumentLabels will get the .github/labels.yaml or .github.labels.yml file.
 * it will then return the section specified by arg.
 *
 * This method has some eslint ignores related to
 * no explicit typing in octokit for content response - https://github.com/octokit/rest.js/issues/1516
 *
 * @param octokit - a hydrated github client
 * @param context - the github actions event context
 * @param arg - the label section to return. For example, may be 'area', etc
 */
var labelIssue = function (octokit, context, issueNum, labels) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, octokit.issues.addLabels(__assign(__assign({}, context.repo), { issue_number: issueNum, labels: labels }))];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                throw new Error("could not add labels: ".concat(e_1));
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.labelIssue = labelIssue;
/**
 * getCurrentLabels will return the labels for the associated issue
 *
 * @param octokit - a hydrated github client
 * @param context - the github actions event context
 * @param issueNum - the issue associated with this runtime
 */
var getCurrentLabels = function (octokit, context, issueNum) { return __awaiter(void 0, void 0, void 0, function () {
    var issue, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, octokit.issues.get(__assign(__assign({}, context.repo), { issue_number: issueNum }))];
            case 1:
                issue = _a.sent();
                return [2 /*return*/, issue.data.labels.map(function (e) {
                        return e.name;
                    })];
            case 2:
                e_2 = _a.sent();
                throw new Error("could not get issue: ".concat(e_2));
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCurrentLabels = getCurrentLabels;
var labelPresent = function (octokit, context, label) { return __awaiter(void 0, void 0, void 0, function () {
    var content, state;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, auth_1.getContentsFromMaintainersFile)(octokit, context, ".github/config.yaml")];
            case 1:
                content = _a.sent();
                state = (0, auth_1.userReturnRole)(content, "states");
                if (state[label] != "") {
                    return [2 /*return*/, state[label]];
                }
                console.log(state, state[label], "#########################################    labelPresent");
                return [2 /*return*/, ""];
        }
    });
}); };
exports.labelPresent = labelPresent;
var getIssueNummber = function (prBody, prTitle) {
    var issueNumber = 0;
    if (prTitle) {
        var issueRegex = /#(\d+)/;
        var match = prTitle.match(issueRegex);
        if (match) {
            issueNumber = parseInt(match[1]);
        }
    }
    // If the issue number wasn't found in the title, try to find it in the body
    if (!issueNumber && prBody) {
        var issueRegex = /#(\d+)/;
        var match = prBody.match(issueRegex);
        if (match) {
            issueNumber = parseInt(match[1]);
        }
    }
    return issueNumber;
};
exports.getIssueNummber = getIssueNummber;
var removeLabel = function (octokit, context, issueNum, label) { return __awaiter(void 0, void 0, void 0, function () {
    var e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, octokit.issues.removeLabel(__assign(__assign({}, context.repo), { issue_number: issueNum, name: label }))];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                core.debug("could not remove labels: ".concat(e_3));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.removeLabel = removeLabel;
