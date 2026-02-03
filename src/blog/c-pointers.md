---
title: "Understanding Pointers"
description: "Notes on Pointers from Beej's Guide to C"
date: 2025-03-01
tags: ["c", "programming", "tutorial"]
---

*These are my notes on pointers in C, mostly from reading [Beej's Guide to C Programming](https://beej.us/guide/bgc/).*

Okay so when you initialize a variable, prefixing it with `*` designates it as a pointer to a variable of a certain type.

E.g. `int *p` would be a variable `p`, which holds a pointer to an int variable. As it holds a pointer variable, it needs to store a valid memory address. For example, if I have a variable `i` with the value 10, I can't just put that in `p`. I have to use the `&` operator which gets the memory address of `i`.

So therefore `int *p = &i` basically stores the memory address of `i` into the variable `p`.

The `*` can also be used to dereference variables - in other words, get the value stored at a certain memory address. This memory address is a virtual memory address - not a physical location in RAM. The virtual address is then mapped to an actual physical location at the OS level (from what I understand).

So let's see this in an example.

```c
printf("The memory address of p is %p", p);
printf("The value stored at the memory address is %d", *p);
```

So the first print statement, we use the `%p` format replacement and pass in `p` directly, which gives us the memory address. Instead when we prefix it with `*` it "dereferences the pointer", in other words it gets the value stored at memory address in `p`. As this is an int, we change our format replacement thing with `%d`.

Okay so what's the point of pointers?

Let's take a traditional function scenario.

Functions in C cannot modify values outside of it. If you pass in a variable `a` to a function, it actually passes a copy of a. Therefore if you do `a = a + 1`, it will return a brand new value. It will not affect `a` outside of the function.

So, what about pointers?

Well if you pass a pointer to a function, similarly it will pass a copy of a pointer.

However unlike us just copying the value, we are actually getting the exact memory address for the data stored in `a`.

This means we can use this address to dereference it and perform adjustments to it inside of a function, and affect it outside of the function.

When I manipulate a value inside of this function, I am manipulating it with `*`. So this means I am actually getting the value stored at the address and directly manipulating it.

Null pointers are basically pointers which contain `NULL` as a value. Null like in most other programming languages represents the absence of a value. In C, it seems like this acts like a special value. For example doing `int *p = NULL;` isn't really assigning any value - `NULL` is not a memory address pointing to a value of type int as it suggests, so this is what makes it a special kind of value. It is used to create a pointer which points to "nothing".
