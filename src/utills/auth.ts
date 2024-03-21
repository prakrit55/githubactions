import * as github from '@actions/github'
import * as core from '@actions/core'
import {RequestError} from '@octokit/request-error'
import {Context} from '@actions/github/lib/context'
import * as fs from 'fs';

import yaml from 'js-yaml'



const getContentsFromMaintainersFile = async (
  octokit: github.GitHub,
  context: Context,
  filepath: string
): Promise<string> => {
  let data: any = undefined
  try {
    const response = await octokit.repos.getContents({
      ...context.repo,
      path: filepath
    })

    data = response.data
    console.log(data)
  } catch (e) {
    if (e instanceof RequestError) {
      if (e.status === 404) {
        core.debug('No OWNERS file found')
        return ""
      }
    }

    throw new Error(
      `error checking for an OWNERS file at the root of the repository: ${e}`
    )
  }
  if (!data.content || !data.encoding) {
    throw new Error(`invalid OWNERS file returned from GitHub API: ${data}`)
  }

  const decoded = Buffer.from(data.content, data.encoding).toString()
  core.debug(`OWNERS file contents: ${decoded}`)
  console.log(decoded)
  return decoded
}

export const getRoleOfUser = async (
  octokit: github.GitHub,
  context: Context,
  arg: string,
): Promise<string> => {
  try{
        const roleContents = await getContentsFromMaintainersFile(octokit, context, "./.github/maintainers.yaml")
        console.log(roleContents, "1")
        const ifCommenterIsAdmin = await userPresentInMaintainers(roleContents, "admin", arg)
                console.log(ifCommenterIsAdmin, "2")
        const ifCommenterIsMaintainer = await userPresentInMaintainers(roleContents, "maintainer", arg)
          console.log(ifCommenterIsMaintainer, "3")
        const ifCommenterIsDeveloper = await userPresentInMaintainers(roleContents, "developer", arg)
          console.log(ifCommenterIsDeveloper, "4")
        const rulesForRole = await getContentsFromMaintainersFile(octokit, context, "./.github/config.yaml")

        switch (true) {
          case ifCommenterIsAdmin:
            const admin = await userReturnRole(rulesForRole, "admin")
            console.log(ifCommenterIsAdmin, "admin")
            return admin
          case ifCommenterIsMaintainer:
            const maintainer = await userReturnRole(rulesForRole, "maintainer")
            console.log(ifCommenterIsMaintainer, "mantainer")
            return maintainer
          case ifCommenterIsDeveloper:
            const developer = await userReturnRole(rulesForRole, "developer")
            console.log(ifCommenterIsDeveloper, "developer")
            return developer
          default:
            const fordefault = await userReturnRole(rulesForRole, "default")
            console.log("default")
            return fordefault
        }
  }catch (e) {
    throw new Error(`could not get authorized user: ${e}`)
  }
  return ""
}

const userReturnRole = async (
  maintanersFile: string,
  role: string,
): Promise<string> => {
  const ruleData = yaml.load(maintanersFile) as any
  const fit = ruleData[role]
  return fit
}

const userPresentInMaintainers = async (
  maintainersFile: string,
  role: string,
  username: string,
): Promise<boolean> => {

  core.debug(`checking if ${username} is in the ${role} in the OWNERS file`)
  const ownersData = yaml.load(maintainersFile) as any

  const roleMembers = ownersData[role]
  if ((roleMembers as string[]) !== undefined) {
    return roleMembers.indexOf(username) > -1
  }

  core.info(`${username} is not in the ${role} role in the OWNERS file`)
  return false
}





/**
 * checkOrgMember will check to see if the given user is a repo org member
 *
 * @param octokit - a hydrated github client
 * @param context - the github actions event context
 * @param user - the users to check auth on
 */
export const checkAdmin = async (
  octokit: github.GitHub,
  context: Context,
  user: string
): Promise<boolean> => {

  try {
    if (context.payload.repository === undefined) {
      core.debug(`checkAdmin error: context payload repository undefined`)
      return false
    }

    await octokit.orgs.checkMembership({
      org: context.payload.repository.owner.login,
      username: user
    })

    return true
  } catch (e) {
    return false
  }
}

/**
 * checkCollaborator checks to see if the given user is a repo collaborator
 *
 * @param octokit - a hydrated github client
 * @param context - the github actions event context
 * @param user - the users to check auth on
 */
export const checkCollaborator = async (
  octokit: github.GitHub,
  context: Context,
  user: string
): Promise<boolean> => {
  try {
    await octokit.repos.checkCollaborator({
      ...context.repo,
      username: user
    })

    return true
  } catch (e) {
    return false
  }
}

/**
 * checkIssueComments will check to see if the given user
 * has commented on the given issue
 *
 * @param octokit - a hydrated github client
 * @param context - the github actions event context
 * @param issueNum - the issue or pr number this runtime is associated with
 * @param user - the users to check auth on
 */
export const checkIssueComments = async (
  octokit: github.GitHub,
  context: Context,
  issueNum: number,
  user: string
): Promise<boolean> => {
  try {
    const comments = await octokit.issues.listComments({
      ...context.repo,
      issue_number: issueNum
    })

    for (const e of comments.data) {
      if (e.user.login === user) {
        return true
      }
    }

    return false
  } catch (e) {
    return false
  }
}

/**
 * getOrgCollabCommentUsers will return an array of users who are org members,
 * repo collaborators, or have commented previously
 *
 * @param octokit - a hydrated github client
 * @param context - the github actions event context
 * @param issueNum - the issue or pr number this runtime is associated with
 * @param args - the users to check auth on
 */
export const getOrgCollabCommentUsers = async (
  octokit: github.GitHub,
  context: Context,
  issueNum: number,
  args: string[]
): Promise<string[]> => {
  const toReturn: string[] = []

  try {
    await Promise.all(
      args.map(async arg => {
        const isOrgMember = await checkAdmin(octokit, context, arg)
        const isCollaborator = await checkCollaborator(octokit, context, arg)
        const hasCommented = await checkIssueComments(
          octokit,
          context,
          issueNum,
          arg
        )

        if (isOrgMember || isCollaborator || hasCommented) {
          toReturn.push(arg)
        }
      })
    )
  } catch (e) {
    throw new Error(`could not get authorized user: ${e}`)
  }

  return toReturn
}

/**
 * checkCommenterAuth will return true
 * if the user is a org member, a collaborator, or has commented previously
 *
 * @param octokit - a hydrated github client
 * @param context - the github actions event context
 * @param issueNum - the issue or pr number this runtime is associated with
 * @param args - the users to check auth on
 */
export const checkCommenterAuth = async (
  octokit: github.GitHub,
  context: Context,
  issueNum: number,
  user: string
): Promise<Boolean> => {
  let isOrgMember: Boolean = false
  let isCollaborator: Boolean = false
  let hasCommented: Boolean = false

  try {
    isOrgMember = await checkAdmin(octokit, context, user)
  } catch (e) {
    throw new Error(`error in checking org member: ${e}`)
  }

  try {
    isCollaborator = await checkCollaborator(octokit, context, user)
  } catch (e) {
    throw new Error(`could not check collaborator: ${e}`)
  }

  try {
    hasCommented = await checkIssueComments(octokit, context, issueNum, user)
  } catch (e) {
    throw new Error(`could not check issue comments: ${e}`)
  }

  if (isOrgMember || isCollaborator || hasCommented) {
    return true
  }

  return false
}

/**
 * When an OWNERS file is present, use it to authorize the action
   otherwise fall back to allowing organization members and collaborators
 * @param role is the role to check
 * @param username is the user to authorize
 */
export const assertAuthorizedByOwnersOrMembership = async (
  octokit: github.GitHub,
  context: Context,
  role: string,
  username: string
): Promise<void> => {
  core.debug('Checking if the user is authorized to interact with prow')
  const owners = await retrieveOwnersFile(octokit, context)

  if (owners !== '') {
    if (!isInOwnersFile(owners, role, username)) {
      throw new Error(
        `${username} is not included in the ${role} role in the OWNERS file`
      )
    }
  } else {
    const isOrgMember = await checkAdmin(octokit, context, username)
    const isCollaborator = await checkCollaborator(octokit, context, username)

    if (!isOrgMember && !isCollaborator) {
      throw new Error(`${username} is not a org member or collaborator`)
    }
  }
}

/**
 * Retrieve the contents of the OWNERS file at the root of the repository.
 * If the file does not exist, returns an empty string.
 */
async function retrieveOwnersFile(
  octokit: github.GitHub,
  context: Context
): Promise<string> {
  core.debug(`Looking for an OWNERS file at the root of the repository`)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = undefined
  try {
    const response = await octokit.repos.getContents({
      ...context.repo,
      path: '.github/maintainers.yaml'
    })

    data = response.data
    const makee = await octokit.issues.listForRepo({
      owner: "Keptn",
      repo: "repo",
      assignee: "prakrit55"
    })
  } catch (e) {
    if (e instanceof RequestError) {
      if (e.status === 404) {
        core.debug('No OWNERS file found')
        return ''
      }
    }

    throw new Error(
      `error checking for an OWNERS file at the root of the repository: ${e}`
    )
  }

  if (!data.content || !data.encoding) {
    throw new Error(`invalid OWNERS file returned from GitHub API: ${data}`)
  }

  const decoded = Buffer.from(data.content, data.encoding).toString()
  core.debug(`OWNERS file contents: ${decoded}`)
  return decoded
}

/**
 * Determine if the user has the specified role in the OWNERS file.
 * @param ownersContents - the contents of the OWNERS file
 * @param role - the role to check
 * @param username - the user to authorize
 */
function isInOwnersFile(
  ownersContents: string,
  role: string,
  username: string
): boolean {
  core.debug(`checking if ${username} is in the ${role} in the OWNERS file`)
  const ownersData = yaml.load(ownersContents) as any;

  const roleMembers = ownersData[role]
  if ((roleMembers as string[]) !== undefined) {
    return roleMembers.indexOf(username) > -1
  }

  let yamlString = `
  admin:
    name: John 
    age: 30
    city: New York`
;
let obj = yaml.load(yamlString) as any;

console.log(obj)

  core.info(`${username} is not in the ${role} role in the OWNERS file`)
  return false
}

const pic = [{"issue": 7,}, {"assign": true}, {"pin": 5} ]
const lo = {"issue": 7, "assign": true, "pin": 5 }
if (lo.assign == false) {

}