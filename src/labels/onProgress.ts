import * as github from '@actions/github'

import {Context} from '@actions/github/lib/context'
import * as core from '@actions/core'
import {getCurrentLabels, getIssueNummber, labelPresent, labelIssue} from '../utills/labelling'

/**
 * Removes the 'lgtm' label after a pull request event
 *
 * @param context - The github actions event context
 */
export const onPrOnReview = async (context: Context = github.context): Promise<void> => {
  const token = core.getInput('github-token', {required: true})
  const octokit = new github.GitHub(token)

  const prNumber: number | undefined = context.payload.pull_request?.number
  const prTitle: string | undefined = context.payload.pull_request?.title;
  const prBody: string | undefined = context.payload.pull_request?.body;

  console.log(prBody, "###################################################### pr body and title", prTitle)

  const prLabelArray: string[] = []


  if (prNumber === undefined) {
    throw new Error(
      `github context payload missing pr number: ${context.payload}`
    )
  }
  const issueNumber = getIssueNummber(prBody, prTitle)
  console.log(issueNumber, "#####################################################   issuenumber")

  let currentLabels: string[] = []
  try {
    currentLabels = await getCurrentLabels(octokit, context, issueNumber)
    core.debug(`remove-lgtm: found labels for issue ${currentLabels}`)
  } catch (e) {
    throw new Error(`could not get labels from issue: ${e}`)
  }

  if (currentLabels.includes('review')) {
    return
  }

  const labelIsPresent = await labelPresent(octokit, context, 'in-review')

  console.log(labelIsPresent, "#########################################               onPrLabel")
  if (labelIsPresent != "review") {
    return
  } else {
    prLabelArray.push("review")
    await labelIssue(octokit, context, issueNumber, prLabelArray)
  }
}