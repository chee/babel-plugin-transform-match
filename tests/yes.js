const path = require('path')
const vm = require('vm')

const {transform} = require('babel-core')
const test = require('tape')

const babelOptions = {
  plugins: [path.join(__dirname, '../lib')]
}

function runBabelInThisContext (code) {
  return vm.runInThisContext(transform(code, babelOptions).code)
}

test('it should not die on good code', t => {
  t.plan(2)

  t.doesNotThrow(() => transform(`
      ((noon) => {
        return noon ~ /lol/;
      });
    `, babelOptions)
  )

  t.doesNotThrow(() => transform(`
      (monkey => {
        return monkey !~ /wh/;
      });
    `, babelOptions)
  )
})

test('it should transform correctly', t => {
  t.plan(2)

  const name = runBabelInThisContext(`
    (() => {
      const string = "hello, jake";
      const regex = /hello, (\\w+)/;

      return string ~ regex;
    });
  `)()

  t.equals(name[1], 'jake')

  const doesntmatch = runBabelInThisContext(`
    (() => {
      const string = "something";
      const regex = /wild/;

      return string !~ regex;
    });
  `)()

  t.equal(doesntmatch, true)
})
