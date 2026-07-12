export const red     = (text:string) => `\x1b[31m${text}\x1b[0m`
export const green   = (text:string) => `\x1b[32m${text}\x1b[0m`
export const yellow  = (text:string) => `\x1b[33m${text}\x1b[0m`
export const blue    = (text:string) => `\x1b[34m${text}\x1b[0m`
export const magenta = (text:string) => `\x1b[35m${text}\x1b[0m`
export const cyan    = (text:string) => `\x1b[36m${text}\x1b[0m`
export const white   = (text:string) => `\x1b[37m${text}\x1b[0m`
export const bold    = (text:string) => `\x1b[1m${text}\x1b[0m`

export const check = bold(green("✓"))
export const warn = bold(yellow("!"))
export const error = bold(red("✗"))
