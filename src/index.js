"use strict";
// // console.log("Try npm run lint/fix!");
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPrefix = void 0;
// // const longString = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ut aliquet diam.';
// // const trailing = 'Semicolon'
// // 			const why={am:'I tabbed?'};
// // const iWish = "I didn't have a trailing space..."; 
// // const sicilian = true;;
// // const vizzini = (!!sicilian) ? !!!sicilian : sicilian;
// // const re = /foo   bar/;
// // export function doSomeStuff(withThis: string, andThat: string, andThose: string[]) {
// //     //function on one line
// //     if(!Boolean(andThose.length)) {return false;}
// //     console.log(withThis);
// //     console.log(andThat);
// //     console.dir(andThose);
// //     console.log(longString, trailing, why, iWish, vizzini, re);
// //     return;
// // }
// import * as github from '@actions/github'
// import {Context} from '@actions/github/lib/context'
// import * as core from '@actions/core'
// import * as yaml from 'js-yaml'
// import path = require('path')
// import { error } from 'console'
// import { stringify } from 'querystring'
// // const yaml = require('js-yaml');
// // const github = require("@actions/github")
// function convertToArrayOfString(value: unknown): string[] {
//     if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
//         // Safely convert to array of strings
//         return value as string[];
//     } else {
//         // Handle cases where the value is not an array of strings
//         throw new Error('Value is not an array of strings.');
//     }
// }
// export const getArgumentLabels = async (arg: any, mycat: github.GitHub, context: Context): Promise<string[]> => {
//     let response: any = undefined
//     try {
//         response = await mycat.repos.getContents({...context.repo, path: '.github/labels.yaml'
//         })
//     } catch (e) {
//         try {
//             response = await mycat.repos.getContents({
//                 ...context.repo, path:'.github/labels.yaml'
//             })
//         } catch (e2) {
//             throw new Error (
//                 `couldn't get .github/labels.yaml or .github/labels.yml ${e}, ${e2}`
//             )
//         }
//     }
//     const decoder = Buffer.from(
//         response.data.content,
//         response.data.encoding
//     ).toString()
//     const content = yaml.load(decoder)
//     const newContent = convertToArrayOfString(content)
//     return Array(newContent[arg])
// }
// export const getIssueLabel = async (issue: number, mycat: github.GitHub, context: Context, labels: string[]): Promise<void> => {
//     try {
//         await mycat.issues.addLabels({
//             ...context.repo, issue_number: issue, labels
//         })
//     } catch (e) {
//         throw new Error(` could not add labels ${e}`)
//     }
// }
// let pin: string[] = []
// pin.includes
// let body = "\kind should be placed"
// let command = "\kind"
// const toReturn = []
//   const lineArray = body.split('\n')
//   let bodyArray = undefined
//   console.log(lineArray)
//   for (const iterator of lineArray) {
//     if (iterator.includes(command)) {
//       bodyArray = iterator.split(' ')
//     }
//   }
//   console.log(bodyArray)
//   if (bodyArray === undefined) {
//     throw new Error(`command ${command} missing from body`)
//   }
//   let i = 0
//   while (bodyArray[i] !== command && i < bodyArray.length) {
//     i++
//   }
//   // advance the index to the next as we've found the command
//   i++
//   console.log(bodyArray[i])
//   while (bodyArray[i] !== '\n' && i < bodyArray.length) {
//     toReturn.push(bodyArray[i])
//     i++
//   }
//   console.log(toReturn)
// export const getCurrentLabels = async (
//   octokit: github.GitHub,
//   context: Context,
//   issueNum: number
// ): Promise<string[]> => {
//   try {
//     const issue = await octokit.issues.get({
//       ...context.repo,
//       issue_number: issueNum
//     })
//     return issue.data.labels.map(e => {
//       return e.name
//     })
//   } catch (e) {
//     throw new Error(`could not get issue: ${e}`)
//   }
// }
var addPrefix = function (prefix, args) {
    var toReturn = [];
    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
        var arg = args_1[_i];
        toReturn.push("".concat(prefix, "/").concat(arg));
    }
    return toReturn;
};
exports.addPrefix = addPrefix;
var args = ["this", "toy", "me"];
// addPrefix("nw", args)
console.log((0, exports.addPrefix)("nw", args));
