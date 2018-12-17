Wasync.js
=========

Asynchronous programming in JS is its strength but also the source of a
lot of frustration and headaches. This library aspires to provide tools
to better cope with the asynchronicity of this world.


## Modules

The aim of this package is to provide different modules that deal with
different aspects of asynchronicity.

### [Async Debounce](doc/debounce.md)

Instead of directly reacting to user events to control async function (that
might do stuff like getting a result from the API), you can use this pattern
to make sure not to call your function in parallel and stay responsive.

[Read more](doc/debounce.md)
