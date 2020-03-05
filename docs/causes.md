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

#### Incorrect joins
#### Delayed log arrival

## Experiment Analysis

Experiment Analysis SRMs are the result of problems which occur while analyzing the cooked data of the experiment.

### Telemetry Filtering

#### Incorrect starting point of analysis
#### Missing counterfactual logging
#### Wrong triggering or filter condition

## Experiment Interference

Experiment Interference SRMs are a special category. These SRMs are the result of problems which occur as a result of outside interence with the experiment, not (directly) as a result of problems with the experimentation platform itself. In some cases, it might be possible to implement platform restrictions in order to avoid such interference. There are two subcategories: Variant Interference and Telemetry Interference.

### Variant Interference

#### Inconsistent ramping of variants
#### Pausing variants during execution

Some experimentation platforms allow experimenters to "pauze" variants during experiment execution. Depending on how such a feature is implemented, it may result in fewer users than expected being considered in the paused variant, triggering an SRM.

Since the attrition is selective (i.e. attrition only occurs while the variant is pauzed, and does not randomly affect all users) it will likely cause bias in the results.

#### Self-assinging into a variant

Some experimentation platforms include mechanisms to enable users to self-assign to a particular variant. Such a feature allows experimenters to test specific variants of an experiment in the production system. Unfortunately, this may also allow users being experimented on to self-assign to a particular variant. 

For example, a particular variant of an experiment may provide users with desirable benefits (such as a discounted product). A tech-savvy user may realise this benefit can be obtained by self-assigning to the variant and share a link that allows other users to do so on a (public) forum. This may result in large groups of users self-assigning themselves into particularly attractive variations, triggering an SRM.

Since the self-assignment is selective (i.e. only users of the forum will self-assign, and this does not randomly affect all users) it will likely cause bias in the results.

### Telemetry Interference

#### Ad blockers

In some cases, ad blockers installed by users may interfere with the ability of the experimentation platform to collect telemetry about these users. If the platform relies on client-side tracking to trigger users into experiments, such interference may result in users not being tracked at all. If a particular variant affects the incidence of this kind of attrition, an SRM may be the result.

Since the attrition is selective (i.e. data loss only occurs for users who have ad blockers installed, and does not randomly affect all users) it will likely cause bias in the results.

(A similar problem might affect not the entire experiment but specific metrics collected using client-side telemetry, causing a metric-level Sample Ratio Mismatch.)

#### Injection attacks and hacks


---

Missing a root cause?
{: .fs-6 .fw-300 }

That's totally possible! This taxonomy is likely incomplete. We would love to hear your suggestions and add your examples to this list.

[Tell us on GitHub](https://github.com/lukasvermeer/srm/issues){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }[Send Lukas an email](https://lukasvermeer.nl/#contact){: .btn .fs-5 .mb-4 .mb-md-0 }

[srmpaper]: https://dl.acm.org/citation.cfm?id=3330722 "Diagnosing Sample Ratio Mismatch in Online Controlled Experiments: A Taxonomy and Rules of Thumb for Practitioners"
[dirtydozen]: https://dl.acm.org/doi/10.1145/3097983.3098024 "A Dirty Dozen: Twelve Common Metric Interpretation Pitfalls in Online Controlled Experiments"
[attritionbias]: https://en.wikipedia.org/wiki/Selection_bias#Attrition "Wikipedia: Selection Bias: Attition"
[benefitspaper]: https://ieeexplore.ieee.org/abstract/document/8051322 "The Benefits of Controlled Experimentation at Scale"
