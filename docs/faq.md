---
layout: default
title: Frequently Asked Questions
nav_order: 2
---

# Frequently Asked Questions
{: .no_toc }


Questions Which Should Probably Be Frequently Asked By People Who Care About Making Sound Decisions Based On Experimentation.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## What is Sample Ratio Mismatch?

In A/B testing, a Sample Ratio Mismatch (SRM) is said to have occured when the _observed_ proportion of the visitors sampled in a particular treatment group does not match the _expected_ proportion of the visitors sampled; the two sample ratios (expected and observed) are mismatched.

For example, imagine we set up a test to split traffic equally between control (base) and treatment (a variation). Then further imagine that our analysis of the results of this experiment tells us that it has recieved 1.000 visitors. In this scenario, we would not be surprised to see approximately (since some slight deviation from a perfect split is to be expected) 500 of the visitors were assigned to control, and the remainder to treatment.

Group | Expected | Observed
--- | --- | ---
Control | 50% | 502 (50.2%)
Treatment | 50% | 498 (49.8%)

We should, however, be surprised to see 600 of the 1.000 visitors assigned to control and only 400 to treatment. These allocation ratios, of 60% and 40% to control and treatment respectively, fall far outside of our expectations for an experiment which has been correctly configured to split traffic equally between control and treatment.

Group | Expected | Observed
--- | --- | ---
Control | 50% | 600 (60%)
Treatment | 50% | 400 (40%)

This distribution of visitors is very unexpected. A sample ratio mismatch has occurred. It suggests that something has gone terribly wrong.

## Why should we care about Sample Ratio Mismatch?

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## How can we detect Sample Ratio Mismatch?

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## How common is Sample Ratio Mismatch?

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## What can we do about Sample Ratio Mismatch?

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## How does the SRM Checker Chrome Extension work?

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Can we check for SRM if we don't expect to split traffic equally?

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Can we check for SRM if we use bandits (or other kinds of Machine Learning)?

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Do we need to check for SRM if we use Bayesian statistics?

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
