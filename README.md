# testcafe-reporter-jest


<p align="center">
    
    
[![Release](https://github.com/thelazurite-cell/testcafe-reporter-jest/actions/workflows/publish.yml/badge.svg)](https://github.com/thelazurite-cell/testcafe-reporter-jest/actions/workflows/publish.yml)
    
    
</p>

    
> This is the fork of the [**xUnit**](https://github.com/DevExpress/testcafe-reporter-xunit) reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

This reporter plugin for TestCafe outputs a junit xml report that is compatible with continuous integration servers like Jenkins. The main difference between this plugin and the default xunit plugin is that in this plugin, the testcase name attribute will only contain the testcase name and any additional information such as screenshots and (unstable) flags are output to `<system-out/>` tag. This allows for better reporting and analysis or repeated test runs.

Additionally, the test report is wrapped in the `<testsuites>` tag, so that the report can be displayed in github acitions using [Dorny's Test Report Action](https://github.com/dorny/test-reporter)

<p align="center">
    <img src="https://raw.github.com/alexschwantes/testcafe-reporter-junit/master/media/preview.png" alt="preview" />
</p>

## Install

To install this reporter, you can use the following command:

```
npm install testcafe-reporter-jest
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter jest
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('jest') // <-
    .run();
```
