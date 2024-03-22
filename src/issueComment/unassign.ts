import * as github from '@actions/github'
import * as core from '@actions/core'

import {Context} from '@actions/github/lib/context'

import {getCommandArgs} from '../utills/command'
import {checkCommenterAuth, getRoleOfUser} from '../utills/auth'

export const unassign = async (
    context: Context = github.context
  ): Promise<void> => {
    let isAuthUser: Boolean = false
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
  
    const commentArgs: string[] = getCommandArgs('/unassign', commentBody, commenterId)
    const roleContents: any = getRoleOfUser(commenterId, octokit, context)
    
    if (roleContents['unassign-others'] == true) {
      isAuthUser = true
    }
  
    if (isAuthUser) {
      try {
        await octokit.issues.removeAssignees({
          ...context.repo,
          issue_number: issueNumber,
          assignees: commentArgs
        })
      } catch (e) {
        throw new Error(`could not remove assignee: ${e}`)
      }
    }
  }