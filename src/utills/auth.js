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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertAuthorizedByOwnersOrMembership = exports.checkCommenterAuth = exports.getOrgCollabCommentUsers = exports.checkIssueComments = exports.checkCollaborator = exports.checkAdmin = exports.getRoleOfUser = void 0;
var core = __importStar(require("@actions/core"));
var request_error_1 = require("@octokit/request-error");
var js_yaml_1 = __importDefault(require("js-yaml"));
var getContentsFromMaintainersFile = function (octokit, context, filepath) { return __awaiter(void 0, void 0, void 0, function () {
    var data, response, e_1, decoded;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                data = undefined;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, octokit.repos.getContents(__assign(__assign({}, context.repo), { path: filepath }))];
            case 2:
                response = _a.sent();
                data = response.data;
                console.log(data);
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                if (e_1 instanceof request_error_1.RequestError) {
                    if (e_1.status === 404) {
                        core.debug('No OWNERS file found');
                        return [2 /*return*/, ""];
                    }
                }
                throw new Error("error checking for an OWNERS file at the root of the repository: ".concat(e_1));
            case 4:
                if (!data.content || !data.encoding) {
                    throw new Error("invalid OWNERS file returned from GitHub API: ".concat(data));
                }
                decoded = Buffer.from(data.content, data.encoding).toString();
                core.debug("OWNERS file contents: ".concat(decoded));
                console.log(decoded);
                return [2 /*return*/, decoded];
        }
    });
}); };
var getRoleOfUser = function (octokit, context, arg) { return __awaiter(void 0, void 0, void 0, function () {
    var roleContents, ifCommenterIsAdmin, ifCommenterIsMaintainer, ifCommenterIsDeveloper, rulesForRole, _a, admin, maintainer, developer, fordefault, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 15, , 16]);
                return [4 /*yield*/, getContentsFromMaintainersFile(octokit, context, "./.github/maintainers.yaml")];
            case 1:
                roleContents = _b.sent();
                console.log(roleContents, "1");
                return [4 /*yield*/, userPresentInMaintainers(roleContents, "admin", arg)];
            case 2:
                ifCommenterIsAdmin = _b.sent();
                console.log(ifCommenterIsAdmin, "2");
                return [4 /*yield*/, userPresentInMaintainers(roleContents, "maintainer", arg)];
            case 3:
                ifCommenterIsMaintainer = _b.sent();
                console.log(ifCommenterIsMaintainer, "3");
                return [4 /*yield*/, userPresentInMaintainers(roleContents, "developer", arg)];
            case 4:
                ifCommenterIsDeveloper = _b.sent();
                console.log(ifCommenterIsDeveloper, "4");
                return [4 /*yield*/, getContentsFromMaintainersFile(octokit, context, "./.github/config.yaml")];
            case 5:
                rulesForRole = _b.sent();
                _a = true;
                switch (_a) {
                    case ifCommenterIsAdmin: return [3 /*break*/, 6];
                    case ifCommenterIsMaintainer: return [3 /*break*/, 8];
                    case ifCommenterIsDeveloper: return [3 /*break*/, 10];
                }
                return [3 /*break*/, 12];
            case 6: return [4 /*yield*/, userReturnRole(rulesForRole, "admin")];
            case 7:
                admin = _b.sent();
                console.log(ifCommenterIsAdmin, "admin");
                return [2 /*return*/, admin];
            case 8: return [4 /*yield*/, userReturnRole(rulesForRole, "maintainer")];
            case 9:
                maintainer = _b.sent();
                console.log(ifCommenterIsMaintainer, "mantainer");
                return [2 /*return*/, maintainer];
            case 10: return [4 /*yield*/, userReturnRole(rulesForRole, "developer")];
            case 11:
                developer = _b.sent();
                console.log(ifCommenterIsDeveloper, "developer");
                return [2 /*return*/, developer];
            case 12: return [4 /*yield*/, userReturnRole(rulesForRole, "default")];
            case 13:
                fordefault = _b.sent();
                console.log("default");
                return [2 /*return*/, fordefault];
            case 14: return [3 /*break*/, 16];
            case 15:
                e_2 = _b.sent();
                throw new Error("could not get authorized user: ".concat(e_2));
            case 16: return [2 /*return*/, ""];
        }
    });
}); };
exports.getRoleOfUser = getRoleOfUser;
var userReturnRole = function (maintanersFile, role) { return __awaiter(void 0, void 0, void 0, function () {
    var ruleData, fit;
    return __generator(this, function (_a) {
        ruleData = js_yaml_1.default.load(maintanersFile);
        fit = ruleData[role];
        return [2 /*return*/, fit];
    });
}); };
var userPresentInMaintainers = function (maintainersFile, role, username) { return __awaiter(void 0, void 0, void 0, function () {
    var ownersData, roleMembers;
    return __generator(this, function (_a) {
        core.debug("checking if ".concat(username, " is in the ").concat(role, " in the OWNERS file"));
        ownersData = js_yaml_1.default.load(maintainersFile);
        roleMembers = ownersData[role];
        if (roleMembers !== undefined) {
            return [2 /*return*/, roleMembers.indexOf(username) > -1];
        }
        core.info("".concat(username, " is not in the ").concat(role, " role in the OWNERS file"));
        return [2 /*return*/, false];
    });
}); };
/**
 * checkOrgMember will check to see if the given user is a repo org member
 *
 * @param octokit - a hydrated github client
 * @param context - the github actions event context
 * @param user - the users to check auth on
 */
var checkAdmin = function (octokit, context, user) { return __awaiter(void 0, void 0, void 0, function () {
    var e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (context.payload.repository === undefined) {
                    core.debug("checkAdmin error: context payload repository undefined");
                    return [2 /*return*/, false];
                }
                return [4 /*yield*/, octokit.orgs.checkMembership({
                        org: context.payload.repository.owner.login,
                        username: user
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
            case 2:
                e_3 = _a.sent();
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.checkAdmin = checkAdmin;
/**
 * checkCollaborator checks to see if the given user is a repo collaborator
 *
 * @param octokit - a hydrated github client
 * @param context - the github actions event context
 * @param user - the users to check auth on
 */
var checkCollaborator = function (octokit, context, user) { return __awaiter(void 0, void 0, void 0, function () {
    var e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, octokit.repos.checkCollaborator(__assign(__assign({}, context.repo), { username: user }))];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
            case 2:
                e_4 = _a.sent();
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.checkCollaborator = checkCollaborator;
/**
 * checkIssueComments will check to see if the given user
 * has commented on the given issue
 *
 * @param octokit - a hydrated github client
 * @param context - the github actions event context
 * @param issueNum - the issue or pr number this runtime is associated with
 * @param user - the users to check auth on
 */
var checkIssueComments = function (octokit, context, issueNum, user) { return __awaiter(void 0, void 0, void 0, function () {
    var comments, _i, _a, e, e_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, octokit.issues.listComments(__assign(__assign({}, context.repo), { issue_number: issueNum }))];
            case 1:
                comments = _b.sent();
                for (_i = 0, _a = comments.data; _i < _a.length; _i++) {
                    e = _a[_i];
                    if (e.user.login === user) {
                        return [2 /*return*/, true];
                    }
                }
                return [2 /*return*/, false];
            case 2:
                e_5 = _b.sent();
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.checkIssueComments = checkIssueComments;
/**
 * getOrgCollabCommentUsers will return an array of users who are org members,
 * repo collaborators, or have commented previously
 *
 * @param octokit - a hydrated github client
 * @param context - the github actions event context
 * @param issueNum - the issue or pr number this runtime is associated with
 * @param args - the users to check auth on
 */
var getOrgCollabCommentUsers = function (octokit, context, issueNum, args) { return __awaiter(void 0, void 0, void 0, function () {
    var toReturn, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                toReturn = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Promise.all(args.map(function (arg) { return __awaiter(void 0, void 0, void 0, function () {
                        var isOrgMember, isCollaborator, hasCommented;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, exports.checkAdmin)(octokit, context, arg)];
                                case 1:
                                    isOrgMember = _a.sent();
                                    return [4 /*yield*/, (0, exports.checkCollaborator)(octokit, context, arg)];
                                case 2:
                                    isCollaborator = _a.sent();
                                    return [4 /*yield*/, (0, exports.checkIssueComments)(octokit, context, issueNum, arg)];
                                case 3:
                                    hasCommented = _a.sent();
                                    if (isOrgMember || isCollaborator || hasCommented) {
                                        toReturn.push(arg);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_6 = _a.sent();
                throw new Error("could not get authorized user: ".concat(e_6));
            case 4: return [2 /*return*/, toReturn];
        }
    });
}); };
exports.getOrgCollabCommentUsers = getOrgCollabCommentUsers;
/**
 * checkCommenterAuth will return true
 * if the user is a org member, a collaborator, or has commented previously
 *
 * @param octokit - a hydrated github client
 * @param context - the github actions event context
 * @param issueNum - the issue or pr number this runtime is associated with
 * @param args - the users to check auth on
 */
var checkCommenterAuth = function (octokit, context, issueNum, user) { return __awaiter(void 0, void 0, void 0, function () {
    var isOrgMember, isCollaborator, hasCommented, e_7, e_8, e_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                isOrgMember = false;
                isCollaborator = false;
                hasCommented = false;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, exports.checkAdmin)(octokit, context, user)];
            case 2:
                isOrgMember = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_7 = _a.sent();
                throw new Error("error in checking org member: ".concat(e_7));
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, (0, exports.checkCollaborator)(octokit, context, user)];
            case 5:
                isCollaborator = _a.sent();
                return [3 /*break*/, 7];
            case 6:
                e_8 = _a.sent();
                throw new Error("could not check collaborator: ".concat(e_8));
            case 7:
                _a.trys.push([7, 9, , 10]);
                return [4 /*yield*/, (0, exports.checkIssueComments)(octokit, context, issueNum, user)];
            case 8:
                hasCommented = _a.sent();
                return [3 /*break*/, 10];
            case 9:
                e_9 = _a.sent();
                throw new Error("could not check issue comments: ".concat(e_9));
            case 10:
                if (isOrgMember || isCollaborator || hasCommented) {
                    return [2 /*return*/, true];
                }
                return [2 /*return*/, false];
        }
    });
}); };
exports.checkCommenterAuth = checkCommenterAuth;
/**
 * When an OWNERS file is present, use it to authorize the action
   otherwise fall back to allowing organization members and collaborators
 * @param role is the role to check
 * @param username is the user to authorize
 */
var assertAuthorizedByOwnersOrMembership = function (octokit, context, role, username) { return __awaiter(void 0, void 0, void 0, function () {
    var owners, isOrgMember, isCollaborator;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                core.debug('Checking if the user is authorized to interact with prow');
                return [4 /*yield*/, retrieveOwnersFile(octokit, context)];
            case 1:
                owners = _a.sent();
                if (!(owners !== '')) return [3 /*break*/, 2];
                if (!isInOwnersFile(owners, role, username)) {
                    throw new Error("".concat(username, " is not included in the ").concat(role, " role in the OWNERS file"));
                }
                return [3 /*break*/, 5];
            case 2: return [4 /*yield*/, (0, exports.checkAdmin)(octokit, context, username)];
            case 3:
                isOrgMember = _a.sent();
                return [4 /*yield*/, (0, exports.checkCollaborator)(octokit, context, username)];
            case 4:
                isCollaborator = _a.sent();
                if (!isOrgMember && !isCollaborator) {
                    throw new Error("".concat(username, " is not a org member or collaborator"));
                }
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.assertAuthorizedByOwnersOrMembership = assertAuthorizedByOwnersOrMembership;
/**
 * Retrieve the contents of the OWNERS file at the root of the repository.
 * If the file does not exist, returns an empty string.
 */
function retrieveOwnersFile(octokit, context) {
    return __awaiter(this, void 0, void 0, function () {
        var data, response, makee, e_10, decoded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    core.debug("Looking for an OWNERS file at the root of the repository");
                    data = undefined;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, octokit.repos.getContents(__assign(__assign({}, context.repo), { path: '.github/maintainers.yaml' }))];
                case 2:
                    response = _a.sent();
                    data = response.data;
                    return [4 /*yield*/, octokit.issues.listForRepo({
                            owner: "Keptn",
                            repo: "repo",
                            assignee: "prakrit55"
                        })];
                case 3:
                    makee = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_10 = _a.sent();
                    if (e_10 instanceof request_error_1.RequestError) {
                        if (e_10.status === 404) {
                            core.debug('No OWNERS file found');
                            return [2 /*return*/, ''];
                        }
                    }
                    throw new Error("error checking for an OWNERS file at the root of the repository: ".concat(e_10));
                case 5:
                    if (!data.content || !data.encoding) {
                        throw new Error("invalid OWNERS file returned from GitHub API: ".concat(data));
                    }
                    decoded = Buffer.from(data.content, data.encoding).toString();
                    core.debug("OWNERS file contents: ".concat(decoded));
                    return [2 /*return*/, decoded];
            }
        });
    });
}
/**
 * Determine if the user has the specified role in the OWNERS file.
 * @param ownersContents - the contents of the OWNERS file
 * @param role - the role to check
 * @param username - the user to authorize
 */
function isInOwnersFile(ownersContents, role, username) {
    core.debug("checking if ".concat(username, " is in the ").concat(role, " in the OWNERS file"));
    var ownersData = js_yaml_1.default.load(ownersContents);
    var roleMembers = ownersData[role];
    if (roleMembers !== undefined) {
        return roleMembers.indexOf(username) > -1;
    }
    var yamlString = "\n  admin:\n    name: John \n    age: 30\n    city: New York";
    var obj = js_yaml_1.default.load(yamlString);
    console.log(obj);
    core.info("".concat(username, " is not in the ").concat(role, " role in the OWNERS file"));
    return false;
}
var pic = [{ "issue": 7, }, { "assign": true }, { "pin": 5 }];
var lo = { "issue": 7, "assign": true, "pin": 5 };
if (lo.assign == false) {
}
