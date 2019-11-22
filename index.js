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
        // console.log(green(`✅ ${test.id}.) ${test.label}`))
        logSuccess(`✅ ${test.id}.) ${test.label}`, 1)
      } catch (err) {
        completedTests.push({ ...test, passing: false, err })
        logFailure(`🔴 ${test.id}.) ${test.label}`, 1)
      }
    })

    completedTests
      .filter(test => !test.passing)
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

describe("Some Tests Go Here", function() {
  it("passing test", function() {})
  it("failing test", function() {
    throw new Error("Something went wrong")
  })
  it("another passing test", function() {})
})
