---
title: "Reflections on building ani.town"
description: "Building a consumer-facing app with SvelteKit, Supabase, and the AniList API"
date: 2025-05-08
tags: ["project", "svelte", "reflection"]
---

I recently built out [ani.town](https://ani.town), a website where users can save queries about anime and manga.

I built it with SvelteKit and Supabase, so just wanted to share some of my reflections on the process, what I struggled with, learnt, and more.

## Auth

I learnt about JWT auth, and options to handle tokens server-side vs client-side.

I opted to handle most of my auth logic client-side using localStorage, as I didn't want a kind of "extra" backend. I was already using Supabase as a kind of backend, so for simplicity's sake I thought I would treat my app more like a SPA in terms of auth.

Admittedly, you could just learn the SSR way of doing auth and host it all on Vercel, but I think from a mental model and cost perspective you're now going between from client -> supabase db to client -> server -> supabase db.

It might sound silly, but it means I could run all my Supabase fetches, AniList GraphQL calls all from the client, which would otherwise incur costs on the server. If I think SSR is important later on I'll probably convert some of my code to it, but don't think I really need it at the moment.

## State Management and Svelte Runes

I also learned Svelte specific stuff for state management using Svelte 5 and runes. Basically `onMount` runs only when a component mounts, so isn't "reactive". `$state()` is reactive, but for that page/component only it can display reactive changes, but doesn't listen for them externally. so I had to use a mix of them plus `$effect` to listen for auth changes and update my components respectively.

## Postgres and other miscellaneous stuff

Some other stuff i learned was about postgres row-level security, and also just creating tables and designing schemas for databases in the first place.

At first, I found it a bit confusing because my mental model would be like - a user has queries, so in the user's table, there should be queries column. But the DB model is more like there is a users table, there is a queries table, you can tie each query to a user. So basically if it's not a kind of atomic piece of data related to a user, it has its own table and links back to it rather than the user linking forward ot it if that makes sense. That relationship was quite new to me.

## SvelteKit routing and fetching from Supabase

Another thing I've learned is about SvelteKit's dynamic routes and `+page.js` for loading data. First, with `+page.js`, it's very easy to set up protected pages by simply checking if a user has a valid session. You can also call `supabase.auth.getUser()` instead of `supabase.auth.getSession()` if you want to validate with the server that a valid JWT has been issued, even though it doesn't store any kind of actual session server-side. The dynamic routes are also coming in handy for profiles, and loading user data based on that.

## Conclusion

This was a fun project, and I feel like I've learned a lot more about actual domain knowledge (e.g. auth, database design, etc) from making this project.

I'm still working on it, not sure if it will ever get many users, but I'm enjoying the process and experience thus far of actually building something myself.

I'd also like to explore more devops-type stuff, where I maybe host this on my own VPS as opposed to relying on other services. We'll see.

Thanks for reading!
