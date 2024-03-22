import * as github from '@actions/github'
import * as core from '@actions/core'

import {Context} from '@actions/github/lib/context'

import {getCommandArgs} from '../utills/command'
import {getContentsFromMaintainersFile, checkCommenterAuth, getRoleOfUser, getConfirm} from '../utills/auth'

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

  let roleContents: string, rulesForRole: string = ""

  if (issueNumber === undefined) {
    throw new Error(
      `github context payload missing issue number: ${context.payload}`
    )
  }

  let commentArgs: string[] = getCommandArgs('/assign', commentBody, commenterId)
  console.log(commentArgs, "1")

//   try{ 
//     roleContents = await getContentsFromMaintainersFile(octokit, context, 'maintainers.yaml')
//     console.log(roleContents, "12")
// }catch (e) {
//   throw new Error(`could not get authorized user: ${e}`)
// }

//   try{ 
//         rulesForRole = await getContentsFromMaintainersFile(octokit, context, '.github/config.yaml')
//         console.log(roleContents, "1")
//     }catch (e) {
//       throw new Error(`could not get authorized user: ${e}`)
//     }

  try {
  await Promise.all(
    commentArgs.map(async arg => {
      console.log(arg, "arg")
      if (arg == 'me') {

      const roleContent: any = await getRoleOfUser(commenterId, octokit, context)
      console.log(roleContent, "2")
      booleanArr = await getConfirm(octokit, commenterId, roleContent)
      console.log(booleanArr, "################################Promise")
      } else { 

      const roleContent: any = getRoleOfUser(arg, octokit, context)
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

  switch (commentApgs.length) {
    case 0:
      throw new Error(
        `no users found. Only users who are members of the org, are collaborators, or have previously commented on this issue may be assigned`
      )

    default:
      try {
            let namme = await octokit.issues.addAssignees({
              ...context.repo,
              issue_number: issueNumber,
              assignees: commentApgs
            })
            console.log('Assignees added:', namme.data, namme);
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