---
layout: default
title: Home
nav_order: 1
description: "This Chrome Extension automatically flags potential data quality issues on supported experimentation platforms."
permalink: /
---

# One neat trick to run better experiments
{: .fs-9 }

This Chrome Extension automatically flagged potential data quality issues on supported experimentation platforms.
{: .fs-6 .fw-300 }

{: .warning }
The SRM Checker Chrome extension **is no longer maintained and has been retired.**

Over the years, the extension has helped hundreds of experimenters detect Sample Ratio Mismatches (SRMs) and improve the quality of their A/B testing data. However, a few things have changed:

- Google introduced changes to how Chrome extensions work, breaking the current implementation
- I no longer have the time to maintain or update the extension
- Most major experimentation platforms now include built-in SRM checks, making the extension less necessary

Because of this, I’ve decided to retire the extension.

Thank you to everyone who used, supported, and contributed to the SRM Checker over the years!

{: .highlight }
The website and related documentation will remain available for reference, but the extension itself will no longer be updated, supported, or guaranteed to work.

[Manually check for SRM](https://lukasvermeer.nl/srm/microsite/){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 }

---

## What is Sample Ratio Mismatch? Why should we care?!

A Sample Ratio Mismatch (SRM) test can be used to detect a wide variety of data quality issues [(paper)](https://dl.acm.org/citation.cfm?id=3330722) [(presentation)](https://conversionhotel.com/session/keynote-2019-run-better-experiments-srm-checks/) that may affect online experiments (aka A/B tests). Only expected proportions and observed sample counts are required as input for this procedure, so this test can be used even in cases where experimenters only have access to summary statistics; such as when using third-party tools.

For more information about Sample Ratio Mismatch please read the [Frequently Asked Questions]({{ site.baseurl }}{% link docs/faq.md %}).

---

## About the project

Sample Ratio Mismatch Checker was created by [Lukas Vermeer](http://lukasvermeer.nl), [Heinrich Mahr](https://heinrich333.github.io) and [Georgi Georgiev](http://blog.analytics-toolkit.com).

![A screenshot of the Google Optimize interface showing the SRM Checker Extension flagging a potential SRM issue.]({{ site.baseurl }}{% link assets/images/screenshot_optimize_1.webp %})

### Platforms supported by this Chrome Extension

- Convert.com
- Omniconvert
- Optimizely
- SiteGainer/Symplify
- Visual Website Optimizer (VWO)
- Zoho PageSense

Several experimentation platforms natively perform Sample Ratio Mismatch checks for their users. These platforms will not be supported by our Chrome Extension, because that would be redundant. An incomplete overview of these platforms can be found [here]({{ site.baseurl }}{% link docs/reference/platforms/index.md %}).

### License

Sample Ratio Mismatch Checker is distributed by an [MIT license](https://github.com/lukasvermeer/srm/tree/master/LICENSE).

### Contributing

You want to contribute to this project? That's amazing! We'd love that! <3

Feel free to fork the repository on [GitHub](http://github.com/lukasvermeer/srm), make the changes you want to see, and issues a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests). If you are not sure what to work on, we maintain a list of outstanding issues on the GitHub [project](https://github.com/lukasvermeer/srm/issues). (If you don't want to code, adding to that list of issues is also a great way to contribute.)

Thank you for making this project more awesome.

![GitHub last commit](https://img.shields.io/github/last-commit/lukasvermeer/srm?label=Last%20Repo%20Commit)
