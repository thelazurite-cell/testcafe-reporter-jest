module.exports = () => ({
    noColors:           true,
    report:             '',
    startTime:          null,
    uaList:             null,
    currentFixtureName: null,
    testCount:          0,
    skipped:            0,

    reportTaskStart (startTime, userAgents, testCount) {
        this.startTime = startTime;
        this.uaList    = userAgents.join(', ');
        this.testCount = testCount;
    },

    reportFixtureStart (name) {
        this.currentFixtureName = this.escapeHtml(name);
    },

    _renderErrors (testRunInfo) {
        this.report += this.indentString('<failure>\n', 6);
        this.report += this.indentString('<![CDATA[', 8);
        
        testRunInfo.errs.forEach((err, idx) => {
            err = this.formatError(err, `${idx + 1}) `);

            this.report += '\n';
            this.report += this.indentString(err, 10);
            this.report += '\n';
        });

        this.report += this.indentString(']]>\n', 8);
        this.report += this.indentString('</failure>\n', 6);
    },

    _renderSystemOut (testRunInfo) {
        this.report += this.indentString('<system-out>\n', 6);
        this.report += this.indentString('<![CDATA[', 8);

        if (testRunInfo.unstable)
            this.report += this.indentString('\n(unstable)\n', 10);

        if (testRunInfo.screenshotPath)
            this.report += this.indentString(`\n(screenshots: ${testRunInfo.screenshotPath})\n`, 10);

        this.report += this.indentString(']]>\n', 8);
        this.report += this.indentString('</system-out>\n', 6);
    },

    reportTestDone (name, testRunInfo) {
        var hasErr = !!testRunInfo.errs.length;
        
        var openTag = `<testcase classname="${this.currentFixtureName}" ` +
                        `name="${this.escapeHtml(name)}" time="${testRunInfo.durationMs / 1000}">\n`;

        this.report += this.indentString(openTag, 4);

        if (testRunInfo.skipped) {
            this.skipped++;
            this.report += this.indentString('<skipped/>\n', 6);
        }
        else if (hasErr)
            this._renderErrors(testRunInfo);

        if (testRunInfo.screenshotPath || testRunInfo.unstable)
            this._renderSystemOut(testRunInfo);

        this.report += this.indentString('</testcase>\n', 4);
    },

    _renderWarnings (warnings) {
        this.setIndent(4)
            .write('<system-out>')
            .newline()
            .setIndent(6)
            .write('<![CDATA[')
            .newline()
            .setIndent(8)
            .write(`Warnings (${warnings.length}):`)
            .newline();

        warnings.forEach(msg => {
            this.setIndent(8)
                .write('--')
                .newline()
                .setIndent(4)
                .write(this.indentString(msg, 6))
                .newline();
        });

        this.setIndent(6)
            .write(']]>')
            .setIndent(4)
            .newline()
            .write('</system-out>')
            .newline();
    },

    reportTaskDone (endTime, passed, warnings) {
        var title = 'TestCafe Tests';
        var testSuiteTitle     = `${this.escapeHtml(this.uaList)}`;
        var failures = this.testCount - passed;
        var time     = (endTime - this.startTime) / 1000;

        const testSuite = `<testsuite name="${testSuiteTitle}" tests="${this.testCount}" failures="${failures}" skipped="${this.skipped}"` +
                    ` errors="${failures}" time="${time}" timestamp="${endTime.toUTCString()}">`;

        this.write('<?xml version="1.0" encoding="UTF-8" ?>')
            .newline()
            .write(`<testsuites name="${title}">`)
            .newline()
            .write(this.indentString(testSuite, 2))
            .newline()
            .write(this.report);

        if (warnings.length)
            this._renderWarnings(warnings);

        this.setIndent(2)
            .write('</testsuite>');
        
        this.setIndent(0)
            .newline()
            .write('</testsuites>');
        
    }
});
