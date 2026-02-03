---
title: "Setting up Neovim Tree-sitter and Built-in LSP"
description: "How to set up syntax highlighting and errors in Neovim"
date: 2023-09-04
tags: ["neovim", "lsp", "tutorial"]
---

In this article we will go into setting up tree-sitter and the built-in LSP in Neovim.

It won't cover some of the extra plugins for completion, but I will go over some of the more common plugins associated with the LSP such as `mason`.

I hope you enjoy!

### Tree-sitter and Syntax Highlighting

Tree-sitter already comes built-in with Neovim, and is a parsing tool/library. It’s very easy to set up and definitely worth doing. It’s written in pure C so it’s fast, efficient, and has no external dependencies.

To keep it simple, tree-sitter improves syntax highlighting in Neovim, although sometimes you won’t see any noticeable difference until you install a language server (which we will do in the LSP section).

The configuration code is as simple as writing the following:

```lua
-- .config/nvim/lua/plugins/treesitter-setup.lua

require("nvim-treesitter.configs").setup({
  ensure_installed = { "c", "lua", "vim", "vimdoc", "query" },
})
```

In wherever this fits into your own config setup. Just replace the languages in `ensure_installed` with the languages you want parsers for.

The full list of languages and additional configuration options are available [here](https://github.com/nvim-treesitter/nvim-treesitter).

### Tree-sitter and Colorschemes

When picking a Neovim colorscheme make sure that it’s tree-sitter supported/compatible - [Awesome Neovim](https://github.com/rockerBOO/awesome-neovim) provides a [list of themes](https://github.com/rockerBOO/awesome-neovim#colorscheme) which you can use.

### Introduction to The LSP

The LSP is what you can use to give Neovim extra features that you might associate with VSCode or other ide-like code/text editors.

LSP stands for Language Server Protocol. Neovim ships with a built-in LSP _client_, and it uses the language server protocol to communicate with these different _servers_ for each language.

These servers make it possible to get features such as go-to-definition, auto-complete and syntax errors (like if you spell something wrong or miss a semi-colon - so you don’t rip your hair out trying to find it).

It’s worth noting that these features don’t technically ship directly with Neovim when the language server is configured. It enables the use of them, and you have to get plugins for each feature you want (unix philosophy, baby).

### lsp-config

The first plugin is called `lsp-config` and is provided by the Neovim team.

This is just an abstraction for you to be able to quickly enable language servers you have installed.
mason (optional)

Remember those language servers we just talked about? Well the `lsp-config` enables them, but it’s still up to you to install them.

Mason is an easy way to install these language servers for the programming languages of your choice if you don’t want to install and maintain them yourself.

Each language server can be installed via a package manager - but often in a different way. For example, the language servers for HTML/CSS/JS are provided by Microsoft, and are installed via `npm`. Whereas the language server for say, Rust, might be managed by `rustup` (or Rust itself).

Keep this in mind, as you will need to have the relevant package manager installed based on what language servers you need. Microsoft keeps a [list of LSP servers](https://microsoft.github.io/language-server-protocol/implementors/servers/) where you can check the repositories to see which package manager (if any) you will need to install it.

If you’re using `mason`, once you open Neovim simply type `:Mason` as a command to list the language servers available. You can use the standard vim keybindings to navigate the menu and use `i` to install the language servers you desire.

### mason-lspconfig (optional)

You can extend this with another plugin called mason-lspconfig, which just gives you some QoL stuff like ensuring servers are installed, automatic installation if they aren't etc.

It’s more just for error handling and isn’t strictly necessary; I personally use it alongside `mason` though.

Assuming you have installed both `mason` and `mason-lspconfig` with your plugin manager, the following code runs both on startup.

```lua
require("mason").setup()
require("mason-lspconfig").setup {
    ensure_installed = { "lua_ls", "rust_analyzer" },
}
```

The extra [setup options](https://github.com/williamboman/mason-lspconfig.nvim#configuration) for `mason-lspconfig` are the extra features such as ensuring language servers are installed and configured correctly, and automatically installing any that don’t exist on your system.

Following this, just add the line `require("lspconfig").rust_analyzer.setup {}` for each language server you want to set up (replace `rust_analyzer` with the language server of your choice). And that’s it! `wq` and re-open Neovim, and the language server should already be working.

### Troubleshooting

If you load up a file and aren’t seeing any errors come up where they should be, there’s a couple things to initially check for:

- Language Server Names - Ensure in your `require("lspconfig")` statements that the language server name follows the specified convention from the list on `:Mason`. If the server has a name in italics to the right, this is the name you should be using (e.g. `rust_analyzer` not `rust-analyzer`.
- Project Structure - The LSP client only attaches to a buffer in certain scenarios. For example with Rust, you have to be in a `cargo` project for the LSP to work. If you try and create a single `main.rs` file, the LSP won’t attach. You can check this with `:LspInfo` which will tell you whether you have a client attached or not. You can also run `:LspStart` to attach it yourself, and you could probably configure Neovim to do this for certain files. But I’m not going to go into this further, and leave that for you to tinker with.

I personally think it’s pretty cool that out of the box, on setup, no “real” third-party LSP plugins that you start getting syntax errors, warnings, etc.

### Go-to-definition, Hover definitions, and Keybindings

In the documentation for `lspconfig` it also provides a list of example keybindings you can use for other LSP features - including diagnostics (i.e. warnings/errors) and definitions.

TJ (a core member of the Neovim team) has [a video](https://www.youtube.com/watch?v=puWgHa7k3SY) on this which goes into much more detail.

Regardless, I’ll explain in more detail below.

### Diagnostic Keybindings

The first of these keybindings are pulled straight from lspconfig readme on github. The only adjustments I made was changing space to the leader key (which happens to still be space for me anyway).

```lua
vim.keymap.set('n', '<leader>do', vim.diagnostic.open_float)
vim.keymap.set('n', '<leader>dp', vim.diagnostic.goto_prev)
vim.keymap.set('n', '<leader>dn', vim.diagnostic.goto_next)
vim.keymap.set('n', '<leader>dl', "<cmd>Telescope diagnostics<cr>")
```

All of these keybinds make use of Neovim’s built-in diagnostic feature to open up warnings or errors raised by the LSP.

Most of these are self-explanatory (`goto_prev` goes to the previous error, `goto_next` goes to the next error, etc.)

`open_float` opens the error is a small pop-up window in full, and you can repeat the keymap to bring your cursor “inside” the pop-up (use `q` to quit).

I’ve also set a keymap using the Telescope plugin, which shows a list of all the errors in the file and you can navigate through them.

### LSP Keybindings

LSP keymaps are a little more complex, only because they require a little more Lua and Neovim magic. Once again, all of the code for this is in the lspconfig docs.

I’ve provided a stripped down version below.

```lua
vim.api.nvim_create_autocmd('LspAttach', {
  group = vim.api.nvim_create_augroup('UserLspConfig', {}),
  callback = function(ev)
    local opts = { buffer = ev.buf }
    vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, opts)
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, opts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, opts)
    vim.keymap.set('n', '<space>rn', vim.lsp.buf.rename, opts)
    vim.keymap.set('n', '<space>f', function()
      vim.lsp.buf.format { async = true }
    end, opts)
  end,
})
```

The `autocmd` created in the example code here is so the keybindings only activate when you are in a buffer which has an LSP client attached. The reason for this is so you can re-use keybindings which may do similar things outside of LSP buffers, for example exploring Neovim documentation with `K`.

In vim, `K` takes you to the documentation of the word you are hovering over. The LSP follows a similar kind of thing, where `K` will instead show you a documentation window of whatever symbol you are hovering over.

So there is a lot of stuff built into Neovim - both the LSP client and just standard Vim features which make the vanilla experience way better than you might expect.

The most common functions are:

- [vim.lsp.buf.hover()](<https://neovim.io/doc/user/lsp.html#vim.lsp.buf.hover()>)
- [vim.lsp.buf.format()](<https://neovim.io/doc/user/lsp.html#vim.lsp.buf.format()>)
- [vim.lsp.buf.references()](<https://neovim.io/doc/user/lsp.html#vim.lsp.buf.references()>)
- [vim.lsp.buf.implementation()](<https://neovim.io/doc/user/lsp.html#vim.lsp.buf.implementation()>)
- [vim.lsp.buf.code_action()](<https://neovim.io/doc/user/lsp.html#vim.lsp.buf.code_action()>)

And you can see the full list by typing `:h vim.lsp.buf.*`. Remember, this is your Neovim config, so set it up the way that you want!

### Caveats

Each language server is different, so you might find for the languages you want to code in that some of the functions you want to use don’t work or work in a different manner.

### What About Completions? And Conclusion

Neovim does actually have some form of built-in completions with `omnifunc`, which is actually activated if you copy and pasted the code from the `lspconfig` docs. However in my opinion I think manual completion isn’t really necessary, and auto-completion works a lot better if you do happen to want it.

Auto-complete is typically setup through a plugin called [nvim-cmp](https://github.com/hrsh7th/nvim-cmp) and isn’t part of the built-in LSP which I wanted to focus on today. I am also personally a big believer in using an IDE for IDE work - debugging etc, so I’m not interested in setting up the debugger for Neovim.

Regardless of this, I hope you learned something about Neovim’s built-in LSP and how many features it actually has. If you want to learn how to install `nvim-cmp`, TJ goes over it in [this video](https://github.com/hrsh7th/nvim-cmp) (same video I linked previously).

I hope you enjoyed!
