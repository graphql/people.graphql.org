---
title: "Working it out in public"
name: "Eddy Nguyen"
sidebar:
  role: "Maintainer of GraphQL Code Generator and GraphQL Ambassador"
  introduction: "Through his work with The Guild, Eddy helps shape the tooling that developers rely on to build with GraphQL."
shareText: "Eddy Nguyen on maintaining GraphQL Codegen, learning in public, and the people behind open source."
description: "Eddy’s first open-source contribution was a one- or two-line fix to GraphQL Code Generator (Codegen). He now maintains the project, developing ideas with the people who use and contribute to it while sharing the questions, mistakes, and learning that shape his work."
publishedAt: 2026-10-22
recordedAt: 2026-08-14
interviewer: "Jem Gillam"
relatedLinks:
  title: "Work it out together"
  items:
    - title: "Explore GraphQL Code Generator"
      url: "https://the-guild.dev/graphql/codegen"
      description: "See how Codegen turns schemas and operations into typed code for clients and servers."
    - title: "Discover Client Preset v6"
      url: "https://the-guild.dev/graphql/hive/blog/graphql-codegen-client-v6-202604"
      description: "Read Eddy’s guide to the major overhaul that produces less generated code, more accurate types and a simpler setup."
    - title: "The biggest change to Codegen in ten years"
      url: "https://graphql.org/conf/2026/schedule/dcd9017f3882e90a2afbdc44893441cd/"
      description: "Watch Eddy and Igor explain how real-world constraints, open discussion and trust shaped the new client-focused approach."
    - title: "Join the GraphQL conversation"
      url: "https://discord.graphql.org/"
      description: "Ask questions, share what you’re building and learn alongside other members of the GraphQL community on Discord."
links:
  - label: "GitHub"
    url: "https://github.com/eddeee888"
    username: "@eddeee888"
  - label: "LinkedIn"
    url: "https://www.linkedin.com/in/eddeee888/"
    username: "Eddy Nguyen"
  - label: "X"
    url: "https://x.com/eddeee888"
    username: "@eddeee888"
  - label: "YouTube"
    url: "https://www.youtube.com/@eddeee888"
    username: "@eddeee888"
hero:
  src: "/stories/eddy-nguyen/graphql-conf.jpg"
  alt: "Eddy presenting slides about CodeGen."
  caption: 'Eddy presenting "Building the ideal GraphQL server workflow featuring GraphQL Code Generator" at GraphQL Conf 2025.'
github: eddeee888
---

## When the release failed

I had a very clear date in mind for Client v6, a major redesign of GraphQL Code Generator’s client-side type generation. Codegen generates types and other code from a GraphQL schema and operations, taking away much of the work developers would otherwise have to do by hand.

This was a huge release. We had around 50 pull requests and 30,000 lines of changes, all kept on a separate feature branch until we were ready. When I finally merged that branch, the release failed.

The release tooling was making so many requests to GitHub that we hit its rate limit! I had to modify my local version of the tool to reduce those requests, get everything through the first stage, and then release it manually. Even after all our testing, people began finding use cases that didn’t quite work once the release was out.

I was very nervous. I wanted to make that deadline, but there are always things you can’t foresee.

Before I contributed to open source, I imagined maintainers as god-level wizard programmers. They could flick their fingers and make things happen. Once I began looking behind the scenes, I realized that maintaining a project was much more recognizable: structure the code well, write tests, communicate with people, and work through problems as they appear.

It turned out that maintaining open source isn’t a magic show, it’s just people writing code.

## Learning to trust the schema

My path into GraphQL began around 2017, when I joined 99designs. The team had recently started using GraphQL and had built gqlgen, a Go library that generates server-side code from a GraphQL schema. It could take care of much of the boilerplate so that we could focus on writing the application logic.

The schema itself was unfamiliar to me. It seemed like a document full of definitions, and I had to understand how that document became connected to the code we wrote. This was around the time that more web developers were moving from JavaScript to TypeScript, while languages such as PHP were developing stronger type systems. GraphQL could carry type information through to both the frontend and backend.

Once I understood that connection, working with the schema began to feel natural. I learned to trust the types and the tooling around them, which made it easier to build quickly and feel confident in the resulting code.
I also began to see the schema as a way to model a system. If we had a user in the schema, that user represented the same idea across different parts of the business. It gave us a shared definition where those ideas might previously have become fragmented.

> For me, the schema is the most important part of GraphQL, even more than the query itself.

That early experience still shapes how my team approaches GraphQL. We try to design the schema at the beginning of a project because it provides the contract between the client and the service. The schema models the business domain, which usually changes less often than the implementation around it. Thinking through that model early can reduce disruptive changes later; For me, the schema is the most important part of GraphQL, even more than the query itself.

## One or two lines

One of the tools I found while experimenting with GraphQL was Codegen. While my new team at 99designs was building a page, I noticed that one of the generated types didn’t match what happened at runtime. I opened the Codegen repository to understand where the difference came from and found that the fix was only one or two lines.

The project was easy to follow, and there were tests I could use to check the change. Dotan, the creator, helped me through the contribution process and once the fix was released I could bring it straight back into my own work.

That was my first open-source contribution. It was a small change, but I enjoyed the experience of working through a problem with people outside my own team. Since then, I’ve encouraged other engineers I work with to find something they can contribute to, or to publish something of their own. A contribution can begin with a problem you already understand from your everyday work.

## Before writing the plugin

Most things I create begin with a problem at work or some kind of frustration. At SEEK, we were already using Codegen in our Node.js stack. It was useful, but I remembered how much gqlgen had generated for me on the backend at 99designs. It could generate types and runtime code together, giving me a more complete backend workflow. I wanted to explore whether a similar workflow was possible in TypeScript.

I already had an idea of how I wanted that workflow to look, but it was quite different from the way my team was working. Before building the plugin, I started showing the idea to other people and asking whether it made sense to them. We worked through the details together until the approach felt about 80% formed.

I then built the plugin and introduced it within my team. Later, as I worked more closely with Uri and The Guild, we used it in The Guild’s Hive Console codebase and shared the approach more widely. Other people began finding that it solved problems in their workflows too. The original frustration came from my own work, but discussing the workflow early helped the plugin become useful beyond my team.

## Working across timezones

That way of working became especially important when Igor from Yelp got in touch. He had started discussions on GitHub about helping people migrate from Apollo tooling to Codegen. The differences might be manageable by hand in a small codebase, but at Yelp’s scale they represented a significant amount of manual work.

GitHub discussions could be difficult to follow. Questions sometimes needed more context, and the delay between replies made it easy to lose track of an important detail. The Guild already had a relationship with Yelp, so Igor moved the conversation into a shared Slack channel.

With Igor in Canada and me in Australia, most of our collaboration happened asynchronously in one long discussion thread. We left ideas for each other, developed them further, and kept the parts that worked for both of us.
At the same time, I had published a proposal outlining changes I already wanted to make to Codegen. Martin and Jerel from Apollo had shared feedback and related work with me, and helped confirm that the direction made sense. That work also happened to unblock what Igor was trying to do.

Igor’s initial design reflected Yelp’s codebase and migration needs. As we worked through the API and even the names of individual pieces, we found ways to support Yelp while making the design useful to other Code Gen users. The collaboration became a large part of Client v6 - the release I had been so nervous to push - and made the result broader than the one I had originally planned.

<figure data-story-photo>
  <img src="/stories/eddy-nguyen/park-photography.JPG" alt="Eddy enjoying time away from the computer." width="1800" height="1200" loading="lazy" decoding="async" />
  <figcaption>Eddy enjoying time away from the computer.</figcaption>
</figure>

## Public by default

On another occasion, we changed a Codegen API without understanding how many users it would affect. We hadn’t communicated the change clearly, so the scale only became apparent when issues began arriving. People were already dealing with the consequences of a decision we had made.

Uri and the rest of The Guild had encouraged me from early on to post ideas and share progress. That mistake gave “public by default” more weight for me. If our work affects other people, I think we have a responsibility to explain our decisions and own the mistakes we make.

The same openness shapes how I learn. When I began exploring GraphQL Federation for my work on Codegen, I recorded videos while I was still figuring it out. Being new to the subject meant I could see the intermediate steps I needed to make sense of it. Explaining those steps reinforced what I was learning, while recording the process could help somebody who later approached Federation with the same questions.

Publishing the videos also gave people an opportunity to correct me. If somebody cared enough to explain what I had misunderstood and how I could describe it better next time, I appreciated that conversation. Their perspective might change my direction or help me develop the idea further.

I asked a lot of questions about Codegen before I began working with The Guild, and those conversations didn’t stop when I became a maintainer. Codegen has been shaped by many contributors over many years. When I work on a feature somebody else designed, I can ask them about the use cases and decisions that shaped it, then carry that context into whatever we do next.

I’ve benefited from having people I can learn from, and I want my videos to give others somewhere to begin. My first contribution began with one type that didn’t look right and people who were willing to help me understand it. If showing what I’m learning, including the mistakes I make along the way, gives somebody else a useful place to begin then I want to keep doing it!
