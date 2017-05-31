import React from 'react'
import {head, tail, isNil, isEmpty, isBoolean, isString, isNumber, isArray, isPlainObject} from 'lodash'


export const isEmptyNode = (node) => {
  return isNil(node) || isBoolean(node)
}

export const isStringNode = (node) => {
  return isString(node)
}

export const isNumberNode = (node) => {
  return isNumber(node)
}

export const isTextNode = (node) => {
  return isStringNode(node) || isNumberNode(node)
}

export const isFragment = (node) => {
  return isArray(node)
}

export const isElement = (node) => {
  return isPlainObject(node)
}

export const isDOMElement = (node) => {
  return isElement(node) && isString(node.type)
}

export const isComponentElement = (node) => {
  return isElement(node) && !isString(node.type)
}

export const traverse = (node, visitor, ...args) => {
  const traverseIn = (node, path, ...args) => {
    if (isFragment(node)) {
      return node.map((item) => visitor(item, [...path, item], traverseIn, ...args))
    }
    if (isElement(node)) {
      const children = React.Children.map(node.props.children, (child) => {
        return visitor(child, [...path, child], traverseIn, ...args)
      })
      return React.cloneElement(node, {}, children)
    }
    return node
  }
  return visitor(node, [node], traverseIn, ...args)
}

export const findElements = (node, pattern, visitor) => {
  const findVisitor = (node, path, traverseIn, pattern) => {
    const remainingPattern = isElement(node) && node.type === head(pattern) ? tail(pattern) : pattern
    if (isEmpty(remainingPattern)) {
      return visitor(node, path, traverseIn)
    }
    return traverseIn(node, path, remainingPattern)
  }
  return traverse(node, findVisitor, pattern)
}

export const appendChild = (node, child) => {
  const children = React.Children.toArray(node.props.children)
  return React.cloneElement(node, {}, [...children, child])
}
