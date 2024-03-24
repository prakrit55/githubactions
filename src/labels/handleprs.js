"use strict";
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
exports.handlePullReq = void 0;
var core = __importStar(require("@actions/core"));
var github = __importStar(require("@actions/github"));
var onPrClosed_1 = require("./onPrClosed");
var onProgress_1 = require("./onProgress");
var labelling_1 = require("../utills/labelling");
var handlePullReq = function (context) {
    if (context === void 0) { context = github.context; }
    return __awaiter(void 0, void 0, void 0, function () {
        var token, octokit, action, _a, runConfig, issueNumber_1, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    token = core.getInput('github-token', { required: true });
                    octokit = new github.GitHub(token);
                    action = context.payload.action;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 10, , 11]);
                    _a = action;
                    switch (_a) {
                        case 'opened': return [3 /*break*/, 2];
                        case 'reopened': return [3 /*break*/, 4];
                        case 'closed': return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 2:
                    core.debug('pr opened');
                    return [4 /*yield*/, (0, onProgress_1.onPrOnReview)(context).catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, e];
                            });
                        }); })];
                case 3: return [2 /*return*/, _b.sent()];
                case 4:
                    core.debug('pr opened');
                    return [4 /*yield*/, (0, onProgress_1.onPrOnReview)(context).catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, e];
                            });
                        }); })];
                case 5: return [2 /*return*/, _b.sent()];
                case 6:
                    runConfig = core.getInput('jobs', { required: false }).split(' ');
                    return [4 /*yield*/, (0, onPrClosed_1.onPrClosed)(context)];
                case 7:
                    issueNumber_1 = _b.sent();
                    issueNumber_1 !== null ? issueNumber_1 : undefined;
                    runConfig.map(function (command) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(command == 'pr-merged' && issueNumber_1 != undefined)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, labelling_1.labelIssue)(octokit, context, issueNumber_1, ["done"])];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 9];
                case 8:
                    core.error("".concat(github.context.eventName, " not yet supported"));
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 11];
                case 10:
                    e_1 = _b.sent();
                    core.setFailed("".concat(e_1));
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
};
exports.handlePullReq = handlePullReq;
