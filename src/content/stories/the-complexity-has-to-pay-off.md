---
title: "The Complexity Has to Pay Off"
name: "Jordan Eldredge"
sidebar:
  role: "Engineer at Meta and open source maintainer"
  introduction: "Jordan works on Relay and GraphQL tooling at Meta, exploring ways to make GraphQL more approachable and practical for developers."
shareText: "When does GraphQL’s complexity pay off? Jordan Eldredge shares what Relay, fragments, and better server tooling can give developers in return."
description: "Jordan Eldredge is a software engineer at Meta, where he works on Relay, and the creator of Grats, which brings implementation-first GraphQL to TypeScript. After joining Facebook with little GraphQL experience, he initially found the technology baffling before discovering ideas in Relay that changed how he thought about data fetching. Here, Jordan explains why GraphQL’s complexity has to pay off - and what fragments, semantic nullability, and better server tooling can give developers in return."
publishedAt: 2026-10-22
recordedAt: 2026-08-04
interviewer: "Jem Gillam"
relatedLinks:
  title: "See the ideas in practice"
  items:
    - title: "The big ideas in Relay"
      url: "https://jordaneldredge.com/big-ideas-in-relay/"
      description: "Watch Jordan explore the techniques behind Relay and the fundamental problems each one is designed to solve."
    - title: "Explore semantic nullability"
      url: "https://rfcs.graphql.org/rfcs/SemanticNullability/"
      description: "See how the proposal separates the nullability of the underlying data from failures encountered while retrieving it."
    - title: "Try Grats"
      url: "https://grats.capt.dev/"
      description: "Explore Jordan’s implementation-first approach to building GraphQL servers from ordinary typed TypeScript code."
    - title: "React Server Components vs. GraphQL"
      url: "https://graphql.org/conf/2026/schedule/ac1946c42298b0ddfaed06e7abdf4776/"
      description: "Watch Jordan examine where the two approaches overlap, where they compete and how they can coexist."
links:
  - label: "GitHub"
    url: "https://github.com/captbaritone"
    username: "@captbaritone"
  - label: "LinkedIn"
    url: "https://www.linkedin.com/in/jordaneldredge"
    username: "Jordan Eldredge"
  - label: "Threads"
    url: "https://www.threads.com/@captbaritone"
    username: "@captbaritone"
  - label: "website"
    url: "https://jordaneldredge.com/"
    username: "jordaneldredge.com"
hero:
  src: "/stories/jordan-eldredge/graphql-conf.jpg"
  alt: "Jordan on stage with a slide showing his love of implementation first GraphQL shown behind him."
  caption: "Jordan presents his implementation first idea while introducing the GraphQL Conf audience to Grats"
github: captbaritone
---

## This is the interesting part

When I joined Facebook, I wasn’t there to work on GraphQL. I joined a team called Nuclide, which was building the company’s internal development environment on top of Atom. When that team dissolved, Facebook was beginning a major rewrite of Facebook.com, moving from an application predominantly rendered on the server with PHP/Hack to one rendered in the browser. I joined the team leading that work and began helping product teams build features for the new site.

I had encountered GraphQL before, but only briefly. I might have experimented with it through a static site generator; I certainly hadn’t used it to build anything substantial. Suddenly, I was working with GraphQL and Relay every day - and I honestly found them baffling. I remember wondering what was going on and how any of it worked.

As I worked on product features, however, I began to look more closely at Relay. It contained solutions to problems I had assumed were simply unavoidable. The more I understood what was happening in that layer of the application, the more interested I became. Before long, I was thinking, “Wait, this is the interesting part!”

I’ve tried to hold on to that first reaction. Once you’ve worked with a technology for years, it becomes difficult to see all the unfamiliar ideas confronting someone who is new. Remembering my own confusion helps me recognize how much GraphQL asks developers to understand before its most powerful ideas become visible.

## Moving the giant lever

Facebook held hack weeks where engineers could step outside their usual teams and try something different. I used one of them—perhaps a little sneakily—to spend time with the Relay team. That hack week became a “hackamonth,” giving me longer to explore the work and giving the team a chance to decide whether I was a good fit. Eventually, I joined Relay properly.

I’ve always been drawn to problems that feel fundamental. Building a product feature can solve an immediate need for a particular group of people. Working on something like Relay gives you the opportunity to improve the way different teams approach the same underlying problems.

I think of it as having access to a giant lever. Because Relay underpins so many product surfaces, even a small improvement to the framework can have a large impact. That was what drew me to the work. The problems were larger than any one feature, and the understanding I developed by working on them felt durable.

<figure data-story-photo>
  <img src="/stories/jordan-eldredge/opera.jpg" alt="Jordan performing as Angelotti in Pocket Opera's 2023 production of Puccini's Tosca" width="1800" height="1200" loading="lazy" decoding="async" />
  <figcaption>Jordan performing as Angelotti in Pocket Opera's 2023 production of Puccini's Tosca. Music and performance remain an important part of his life outside software.</figcaption>
</figure>

## Playing in the same sandbox

I think it’s fair to say that Relay has a steep learning curve, and that GraphQL itself introduces complexity. The moment you add another language to a system, you take on a cost. You’d better be able to demonstrate that you’re providing enough value somewhere else to pay it back.

When people talk about building software at scale, they often mean the number of requests an application handles or the size of its database. The kind of scale that fascinated me at Meta was the number of people: how do thousands of engineers work successfully in the same enormous codebase without surprising or obstructing one another?

Meta has a development culture built around a monorepo and a monolith. That approach has real costs, and many of our internal tools have to be purpose-built for a codebase of that size. It also means thousands of engineers need to be able to play in the same sandbox.

Relay is opinionated because it was designed for that environment. It establishes shared patterns that help developers understand how an application is structured and trust that a change in one place will not have unexpected effects somewhere else. The constraints are part of what allows so many people to build together.

You don’t need thousands of colleagues to benefit from that kind of guidance. Even if you are working alone, you are still collaborating with yourself from six months ago - and that guy was an idiot. A dependable structure protects you from some of the freedom your past self might otherwise have enjoyed.

## Bringing the data with you

One of the clearest benefits of Relay’s structure is data colocation. I think of it as bringing the React component model to data. React challenged the idea that “concerns” should always be separated into different parts of an application. But some things are inherently coupled, and by bringing them together, React allows us to create self-contained components that can be composed into a larger interface.

Before I encountered GraphQL and Relay’s approach to it, data still seemed to sit awkwardly outside that model. You could build a reusable component, but someone higher in the application had to fetch the data it needed. If the component changed, you might have to travel several levels up the tree to find and update the query supplying it.

Relay allows a component to define a GraphQL fragment describing its own data requirements. A component displaying a user profile might declare that it needs a first name, last name, and profile picture. Wherever the component is used, that fragment goes with it, and Relay incorporates its requirements into the query for that part of the application.

> I didn’t know you could solve the problem this way.

At Meta, a component might appear in hundreds or even thousands of places. Without data colocation, adding a profile picture could mean finding every query responsible for rendering that component. With Relay, the requirement belongs to the component itself.
This was one of the ideas that made me think: I didn’t know you could solve the problem this way. The component becomes a genuinely composable unit, carrying not only the interface it renders but a clear account of the data it needs.

To me, this is why you pay the complexity cost of GraphQL. You’re taking on another language and another layer, but in return you get a way to compose data requirements without creating a waterfall of nested requests. When I see GraphQL applications that aren’t taking advantage of fragments in this way, I find myself asking: what are you getting? You’re paying a significant cost without receiving the benefit that makes GraphQL exciting to me.

## When everything can be null

One of my first projects after joining Relay grew out of a frustration I had experienced while working on the Facebook.com rewrite. Our components were full of defensive checks because almost every field they received could potentially be null. I had examples where around half of a component was devoted to null handling.

There’s a good reason for this. GraphQL allows each nullable field to act as an error boundary. If one field encounters an error, the server can still return the rest of the useful data rather than losing the entire response. That makes an application more resilient, but it also creates pressure to make as many fields nullable as possible.

The cost becomes apparent in the component. What is it supposed to do if something as fundamental as a user’s name is null? Relay’s @required directive was our first way of addressing that problem. It allows a component to declare that there is nothing sensible it can do without a particular field and move the handling of that failure to Relay.

Over the following years, conversations with product and infrastructure engineers helped reveal a deeper distinction. Imagine that every user in a system is required to have a username. That is part of the system’s mental model: a user always has a username. The server might still encounter an error while trying to provide it, but that doesn’t mean the username is conceptually optional.

The field is therefore “semantically” non-nullable, even if it remains nullable for the purposes of error recovery. If the schema can express that distinction, an aware client knows that the field should only be null because something has gone wrong. Relay can handle that error separately, while ordinary product code treats the username as the required value the system says it is.

That idea became semantic nullability. It gives the schema a more precise way to describe the data while preserving GraphQL’s granular error recovery.

We could explore ideas like this within Relay and Meta, but we didn’t want them to remain internal solutions. I’ve had the privilege of taking this work into GraphQL’s working groups and developing it openly with people across the ecosystem. Meta supports the idea that this work should be open and shared by default, and the willingness of others to engage with it has been enormously rewarding. I’ve also learned that sharing an idea sometimes requires more than discussing it openly: you need to give people something concrete to experience.

## Making the idea visible

That was how my open-source project Grats began. While we were developing Relay Resolvers, I wanted the API to feel less like constructing a separate GraphQL layer and more like exposing capabilities already expressed in typed application code. A Relay Resolver allows a developer to add a client-defined field to Relay’s GraphQL graph by writing an ordinary JavaScript or TypeScript function and annotating it with the field’s GraphQL definition.

Explaining that distinction proved surprisingly difficult. I could describe the API I thought Relay should have, but without a working example it was hard for other people to see why it would feel different. Building the complete version inside Relay would have been complicated, so I created a proof of concept on the server instead. That project became Grats.

> The implementation is the source of truth.

With Grats, you write resolver functions as ordinary TypeScript and add lightweight annotations to indicate which parts should be exposed through GraphQL. Grats statically analyzes the code and its TypeScript types, then extracts an executable GraphQL schema from them. The implementation is the source of truth; you don’t separately declare a field and then write another piece of code that implements it.

As I built it, I realized that Grats could demonstrate something larger than the Relay API I had originally imagined. Meta’s GraphQL server works in a similar way, but it is written in Hack and tightly connected to Meta’s internal systems. It’s not something we can simply release as a general-purpose open-source server. Grats offered a tangible example of that development style for the TypeScript ecosystem.

As I worked on Grats, I realized there was also a vocabulary problem. At the time, GraphQL server development was often presented as a choice between two competing approaches: schema-first or code-first. With schema-first development, you write the schema in GraphQL’s Schema Definition Language and then separately implement its fields in your application code. With code-first development, you use an API in your application’s programming language to construct the GraphQL schema instead.

However, many code-first tools still require developers to write GraphQL-specific schema-building code and then connect it to the functions that implement those fields. When I described Meta’s approach as code first, people understandably assumed I meant that. I was trying to describe something different, but the existing terminology kept getting in the way.

I coined the term “implementation-first GraphQL” to give that approach its own name. In an implementation-first system, the ordinary typed function that implements a field is also the source of its GraphQL definition. You annotate which parts of the application should be exposed, and the GraphQL library infers the corresponding field names and types from the implementation. Grats brought that approach to TypeScript and gave me a concrete way to show people what I meant.

It’s been gratifying to see both the idea and the term “implementation-first GraphQL” begin to percolate through the ecosystem, with other tools using it to describe how they work. People are beginning to recognize that this is a meaningfully different way to build GraphQL servers.

## A vocabulary for what comes next

I think every application needs a consistent model of its world, for example, “There are users, users belong to groups, and they might have particular roles within those groups.” The details will vary between products, but the same concepts and rules need to make sense across a website, a mobile app, an email, or a report.

That logic needs to live somewhere that isn’t tied to any one interface. I don’t think of it as a GraphQL layer. It’s the application’s model layer, and GraphQL provides a view onto it. The schema shouldn’t automatically expose everything in that layer; it should describe the capabilities the server has deliberately made available.

> The specification binds us and yet decouples us at the same time.

This distinction helps me think about technologies such as React Server Components. If your server is written in JavaScript or TypeScript and provides data to a web application, Server Components can offer a meaningfully simpler developer experience. GraphQL can bring a build step, generated types, and a degree of opacity; if you can avoid those costs in a particular application, that’s worth considering. But most substantial applications eventually have other consumers: mobile apps, background jobs, reports, and perhaps AI agents. GraphQL earns its place as a general-purpose interface to the same underlying model.

GraphQL also gives us a shared language for discussing how these pieces fit together. At Meta, there isn’t one central GraphQL team. The server, Relay, and the native clients are developed by different teams that can explore ideas independently while remaining compatible. The specification binds us and yet decouples us at the same time. When we need to agree on how those systems should work together, it gives us a place to have that conversation.

That’s also something I value in the wider GraphQL community. There are so many people who are passionate about different things, and it’s so cool to hear someone else’s perspective and think, “What? I disagree with you.” Then they say, “Yeah, let’s talk about it.” This is such a beautiful community.
