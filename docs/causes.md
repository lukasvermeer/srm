---
layout: default
title: Taxonomy Of Causes
nav_order: 3
---

# Taxonomy Of Causes
{: .no_toc }

Making diagnosing, fixing, and preventing Sample Ratio Mismatch easier by providing a taxonomy of known potential causes.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

While a simple statistical check is used to detect Sample Ratio Mismatch, correctly identifying the root cause and preventing it from happening in the future is often extremely challenging and time consuming. This section is based on the KDD paper "Diagnosing Sample Ratio Mismatch in Online Controlled Experiments: A Taxonomy and Rules of Thumb for Practitioners" ([link][srmpaper]). The paper provides several examples of causes of Sample Ratio Mismatch, as well as a taxonmy of types based on the stage of the experiment where they appear.

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
#### Telemetry added or removed
#### Variant changing performance
#### Variant changing engagement
#### Variant crashing the product
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
#### Self-assinging into a variant

### Telemetry Interference

#### Injection attacks and hacks

[srmpaper]: https://dl.acm.org/citation.cfm?id=3330722 "Diagnosing Sample Ratio Mismatch in Online Controlled Experiments: A Taxonomy and Rules of Thumb for Practitioners"
[dirtydozen]: https://dl.acm.org/doi/10.1145/3097983.3098024 "A Dirty Dozen: Twelve Common Metric Interpretation Pitfalls in Online Controlled Experiments"
[attritionbias]: https://en.wikipedia.org/wiki/Selection_bias#Attrition "Wikipedia: Selection Bias: Attition"
