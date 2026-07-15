export type Experience = {
  title: string;
  company: string;
  period: string;
  description: string[];
};

export type SkillCategory = {
  name: string;
  skills: string[];
};

export type PositioningStat = {
  label: string;
  value: string;
};

export type AboutProfile = {
  badge: string;
  panelLabel: string;
  statement: string;
  companyLabel: string;
  locationLabel: string;
  experienceIntro: string;
  founderLabel: string;
  brandLabel: string;
  storyCardDescription: string;
  workflowCardDescription: string;
  philosophyCardDescription: string;
  resumeDescription: string;
  stats: PositioningStat[];
};

export type CVData = {
  name: string;
  email: string;
  role: string;
  summary: string;
  profile: AboutProfile;
  experiences: Experience[];
  skills: SkillCategory[];
  education: {
    school: string;
    degree: string;
    year: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    period: string;
    description: string;
  }[];
};

export const cvData = {
  en: {
    name: "Iwan Efendi",
    email: "iwan.efndi@gmail.com",
    role: "Procurement Specialist, Technical Writer & Workflow Builder",
    summary:
      "SheetHub is built as a practical knowledge base for Excel and Google Sheets users who need clear guidance and repeatable workflows. The platform focuses on documentation that can be applied quickly in real tasks, from formula usage and data cleanup to automation-oriented routines. Its editorial direction is simple: useful first, clear by default, and consistent over time.",
    profile: {
      badge: "Founder Story",
      panelLabel: "Positioning",
      statement:
        "SheetHub is positioned as a practical reference for spreadsheet-driven work: concise, reliable, and ready for daily use.",
      companyLabel: "PT Telkom Akses",
      locationLabel: "Indonesia",
      experienceIntro:
        "Selected roles that shaped how I work today: from field operations, safety, and troubleshooting to cleaner administrative systems and practical workflows.",
      founderLabel: "Founder",
      brandLabel: "SheetHub",
      storyCardDescription:
        "SheetHub was built to preserve practical spreadsheet knowledge so teams can revisit proven steps without repeating trial-and-error.",
      workflowCardDescription:
        "The workflow principle is pragmatic: use focused tools, keep steps traceable, and avoid unnecessary complexity.",
      philosophyCardDescription:
        "Writing follows a utility-first approach: clear structure, direct examples, and practical outcomes over decorative wording.",
      resumeDescription:
        "For a more formal and concise professional reference, you can download my full resume below.",
      stats: [
        { label: "Focus", value: "Practical Tech" },
        { label: "Direction", value: "Clarity First" },
        { label: "Interest", value: "Automation" },
        { label: "Style", value: "Useful Writing" },
      ],
    },
    experiences: [
      {
        title: "Staff Procurement & Partnership",
        company: "PT Telkom Akses",
        period: "Jan 2018 - Present",
        description: [
          "Manage partner administration and procurement workflows with strong attention to accuracy, completeness, and procedural compliance.",
          "Build reporting structures in Microsoft Excel, Google Sheets, and SAP to improve visibility, monitoring, and day-to-day coordination.",
          "Support faster invoice and payment processing through cross-divisional follow-up and document control.",
          "Help turn operational work into clearer, more traceable systems that reduce friction for everyone involved.",
        ],
      },
      {
        title: "NE Maintenance Technician",
        company: "Telkom Akses",
        period: "May 2017 - Jan 2018",
        description: [
          "Handled maintenance and monitoring of network equipment to keep operational reliability stable in the field.",
          "Performed routine inspections, voltage checks, and preventive actions to reduce the risk of disruption and downtime.",
          "Built practical technical discipline through direct exposure to infrastructure, troubleshooting, and follow-up coordination.",
        ],
      },
      {
        title: "HSE Staff",
        company: "Telkom Akses",
        period: "Nov 2016 - May 2017",
        description: [
          "Focused on field safety readiness by helping technicians understand and apply K3 procedures in real working conditions.",
          "Delivered practical guidance on working at height, ladder handling, pole climbing, and electrical hazard awareness.",
          "Strengthened my approach to systems thinking by learning that good work depends on clarity, discipline, and risk awareness.",
        ],
      },
      {
        title: "Capdev Staff (Capital Development)",
        company: "Telkom Akses",
        period: "Jun 2016 - Nov 2016",
        description: [
          "Supported workforce readiness through technical briefing, direct practice, and quality-focused field training.",
          "Helped standardize installation understanding across FTTH and LAN work so execution stayed consistent and safe.",
          "Built early experience in translating technical standards into practical guidance people could actually apply.",
        ],
      },
      {
        title: "PT1 Technician (IndiHome New Installation)",
        company: "Telkom Akses",
        period: "Aug 2015 - Jun 2016",
        description: [
          "Worked directly on FTTH installation from cable pulling to service activation for new IndiHome customers.",
          "Developed hands-on understanding of installation standards, attenuation, and field execution quality.",
          "This role became part of the technical foundation behind how I write about practical technology today.",
        ],
      },
      {
        title: "Computer & Laptop Technician",
        company: "Computer Shop",
        period: "Oct 2013 - Sep 2014",
        description: [
          "Installed, configured, and repaired computers, laptops, and printers for everyday user needs.",
          "Diagnosed hardware and software problems systematically to provide practical and efficient solutions.",
          "This early work shaped my long-term interest in troubleshooting, useful documentation, and real-world IT support.",
        ],
      },
    ],
    skills: [
      {
        name: "Workflow & Automation",
        skills: [
          "Microsoft Excel (Advanced)",
          "Google Sheets",
          "SAP System",
          "Data Structuring",
        ],
      },
      {
        name: "Technical Writing & Web",
        skills: [
          "Technical Documentation",
          "NextJS / React",
          "Process-Oriented Writing",
          "Knowledge Organization",
        ],
      },
      {
        name: "Systems & Troubleshooting",
        skills: [
          "Troubleshooting Hardware",
          "Software Installation",
          "LAN Networking",
          "Operational Problem Solving",
        ],
      },
    ],
    education: [
      {
        school: "SMKN1 Jambi",
        degree: "Higher Secondary / 'A' Level",
        year: "2013",
      },
    ],
    certifications: [
      {
        name: "SIM C License",
        issuer: "Korlantas Polri",
        period: "Active",
        description:
          "Valid driver's license supporting field mobility for installation, inspection, and network monitoring.",
      },
    ],
  },
} satisfies Record<"en", CVData>;
