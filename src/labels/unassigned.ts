import * as github from '@actions/github'

import {Context} from '@actions/github/lib/context'
import * as core from '@actions/core'

// import {getCommandArgs} from '../utils/command'
import {removeLabel} from  "../utills/labelling"

/**
 * /kind will add a kind/some-kind label
 *
 * @param context - the github actions event context
 */
export const unassigned = async (
  context: Context = github.context
): Promise<void> => {
  const token = core.getInput('github-token', {required: true})
  const octokit = new github.GitHub(token)
  let numberOfAssignees: any = 0

  const issueNumber: number | undefined = context.payload.issue?.number

  if (issueNumber === undefined) {
    throw new Error(
      `github context payload missing issue number: ${context.payload}`
    )
  }

  console.log("###########################################          111111111111111111111111     assigning")

  try { 
  const response = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/assignees', {
    owner: 'prakrit55', // Replace with your GitHub username
    repo: 'githubactions',
    issue_number: issueNumber
  });
  numberOfAssignees = response.data.length;
  console.log('Number of Assignees:', numberOfAssignees);
} catch (error) {
  console.error('Error:', error);
}

//   const labelIsPresent = await labelPresent(octokit, context, 'assigned')

//   console.log(labelIsPresent)
//   if (labelIsPresent != "taken") {
//     return
//   }

  console.log("###########################################               assigning")

//   const issueLabels = await getCurrentLabels(octokit, context, issueNumber)
//       if (issueLabels.includes("taken")) {
//         console.log("The 'assigned' label is present on the issue.");
//       } else {
//         issueArray.push("taken")
//         await labelIssue(octokit, context, issueNumber, issueArray)
//       }

    if (numberOfAssignees == 0) {
        await removeLabel(octokit, context, issueNumber, 'taken')
    }
}