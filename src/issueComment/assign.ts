import * as github from '@actions/github'
import * as core from '@actions/core'

import {Context} from '@actions/github/lib/context'

import {getCommandArgs} from '../utills/command'
import {getContentsFromMaintainersFile, checkCommenterAuth, getRoleOfUser} from '../utills/auth'

/**
 * /assign will self assign with no argument
 * or assign the users in the argument list
 *
 * @param context - the github actions event context
 */
export const assign = async (
  context: Context = github.context
): Promise<void> => {
  const toReturn: boolean[] = []
  let commentApgs: string[] = []
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

  try{ 
    roleContents = await getContentsFromMaintainersFile(octokit, context, 'maintainers.yaml')
    console.log(roleContents, "12")
}catch (e) {
  throw new Error(`could not get authorized user: ${e}`)
}

  try{ 
        rulesForRole = await getContentsFromMaintainersFile(octokit, context, '.github/config.yaml')
        console.log(roleContents, "1")
    }catch (e) {
      throw new Error(`could not get authorized user: ${e}`)
    }

  try{
    const issueps = await octokit.pulls.list({
      owner: "prakrit55",
      repo: "githubactions",
      state: "open",
    })
    console.log(issueps, "prs")
    console.log(issueps.data.filter.length)
    console.log(issueps.data.length)
  } catch (e){
    throw new Error("no prs")
  }

  const issues = await octokit.issues.listForRepo ({
    owner: "prakrit55",
    repo: "githubactions",
    assignee: "prakrit55",
  })

  console.log(issues.data.length)

  try {
  await Promise.all(
    commentArgs.map(async arg => {
      console.log(arg, "arg")
      let userPullRequestCount = 0
      const roleContent: any = getRoleOfUser(arg, roleContents, rulesForRole)
      console.log(roleContent, "2")

      const issueps = await octokit.pulls.list({
        owner: "prakrit55",
        repo: "githubactions",
        state: "open",
      })
      if (issueps.data.length == 0) {
        userPullRequestCount= 0
        console.log(issueps.data.filter.length)
      } else {
        userPullRequestCount = issueps.data.filter(pr => pr.user.login == arg).length
      }

      const issues = await octokit.issues.listForRepo ({
        owner: "prakrit55",
        repo: "githubactions",
        assignee: arg,
      })

      console.log(issues.data.length)
        if (roleContent['max-assigned-issues'] == issues.data.length || roleContent['max-opened-prs'] == userPullRequestCount) {
          toReturn.push(true)
        } else {
          toReturn.push(false)
        }
    })
  )
  } catch (error) {
    throw new Error(`could not assign: ${error}`)
    }
      
let i = 0
for (const comm of toReturn) {
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
            console.log('Assignees added:', namme.data);
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