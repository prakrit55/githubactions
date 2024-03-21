import * as github from '@actions/github'

import {Context} from '@actions/github/lib/context'
import * as core from '@actions/core'

import * as yaml from 'js-yaml'



async function run(): Promise<void> {
    try {
        switch (github.context.eventName) {
            case 'issue_comment':
                handleCommentReq()
                break
            default:
                core.error(`${github.context.eventName} not yet supported`)
            break
                }
        } 
        catch (error) {
        // core.setFailed(error)
    }
}
 run()