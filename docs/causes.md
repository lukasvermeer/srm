---
layout: default
title: Taxonomy Of Causes
nav_order: 3
---

# Taxonomy Of Causes
{: .no_toc }

The goal of this section is to make diagnosing, fixing, and preventing Sample Ratio Mismatch easier by providing a taxonomy of known potential causes.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

While a simple statistical check is used to detect Sample Ratio Mismatch, correctly identifying the root cause and preventing it from happening in the future is often extremely challenging and time consuming. This section is based on the KDD paper "Diagnosing Sample Ratio Mismatch in Online Controlled Experiments: A Taxonomy and Rules of Thumb for Practitioners" ([link](https://dl.acm.org/citation.cfm?id=3330722)). The paper provides several examples of causes of Sample Ratio Mismatch, as well as a taxonmy of types based on the stage of the experiment where they appear.

## Experiment Assignment

Assignment SRMs are the result of problems which occur during the assignment phase of the experiment. There are two subcategories: Variant Assignment and Variant Deployment.

### Variant Assignment

#### Incorrect bucketing
#### Faulty randomization function
#### Corrupted user IDs
#### Carry over effects

### Variant Deployment

#### Non-orthogonal experiments
#### Interaction effects

## Experiment Execution

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

### Telemetry Cooking

#### Removal of bots
#### Incorrect joins
#### Delayed log arrival

## Experiment Analysis

### Telemetry Filtering

#### Incorrect starting point of analysis
#### Missing counterfactual logging
#### Wrong triggering or filter condition

## Experiment Interference

### Variant Interference

#### Inconsistent ramping of variants
#### Pausing variants during execution
#### Self-assinging into a variant

### Telemetry Interference

#### Injection attacks and hacks
