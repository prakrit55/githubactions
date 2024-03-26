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
exports.assign = void 0;
var github = __importStar(require("@actions/github"));
var core = __importStar(require("@actions/core"));
var command_1 = require("../utills/command");
var auth_1 = require("../utills/auth");
/**
 * /assign will self assign with no argument
 * or assign the users in the argument list
 *
 * @param context - the github actions event context
 */
var assign = function (context) {
    if (context === void 0) { context = github.context; }
    return __awaiter(void 0, void 0, void 0, function () {
        var commentApgs, booleanArr, token, octokit, issueNumber, commenterId, commentBody, commentArgs, error_1, i, _i, booleanArr_1, comm, _a, e_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    commentApgs = [], booleanArr = [];
                    core.debug("starting assign job");
                    token = core.getInput('github-token', { required: true });
                    octokit = new github.GitHub(token);
                    issueNumber = (_b = context.payload.issue) === null || _b === void 0 ? void 0 : _b.number;
                    commenterId = context.payload['comment']['user']['login'];
                    commentBody = context.payload['comment']['body'];
                    if (issueNumber === undefined) {
                        throw new Error("github context payload missing issue number: ".concat(context.payload));
                    }
                    commentArgs = (0, command_1.getCommandArgs)('/assign', commentBody, commenterId);
                    console.log(commentArgs, "1");
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all(commentArgs.map(function (arg) { return __awaiter(void 0, void 0, void 0, function () {
                            var roleContent, roleContent;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log(arg, "arg");
                                        if (!(arg == 'me')) return [3 /*break*/, 3];
                                        return [4 /*yield*/, (0, auth_1.getRoleOfUser)(commenterId, octokit, context)];
                                    case 1:
                                        roleContent = _a.sent();
                                        return [4 /*yield*/, (0, auth_1.getConfirm)(octokit, commenterId, roleContent)];
                                    case 2:
                                        booleanArr = _a.sent();
                                        commentArgs = commentArgs.filter(function (word) { return word !== "me"; });
                                        commentArgs.push(commenterId);
                                        return [3 /*break*/, 6];
                                    case 3: return [4 /*yield*/, (0, auth_1.getRoleOfUser)(arg, octokit, context)];
                                    case 4:
                                        roleContent = _a.sent();
                                        console.log(roleContent, "2");
                                        return [4 /*yield*/, (0, auth_1.getConfirm)(octokit, arg, roleContent)];
                                    case 5:
                                        booleanArr = _a.sent();
                                        console.log(booleanArr, "################################Promise");
                                        _a.label = 6;
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _c.sent();
                    throw new Error("could not assign: ".concat(error_1));
                case 4:
                    i = 0;
                    for (_i = 0, booleanArr_1 = booleanArr; _i < booleanArr_1.length; _i++) {
                        comm = booleanArr_1[_i];
                        if (comm == false) {
                            console.log(commentArgs);
                            commentApgs.push(commentArgs[i]);
                        }
                        i++;
                    }
                    _a = commentApgs.length;
                    switch (_a) {
                        case 0: return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 6];
                case 5: throw new Error("no users found. Only users who are members of the org, are collaborators, or have previously commented on this issue may be assigned");
                case 6:
                    _c.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, octokit.issues.addAssignees(__assign(__assign({}, context.repo), { issue_number: issueNumber, assignees: commentApgs }))];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 9];
                case 8:
                    e_1 = _c.sent();
                    console.error('Error adding assignees:', e_1);
                    throw new Error("could not add assignees: ".concat(e_1));
                case 9: return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
};
exports.assign = assign;
/**
 * selfAssign will assign the issue / pr to the user who commented
 *
 * @param octokit - a hydrated github client
 * @param context - the github actions event context
 * @param issueNum - the issue or pr number this runtime is associated with
 * @param user - the user to self assign
 */
var selfAssign = function (octokit, context, issueNum, user) { return __awaiter(void 0, void 0, void 0, function () {
    var isAuthorized;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, auth_1.checkCommenterAuth)(octokit, context, issueNum, user)];
            case 1:
                isAuthorized = _a.sent();
                if (!isAuthorized) return [3 /*break*/, 3];
                return [4 /*yield*/, octokit.issues.addAssignees(__assign(__assign({}, context.repo), { issue_number: issueNum, assignees: [user] }))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
