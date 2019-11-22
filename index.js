const { red, green } = require("chalk")
console.clear()

function describe(label, testsFn) {
  let registeredTests = []
  function addTest(test) {
    registeredTests.push(test)
  }
  try {
    testsFn(addTest)
    registeredTests.forEach(test => {
      if (test.passing) {
        console.log(green(`✅ ${test.label}`))
      } else {
        console.log(red(`🔴 ${test.label}`))
      }
    })
  } catch (err) {
    console.error("the tests broke", err)
  }
}

function it(label, singleTestFn) {
  const addTest = arguments.callee.caller.arguments[0]
  try {
    singleTestFn()
    addTest({
      label,
      passing: true
    })
  } catch (err) {
    addTest({
      label,
      passing: false
    })
  }
}

describe("some tests go here", function() {
  it("passing test", function() {})
  it("failing test", function() {
    throw new Error("Something went wrong")
  })
  it("another passing test", function() {})
})
