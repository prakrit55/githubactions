import * as github from '@actions/github'
import {Context} from '@actions/github/lib/context'
import * as core from '@actions/core'
import { getContentsFromMaintainersFile } from './auth'
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
  

  function isStateInFile(
    ownersContents: string,
    role: string,
  ): string {
    core.debug(`checking if ${role} is in the ${ownersContents} in the OWNERS file`)
    const ownersData = yaml.load(ownersContents) as any;
  
    return ownersData[role]
  }
  

  export const labelPresent = async (
    octokit: github.GitHub,
    context: Context,
    label: string
  ): Promise<string> => {
    const content: any = await getContentsFromMaintainersFile(octokit, context, ".github/config.yaml")
    const state: any = isStateInFile(content, "states")

    if (state[label] != "" ) {
        return content[label]
    }
    console.log(state, state[label])
    return ""
  }