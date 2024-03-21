// import yaml from 'js-yaml'

// let yamlString = `
//   maintainers:
//     phan: Johns 
//     alpha: punit30s
//     sigma: prakrit55s`
// ;

// let obj = yaml.load(yamlString) as any;

// for (const key in obj) {
//   console.log(obj[key]["phan"]); // Access value using key
// }
// // console.log(obj[]["phan"]);

const tReturn: boolean[] = []

let commentArgs: string[] = []
let commentApgs: string[] = []
tReturn.push(true)
commentArgs.push("yes")
tReturn.push(false)
tReturn.push(true)
commentArgs.push("no")
commentArgs.push("yes")
// commentArgs = commentArgs.reverse()
console.log(commentArgs)

let i = 0
for (const comm of tReturn) {
  if (comm == false) {
    commentApgs.push(commentArgs[i])
  } 
  i++
}

console.log(tReturn, commentApgs)
// console.log(tReturn[0])
// tReturn.pop()

// console.log(tReturn)




// while (roleMembers[p] != "") {
//   console.log(roleMembers[p]['phan'])
// }
// if ((roleMembers as string[]) !== undefined) {
//     console.log(roleMembers.indexOf('prakrit55s') > -1)
//   }


// let body: any = "/assign me"
// let command: any = "/assign"
// const toReturn = []
//     const lineArray = body.split('\n')
//     let bodyArray = undefined
  
//     for (const iterator of lineArray) {
//       if (iterator.includes(command)) {
//         bodyArray = iterator.split(' ')
//       }
//     }
//     if (bodyArray === undefined) {
//       throw new Error(`command ${command} missing from body`)
//     }
  
//     let i = 0
//     while (bodyArray[i] !== command && i < bodyArray.length) {
//       i++
//     }
  
//     // advance the index to the next as we've found the command
//     i++
//     while (bodyArray[i] !== '\n' && i < bodyArray.length) {
//       toReturn.push(bodyArray[i])
//       i++
//     }

// if (toReturn.length == 0) {

// }

// console.log(bodyArray, toReturn)