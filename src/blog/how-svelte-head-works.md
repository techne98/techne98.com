---
title: "How <svelte:head> works"
description: "Why you need svelte:head, and other shenanigans"
date: 2023-11-28
tags: ["svelte", "web", "tutorial"]
---

SvelteKit has special elements, one of which is the `<svelte:head>` tag.

`<svelte:head>` works just like normal `<head>` tags where you can place metadata inside - such as a title, but it lets you use it across components and pages. This is useful for a couple of reasons.

The first is personalization. If you want to add some personalization to your website such as giving users a special favicon, or using their name in the browser tab (with `<title>`) you could use `<svelte:head>` to add this functionality to your components.

You could also use `<svelte:head>` to use different [og:image](https://www.freecodecamp.org/news/what-is-open-graph-and-how-can-i-use-it-for-my-website/) tags for each page, so when you share your website different pages have different embedded images.

Arguably more importantly is the second reason — SEO.

If you have a blog for example, you can add metadata such as different keywords for each blog post in your `<svelte:head>` tags.

### So why not just use `<head>`?

What’s kind of interesting, is you can actually use the normal `<head>` tags inside your components and pages. But they won’t work as intended.

If you try it, you’ll notice that the head tags don’t end up as the first element inside of the HTML tags, but rather they end up inside of `<body>`. This is bad because it breaks the [HTML spec](https://html.spec.whatwg.org/multipage/semantics.html#the-head-element), but also if you’re relying on your website getting scraped/used for SEO purposes, chances are it might cause issues.

### How `<svelte:head>` actually works

To understand what is happening here and how `<svelte:head>` works, we have to start with the app.html file.

`app.html` is kind of like a skeleton which gets wrapped around every page. This skeleton is loaded server-side, so this is where you want stuff to be picked up by SEO.

You can add any global head tags here which will apply to every page, but there’s also a couple special elements — `%sveltekit.head%` and `%sveltekit.body%`.

As you might expect, `%sveltekit.head%` is essentially saying - “when you wrap the page you’re serving in this app.html skeleton page, check if it has any `<svelte:head>` tags, and if it does insert them here.” Similarly, it takes the contents of pages and puts them in the body, which is why “normal” head tags end up inside the body instead.

It’s also worth mentioning that Svelte/SvelteKit has server-side rendering (SSR) by default, with hydration. If you’re building your app with pre-rendering or an SSG it should work the same, but you won’t get the SEO benefits if you’re using it as a SPA as far as I know.

I hope you enjoyed!
