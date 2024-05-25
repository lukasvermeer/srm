---
layout: default
title: Privacy Policy
nav_order: 9
---

# Privacy Policy
{: .no_toc }

We collect anonymized statistics. This policy explains what data is collected and why. 
{: .fs-6 .fw-300 }

---

By using the SRM Checker Chrome Extension you agree to the following privacy policy and the data collection described within it. If you do not agree and want to withdraw your consent please uninstall the extension.

**THE FOLLOWING IS A STATEMENT OF INTENT. THE LATEST CHROME STORE RELEASE OF THE EXTENSION DOES NOT COLLECT ANY DATA AT ALL. (THIS LINE WILL BE REMOVED ONCE DATA COLLECTION IS IMPLEMENTED.)**

## Why do we collect anonymized statistics?

The SRM Checker Chrome Extension collects anonymized statistics for two reasons.

**1. To help us prioritize development efforts.**

We would like to understand which platforms users of the Chrome Extension are using, so that we can spend our time and effort on supporting those platforms better. For the same reason, we would also like to understand what sample sizes users are likely to encounter, how often results are being viewed, and how often an SRM is encountered. These statistics will be used by the development team to help us better support users of the Chrome Extension.

(We would also very much welcome qualitative feedback through [email](https://lukasvermeer.nl/#contact) or a support [ticket](https://github.com/lukasvermeer/srm/issues).)

**2. To help everyone better understand the prevalance of Sample Ratio Mismatch.**

Publically available information about the incidence of Sample Ratio Mismatch in experimentation platforms is [limited]({{ site.baseurl }}{% link docs/faq.md %}#how-common-is-sample-ratio-mismatch). By collecting and publishing summary statistics we hope to increase public awareness and understanding of Sample Ratio Mismatch. Specifically, we intend to publish the following aggregate statistics.

- The number of unique Extension users (reported by Chrome Store statistics)
- The number of unique experiments checked (collected by the Chrome Extension)
- The number of unique SRM issues encountered (collected by the Chrome Extension)

These results may also be reported over time and per experimentation platform for additional insights.

## What data is being collected?

In order to accomplish the two objectives outlined above, the SRM Checker Chrome Extension sends the following information to a central data repository.

- A unique, anonymized (see below) identifier for each experiment (to enable data deduplication)
- Experimentation platform name (e.g. "Convert.com", "VWO", etc.)
- Observed sample counts (to enable the development team to estimate average power)
- Expected proportions (to allow development team to run repeat SRM checks)
- SRM status reported (to track how often SRM was reported to users)

## How is my anonymity ensured and my privacy protected?

We have no intention or need to collect any information which can be used to identify users of the Chrome Extension. However, we do need a method to ensure we can deduplicate data and count unique experiments as well as SRM incidence.

For this purpose, we apply a hashing technique (i.e. MD5) to a combination of two identifiers (i.e. the user id and the experiment id). The extension collects only the output of this hashing function. This approach makes it impossible to determine either of the original identifiers from the data collected.

(As a result, our analysis will double count any experiments viewed by two or more Extension users, as there is no way to know from the data collected that they are related to the same experimemt.)

---

Have questions or concerns about this policy?
{: .fs-6 .fw-300 }

[Ask us on GitHub](https://github.com/lukasvermeer/srm/issues){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }[Send Lukas an email](https://lukasvermeer.nl/#contact){: .btn .fs-5 .mb-4 .mb-md-0 }
