import * as github from '@actions/github'
import * as core from '@actions/core'

import {Context} from '@actions/github/lib/context'

import {getCommandArgs} from '../utills/command'
import {checkCommenterAuth, getRoleOfUser, getConfirm} from '../utills/auth'
import { getCurrentLabels } from '../utills/labelling'
import { assigned } from '../labels/assignd'

/**
 * /assign will self assign with no argument
 * or assign the users in the argument list
 *
 * @param context - the github actions event context
 */
export const assign = async (
  context: Context = github.context
): Promise<void> => {
  let commentApgs: string[] = [], booleanArr: boolean[] = []

  core.debug(`starting assign job`)

  const token = core.getInput('github-token', {required: true})
  const octokit = new github.GitHub(token)

  const issueNumber: number | undefined = context.payload.issue?.number
  const commenterId: string = context.payload['comment']['user']['login']
  const commentBody: string = context.payload['comment']['body']


  if (issueNumber === undefined) {
    throw new Error(
      `github context payload missing issue number: ${context.payload}`
    )
  }

  let commentArgs: string[] = getCommandArgs('/assign', commentBody, commenterId)
  console.log(commentArgs, "1")


  try {
  await Promise.all(
    commentArgs.map(async arg => {
      console.log(arg, "arg")
      if (arg == 'me') {

      const roleContent: any = await getRoleOfUser(commenterId, octokit, context)
      booleanArr = await getConfirm(octokit, commenterId, roleContent)
      commentArgs = commentArgs.filter(word => word !== "me");
      commentArgs.push(commenterId)
      } else { 

      const roleContent: any = await getRoleOfUser(arg, octokit, context)
      console.log(roleContent, "2")

      booleanArr = await getConfirm(octokit, arg, roleContent)
      console.log(booleanArr, "################################Promise")
      }
    })
  )
  } catch (error) {
    throw new Error(`could not assign: ${error}`)
    }
      
let i = 0
for (const comm of booleanArr) {
  if (comm == false) {
    console.log(commentArgs)
    commentApgs.push(commentArgs[i])
  } 
  i++
}
  try {
    await assigned(context)
  } catch (error) {
    console.log(error)
  }

  switch (commentApgs.length) {
    case 0:
      throw new Error(
        `no users found. Only users who are members of the org, are collaborators, or have previously commented on this issue may be assigned`
      )

    default:
      try {
            await octokit.issues.addAssignees({
              ...context.repo,
              issue_number: issueNumber,
              assignees: commentApgs
            })
      } catch (e) {
        console.error('Error adding assignees:', e);
        throw new Error(`could not add assignees: ${e}`)
      }
      break
  }
}

/**
 * selfAssign will assign the issue / pr to the user who commented
 *
 * @param octokit - a hydrated github client
 * @param context - the github actions event context
 * @param issueNum - the issue or pr number this runtime is associated with
 * @param user - the user to self assign
 */
const selfAssign = async (
  octokit: github.GitHub,
  context: Context,
  issueNum: number,
  user: string
): Promise<void> => {
  const isAuthorized = await checkCommenterAuth(
    octokit,
    context,
    issueNum,
    user
  )

  if (isAuthorized) {
    await octokit.issues.addAssignees({
      ...context.repo,
      issue_number: issueNum,
      assignees: [user]
    })
  }
}