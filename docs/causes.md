---
layout: default
title: Taxonomy Of Causes
nav_order: 3
---

# Taxonomy Of Causes
{: .no_toc }

Making diagnosing, fixing, and preventing Sample Ratio Mismatch easier by providing a taxonomy of known potential causes.
{: .fs-6 .fw-300 }

While a simple statistical check is used to detect Sample Ratio Mismatch, correctly identifying the root cause and preventing it from happening in the future is often extremely challenging and time consuming. This section is based on the KDD paper "Diagnosing Sample Ratio Mismatch in Online Controlled Experiments: A Taxonomy and Rules of Thumb for Practitioners" ([link][srmpaper]). The paper provides several examples of causes of Sample Ratio Mismatch, as well as a taxonmy of types based on the stage of the experiment where they appear.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Experiment Assignment

Assignment SRMs are the result of problems which occur during the assignment phase of the experiment in which users are bucketed into a particular variant. There are two subcategories: Variant Assignment and Variant Deployment.

### Variant Assignment

#### Incorrect bucketing

In "Diagnosing Sample Ratio Mismatch in Online Controlled Experiments: A Taxonomy and Rules of Thumb for Practitioners" ([link][srmpaper]), the authors describe how a bug in the experiment assignment service caused an SRM:

> The experiment  assignment  service used a hash function to randomize users into one thousand buckets, each bucket representing 0.1 percent of users. For each experiment, the experiment owners define how much user traffic they want to expose each variant in the experiment to, which translates into a specific number of buckets to assign to control and treatment. In this case, there was a bug  in the experiment assignment service where the control variant was assigned one less bucket than the required number of buckets. A 50/50 test would incorrectly be setup as a 49.9/50 split, which is not necessarily an obvious issue.

In this example, the SRM is mostly harmless. The unexpectedly uneven split would result in a slight loss of statistical power, and some confusion and bug hunting, but not much else. This type of SRM would also quickly become apparent when running A/A experiments.

#### Faulty randomization function
#### Corrupted user IDs
#### Carry over effects

### Variant Deployment

#### Non-orthogonal experiments
#### Interaction effects

## Experiment Execution

Execution SRMs are the result of problems which occur during the execution phase of the experiment. There are three subcategories: Variant Delivery, Variant Execution and Telemetry Generation.

### Variant Delivery

#### Variants started at different times

Online experiments rely on a form or [convenience sampling](https://en.wikipedia.org/wiki/Convenience_sampling): only users who visit the website while a variant is active will be included in the sample. Some platforms allow (or force, due to technical limitations) experimenters to start variants at different times. In such a scenario, variants started later will include fewer users than variants started earlier, potentially triggering an SRM.

Since the attrition is selective (i.e. attrition only occurs for users who visit the website before all variants are started, and does not randomly affect all users) it will likely cause bias in the results.

### Variant Execution

#### Delayed filter execution

### Telemetry Generation

#### Redirecting only some variants

In "Diagnosing Sample Ratio Mismatch in Online Controlled Experiments: A Taxonomy and Rules of Thumb for Practitioners" ([link][srmpaper]), the authors warn that:

> Experiments not redirecting all variants of a web page may have an SRM as some redirects may fail.

This happens when users are not included in the experiment unless the redirect is successful, for example because telemetry is only generated after the page loads.

#### Telemetry added or removed

In "Diagnosing Sample Ratio Mismatch in Online Controlled Experiments: A Taxonomy and Rules of Thumb for Practitioners" ([link][srmpaper]), the authors warn that:

> If new telemetry is added to the product, the likelihood of receiving at least one event back from one-time users increases, which typically results in observing more users in that variant.

In most systems, a limited amount of data loss is considered acceptable. If there is only one event for a particular user, loss of this one event would results in the user not being included in the experiment. If treatment causes more telemtry to be generated, then this attrition is far less likely to occur.

#### Variant changing performance

In "Diagnosing Sample Ratio Mismatch in Online Controlled Experiments: A Taxonomy and Rules of Thumb for Practitioners" ([link][srmpaper]), the authors warn that:

> If the treatment degrades performance of a product, an SRM can happen as users have more time to exit the product before the  logs are generated. In contrast, improved product performance can give telemetry generation component more time to generate and send logs, frequently resulting in observing more users in the faster variant.

#### Variant changing engagement
#### Variant crashing the product

In "The Benefits of Controlled Experimentation at Scale" ([link][benefitspaper]), the authors describe how an increase in crashes caused a "user mismatch" (i.e. an SRM):

> By examining the experiment in detail, the team learned that instrumentation data was lost when the application crashed during the experiment on the older OS version. This caused unusual movements in metrics and the user mismatch. By investigating this experimental alert, the team discovered that a software bug in the new feature caused a crash in the code path related to the new feature.

#### Client caching behaviour

 When client telemetry is cached, it is uploaded to the server at a later point (e.g. when enough events are recorded for the cache to be declared as full). If experiment variants are logging the signals with approximately same velocity (e.g. the number of logged events within the same order of magnitude), the cache across variants will be filled and sent to the server in a similar time. If, however, one of experiment variants tests a new feature that introduces many new types of log events, the cache in that variant might be filling up quicker. As a result, the telemetry will be sent to the server more frequently and the likelihood of recording a user in the treatment variant will be larger compared to the control.

Consider the following hypothetical example. A car sales website introduces variant B with an overlay that appears over the homepage as users visit the site. The users can interact with the overlay by clicking a few buttons and answering a few questions. All of these interactions are logged, creating additional events in the logs that are not captured in the control experience that does not have this overlay. After the overlay for users in treatment is closed, users in both variants are exposed to the identical web site. The average batch size of logs, however, will be much larger for the users in the treatment group. As a result of the larger batch size, users in the treatment group will send their first batch of telemetry to the server earlier than the users in control. If very few events are recorded on the website overall, many users in the control group might not send their first batch. This will result in an SRM which will be surfaced most prominently on the beginning of the experiment and might dissipate over longer period. The number of users for the days where the SRM will be present will very likely be much greater for the treatment group that receives the new functionality that causes the increased telemetry.

#### Telemetry transmission

## Experiment Log Processing

Experiment Log Processing SRMs are the result of problems which occur while cooking the data of the experiment.

### Telemetry Cooking

Telemetry cooking refers to the process of transforming raw log data into (summary) statistics to be used for experiment analysis and reporting. Several potential causes for SRM have been identified in this area.

#### Removal of bots

In "A Dirty Dozen: Twelve Common Metric Interpretation Pitfalls in Online Controlled Experiments" ([link][dirtydozen]), the authors describe how a variant caused more users to be flagged as bots, causing an SRM:

> Infopane is the module showing a slide show of large images at the top of MSN.com homepage. There was an experiment to increase the number of slides in the infopane from 12 to 16. Contrary to the expectation that increasing the number of slides would improve user engagement, the experiment showed significant regression in engagement. The experiment also had an SRM, with fewer users than expected in the treatment.
>
> Investigation showed that the cause of the SRM and the puzzling drop in engagement was bot filtering logic. Number of distinct actions the user takes was one of the features used by the bot filtering algorithm, resulting in users with outlier values labeled as bots and excluded from experiment analysis. Increasing the number of slides improved engagement for some users so much that these real users started getting labeled as bots by the algorithm. After tuning the bot filtering algorithm, SRM disappeared and experiment results showed a big increase in user engagement.

In this example, the SRM is a symptom of a (post-treatment) [attrition bias](attritionbias), which severely undermines the reliability of the results. The authors recommend to ensure that attrition (e.g. bot filtering) affects all variants equally:

> As the example above shows, however, one needs to ensure that all variants in the experiment are impacted by the outlier filtering logic in the same way.

If the bot filtering logic only relies on pre-treatment variables to filter users from an experiment, we can safely assume that variant assignment cannot affect attrition rates.

#### Using the HyperLogLog++ cardinality estimation algorithm

In "The Effect of Using Cardinality Estimates Like HyperLogLog in Statistical Analyses" ([link][hyperloglog]), the author describes the effects of using the HyperLogLog++ (HLL++) cardinality estimation algorithm in applications where its output serves as input for statistical calculations. They show that frequent SRMs are the result, and conclude that:

> HyperLogLog data with precision typical of current default implementations is unsuitable for use in A/B testing and similar scenarios where an estimator is supposed to converge to the true value in the asymptotic case.

#### Incorrect joins
#### Delayed log arrival

## Experiment Analysis

Experiment Analysis SRMs are the result of problems which occur while analyzing the cooked data of the experiment.

### Telemetry Filtering

#### Incorrect starting point of analysis

A good hypothetical example demonstrating this type of SRM is with the Windows 10 Search Box. A typical user flow is to search in the Windows 10 Search Box and then be navigated to Bing on your browser. The Windows 10 Search Box is a driver of query share for Bing, so experiments could be run on this surface with a desire to primarily understand the impact to Bing.

Bing is known to run thousands of experiments a year, so they must have a standard analysis for their experiments utilizing the Bing pageview logs. However, **you can't use the same analysis for experiments on the Windows 10 Search Box**!

Consider this hypothetical example - say a UI change on the Windows 10 Search Box results in twice the rate in which users click through to Bing. If you run the standard Bing analysis on a 50/50 experiment, then you will have a sample ratio of 2:1, which is an SRM.

#### Missing counterfactual logging

#### Wrong triggering or filter condition

Some platforms assign all users that open the product / visit the website into experiment variants (type 1) whereas other platforms assign only the users that visit the part of the product where the new change is being tested (type 2). For the platforms of type 1, it will be common to analyze results of an experiment for all users as well as zoom in to the users that were impacted by the change (or would have been impacted if they are in control - counterfactual). Zooming-in to impacted parts of the user-base increases the sensitivity of the metrics, however, if the condition to zoom-in (aka triggering condition) is incorrect, users kept in the analysis will be unbalanced. 

Consider the following hypothetical example. A search engine is testing the impact of a complex, new search algorithm. The control search results load in ~30ms but the treatment search results take ~300ms to load. The experimenter decides to track assignment when the search results for each group have loaded. When the test is launched, not as many users in the treatment group waited for the new search results to load as they did in the control group. Since user assignment was only tracked after the search results loaded, the control group recorded more users than the treatment group.

## Experiment Interference

Experiment Interference SRMs are a special category. These SRMs are the result of problems which occur as a result of outside interence with the experiment, not (directly) as a result of problems with the experimentation platform itself. In some cases, it might be possible to implement platform restrictions in order to avoid such interference. There are two subcategories: Variant Interference and Telemetry Interference.

### Variant Interference

#### Inconsistent ramping of variants
#### Pausing variants during execution

Some experimentation platforms allow experimenters to "pause" variants during experiment execution. Depending on how such a feature is implemented, it may result in fewer users than expected being considered in the paused variant, triggering an SRM.

Since the attrition is selective (i.e. attrition only occurs while the variant is paused, and does not randomly affect all users) it will likely cause bias in the results.

#### Self-assigning into a variant

Some experimentation platforms include mechanisms to enable users to self-assign to a particular variant. Such a feature allows experimenters to test specific variants of an experiment in the production system. Unfortunately, this may also allow users being experimented on to self-assign to a particular variant. 

For example, a particular variant of an experiment may provide users with desirable benefits (such as a discounted product). A tech-savvy user may realise this benefit can be obtained by self-assigning to the variant and share a link that allows other users to do so on a (public) forum. This may result in large groups of users self-assigning themselves into particularly attractive variations, triggering an SRM.

Since the self-assignment is selective (i.e. only users of the forum will self-assign, and this does not randomly affect all users) it will likely cause bias in the results.

### Telemetry Interference

#### Ad blockers

In some cases, ad blockers installed by users may interfere with the ability of the experimentation platform to collect telemetry about these users. If the platform relies on client-side tracking to trigger users into experiments, such interference may result in users not being tracked at all. If a particular variant affects the incidence of this kind of attrition, an SRM may be the result.

Since the attrition is selective (i.e. data loss only occurs for users who have ad blockers installed, and does not randomly affect all users) it will likely cause bias in the results.

(A similar problem might affect not the entire experiment but specific metrics collected using client-side telemetry, causing a metric-level Sample Ratio Mismatch.)

#### Injection attacks and hacks

In an ideal world, client-side telemetry (e.g. events captured in a browser) would be uploaded to the server instantly as the event happened. However, in practice such real-time telemetry transmission often isn't feasible as it would require numerous calls to the server, potentially slowing down the product and harming user experience. Often, logs are  "packaged" in a batch on the client and sent to the service as defined in the product policy (e.g. when the number of logs exceeds some size threshold, every 30 seconds, or some other configuration). Code, however, isn't necessary the only source of new events in the batch.

The batch on the client can sometimes be accessed by power users (e.g. by inspecting the local storage in the browser and finding the array holding the logs) and altered in a way that would cause an SRM at the time of the analysis. For example, if the power user creates hundreds of new user IDs and injects them in the batch without alternating the assigned variant, the experimentation platform likely won't know that those users aren't real and will declare an SRM. The best way to avoid such SRMs is to protect client-side telemetry from being altered in an easy way, and to have alerts in place that fire in case telemetry from a single client contains an abnormal number of user identifiers.

---

Missing a root cause?
{: .fs-6 .fw-300 }

That's totally possible! This taxonomy is likely incomplete. We would love to hear your suggestions and add your examples to this list.

[Tell us on GitHub](https://github.com/lukasvermeer/srm/issues){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }[Send Lukas an email](https://lukasvermeer.nl/#contact){: .btn .fs-5 .mb-4 .mb-md-0 }

[srmpaper]: https://dl.acm.org/citation.cfm?id=3330722 "Diagnosing Sample Ratio Mismatch in Online Controlled Experiments: A Taxonomy and Rules of Thumb for Practitioners"
[dirtydozen]: https://dl.acm.org/doi/10.1145/3097983.3098024 "A Dirty Dozen: Twelve Common Metric Interpretation Pitfalls in Online Controlled Experiments"
[attritionbias]: https://en.wikipedia.org/wiki/Selection_bias#Attrition "Wikipedia: Selection Bias: Attition"
[benefitspaper]: https://ieeexplore.ieee.org/abstract/document/8051322 "The Benefits of Controlled Experimentation at Scale"
[hyperloglog]: https://blog.analytics-toolkit.com/2020/the-effect-of-using-cardinality-estimates-like-hyperloglog-in-statistical-analyses/
