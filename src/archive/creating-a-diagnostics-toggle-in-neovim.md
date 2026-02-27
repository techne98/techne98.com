---
title: "Creating a Diagnostics Toggle in Neovim"
description: "Toggle diagnostics on and off in Neovim"
date: 2024-10-24
tags: ["neovim", "lua", "lsp"]
---

### The Problem

You want an LSP server integration for the benefits it provides - e.g. hover definitions, go to definition, etc.

However, you get distracted by arbitrary warnings like these ones.

![Screenshot of Neovim config with diagnostics/warnings.](../assets/creating-a-diagnostics-toggle-in-neovim/neovimdiagnostics.png)

I had this problem and solved it with a simple toggle. I didn't want to disable it entirely, as it can be helpful to see what warnings and/or errors you have. I just didn't like the fact every time I hit `esc` and went into normal mode it would pop up and break my concentration/flow.

I googled about a bit and found the commands `vim.diagnostic.enable()` and `vim.diagnostic.disable()`. These do exactly what you would expect - unsilence and silence any warnings or errors.

The simplest (and initial approach) I took was just to create two keybinds for enabling and disabling diagnostics.

> **Skip ahead to "The actual solution" if you don't care about any of this and just want the code.**


This is fairly simple - you can set a keybind to call both functions.

```lua
vim.keymap.set("n", "<leader>de", "<cmd>lua vim.diagnostic.enable()<cr>")
vim.keymap.set("n", "<leader>dd", "<cmd>lua vim.diagnostic.disable()<cr>")
```

In the code above, we:
1. Set a new keybind
2. Set the mode for this keybind to function in (normal mode)
3. Set the keybind itself
4. Set the command to trigger on the keybind press

Keep in mind that as the `vim.diagnostic` commands are Neovim commands, you must prefix it with `lua`.  You can also call a normal function to do this as well.

### The actual solution

So I'm lazy. I'd prefer one keybind which just toggles the diagnostics on and off, because it's a bit simpler and easier. For this we have to actually write some logic.

The steps we want to produce on the "toggle" function are:
- Check the current status of the diagnostics (is it currently enabled or disabled)?
- If diagnostics are enabled, disable them
- Otherwise, enable them

So let's implement this in Lua.

```lua
vim.keymap.set("n", "<leader>dt", function()
	if vim.diagnostic.is_enabled() then
		vim.diagnostic.disable()
	else
		vim.diagnostic.enable()
	end
end)
```

So this time the key map set is a little different - for the last argument we don't pass in an *actual* command, we instead pass in a Lua function to be called.

This is our custom function which checks the state of diagnostics, and will enable it or disable it depending on its current state.

I hope you found some value in this post, and if you did then maybe check out my other Neovim posts.

Thanks for reading!
