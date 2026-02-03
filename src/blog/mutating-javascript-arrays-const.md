---
title: "Mutating JavaScript Arrays set with const"
description: "Mutation of JavaScript arrays with const variables"
date: 2025-08-29
tags: ["javascript", "programming"]
---

Something simple which I've often missed when setting up JavaScript arrays is that if you plan to mutate the array (e.g. with `.push()` or `.pop()`) you can still set the array as `const` to make intentions clear about reassignment. 

`const` simply sets the fact that a variable cannot:
- Have any value re-assigned
- Have the const be re-declared with a different value (inside the same scope)

This is a pretty interesting behaviour to keep in mind as "const" might to some people feel synonymous with "immutable", when this isn't actually the case.

Thanks to `deno-lint` for making me realize this!