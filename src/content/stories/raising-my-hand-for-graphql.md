---
title: "Raising my hand for GraphQL"
name: "Jeff Auriemma"
sidebar:
  role: "GraphQL Foundation Governing Board Chair and GraphQL Ambassador"
  introduction: "Jeff manages GraphQL engineering teams at Apollo and helps guide the wider GraphQL community through his work with the Foundation."
shareText: "Jeff Auriemma on discovering GraphQL in the quiet hours, designing for people, and helping more people shape its future."
description: "Jeff Auriemma is an engineering leader at Apollo, chair of the GraphQL Foundation’s Governing Board and a GraphQL Ambassador. Here, he tells the story of discovering GraphQL late at night while raising a young family, designing software around the people who use it, and helping more people shape GraphQL’s future."
publishedAt: 2026-10-22
recordedAt: 2026-07-20
interviewer: "Jem Gillam"
relatedLinks:
  title: "Raise your hand"
  items:
    - title: "Take part in a GraphQL Working Group"
      url: "https://graphql.org/community/contribute/project-meetings/"
      description: "Join the public meetings where the specification, official projects and newer initiatives are developed."
    - title: "Become a GraphQL Ambassador"
      url: "https://graphql.org/community/ambassadors/"
      description: "Learn about the program supporting people who teach, organize, create content and contribute to the GraphQL community."
    - title: "Start a GraphQL Local"
      url: "https://graphql.org/community/foundation/local-initiative/"
      description: "Get Foundation support for building a GraphQL community in your city or region."
    - title: "Support the Foundation"
      url: "https://graphql.org/community/foundation/join/"
      description: "Find out how individuals can join the GraphQL Specification for free, or how organizations can become members of the GraphQL Foundation."
links:
  - label: "BlueSky"
    url: https://bsky.app/profile/jeff.auriemma.xyz
    username: "@jeff.auriemma.xyz"
  - label: "GitHub"
    url: "https://github.com/bignimbus"
    username: "bignimbus"
  - label: "LinkedIn"
    url: "https://www.linkedin.com/in/jeffreyauriemma/"
    username: "Jeff Auriemma"
  - label: "website"
    url: "https://jdauriemma.com/"
    username: "jdauriemma.com"
hero:
  src: "/stories/jeff-auriemma/graphql-conf.jpg"
  alt: "Jeff on stage with a microphone."
  caption: 'Jeff presenting "What Is the GraphQL Foundation?" at GraphQL Conf 2025.'
github: bignimbus
---

## In the quiet hours

My now-middle child was still a baby when I discovered GraphQL. It was 2018, during a period when it felt as though we were rethinking the best way to build an application every six months. It was an exciting time to be a developer: whenever something new began to catch on, I wanted to understand it and get my hands on it.

Apollo Client reached me first. I was working heavily with React and a Ruby on Rails backend, and GraphQL immediately felt like a better way to make an application. I found Graphcool, which later became Prisma, and loved how quickly I could turn an idea into something real.

Those experiments fit naturally around family life. When my daughter inevitably woke me during the night, GraphQL gave me something enjoyable to return to in the quiet hours. I made proof of concept after proof of concept, partly because I wanted to understand the technology, but mostly because it was simply fun to use.

> I am in the business of making things for people to use. GraphQL brings us closer to the needs of those people

I knew almost immediately that GraphQL was important. There has been plenty written about its advantages and disadvantages since then, and I would never pretend that adopting it requires no investment. But I am in the business of making things for people to use. GraphQL brings us closer to the needs of those people, and once that clicked for me, there was no looking back.

At my next job, I finally had the opportunity to use GraphQL in production. Seeing something that had begun as a nighttime experiment become part of how we built real software was a genuine thrill.

## The human side of software

As GraphQL moved from personal projects into production, my own role in software was changing too. Before becoming a developer, I had worked as a musician and a teacher. Software itself had begun as another hobby. It was something I did because I enjoyed it. But eventually it became the work I was paid to do.

My first engineering management role arrived through circumstance. I was working at Opternative, a telehealth startup now known as Visibly, and we needed to bring in and support a significant number of new engineers. The structure we had could no longer accommodate that growth, so I was asked to become the company’s first manager besides the CTO.

I had already found myself teaching within the team, running lunch-and-learns about React and, if memory serves, GraphQL too. Moving into management felt like a natural transition. Managing a classroom and managing a software team are obviously different, but some of the same skills came back to me: helping people understand something unfamiliar, paying attention to what each person needs, and creating the conditions in which they can do good work.

I’ve always been drawn to the human side of software development. Once my ability to build and ship software reached a certain level, leadership opportunities seemed to follow. I have moved back and forth between management and individual-contributor roles ever since, and I wouldn’t have it any other way.

## Begin with the dream query

That pull toward the human side of software also shapes how I think about GraphQL itself. One of my strong opinions is that schema-first remains the purest way to design a GraphQL API. Code-first approaches are perfectly valid, but I keep returning to schema-first because it encourages teams to design the API from first principles.

It has also helped me recognize a mistake I continue to make myself. I can get into my own head about the ideal representation of a business object. I start asking: ‘What is this object really, and how should I model it?’ ‘What is the Platonic ideal of a User?’ That kind of thinking has some value, but it can quickly take over the design. The schema begins to resemble a SQL database model, organized around internally perfect objects and their relationships.

The way out is to begin with the dream query. What are users, clients or agents actually trying to ask for, and what shape do they need the answer to take? That demand profile has to inform the schema first and foremost. When I lose sight of it, I tie myself in knots and create performance bottlenecks that could have been avoided.

## Preserving what works, making room for what comes next

Schema design is one part of a larger question: What makes a healthy GraphQL ecosystem? To me, it is a place where good ideas can find their way to users and the tried and true can be preserved.

Years after Apollo Client gave me my first way into GraphQL, I find myself working at Apollo and chairing the GraphQL Foundation’s Governing Board. I now see GraphQL from both a company perspective of building products around it, and from the nonprofit responsible for its open governance.

GraphQL is still sometimes described as a Facebook technology, but that hasn’t really been true for a long time. Facebook open-sourced GraphQL in 2015, and since 2019 the GraphQL Foundation has operated under the nonprofit Linux Foundation, with governance representing companies and interests from across the ecosystem. You’ll also sometimes hear GraphQL described as an Apollo technology. I’m extremely proud of the role Apollo has played in GraphQL’s growth, but there’s an important distinction here: Apollo and other companies build tooling and infrastructure around GraphQL. They don’t own the core technology. GraphQL itself is an independently governed open-source standard.

> GraphQL’s many implementations create a wonderful, productive marketplace of ideas.

From where I sit, the relationship is harmonious. Companies benefit from investing in openly governed technology, and that investment helps fund the specification, cooperative development and community activity. The work strengthens the ecosystem those companies rely on. But this is still a challenging moment.

GraphQL’s many implementations create a wonderful, productive marketplace of ideas. Different tools solve the same problems in different ways. One might pioneer a particularly ergonomic approach whilst another might bring GraphQL to a new framework or community. Those ideas can influence one another across languages and tooling. The original specification also gave us a remarkably strong foundation. If the open-source specification published in 2015 were the only version available today, people could still build useful production systems with it. We could quibble over a few things, but nothing would grind to a halt.

That strength matters in the age of AI. An excellent specification gets you most of the way to a good prompt, which can make any particular language implementation feel more like an implementation detail. I think GraphQL is uniquely suited to this era, yet it gets perhaps 10% of the attention it deserves from agentic developers and AI practitioners. Bringing GraphQL to that community is the highest priority, and I am excited by the possibilities.

In order for that to happen, I think the twin pillars of the technical and community side of the GraphQL ecosystem need to move with greater urgency on spec innovations and driving adoption from a new generation of developers.

## Looking under the rock

Whatever comes next, open governance gives us a way to help shape it. People have confidence in a technology with an open governance structure, especially when it is supported by many different businesses and interests. But when you look under the rock of almost any open-source project, you will usually find a relative handful of people keeping it moving. That is absolutely true of the GraphQL Foundation.

There is a small group at its core, supported by many others who contribute their time and resources whenever they can. Behind the scenes, it has the same dynamics as any small organization: people wear several hats; things are remembered and forgotten in equal measure; new energy gathers around some projects while others have to sit on the back burner.

That reality creates a real need for more people to join in and move GraphQL in the directions they care about. You might be surprised by how small the core operation is, but you might also be delighted by how much difference somebody can make with only a few hours of their time each month.

<figure data-story-photo>
  <img src="/stories/jeff-auriemma/all-hands.jpg" alt="Jeff on stage at the 2025 GraphQL All Hands" width="1800" height="1200" loading="lazy" decoding="async" />
  <figcaption>Jeff inviting community members to join the GraphQL working groups at the GraphQL Foundation All Hands 2025.</figcaption>
</figure>

## Don’t be too precious

The Ambassador program is one way the Foundation is trying to look outward, connecting its work on the specification and governance with people maintaining tools, teaching developers, organizing events, and building GraphQL communities around the world.

People have repeatedly told us they want more GraphQL content and more public discussion. I decided one way I could contribute was by making videos. It felt like the kind of thing that was “on the tin” when I became a GraphQL Ambassador: furthering the cause of GraphQL and bringing more people into the conversation. I chose video because so many developers now encounter ideas through video feeds. I wanted something immediate and authentic: a place to share ideas already being discussed in the community, think out loud and work out what I believe, without a huge production process around it.

I committed to publishing a video every business day. The most important skill I am developing is precise prioritization: deciding what matters, limiting how long I spend editing and, above all, not being too precious. I hope the quality continues to improve and that I can build enough of a backlog to think a week ahead rather than a day ahead. First, I needed to prove that I could keep showing up!

## More hands raised

When I look at the GraphQL community today, what gives me confidence is how many new people are raising their hands. We have more volunteers than I have seen at any other point since I became involved in the community. People are running GraphQL Locals, representing GraphQL at booths and conferences, and applying for Foundation grants. Ambassadors are using new travel funding to bring GraphQL to events and communities that the Foundation might otherwise struggle to reach.

We are also seeing people gather around new areas of work. The Community, Composite Schemas, OpenTelemetry and GraphQL AI Working Groups all began because somebody saw an opportunity and was willing to help move it forward. Volunteers have been able to turn the Foundation’s funding into real activity across both the technical and community sides of GraphQL.

That is what I am most proud of. All of this makes me proud because it reveals how much passion there still is for GraphQL, and how many people are willing to spend their valuable time moving it forward.

Seeing more of those people raise their hands makes me more optimistic about GraphQL than I have ever been.
