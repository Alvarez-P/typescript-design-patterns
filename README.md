<h1 align="center">
  DESIGN PATTERNS IN <img src="./assets/images/typescript.png" width="30">
</h1>

### Overview 🤔

This project is a design patterns compilation with examples in Typescript.

## Getting Started 🚀

To execute patterns must be:

* Install dependencies:
```sh
pnpm i
```

* Run command:
```sh
pnpm run dev
```

> [!TIP]
> You can edit file `./src/index.ts` to change patterns to execute using `DesignPatternsRunner` class
>
> 1. Get class instance
> ```ts
>   const runner = new DesignPatternsRunner(
>     new Queue<ReturnType<PatternRunner>>(new ConsoleLogger('Queue')),
>     new ConsoleLogger('Runner')
>   )
> ```
> 2. Run patterns
> ```ts
>   // Run all patterns
>   await runner.runAll()
>
>   // Run specific pattern
>   await runner.run(runner.getPatterns().SINGLETON)
> ```
>

## Definitions 📚

A design pattern is a general, reusable solution to a common problem in software design. It is a description of a set of interacting objects and their relationships, as well as the rules and guidelines for their use.

Characteristics

* Reusability
* Abstraction
* Modularity
* Flexibility

Classification

* Creational
* Structural
* Behavioral

### Creational Patterns

**Factory**

**Abstract Factory**

**Builder**
