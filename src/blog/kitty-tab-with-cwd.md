---
title: "How To Open a New Kitty Tab in Current Working Directory"
description: "A single Kitty keybind I use a lot"
date: 2024-01-04
tags: ["terminal", "tools", "productivity"]
---

When I'm using [kitty](https://sw.kovidgoyal.net/kitty/) I often find myself wanting to open a new tab to run a local server for a web app I'm working on, or run some other commands in the same directory I'm currently in.

Of course I could use kitty's windows here instead of tabs - but I prefer to stay focused on my code in one window - and if it's just a command running in the background, it doesn't need to take up space on my screen.

Fortunately, this is super easy to set up with kitty.

In kitty's [documentation](https://sw.kovidgoyal.net/kitty/conf/), under [mappable actions](https://sw.kovidgoyal.net/kitty/actions/#tab-management) there's a command called `new_tab_with_cwd`. This is what we want.

As you can see in the documentation, it doesn't have a default keymap - so we need to set this ourselves.

Open up your `.config/kitty/kitty.conf` file (or create one if you don't already have it).

All we have to do is add the following line:

`map [key] new_tab_with_cwd`.

Replace `[key]` with the key or combination of keys you want to use as a shortcut, for example:

`map cmd+shift+t`.

I opted for `cmd+shift+t` as `cmd+t` opens up a new tab, so this makes it pretty easy to remember.

Also make sure the keybind you choose isn't already set to something else first.

And that's it! You can now open up a new kitty tab in your current working directory, without needing to `cd` back into it or scroll through your command line history.

I hope you enjoyed!
