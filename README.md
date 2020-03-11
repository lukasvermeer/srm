![Chrome Web Store](https://img.shields.io/chrome-web-store/v/ikielffdbameifemkibfheolelbohipn?label=Store%20Release)
![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/ikielffdbameifemkibfheolelbohipn?label=Store%20Rating)
![Chrome Web Store](https://img.shields.io/chrome-web-store/users/ikielffdbameifemkibfheolelbohipn?label=Extension%20Users)
![GitHub last commit](https://img.shields.io/github/last-commit/lukasvermeer/srm?label=Last%20Repo%20Commit)
![Build status](https://img.shields.io/github/workflow/status/lukasvermeer/srm/NodeCI?label=Build%20Status)

# Sample Ratio Mismatch (SRM) Checker

The Sample Ratio Mismatch (SRM) test can be used to detect a wide variety of data quality issues [(paper)](https://dl.acm.org/citation.cfm?id=3330722) that may affect online experiments (aka A/B tests). Only expected proportions and observed sample counts are required as input for this procedure, so this test can be used even in cases where experimenters only have access to summary statistics; such as when using third-party tools.

This repository contains a [Chrome Extension](https://chrome.google.com/webstore/detail/sample-ratio-mismatch-che/ikielffdbameifemkibfheolelbohipn) that can automatically detect SRM on supported platforms, as well as a [website](https://lukasvermeer.nl/srm/) with more information about the extension.

Supported platforms:
- Convert.com
- Google Optimize
- Omniconvert
- SiteGainer/Symplify
- Visual Website Optimizer (VWO)
- Zoho PageSense

Known issues:
- Optimize: "Updated Reporting" breaks the extension ([#12](https://github.com/lukasvermeer/srm/issues/12))
- VWO: Red highlighting disappears when selecting different goal ([#23](https://github.com/lukasvermeer/srm/issues/23))
- Convert: Auto-stopping variants triggers false SRM alert ([#29](https://github.com/lukasvermeer/srm/issues/29))

---

# About the project

Sample Ratio Mismatch Checker was created by [Lukas Vermeer](http://lukasvermeer.nl), [Heinrich Mahr](https://heinrich333.github.io) and [Georgi Georgiev](http://blog.analytics-toolkit.com).

## License

Sample Ratio Mismatch Checker is distributed by an [MIT license](https://github.com/lukasvermeer/srm/tree/master/LICENSE).

## Contributing

You want to contribute to this project? That's amazing! We'd love that! <3

Feel free to fork the repository on on [GitHub](http://github.com/lukasvermeer/srm), make the changes you want to see, and issues a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests). If you are not sure what to work on, we maintain a list of outstanding issues on the GitHub [project](https://github.com/lukasvermeer/srm/issues). (If you don't want to code, adding to that list of issues is also a great way to contribute.)

### Testing Locally

We utilize the instructions provided [here](https://help.github.com/en/github/working-with-github-pages/testing-your-github-pages-site-locally-with-jekyll) regrading testing locally with Github Pages using Jekyll. 

These instructions are only for UNIX-based setups. 

#### Initial, One-time Steps

1. Make sure [Ruby is installed](https://www.ruby-lang.org/en/documentation/installation/). Use your package manager or ``sudo apt-get install ruby-dev`` or ``sudo apt-get install ruby-full``.
2. Install [Bundler](https://bundler.io/) - ``gem install bundler``.
3. Install [Jekyll](https://jekyllrb.com/docs/installation/ubuntu/) via ``sudo apt-get install ruby-full build-essential zlib1g-dev`` and ``gem install jekyll bundler``.

#### Running Locally

All you gotta do is run this command at the root of the repo (where the ``Gemfile`` is located):

``bundle exec jekyll serve``

You will get output that looks like the following
```console
Configuration file: /media/paul/3638-6263/git/srm/_config.yml
            Source: /media/paul/3638-6263/git/srm
       Destination: /media/paul/3638-6263/git/srm/_site
 Incremental build: disabled. Enable with --incremental
      Generating... 
Invalid theme folder: _sass
      Remote Theme: Using theme pmarsceill/just-the-docs
       Jekyll Feed: Generating feed for posts
                    done in 5.583 seconds.
 Auto-regeneration: enabled for '/media/paul/3638-6263/git/srm'
    Server address: http://127.0.0.1:4000/srm/
  Server running... press ctrl-c to stop.
```

Note the ``Invalid theme folder: _sass`` will show up as a warning; you can safely ignore it as it's related to production deployment on Github. Navigate to the server address given (in this case, ``http://127.0.0.1:4000/srm/`` and you're done!

Thank you for making this project more awesome.

## Testing locally

We utilize the instructions provided [here](https://help.github.com/en/github/working-with-github-pages/testing-your-github-pages-site-locally-with-jekyll) regrading testing locally with Github Pages using Jekyll. 

These instructions are only for UNIX-based setups. 

### Initial, One-time Steps

1. Make sure [Ruby is installed](https://www.ruby-lang.org/en/documentation/installation/). Use your package manager or ``sudo apt-get install ruby-dev`` or ``sudo apt-get install ruby-full``.
2. Install [Bundler](https://bundler.io/) - ``gem install bundler``.
3. Install [Jekyll](https://jekyllrb.com/docs/installation/ubuntu/) via ``sudo apt-get install ruby-full build-essential zlib1g-dev`` and ``gem install jekyll bundler``.

### Running Locally

All you gotta do is run this command at the root of the repo (where the ``Gemfile`` is located):

``bundle exec jekyll serve``

You will get output that looks like the following
```console
Configuration file: /media/paul/3638-6263/git/srm/_config.yml
            Source: /media/paul/3638-6263/git/srm
       Destination: /media/paul/3638-6263/git/srm/_site
 Incremental build: disabled. Enable with --incremental
      Generating... 
Invalid theme folder: _sass
      Remote Theme: Using theme pmarsceill/just-the-docs
       Jekyll Feed: Generating feed for posts
                    done in 5.583 seconds.
 Auto-regeneration: enabled for '/media/paul/3638-6263/git/srm'
    Server address: http://127.0.0.1:4000/srm/
  Server running... press ctrl-c to stop.
```

Note the ``Invalid theme folder: _sass`` will show up as a warning; you can safely ignore it as it's related to production deployment on Github. Navigate to the server address given (in this case, ``http://127.0.0.1:4000/srm/`` and you're done!
