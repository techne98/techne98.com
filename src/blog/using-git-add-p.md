---
title: "Using git add -p for fun (and profit)"
date: 2025-12-10
---

The Git option you might not have heard of (git add -p)


Here's the problem: 

You're coding, and in flow state, and you make a lot of changes to a single file. 

Now you want to commit it, but because there isn't a single atomic change you have to suck it up and write something terrible like `git commit -m "Update stuff"`, or commit early and often which, while good practice, can be distracting. 

This is where `git add -p` fundamentally changed my workflow, and I feel a bit silly for not knowing about it sooner. 

## What git add -p actually is 

The long version of this Git option is `--patch`, which opens up an interactive mode for staging "hunks" of text. Hunks are different pieces of code/text that Git has identified in your file.

In other words, when you do `git add -p <file>` it doesn't just add the file to staging. Instead, it opens it up and lets you go through different chunks of code to decide what to commit.

## Using git add -p

When you first open it up, you'll get a random assortment of characters at the bottom of your screen. The most important ones (for me) are `[y, n, s, a, d]`.

- `y` accepts the hunk to be staged.
- `n` declines the hunk to be staged.
- `s` tries to split the hunk up into smaller pieces.
- `a` accepts the hunk and any remaining.
- `d` declines the hunk and any remaining. 

### `s` doesn't always work as expected

If you have quite a small file, using `git add -p` sometimes doesn't really work that great and suggests all of the code to be added. When you try to split it further with `s`, it doesn't always work that well. 

So keep that in mind. It's likely better for established and larger projects than one-off scripts. 


## Further explorations

I've heard a lot of people talk about using LazyGit as a TUI frontend. From what I can tell it works by staging these individual hunks by default, essentially giving you an interface for doing `git add -p` on every change without having to keep re-running `git add -p` on the same file.

This is what I'm likely going to check out next to help me improve my workflow.

I also have been meanining to understand rebasing properly and `git rebase -i` to make sure that any commits I make can be maintained more easily in the future.

I hope you found this post useful.

Thanks for reading!
