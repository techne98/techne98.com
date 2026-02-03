---
title: "A Beginner's Guide to the uv Package Manager in Python"
description: "Rust-powered package management in Python"
date: 2025-01-29
tags: ["python", "tools", "tutorial"]
---


uv is a new-ish package manager for Python. It's built by [Astral](https://astral.sh/) (the team behind Ruff), a linter for Python, so we have some seasoned devs working on it.

Yes, it's another package manager. Yes, we have pip, pipx, poetry, conda, and countless other solutions. Obligatory xkcd here.

![xkcd comic on standards.](../assets/a-beginners-guide-to-uv-python/standards_2x.webp)

However, it's an awesome experience. Here, I'll go over some features which I've personally used which make it a very nice experience to use.

## Using `uv`

You can install uv through your favourite package manager, such as brew on MacOS (`brew install uv`).

You can bootstrap and setup a new project with `uv init`, e.g. `uv init my-app`. Here's an example of what the directory will look like after using `uv init`.

```
.
├── README.md
├── hello.py
└── pyproject.toml
```

You can run scripts or the entry point file within your project with `uv run`, e.g. `uv run hello.py`. This will use the default Python version on your system to setup the environment.

```
.
├── .git
├── .gitignore
├── .python-version
├── .venv
├── README.md
├── hello.py
├── pyproject.toml
└── uv.lock
```

What I particularly like about uv is that it uses the default `.venv` configuration. This means everything is built on top of Python's existing virtual environment setup.

You can then add packages to your project with `uv add` e.g. `uv add numpy`, and remove them with `uv remove`.

The project dependencies and their versions are noted in `pyproject.toml` and `uv.lock`. If you've worked in modern web development, you're probably familiar with `package.json` and `package-lock.json` which do something similar.

For those who aren't, these files ensure anyone who clones your project and wants to work on it can run `uv sync` and it will install the *exact* dependencies and the specific versions you used, which means no annoying compatibility errors or conflicts.

Another thing in tandem with this is this doesn't just apply to package versions - but also Python versions. You can specify what Python versions you want to use for your project and likewise if you work on someone else's project, you can use the exact version of Python they used.

uv therefore solves two majorly annoying issues when working in Python:
- Managing different versions of Python
- Managing different versions of Python packages

This in combination with being super easy to install, super easy to start a new project and add/remove dependencies, and also being almost like a wrapper over the traditional `.venv` solution (which is typically my go to) made it an instant use for me.

I haven't gone into probably half of the other features uv has and what it is capable of - but I can only speak to my experiences and what I've been using it for.

If you want to check out uv and try it for yourself, head to their [docs](https://docs.astral.sh/uv/) and see what you think. If you found this post useful, check out my other [posts](https://jacksmith.xyz/blog).

Thanks for reading!
