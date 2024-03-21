import * as github  from '@actions/github'

import * as core from '@actions/core'
import {Context} from '@actions/github/lib/context'


export const handleCommentReq = async (context: Context =  github.context): Promise<void> => {
    const commandConfig = core
    .getInput('prow-commands', {required: false})
    .replace(/\n/g, ' ')
    .split(' ')
}