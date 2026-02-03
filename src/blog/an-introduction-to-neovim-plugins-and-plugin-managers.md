---
title: "An Introduction to Neovim Plugins and Plugin Managers"
description: "Everyhing you need to know about using plugins with Neovim"
date: 2023-08-23
tags: ["neovim", "tutorial", "tools"]
---

If you clicked on this article you're probably already aware that Neovim is a highly customizable and extensible text editor, and you can extend it with user-created plugins.

Plugins are pretty much essential if you want to transform Neovim from a simple text editor akin to Vim, into something with a bit more flair — or all the way into a fully-powered IDE-like experience. Either way, you can't really get there without plugins.

This post won't explore topics like setting up the LSP, or guides to specific plugins. Rather, it focuses on understanding what a plugin manager does, and how to set one up to get going installing and configuring plugins yourself.

If you're brand new to Neovim or want to understand more about how configuration works, feel free to check out my [previous post](/blog/a-beginners-guide-to-neovim-configuration).

### Why Do I Need a Plugin Manager?

Plugin managers save you the hassle of having to slog through GitHub, place all of their plugin scripts manually in the correct folders, make sure to keep them up to date, organize the scripts correctly, and anything else that might come with manual plugin management.

The same goes for color schemes. If (for some reason) your color scheme is getting frequent updates, or you're switching your theme a lot, you don’t want to have to worry about re-downloading the palette every week.

Managing your own plugins would get annoying rather quickly, not to mention any other problems you might come across. So let's instead look at how you can set up one of the most popular plugin managers for Neovim.

### Introducing lazy.nvim

A little bit of random Neovim lore: the de-facto standard for plugin managers for a long time was [packer.nvim](https://github.com/wbthomason/packer.nvim).

It's still used (and it's great), but some people are using a newer plugin manager which has appeared called lazy.nvim - including the creator of packer themselves. Not sure of the reason for it, but it's kind of amusing.

The plugin manager we'll be focusing on in this post is [lazy](https://github.com/folke/lazy.nvim).

Like most plugin managers for Neovim, you head to GitHub repository where the plugin manager is located, and paste some code from the README into your config.

It pretty much does most of the work for you. All you have to do as the user is add a line of code for each plugin you want to install.

Here's what the setup code for `lazy.nvim` looks like:

```lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
vim.fn.system({
"git",
"clone",
"--filter=blob:none",
"https://github.com/folke/lazy.nvim.git",
"--branch=stable", -- latest stable release
lazypath,
})
end
vim.opt.rtp:prepend(lazypath)
```

Place this code somewhere in your `init.lua` file, or in your `lua/` directory.

I'm going to put it in my `lua/` directory in a file called `plugins-setup.lua`. (Don't forget to require it in your `init.lua` file if you do it this way.)

The snippet was taken straight from the installation instructions in the lazy repo. Let's break this down. The code:

- Creates a path to the Neovim data directory (Line 1)
- Checks whether that path exists (i.e. checks whether or not you already have `lazy` installed) (Line 2)
- If not, clones the repo (in other words installs `lazy`) (Lines 2 - 11)
- Adds `lazy` to Neovim's [runtimepath](https://neovim.io/doc/user/options.html#'runtimepath') (also covered here) (Line 12)

So in other words, each time you open up Neovim lazy will bootstrap itself if you don't have it installed. Pretty handy if you're copying over your config to another machine!

The final point is also interesting, as `lazy` is both a **plugin manager** and a **plugin itself**. It adds *itself* to the runtimepath so it loads every time Neovim is opened, and in turn will manage the plugins you install (making sure they are installed correctly, checking for updates, etc.)

Directly after this code, the plugin manager is bootstrapped and now needs to be setup with the following line of code:

```lua
require("lazy").setup({})
```

Remember, `require` is a Lua thing, not a Neovim thing.

In the context of Neovim, it means to search for a `lua/` directory with the module `lazy` inside of it. It will search the entire runtimepath - including the `lazypath` added earlier - to run and setup `lazy`. So while the first code snippet *installs* the plugin manager, this one *runs* it.

### Installing Plugins

The empty curly braces in the `setup`` method above are where your plugins go.

For example, if you want to add the [lualine](https://github.com/nvim-lualine/lualine.nvim) plugin (a status bar) you would do:

```lua
require("lazy").setup({
'nvim-lualine/lualine.nvim'
})
```

Most plugins have a guide on how to install them. There is a curated list of plugins at [Awesome Neovim](https://github.com/rockerBOO/awesome-neovim) you can use to get started. Also, remember to add a comma after each plugin within the curly braces.

All of this code (both the installation and setup) are suggested to be placed directly in your `init.lua` file. But as discussed in my [previous post](/blog/a-beginners-guide-to-neovim-configuration), most people use the `lua/` directory for their config. There are some things to watch out here for though, which I will address later.

### Setting Up Plugins

In the above, we have installed `lazy`, a plugin manager, included it in our `init.lua` with `require`, and passed in the names of the plugins we want to install (if not already installed). But similarly to `lazy`, each plugin is *installed*, but also needs to be *set up*.

This is typically done in the same way as `lazy`. For example with the [lualine](https://github.com/nvim-lualine/lualine.nvim#starting-lualine) plugin, to load the plugin all you have to do is put `require("lualine").setup()`` somewhere in your `init.lua``, or in a file like `lua/lualine-setup.lua`` (remember to `require` this file in your `init.lua` if you do it this way.)

Each plugin is slightly different to set up and may have additional options you can configure inside of the `setup` brackets. Therefore I hope I have given you an idea of how you can get started picking and choosing plugins for yourself, rather than giving a guide on how to install specific plugins you may or may not want.

### Caveats and Pitfalls to Avoid

The main thing to be careful of if you're using the `lua/` directory in your config is your directory structure and naming files.

For example, creating a file called `lazy.lua` and then requiring it in your `init.lua` with `require("lazy")` is going to cause some problems...

Remember the snippet above does the exact same thing to find `lazy` on the runtimepath, but now there are two modules named `lazy` - one in your config, and one in the Neovim data directory. This will essentially cause your entire configuration to break.

The second pitfall to avoid is the ordering of your `require` statements, as these matter.

Say for example you have a file called `keymaps.lua`, which contains some keybinds, and another file called `telescope-setup.lua` which sets up your Telescope plugin with some of those keybinds.

When you `require` these files in your `init.lua`, if you don't `require` the keymaps before the telescope module, then the keybinds won't work with it. This is why you see some people use `after/plugin` for their plugin setup files, to ensure that they run after everything else in the init file.

### Conclusion

The aim of this post was to make clearer how plugin managers work and set you up to explore and install plugins yourself — rather than giving you a complete step-by-step guide. The best way to learn is to play around with the config yourself and see what breaks and what doesn't.

I plan to make a few more articles covering the LSP and other aspects of Neovim, and feel free to check out my post on [Neovim configuration](/blog/a-beginners-guide-to-neovim-configuration) as well.

I hope you enjoyed!
