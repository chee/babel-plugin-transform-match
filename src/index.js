import syntax from 'babel-plugin-syntax-match'
import createTemplate from 'babel-template'
import {types} from 'babel-core'

export default function () {
  return {
    inherits: syntax,
    visitor: {
      BinaryExpression (path, state) {
        const isNeggoMatch = path.isBinaryExpression({operator: '!~'})
        const isMatch = path.isBinaryExpression({operator: '~ '})
        const {left, right} = path.node
        const matcher = types.memberExpression(types.identifier('Symbol'), types.identifier('match'))
        const createMatch = createTemplate('(OBJECT)[PROPERTY](RVALUE) || []')
        const createNeggoMatch = createTemplate('!(OBJECT)[PROPERTY](RVALUE)')

        const options = {
          OBJECT: right,
          PROPERTY: matcher,
          RVALUE: left
        }

        if (isNeggoMatch) {
          path.replaceWith(
            createNeggoMatch(options)
          )
        }

        if (isMatch) {
          path.replaceWith(
            createMatch(options)
          )
        }
      }
    }
  }
}
