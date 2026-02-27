---
title: "Delta time made simple"
description: "Why do we need delta time to create consistent game behaviour?"
date: 2025-03-10
tags: ["gamedev", "programming"]
---

Delta time = time elapsed since the last frame of execution.
Simple! Pack it up boys!

Really though, it's a bit more complicated than that.

Delta time is a way to make behaviour consistent across different framerates in games. This can be difficult to visualize, or wrap your head around at first.

Let's get into what happens when you don't use delta time, and how we can use it.

## Computers running at different frame rates

Let's take a look at an example of what happens when we try to move a character across a screen without using deltatime, and just using raw pixel values.

Let’s say you have a computer running at 60 FPS.

You want to move your character from the bottom to the top of the screen, and when the arrow up key is pressed, your character moves 10 pixels up. The screen is 100 pixels tall.

Let’s do some math quickly.

Our computer can run our game at 60 FPS, so this means every second, our game updates 60 times (60 fps).

So in between each frame there is 1 (second) / 60 (frames) = ~0.01667 seconds. This means in your game loop, the game runs, and every 0.01667 seconds it will check the game loop again, and make any updates to your game state.

A user presses an up arrow key, and the character moves 10 pixels up. One frame passes One frame passes (0.01667 seconds), and the user is still pressing the key, so the character continues going up the screen.

As our screen is 100 pixels tall, and the character is moving 10 pixels at a time, this repeats until it hits the top of the screen - aka after 10 * 0.01667 = 0.1667 seconds.

Now let’s do the same calculation with a game running at 30 FPS.

This game is actually technically running slower, as every second, our game only updates 30 times (30 fps).

This means that there is a new frame of gameplay every 1 (second) / 30 (frames) = 0.03333 seconds.

The same happens again - a user presses a key to go up the same amount of pixels, but it takes them 0.03333 seconds to go up 10 pixels.

This repeats until the character hits the top of the screen - aka after 10 * 0.03333 = 0.3333 seconds.

So this means for a character to travel the same amount of distance on screen, it actually takes *double* the time on the slower computer.

This isn’t good as we want our gameplay to be consistent no matter what the frame rate is.

## So where does delta time come into this?

Delta time is simply the time between each frame - on computer one it will be the 0.01667 seconds we calculated, on computer 2 it will be 0.03333 seconds.

We use this to create consistent behaviour in a game.

Going back to our movement example, our implementation is wrong. We cannot move a character a flat amount of pixels across the screen if we want continuous movement across different frame rates.

So to solve this, we can't use a flat number. We have to use a simple equation which you might remember from physics:

distance = speed × time

So we don't have a flat distance to move, the distance the character moves is instead determined by a speed and time.

In this equation, we already have time - it's delta time. It's the time in between each frame. So now we set an arbitrary number, say 200, and multiply this by delta time to create our own movement distance.

Instead of a flat "move 10 pixels when the key is pressed", we say "move 200 * delta time when the key is pressed". So for computer 1, this would be 200 x 0.01667 = 3.34 *pixels* per frame upwards. For computer 2, this would be 200 x 0.03333 = 6.666 pixels per frame.

Now, after the same period of time, each character will reach the top of the screen at the same time. As the faster computer executes more frequently it moves a smaller distance, while computer 2 moves a larger distance as it executes more slowly.

It also means if a game's frame rate changes, gameplay will still remain consistent, as it will just pull the delta time since the last frame.

So this is why delta time is used in video games.

I hope you enjoyed!
