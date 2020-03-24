// eslint-disable-next-line
const { existsSync, readFileSync, writeFileSync } = require('fs')
// eslint-disable-next-line
const { join } = require('path')

const moduleList = ['@gregfrench/react-native-wheel-picker']

const rootDir = join(__dirname, '..')
const nodeModulesPath = join(rootDir, 'node_modules')
const propertyName = [
  'compileSdkVersion',
  'buildToolsVersion',
  'minSdkVersion',
  'targetSdkVersion',
]
const reg = new RegExp(`(${propertyName.join('|')}) (.*)`, 'g')
const defText = `def safeExtGet(prop, fallback) {
  rootProject.ext.has(prop) ? rootProject.ext.get(prop) : fallback
}
`

function replace(list) {
  list.forEach(name => {
    const filePath = join(nodeModulesPath, name, 'android', 'build.gradle')
    if (existsSync(filePath)) {
      const data = readFileSync(filePath, 'utf-8')
      let value = data.replace(
        reg,
        (_o, c1, c2) => `${c1} safeExtGet("${c1}", ${c2})`
      )
      if (!value.startsWith(defText)) {
        value = `${defText}\n${value}`
      }
      writeFileSync(filePath, value)
    }
  })
}

replace(moduleList)
