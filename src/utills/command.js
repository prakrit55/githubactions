"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandArgs = void 0;
/**
 * getCommandArgs will return an array of the arguments associated with a command
 * Ex return: [`some-user', 'some-other-user']
 *
 * @param command - the given command to get arguments for. Ex: '/assign'
 * @param body - the full body of the comment
 */
var getCommandArgs = function (command, body, commenterId) {
    var toReturn = [];
    var lineArray = body.split('\n');
    var bodyArray = undefined;
    for (var _i = 0, lineArray_1 = lineArray; _i < lineArray_1.length; _i++) {
        var iterator = lineArray_1[_i];
        if (iterator.includes(command)) {
            bodyArray = iterator.split(' ');
        }
    }
    if (bodyArray === undefined) {
        throw new Error("command ".concat(command, " missing from body"));
    }
    var i = 0;
    while (bodyArray[i] !== command && i < bodyArray.length) {
        i++;
    }
    // advance the index to the next as we've found the command
    i++;
    while (bodyArray[i] !== '\n' && i < bodyArray.length) {
        toReturn.push(bodyArray[i]);
        i++;
    }
    if (toReturn.length == 0) {
        toReturn.push(commenterId);
    }
    return stripAtSign(toReturn);
};
exports.getCommandArgs = getCommandArgs;
/**
* stripAtSign will remove a leading '@' sign from the arguments array
* This is necessary as some commands may have arguments with users tagged with
* a leading at sign. Ex: /assign @some-user
*
* @param args - the array to remove at signs from
*/
var stripAtSign = function (args) {
    var toReturn = [];
    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
        var e = args_1[_i];
        if (e.startsWith('@')) {
            toReturn.push(e.replace('@', ''));
        }
        else {
            toReturn.push(e);
        }
    }
    return toReturn;
};
