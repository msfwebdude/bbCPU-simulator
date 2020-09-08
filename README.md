# bbCPU-simulator
Simulation of breadboard computer components based on Ben Eater's breadboard computer I built

## Rational for project
This project has two purposes, things I wanted to experiment with, that I had not had too much deep dive experience with:
* I wanted to play around with classes in JavaScript and inheritance
* I was also wondering if the `EventTarget` class ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)) could be extended to allow me to dispatch events with custom events.

## Try it out
Click [here](http://firoved.com/github/bbCPU-simulator/) to play with it.

## CPU Registers
Central processing units have registers, or immediate memory locations that can be used with instructions. For example the instruction `LDA` Loads a value into register A. 

There are a few different registers in this project. 
* A Register - an immediate storage of an 8-bit number 0-255
* B Register - another immediate storage of an 8-bit number 0-255
* Instruction Register - which would hold the next instruction to be held

## Caveat
I wont go into how to use the cpu, at this time, as it is a copy of what is shown on [YouTube](https://youtu.be/AwUirxi9eBg)
