---
title: "Crafting a Single File Neovim Config"
description: "A pragmatic approach to Neovim configuration"
date: 2025-01-09
tags: ["neovim", "lua", "tools"]
---

> *One file to rule them all,*
>
> *One file to find them,*
>
> *One file to bring them all,*
>
> *And in the config bind them.*
>
> *In the land of Neovim where the plugins lie.*
>
― Some LLM

## Motivation

Here's my goal of a single-file Neovim configuration:

**Simplicity**

Neovim can be extended from basically a text editor all the way to a full-blown IDE, but if you want to do that yourself and not use a distribution (e.g. [LazyVim](https://www.lazyvim.org/), etc.) then configuration can get complex.

I've even talked about how Neovim configuration works before ([a](https://jacksmith.xyz/blog/a-beginners-guide-to-neovim-configuration/) [few](https://jacksmith.xyz/blog/an-introduction-to-neovim-plugins-and-plugin-managers/) [times](https://jacksmith.xyz/blog/setting-up-neovim-tree-sitter-and-built-in-lsp/)), but I've settled on a single-file configuration.

One file is easier to edit, easier to copy anywhere else, and just keeps everything in one place. I don't have to dig through a bunch of nested directories (that I've probably forgotten the structure of) just to tweak a minor setting.

Some important notes on my setup and why this works for me:
- I use probably < 10 plugins in total
- I don't have any set up for autocomplete/intellisense-type features
- I don't do much web development in Neovim
- I haven't used it to work on extremely large projects

## Introducing the init.lua file

The configuration file lives in a `.config` dir inside of your home directory, e.g. `~/.config/nvim/init.lua` .

If you're unfamiliar about how dotfiles work, or new to configuring terminal applications, you can learn more about it in one of my other posts [here](https://jacksmith.xyz/blog/a-beginners-guide-to-neovim-configuration/).

## Bootstrapping a Plugin Manager

You can bootstrap [lazy](https://github.com/folke/lazy.nvim), a plugin manager for Neovim, which installs and sets itself up with the following code.

```lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  local lazyrepo = "https://github.com/folke/lazy.nvim.git"
  local out = vim.fn.system({ "git", "clone", "--filter=blob:none", "--branch=stable", lazyrepo, lazypath })
  if vim.v.shell_error ~= 0 then
    vim.api.nvim_echo({
      { "Failed to clone lazy.nvim:\n", "ErrorMsg" },
      { out, "WarningMsg" },
      { "\nPress any key to exit..." },
    }, true, {})
    vim.fn.getchar()
    os.exit(1)
  end
end
vim.opt.rtp:prepend(lazypath)
```

This code:
- Checks if you have a path on your computer for lazy
- If not, it pulls the lazy package manager from GitHub (i.e. installs it onto your system)
- Throws an error if any appear
- Adds lazy to the runtimepath, which are a group of directories Neovim looks for on startup (so lazy runs when Neovim opens)

## General Settings and Keybinds

Directly underneath this, I set up some general settings and global keybinds.

```lua
vim.g.mapleader = " "
vim.g.maplocalleader = "\\"

vim.opt.cursorline = true
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true

vim.diagnostic.disable()
```

This may not look like much, but Neovim has a lot of [sensible defaults](https://neovim.io/doc/user/vim_diff.html#nvim-defaults) so you don't actually need to a set a lot of the settings you think you might need to.

The main things here are setting the leader key to space which is a general practice, and is used as a prefix to setup custom keybinds.

Cursorline is self explanatory, `relativenumber` works well with Vim so you can see how many lines you can jump up or down in a file, and `tabstop` and `shiftwidth` are 4 because that's a nice number for code indentation.

I also disable diagnostics which are warning and error messages which appear next to your code if you are using an LSP. I personally find they break my flow when I'm coding, so I've opted for another way of checking for errors (which I'll get into later on).

## Plugins

Next, I have the plugins I actually want installed. You might be surprised at how little there is here, but it works for me.

```lua
require("lazy").setup({
  spec = {
    {
        "neovim/nvim-lspconfig",
        { "catppuccin/nvim", name = "catppuccin", priority = 1000 },
        { "lewis6991/gitsigns.nvim", opts = {} },
        {
          "nvim-lualine/lualine.nvim",
          dependencies = {'nvim-tree/nvim-web-devicons' },
          opts = {}
        },
        { "nvim-tree/nvim-tree.lua", opts = {} },
        { "nvim-treesitter/nvim-treesitter", build = ":TSUpdate" },
        { "williamboman/mason.nvim", opts = {} },
        { "williamboman/mason-lspconfig.nvim", opts = {} }
    }
  },
  { colorscheme = { "catppuccin" } },
  checker = { enabled = true },
})
```

In this part I've just installed the plugins I want - a colorscheme, statusline, git status, file tree, and some LSP stuff respectively.

It might seem weird that I've installed plugins related to the LSP and what not considering I'm not using autocomplete. But I've personally found that the syntax highlighting works a lot better when I have the LSP servers installed, and I also have some other cool stuff I can do thanks to LSP which I'll demonstrate in a bit.

The last couple parts of the setup inside of `spec` sets the actual Lazy colorscheme (not the colorscheme for Neovim itself) and has the checker for plugin updates enabled.

## Plugin Keybinds and Setup

After this section I've added the keybinds for the plugins installed and any other settings.

```lua
local builtin = require('telescope.builtin')
vim.keymap.set('n', '<leader>ff', builtin.find_files, { desc = 'Telescope find files' })
vim.keymap.set('n', '<leader>fg', builtin.live_grep, { desc = 'Telescope live grep' })
vim.keymap.set('n', '<leader>fb', builtin.buffers, { desc = 'Telescope buffers' })
vim.keymap.set('n', '<leader>fh', builtin.help_tags, { desc = 'Telescope help tags' })
vim.keymap.set('n', '<leader>td', builtin.diagnostics, { desc = 'Telescope diagnostics' })

vim.keymap.set('n', '<leader>tt', ':NvimTreeToggle<cr>')

vim.cmd([[colorscheme catppuccin]])
```

In the first section of the code I set up the keybinds for any plugins that need it - in this case Telescope. There's also a keybind that I've set up here which displays a list of any warnings/errors in a file.

This is what I use to check for any errors in my code, rather than the automatic checking I mentioned previously. I also set a keybind to toggle the file tree on and off.

Lastly, I set my colorscheme for Neovim.

## That's it!

There is a simple Neovim configuration in less than 100 lines of code.

As you can see, you can achieve quite a lot with Neovim even in 100 lines of code or less. I hope this inspires you to make your own Neovim configuration which is less than 100 lines - even if just for fun, if not anything else.

Thanks for reading!
