import path from 'path'

export const ABSOLUTE_BASE = process.cwd()

const constants = Object.freeze({
  ABSOLUTE_BASE,
  NODE_MODULES_DIR: path.join(ABSOLUTE_BASE, 'node_modules'),
  BUILD_DIR: path.join(ABSOLUTE_BASE, 'build'),
})

export const NODE_MODULES_DIR = constants.NODE_MODULES_DIR
export const BUILD_DIR = constants.BUILD_DIR

export default constants
