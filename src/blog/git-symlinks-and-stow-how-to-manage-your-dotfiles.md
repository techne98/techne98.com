---
title: "Git, Symlinks, and GNU Stow: How To Manage Your Dotfiles"
description: "Using Stow to manage my dotfiles"
date: 2024-01-18
image: "../assets/git-symlinks-and-stow-how-to-manage-your-dotfiles/cover.webp"
tags: ["git", "dotfiles", "tutorial"]
---

I wanted to start managing my dotfiles for two reasons:
- Having a backup and version history
- Being able to set up another machine easily if necessary

So, as anyone would do, I looked into the existing solutions and decided to go with [Stow](https://www.gnu.org/software/stow/), and store my dotfiles on GitHub.

### Why Not Just a Git Repo?

I'm sure some people out there are thinking this question, or they maybe are unsure of which method of managing dotfiles to use.

The "just use a git repo" approach tends to focus on making your entire home directory a git repository (typically using `git --bare`), and adding a gitignore file to ignore every file in your home directory and only add your dotfiles.

I personally do not like the idea of having my home directory as a giant git repo, but each to their own. Using a git repo (most likely with `--bare` as most tutorials will tell you) also feels like a sure way to accidentally push secrets or personal stuff to a public git repo - at least, knowing me, I’d probably end up making that mistake. I’d rather specify exactly what dotfiles I want to be symlinked, and be explicit about it.

It would be great if you could `git init` inside the `.config` directory, but then you'd have to worry about `.zshrc` or other home level dotfiles, which means symlinks, which is fine but Stow does something similar whilst handling symlinking for you.

### Understanding Symlinks

If you're not opting for a git --bare repo, then your next option is symlinks - which can be handled nicely for you with GNU Stow. As stow is a "symlink farm manager" it's probably a good idea to have a brief understanding of symlinks so you know what this tool is actually going to be doing on your machine.

Here's an extremely quick explanation:
- Symlinks are a bit like "shortcuts", or files which point to other files.
- If you delete the original file, the symlinked file will break.
- Symlinks can be used across files and directories.
- If you edit either the original or symlinked file, changes will be reflected on both.

For example, if you symlink `hello.txt` to `new.txt` and then open `new.txt`, you will actually be editing `hello.txt`.

You can set up symlinks using the `ln` command, which links one file to another. The benefit of this is it doesn’t take up storage space as if you were to actually “copy” the file manually (it’s essentially just a reference to the original file, remember?). It’s *symbolically* linked.

### Setting Up and Using GNU Stow

GNU Stow utilizies symlinks, which means it’s built straight on top of unix/linux. I personally like this.

Get started by installing stow via your package manager, e.g. with `brew install stow`.

Next, we need to create a directory which is going to store our dotfiles, e.g. `.dotfiles`. This is essentially going to be the new "home" of all of your dotfiles. They are then going to be symlinked using `stow` to make them appear in the "correct" place they should be.

Stow uses a few different terms which you can find with `man stow` which will be important. They refer to the different directories `stow` uses. Here's a quick explanation:
- Target Directory - Where your dotfiles should *appear* to be installed (e.g. your home directory, .config, etc.)
- Stow Directory - Where you have "packages" (i.e. different dotfiles) to be installed. This will be your your `.dotfiles` directory.
- Package Directory - A directory containing installation files (or in instance configuration files) for a single program, e.g. a `zsh` directory containing a `.zshrc` file. These package directories live inside your stow directory.

Now that's out of the way, we can start using Stow.

Let's start with an example of a `.bashrc` or `.zshrc` file. Move the file into your new dotfiles directory (feel free to back it up first) with `mv ~/.zshrc ~/.dotfiles/zsh`. This will also create the `zsh` directory in your `.dotfiles` directory if it doesn't already exist.

Your directory should look something like this:

```
.dotfiles
└── zsh
    └── .zshrc
```

So `.dotfiles` is the stow directory, and `zsh` is a package directory. So how do we set the target directory? How do we now get our `.zshrc` file to "appear" in our home directory like usual?

Well, this is actually fairly simple. The default target directory is the parent directory of wherever you are. So if you're in your `~/.dotfiles` directory, the parent directory is `~`. That's your home directory - exactly where we want our `.zshrc` to appear. Great! From within the `.dotfiles` directory just run `stow zsh` and the symlink will be created. Don't want it symlinked anymore? Run `stow -D zsh` to unstow it.

If you run `ls -la` in your home directory now, you should see something like this:

```sh
.zshrc -> .dotfiles/zsh/.zshrc
```

Which confirms the symlink is there. Also notice the direction of the symlink: the file on the left of the arrow is the "shortcut" or alias, and the original file is on the right hand side of the arrow.

Okay, so what about your files in the `.config` directory? How do you set these as the target?

Well, the benefit of stow is that whatever structure you put into a package directory is replicated to the target directory. Here's an example.

Let's say I am using kitty as my terminal (I am), and I store my configuration files in `.config/kitty`. If I want to use these with Stow, all I need to do is create a package directory (so in `./dotfiles` make a directory called `kitty`), and *inside* of this, copy the directory structure (so, `.config/kitty/kitty.conf`).

This might seem a bit weird at first, as you have to copy the `.config` directory and relevant name for each package, but it makes each package really easy to manage, which is cool.

So when you do `stow kitty`, it takes the target directory `~` and combines it with the directory structure in your package `.config/kitty/kitty.conf` and so symlinks your file(s) to `~/.config/kitty/kitty.conf` so you don't have to specify a target directory each time, and it doesn't matter if you are using a new machine - if you re-stow it will just make your dotfiles "appear" where they are supposed to be.

That's pretty much it, I personally think using `stow` or at least using symlinks with a bash script is the the best way to manage your dotfiles. You can then just run `git init` in your `.dotfiles` directory and you know that anything you've put in there is there intentionally, and will be backed up on GitHub/whatever code forge you use.

I hope you enjoyed!
