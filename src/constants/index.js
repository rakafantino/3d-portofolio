import {
  meta,
  shopify,
  starbucks,
  tesla,
} from "../assets/images";
import {
  contact,
  css,
  estate,
  express,
  git,
  github,
  html,
  javascript,
  linkedin,
  mongodb,
  motion,
  nextjs,
  nodejs,
  pricewise,
  react,
  redux,
  snapgram,
  summiz,
  tailwindcss,
  threads,
  typescript,
} from "../assets/icons";

export const skills = [
  {
    imageUrl: html,
    name: "HTML5",
    type: "Frontend",
  },
  {
    imageUrl: css,
    name: "CSS",
    type: "Frontend",
  },
  {
    imageUrl: tailwindcss,
    name: "Tailwind CSS",
    type: "Frontend",
  },
  {
    imageUrl: javascript,
    name: "JavaScript",
    type: "Frontend",
  },
  {
    imageUrl: typescript,
    name: "TypeScript",
    type: "Frontend",
  },
  {
    imageUrl: react,
    name: "React",
    type: "Frontend",
  },
  {
    imageUrl: nextjs,
    name: "Next.js",
    type: "Frontend",
  },
  {
    imageUrl: nodejs,
    name: "Node.js",
    type: "Backend",
  },
  {
    imageUrl: express,
    name: "Express",
    type: "Backend",
  },
  {
    imageUrl: redux,
    name: "Redux",
    type: "State Management",
  },
  {
    imageUrl: motion,
    name: "Motion",
    type: "Animation",
  },
  {
    imageUrl: git,
    name: "Git",
    type: "Version Control",
  },
  {
    imageUrl: github,
    name: "GitHub",
    type: "Version Control",
  },
  {
    imageUrl: mongodb,
    name: "MongoDB",
    type: "Database",
  },
];

export const experiences = [
  {
    title: "Fullstack Developer (Freelance)",
    company_name: "Meraki Warna Teknologi",
    icon: meta,
    iconBg: "#10b981",
    date: "May 2025 - Present",
    category: "tech",
    points: [
      "Led full-cycle development for numerous client projects, managing front-end and back-end architectures.",
      "Built scalable API services using Node.js/Express/Hono with serverless PostgreSQL solutions (Supabase and Neon).",
      "Delivered responsive, high-performance web applications leveraging React.js, Next.js, and TypeScript.",
      "Winner of Pan-SEA AI Developer Challenge 2025 - Education Path Certification by AI Singapore.",
      "Winner of Google Gemma 3n Impact Challenge - The Ollama Prize on Kaggle.",
    ],
  },
  {
    title: "Frontend Developer (Software Engineer)",
    company_name: "Loka Mining",
    icon: tesla,
    iconBg: "#06b6d4",
    date: "May 2024 - May 2025",
    category: "tech",
    points: [
      "Developed Roshambo Multi-Chain Game (ICP/BTC/Solana) using React.js, TailwindCSS, Framer Motion, and Jotai with on-chain randomness.",
      "Built Telegram Mini App for wallet-less login via Telegram and text-based gameplay via custom bot.",
      "Created Over Under Dice Game (Solana) provably fair prediction platform deployed at goatofgamblers.com.",
      "Engineered trading dashboard UI for Solana toolkit NinjaPump.ai and upgraded suite at suite.ninjapump.ai.",
      "Built PupsBot (Telegram Trading Bot) using Node.js/Express for Runes trading on Odin.Fun.",
    ],
  },
  {
    title: "Content Creator",
    company_name: "Pemerintah Kota Pekanbaru",
    icon: starbucks,
    iconBg: "#f59e0b",
    date: "May 2023 - Jun 2024",
    category: "creative",
    points: [
      "Produced and edited documentary-style video content for the spouse of Pekanbaru's Interim Mayor (PJ Walikota).",
      "Filmed high-quality documentation of community engagements, events, and behind-the-scenes moments.",
      "Crafted polished social media content (Reels, Stories) with aesthetic consistency, subtitles, and narrative pacing.",
      "Handled sensitive executive documentation with strict confidentiality and discretion.",
    ],
  },
  {
    title: "Head Operation, Engineer",
    company_name: "PT Alga Jaya Solusi",
    icon: shopify,
    iconBg: "#3b82f6",
    date: "Sep 2021 - Dec 2021",
    category: "operations",
    points: [
      "Led operational division and reduced corporate client complaints by 50% through workflow optimization.",
      "Architected and deployed point-to-point network infrastructure between Dumai and Rupat islands in 4 days.",
      "Managed field technician schedules, workflows, and compliance with Standard Operating Procedures.",
      "Handled direct resolution of complex client escalations across corporate and individual installations.",
    ],
  },
  {
    title: "Sales Promotion Boy (SPB)",
    company_name: "PT Mitra Cahaya Sentosa",
    icon: shopify,
    iconBg: "#ec4899",
    date: "Apr 2022 - May 2022",
    category: "operations",
    points: [
      "Assisted Ramadan bazaar retail operations at Pekanbaru Mall representing Pakalolo and Deisler footwear.",
      "Achieved top sales honors for the month, generating Rp97,409,300 across 549 pairs of sandals.",
      "Managed customer engagement, product upselling, and retail inventory reconciliation.",
    ],
  },
];

export const socialLinks = [
  {
    name: "Contact",
    iconUrl: contact,
    link: "/contact",
  },
  {
    name: "GitHub",
    iconUrl: github,
    link: "https://github.com/rakafantino",
  },
  {
    name: "LinkedIn",
    iconUrl: linkedin,
    link: "https://www.linkedin.com/in/rakafantino",
  },
];

export const projects = [
  {
    iconUrl: pricewise,
    theme: "btn-back-red",
    name: "NinjaPump.ai",
    description:
      "Solana trading toolkit and dashboard for stealth wallet coordination, volume campaigns, and token management processing 1K+ transactions monthly.",
    link: "https://ninjapump.ai",
    tags: ["React.js", "TailwindCSS", "Solana", "Web3"],
    category: "web3-crypto",
  },
  {
    iconUrl: threads,
    theme: "btn-back-green",
    name: "Ninja Suite",
    description:
      "Advanced enterprise upgrade to NinjaPump platform providing enhanced market-making frameworks and multi-wallet management on Solana.",
    link: "https://suite.ninjapump.ai",
    tags: ["React.js", "TypeScript", "Solana", "Trading"],
    category: "web3-crypto",
  },
  {
    iconUrl: snapgram,
    theme: "btn-back-pink",
    name: "Roshambo (DragonEyes)",
    description:
      "Decentralized multi-chain Rock-Paper-Scissors game on ICP, Bitcoin, and Solana with Telegram Mini App integration, featured on the DFINITY Forum.",
    link: "https://dragoneyes.xyz",
    tags: ["React.js", "ICP", "Solana", "Telegram API", "Framer Motion"],
    category: "web3-crypto",
  },
  {
    iconUrl: estate,
    theme: "btn-back-black",
    name: "Goat of Gamblers",
    description:
      "Provably fair Over Under dice prediction game on Solana supporting real-time multiplayer participation and on-chain payouts.",
    link: "https://goatofgamblers.com",
    tags: ["React.js", "TailwindCSS", "Solana", "GameFi"],
    category: "web3-crypto",
  },
  {
    iconUrl: summiz,
    theme: "btn-back-yellow",
    name: "PupsBot",
    description:
      "High-speed Telegram trading bot built with Node.js and Express for Runes trading on Odin.Fun with automated order routing.",
    link: "https://pupsbot.com",
    tags: ["Node.js", "Express", "Telegram Bot API", "Runes"],
    category: "web3-crypto",
  },
  {
    iconUrl: estate,
    theme: "btn-back-blue",
    name: "Diklik.co",
    description:
      "Comprehensive digital news platform built for client publishing, featuring responsive article feeds, editorial CMS, and social distribution.",
    link: "https://diklik.co",
    tags: ["Next.js", "React.js", "TailwindCSS", "PostgreSQL"],
    category: "fullstack-saas",
  },
  {
    iconUrl: threads,
    theme: "btn-back-green",
    name: "Feedly App",
    description:
      "E-commerce livestock and cat feed inventory and sales management application built for personal business operations.",
    link: "https://github.com/rakafantino",
    tags: ["React.js", "Node.js", "Inventory Management"],
    category: "fullstack-saas",
  },
];

export const awards = [
  {
    title: "PAN-SEA AI Developer Challenge 2025 - Winner",
    issuer: "AI Singapore",
    date: "Oct 2025",
    description:
      "Winner of Education Path Certification in Southeast Asia developer challenge for building innovative AI applications.",
  },
  {
    title: "Google - The Gemma 3n Impact Challenge (The Ollama Prize)",
    issuer: "Kaggle",
    date: "Nov 2025",
    description:
      "Selected as winner of The Ollama Prize for impactful edge AI application development with Google Gemma 3n.",
  },
  {
    title: "Basic Web Programming",
    issuer: "Dicoding",
    date: "May 2020",
    description:
      "Foundational certification in semantic web standards, responsive design, and modern front-end web development.",
  },
];
