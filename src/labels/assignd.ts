import * as github from '@actions/github'

import {Context} from '@actions/github/lib/context'
import * as core from '@actions/core'

// import {getCommandArgs} from '../utils/command'
import {getCurrentLabels, labelIssue, labelPresent} from  "../utills/labelling"

/**
 * /kind will add a kind/some-kind label
 *
 * @param context - the github actions event context
 */
export const assigned = async (
  context: Context = github.context
): Promise<void> => {
  const token = core.getInput('github-token', {required: true})
  const octokit = new github.GitHub(token)
  const issueArray: string[] = []

  const issueNumber: number | undefined = context.payload.issue?.number

  if (issueNumber === undefined) {
    throw new Error(
      `github context payload missing issue number: ${context.payload}`
    )
  }

  console.log("###########################################          111111111111111111111111     assigning")

  const labelIsPresent = await labelPresent(octokit, context, "assigned")
  if (labelIsPresent != "taken") {
    return
  }

  console.log("###########################################               assigning")

  const issueLabels = await getCurrentLabels(octokit, context, issueNumber)
      if (issueLabels.includes(labelIsPresent)) {
        console.log("The 'assigned' label is present on the issue.");
      } else {
        issueArray.push(labelIsPresent)
        await labelIssue(octokit, context, issueNumber, issueArray)
      }
}