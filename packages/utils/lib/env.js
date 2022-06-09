const { execSync } = require('child_process')
const semver = require('semver')

exports.hasYarn = () => {
  try {
    execSync('yarn --version', { stdio: 'ignore' })
    return (_hasYarn = true)
  } catch (e) {
    return (_hasYarn = false)
  }
}

function getPnpmVersion () {
  let _pnpmVersion;
  try {
    _pnpmVersion = execSync('pnpm --version', {
      stdio: ['pipe', 'pipe', 'ignore']
    }).toString()
    // there's a critical bug in pnpm 2
    // https://github.com/pnpm/pnpm/issues/1678#issuecomment-469981972
    // so we only support pnpm >= 3.0.0
    _hasPnpm = true
  } catch (e) {}
  return _pnpmVersion || '0.0.0'
}

exports.hasPnpmVersionOrLater = (version) => {
  if (process.env.VUE_CLI_TEST) {
    return true
  }
  return semver.gte(getPnpmVersion(), version)
}

exports.hasPnpm3OrLater = () => {
  return this.hasPnpmVersionOrLater('3.0.0')
}