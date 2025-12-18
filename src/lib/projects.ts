export interface Project {
  title: string;
  slug: string;
  description: string;
  tech: string[];
  link: string;
  image?: string;
  // Extended Details for Case Study
  subtitle: string;
  metrics: { label: string; value: string }[];
  challenge: string;
  solution: string;
  features: string[];
}

export const PROJECTS: Project[] = [
  {
    title: "Recruit-AI",
    slug: "recruit-ai",
    description: "Agentic AI system for automated resume screening, scoring, and recruiter decision support for SMBs",
    subtitle: "AI-Powered Recruitment for the Modern Era",
    tech: ["n8n", "OpenRouter (LLMs)", "LangChain", "Next.js", "Node.js"],
    link: "#",
    metrics: [
      { label: "Time Saved", value: "85%" },
      { label: "Candidates Processed", value: "500+" },
      { label: "Accuracy", value: "92%" },
    ],
    challenge: "Small businesses struggle with high-volume recruitment, spending an average of 40 hours per hire on manual resume screening.",
    solution: "An automated pipeline that uses LLMs to parse, score, and rank candidates based on job descriptions, providing instant shortlists and detailed feedback.",
    features: [
        "Automated PDF Resume Parsing", 
        "Contextual Candidate Scoring", 
        "Instant Email Notifications",
        "Role-Based Access Control"
    ]
  },
  {
    title: "Hospital Management System",
    slug: "hospital-management-system",
    description: "Full-stack healthcare system built in a 48-hour hackathon with secure role-based workflows",
    subtitle: "Secure & Efficient Healthcare Administration",
    tech: ["MERN Stack", "RBAC", "SSR", "Docker"],
    link: "#",
    metrics: [
      { label: "Development Time", value: "48 Hrs" },
      { label: "Roles Administered", value: "4" },
      { label: "Uptime", value: "99.9%" },
    ],
    challenge: "Healthcare systems are often clunky, insecure, and difficult to manage, leading to administrative bottlenecks.",
    solution: "A streamlined, secure web application with distinct portals for Admins, Doctors, and Patients, ensuring data privacy and efficient workflows.",
    features: [
        "Secure Role-Based Authentication",
        "Real-time Appointment Scheduling",
        "Patient History Management",
        "Dockerized Deployment"
    ]
  },
  {
    title: "Orion",
    slug: "orion",
    description: "Vibe-coding tool designed for Flutter developers to accelerate prototyping",
    subtitle: "Accelerating Flutter Development",
    tech: ["Flutter ecosystem", "Experimentation Stack", "Dart"],
    link: "#",
    metrics: [
      { label: "Prototyping Speed", value: "3x" },
      { label: "Widgets", value: "50+" },
      { label: "Beta Users", value: "100+" },
    ],
    challenge: "Flutter developers spend too much time on boilerplate UI code instead of focusing on core logic.",
    solution: "A low-code/no-code interface that generates clean Flutter widgets, allowing developers to visually construct UIs and export production-ready code.",
    features: [
        "Visual Widget Drag-and-Drop",
        "Real-time Code Preview",
        "Custom Theme Generation",
        "Component Library Integration"
    ]
  },
  {
    title: "LegalTech Dashboards",
    slug: "legaltech-dashboards",
    description: "Judiciary and court case management dashboards with structured case data and AI exploration",
    subtitle: "Digitizing the Judiciary",
    tech: ["Next.js", "Dashboard UX", "LLM integrations", "PostgreSQL"],
    link: "#",
    metrics: [
      { label: "Cases Indexed", value: "10k+" },
      { label: "Search Latency", value: "<200ms" },
      { label: "User Adoption", value: "Growing" },
    ],
    challenge: "Legal case management relies on outdated, paper-based systems or legacy software with poor UX.",
    solution: "A modern, responsive dashboard that aggregates case data, provides AI-powered summaries, and enables predictive analytics for case outcomes.",
    features: [
        "AI Case Summarization",
        "Interactive Status Timelines",
        "Full-Text Search",
        "Secure Document Vault"
    ]
  },
  {
    title: "Agastya",
    slug: "agastya",
    description: "AI-powered PCB co-engineer that converts natural language into schematic and PCB layout (MVP concept)",
    subtitle: "Generative AI for Hardware Engineering",
    tech: ["Python", "KiCad Automation", "LLMs", "Pipelines"],
    link: "#",
    metrics: [
      { label: "Design Time", value: "-60%" },
      { label: "Complexity", value: "High" },
      { label: "Automation Level", value: "L3" },
    ],
    challenge: "Designing PCBs requires specialized knowledge and complex CAD tools, creating a high barrier to entry.",
    solution: "An AI agent that understands natural language requirements (e.g., 'Arduino UNO clone') and automatically generates KiCad schematics and layouts via Python scripting.",
    features: [
        "Natural Language to Circuit",
        "KiCad Python API Integration",
        "Automated Component Placement",
        "Rule-Based Routing"
    ]
  },
];
