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
> You can edit file `./src/index.ts` to change patterns to execute using `DesignPatternsManager` class
>
> 1. Get class instance
> ```ts
>   const managerLogger = new ConsoleLogger('DesignPatternsManager')
>   const queueLogger = new ConsoleLogger('Queue')
>
>   const manager = new DesignPatternsManager(
>     managerLogger,
>     new Queue<ReturnType<PatternUseCase>>(new Runner(queueLogger)),
>     new Runner(managerLogger)
>   )
> ```
> 2. Run patterns
> ```ts
>   // Run all patterns
>   await manager.runAll()
>
>   // Run specific pattern
>   await manager.run(manager.getPatterns().SINGLETON)
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

### Creational Patterns 🏭

* Singleton

Restricts a class from instantiating multiple objects. It creates a single instance of a class and provides a global point of access to that instance.

<p align="center">
  <img src="./assets/images/umls/singleton.png" width="200">
</p>

* Factory

Provides a way to create objects without specifying the exact class of object that will be created. It defines an interface for creating objects, and lets subclasses decide which class to instantiate.

<p align="center">
  <img src="./assets/images/umls/factory.png" width="350">
</p>

* Abstract Factory

Provides a way to create families of related objects without specifying their concrete classes. It defines an interface for creating objects, and lets subclasses decide which classes to instantiate and how to create them.

<p align="center">
  <img src="./assets/images/umls/abstract-factory.png" width="450">
</p>

* Builder

Separates the construction of complex objects from their representation. It allows you to construct objects step-by-step, and provides a way to create different representations of the same object.

<p align="center">
  <img src="./assets/images/umls/builder.png" width="450">
</p>

* Prototype

Allows you to create new objects by copying existing objects, without making your code dependent on their classes. It provides a way to create objects that are initialized with values from another object.

<p align="center">
  <img src="./assets/images/umls/prototype.png" width="400">
</p>

### Structural Patterns 🧩

* Adapter

Allows two incompatible objects to work together by converting the interface of one object into an interface expected by the other object.

<p align="center">
  <img src="./assets/images/umls/adapter.png" width="400">
</p>

* Bridge

Separates an object's abstraction from its implementation, allowing them to vary independently, favoring greater flexibility and extensibility.

<p align="center">
  <img src="./assets/images/umls/bridge.png" width="400">
</p>
