# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Points to improve the codebase

1. Funtional component approach
   I don't want why functional component has more advantages over class based one, but in general.
   it has many benefits like clean, less, readable code with performance benefit and less side-effects.
   For downside, it doesn't have lifecycle methods but I noticed that you didnt use any special lifecycle methods in your code,
   so it won't be problem for simple ones like componentDidMount, componentDidUpdate since they can be done with useEffect.

2. Breaking into multiple components instead of one big component.
   Actually I was going to split the component with functional components, but it is a bit hard since it has complicated logic inside.
   But if I get to know the business logic side, it is not a big deal.
   So components should be separated into smaller ones like below:
   e.g.

   - presentational component and layout component.
   - stateless component and stateful component

3. There are some code not well writen, actually Javascript has many builtin functions, esp ES6, so if we use that well, codebase can have less amount, optimized, organized. I think the developer is quite fan of switch statement, of course, it is more readable but huge code with pretty straightforward logic sometimes. Using array related functions tactfully will help you write less, clean code. (Ref. Utils/index.js)

4. Lastly, I don't mention typescript here even if it basically help you in many aspects, but it requires developers with more knowledge and experience on that and for your team and startup situation, it is suitable I guess.
