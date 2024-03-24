import * as github from '@actions/github'
import {Context} from '@actions/github/lib/context'
import * as core from '@actions/core'
import { getContentsFromMaintainersFile, userReturnRole } from './auth'
import yaml from 'js-yaml';

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


export const labelIssue = async (
    octokit: github.GitHub,
    context: Context,
    issueNum: number,
    labels: string[]
  ): Promise<void> => {
    try {
      await octokit.issues.addLabels({
        ...context.repo,
        issue_number: issueNum,
        labels,
      })
    } catch (e) {
      throw new Error(`could not add labels: ${e}`)
    }
  }
  
  /**
   * getCurrentLabels will return the labels for the associated issue
   *
   * @param octokit - a hydrated github client
   * @param context - the github actions event context
   * @param issueNum - the issue associated with this runtime
   */
  export const getCurrentLabels = async (
    octokit: github.GitHub,
    context: Context,
    issueNum: number
  ): Promise<string[]> => {
    try {
      const issue = await octokit.issues.get({
        ...context.repo,
        issue_number: issueNum
      })
  
      return issue.data.labels.map(e => {
        return e.name
      })
    } catch (e) {
      throw new Error(`could not get issue: ${e}`)
    }
  }
  
  

  export const labelPresent = async (
    octokit: github.GitHub,
    context: Context,
    label: string
  ): Promise<string> => {
    const content: any = await getContentsFromMaintainersFile(octokit, context, ".github/config.yaml")
    const state: any = userReturnRole(content, "states")

    if (state[label] != "" ) {
        return state[label]
    }
    console.log(state, state[label], "#########################################    labelPresent")
    return ""
  }


  export const getIssueNummber = (prBody: string | undefined, prTitle: string | undefined): number =>{
    let issueNumber: number = 0;

if (prTitle) {
    const issueRegex = /#(\d+)/;
    const match = prTitle.match(issueRegex);
    if (match) {
        issueNumber = parseInt(match[1]);
    }
}

// If the issue number wasn't found in the title, try to find it in the body
if (!issueNumber && prBody) {
    const issueRegex = /#(\d+)/;
    const match = prBody.match(issueRegex);
    if (match) {
        issueNumber = parseInt(match[1]);
    }
}
  return issueNumber
  }


  export const removeLabel = async (
    octokit: github.GitHub,
    context: Context,
    issueNum: number,
    label: string
  ): Promise<void> => {

      try {
        await octokit.issues.removeLabel({
          ...context.repo,
          issue_number: issueNum,
          name: label
        })
      } catch (e) {
        core.debug(`could not remove labels: ${e}`)
      }
  }


  
