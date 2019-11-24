const { red, green } = require("chalk")
console.clear()

const logSuccess = (msg, indent = 0) => {
  process.stdout.write(green("  ".repeat(indent) + msg) + "\n")
}

const logFailure = (msg, indent = 0) => {
  process.stdout.write(red("  ".repeat(indent) + msg) + "\n")
}

function describe(label, testsFn) {
  let registeredTests = []
  let completedTests = []
  let id = 1
  function addTest(test) {
    registeredTests.push({ ...test, id: id++ })
  }
  try {
    testsFn(addTest)
    console.log(label)
    registeredTests.forEach(test => {
      try {
        test.testFn()
        completedTests.push({ ...test, passing: true })
        logSuccess(`✅ ${test.id}.) ${test.label}`, 1)
      } catch (err) {
        completedTests.push({ ...test, passing: false, err })
        logFailure(`🔴 ${test.id}.) ${test.label}`, 1)
      }
    })

    const passingTests = completedTests.filter(test => test.passing)
    const failingTests = completedTests.filter(test => !test.passing)

    console.log('')
    if (passingTests.length) {
      console.log(green(`${passingTests.length} passing`))
    }
    if (failingTests.length) {
      console.log(red(`${failingTests.length} failing`))
    }

    failingTests
      .forEach(failingTest => {
        console.log("")
        console.log(red(`🔴 ${failingTest.id}.) ${failingTest.label}`))
        console.log(red(failingTest.err.stack))
      })
  } catch (err) {
    console.error("the tests broke", err)
  }
}

function it(label, testFn) {
  const addTest = arguments.callee.caller.arguments[0]
  addTest({
    label,
    finished: false,
    passing: null,
    testFn
  })
}

// It blocks should be able to run on their own, but this one doesn't.
// This is because Mocha uses global context to register tests, rather than
// the containing function scope.
// it("passing test", function() {})

describe("Some Tests Go Here", function() {
  it("passing test", function() {})
  it("failing test", function() {
    throw new Error("Something went wrong")
  })
  describe("Some Other Tests Go Here", function() {
    it("failing test", function() {
      throw new Error("Something went wrong")
    })
  })
  it("another passing test", function() {})
})
