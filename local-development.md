# Testing locally

We utilize the instructions provided [here](https://help.github.com/en/github/working-with-github-pages/testing-your-github-pages-site-locally-with-jekyll) regrading testing locally with Github Pages using Jekyll. 

These instructions are only for UNIX-based setups. 

## Initial, One-time Steps

1. Make sure [Ruby is installed](https://www.ruby-lang.org/en/documentation/installation/). Use your package manager or ``sudo apt-get install ruby-dev`` or ``sudo apt-get install ruby-full``.
2. Install [Bundler](https://bundler.io/) - ``gem install bundler``.
3. Install [Jekyll](https://jekyllrb.com/docs/installation/ubuntu/) via ``sudo apt-get install ruby-full build-essential zlib1g-dev`` and ``gem install jekyll bundler``.

## Running Locally

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
