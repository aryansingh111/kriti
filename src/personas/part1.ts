import type { ResumeData } from '@/types'
import { DECLARATION, bulletSection, details, entrySection, persona, textSection } from './kit'

/* Personas 1–24. Companies are fictional; institutions are real (they only appear as places of study). */

export const PART1: Record<string, ResumeData> = {
  aurora: persona('aurora', {
    name: 'Aarav Sharma',
    title: 'Senior Software Engineer',
    email: 'aarav.sharma@gmail.com',
    phone: '+91 98450 12345',
    location: 'Bengaluru, Karnataka',
    links: [
      ['linkedin', 'linkedin.com/in/aarav-sharma'],
      ['github', 'github.com/aaravsharma'],
      ['portfolio', 'aaravsharma.dev'],
    ],
    summary:
      'Full-stack engineer with 8+ years of experience building high-traffic fintech platforms and developer tooling. Led teams that cut page-load times by 48% and shipped products used by more than 2 crore people.',
    exp: [
      [
        'Senior Software Engineer',
        'Zenith Fintech',
        'Bengaluru',
        'Mar 2021',
        '',
        [
          'Led a team of 6 engineers to rebuild the UPI checkout flow, lifting conversion by 18% across ₹4,200 Cr in annual volume',
          'Cut p95 page-load time by 48% with edge caching, code-splitting and a shared image pipeline',
          'Designed an event-driven notification service handling 4 Cr+ messages per day at 99.99% uptime',
        ],
        'zenithfintech.in',
      ],
      [
        'Software Engineer',
        'Kaveri Systems',
        'Hyderabad',
        'Jun 2017',
        'Feb 2021',
        [
          'Built a real-time analytics dashboard in React and D3 adopted by 300+ enterprise customers',
          'Migrated a Rails monolith to services on AWS, reducing infrastructure spend by 32%',
        ],
      ],
      [
        'Junior Developer',
        'Pranav Infosolutions',
        'Pune',
        'Jul 2015',
        'May 2017',
        ['Delivered 20+ websites and web apps for startups in fintech, health and education'],
      ],
    ],
    edu: [
      ['Indian Institute of Technology Bombay', 'B.Tech', 'Computer Science and Engineering', 'Mumbai', '2011', '2015', 'CGPA 8.7 / 10'],
    ],
    skills: ['TypeScript', 'React', 'Node.js', 'System Design', 'PostgreSQL', 'GraphQL', 'AWS', 'Python', 'Docker', 'Kubernetes'],
    projects: [
      [
        'OpenTrace',
        'github.com/aaravsharma/opentrace',
        'Go · OpenTelemetry · React',
        ['Open-source tracing explorer with 3.2k GitHub stars and 40+ contributors'],
      ],
    ],
    certs: [['AWS Certified Solutions Architect – Associate', 'Amazon Web Services', '2022']],
    langs: [
      ['English', 'Fluent'],
      ['Hindi', 'Native'],
      ['Kannada', 'Intermediate'],
    ],
  }),

  ivy: persona('ivy', {
    name: 'Ananya Iyer',
    title: 'Investment Analyst · MBA (Finance)',
    email: 'ananya.iyer@outlook.com',
    phone: '+91 99200 45678',
    location: 'Mumbai, Maharashtra',
    links: [['linkedin', 'linkedin.com/in/ananya-iyer']],
    summary:
      'MBA (Finance) graduate from IIM Calcutta with 5 years of experience in equity research and valuation across consumer and banking sectors. Skilled in financial modelling, DCF and investor communication.',
    exp: [
      [
        'Investment Analyst',
        'Sahyadri Capital',
        'Mumbai',
        'Jul 2021',
        '',
        [
          'Cover 14 consumer and banking stocks with a combined market cap of ₹6.8 lakh crore; initiated coverage on 4 mid-caps',
          'Built DCF and relative-valuation models that informed a ₹320 Cr portfolio allocation',
          'Authored 22 sector notes read by 60+ institutional clients',
        ],
      ],
      [
        'Equity Research Associate',
        'Indus Securities',
        'Mumbai',
        'Jul 2019',
        'Jun 2021',
        [
          'Maintained earnings models for 8 companies and published result previews within 2 hours of release',
          'Cut model-update time by 35% by automating data pulls with Excel VBA',
        ],
      ],
    ],
    edu: [
      ['Indian Institute of Management Calcutta', 'PGDM', 'Finance', 'Kolkata', '2017', '2019', 'Dean’s List · Convener, Finance Club'],
      ["St. Xavier's College, Mumbai", 'B.Com', 'Accounting & Finance', 'Mumbai', '2014', '2017', 'First Class with Distinction'],
    ],
    skills: ['Financial Modelling', 'DCF Valuation', 'Equity Research', 'Bloomberg Terminal', 'Advanced Excel', 'Power BI', 'Python (pandas)'],
    certs: [
      ['CFA Level III Candidate', 'CFA Institute', '2024'],
      ['NISM Series XV – Research Analyst', 'NISM', '2020'],
    ],
    langs: [
      ['English', 'Fluent'],
      ['Tamil', 'Native'],
      ['Hindi', 'Fluent'],
    ],
  }),

  slate: persona('slate', {
    name: 'Kabir Malhotra',
    title: 'Senior Product Manager',
    email: 'kabir.malhotra@gmail.com',
    phone: '+91 98100 23456',
    location: 'Gurugram, Haryana',
    links: [
      ['linkedin', 'linkedin.com/in/kabirmalhotra'],
      ['portfolio', 'kabirmalhotra.in'],
    ],
    summary:
      'Product manager with 7 years of experience shipping consumer fintech and marketplace products to 12M+ users. Combines data-driven discovery with hands-on delivery across design and engineering.',
    exp: [
      [
        'Senior Product Manager',
        'Saral Pay',
        'Gurugram',
        'Apr 2022',
        '',
        [
          'Own the merchant-payments roadmap (8 engineers, 2 designers); grew monthly active merchants from 0.9M to 1.6M',
          'Launched UPI AutoPay mandates, adding ₹38 Cr in recurring GMV within two quarters',
          'Cut onboarding drop-off by 27% through funnel analysis and 14 A/B tests',
          'Mentor 3 associate PMs and run the quarterly product-review rhythm with leadership',
        ],
      ],
      [
        'Product Manager',
        'Rangoli Retail',
        'New Delhi',
        'Aug 2019',
        'Mar 2022',
        [
          'Shipped hyperlocal delivery used by 2.1M customers across 11 cities',
          'Reduced order cancellations by 19% by redesigning slot selection',
        ],
      ],
      [
        'Associate Product Manager',
        'Tarang Media',
        'Noida',
        'Jul 2017',
        'Jul 2019',
        ['Launched a vernacular video feed in 5 Indian languages that lifted session length by 31%'],
      ],
    ],
    edu: [
      ['Indian Institute of Technology Delhi', 'B.Tech', 'Mechanical Engineering', 'New Delhi', '2013', '2017'],
      ['Indian School of Business', 'Certificate', 'Product Management', 'Hyderabad', '2020', '2021'],
    ],
    skills: ['Product Strategy', 'Roadmapping', 'A/B Testing', 'SQL', 'Mixpanel', 'Figma', 'Agile / Scrum', 'Stakeholder Management'],
    certs: [['Product Management Certification', 'Pragmatic Institute', '2020']],
    awards: [['Product Leader to Watch', 'ProductCon India', '2023', '']],
    langs: [
      ['English', 'Fluent'],
      ['Hindi', 'Native'],
      ['Punjabi', 'Fluent'],
    ],
  }),

  executive: persona('executive', {
    name: 'Rajesh Venkataraman',
    title: 'Vice President – Operations',
    email: 'rajesh.venkataraman@gmail.com',
    phone: '+91 98410 67890',
    location: 'Chennai, Tamil Nadu',
    links: [['linkedin', 'linkedin.com/in/rajeshvenkataraman']],
    summary:
      'Operations leader with 22 years of experience scaling manufacturing and supply chains across automotive and consumer durables. Delivered ₹210 Cr in cost savings while leading 1,800+ people across six plants.',
    exp: [
      [
        'Vice President – Operations',
        'Dakshin Motors Ltd.',
        'Chennai',
        'Apr 2018',
        '',
        [
          'Lead end-to-end operations for 6 plants with ₹5,400 Cr annual revenue and 1,800 employees',
          'Drove a lean transformation that lifted OEE from 68% to 84% and cut working capital by ₹140 Cr',
          'Localised 42 components, saving ₹71 Cr a year and de-risking the import supply chain',
        ],
      ],
      [
        'General Manager – Manufacturing',
        'Sahyadri Engineering',
        'Pune',
        'Jun 2012',
        'Mar 2018',
        [
          'Commissioned a greenfield plant at Chakan in 14 months, ₹60 Cr under budget',
          'Cut defect rate from 1,900 ppm to 320 ppm through a Six Sigma programme',
        ],
      ],
      [
        'Senior Manager – Plant Operations',
        'Ganga Industries',
        'Kolkata',
        'Jul 2004',
        'May 2012',
        ['Ran a 420-member plant; achieved 99.2% on-time delivery for five consecutive years'],
      ],
    ],
    edu: [
      ['Indian Institute of Management Bangalore', 'MBA', 'Operations', 'Bengaluru', '2009', '2011'],
      ['College of Engineering, Guindy', 'B.E.', 'Mechanical Engineering', 'Chennai', '1998', '2002'],
    ],
    skills: ['Lean Manufacturing', 'Six Sigma Black Belt', 'P&L Management', 'Supply Chain', 'Capex Planning', 'Industrial Relations', 'SAP', 'Team Leadership'],
    certs: [['Six Sigma Black Belt', 'ASQ', '2010']],
    langs: [
      ['English', 'Fluent'],
      ['Tamil', 'Native'],
      ['Hindi', 'Intermediate'],
    ],
  }),

  canvas: persona('canvas', {
    name: 'Meera Nair',
    title: 'Brand & UX Designer',
    email: 'meera.nair.design@gmail.com',
    phone: '+91 94470 23456',
    location: 'Kochi, Kerala',
    links: [
      ['behance', 'behance.net/meeranair'],
      ['portfolio', 'meeranair.design'],
      ['linkedin', 'linkedin.com/in/meeranair'],
    ],
    summary:
      'Brand and UX designer with 5 years of experience crafting identity systems and mobile products for D2C and healthcare startups. Obsessed with clear visual stories and inclusive interfaces.',
    exp: [
      [
        'UX & Brand Designer',
        'Arohi Healthcare',
        'Kochi',
        'Jan 2022',
        '',
        [
          'Redesigned the patient app (4.1★ → 4.7★) and cut appointment booking from 9 steps to 4',
          'Built a 120-component design system shared by 3 product squads',
          'Led the brand refresh across web, print and 30 clinics',
        ],
      ],
      [
        'Visual Designer',
        'Lakshya Edutech',
        'Bengaluru',
        'Jun 2019',
        'Dec 2021',
        [
          'Designed 200+ learning-module illustrations and 40 marketing campaigns',
          'Shortened design-to-dev handoff by 40% with Figma component libraries',
        ],
      ],
    ],
    edu: [
      ['National Institute of Design', 'M.Des', 'Visual Communication', 'Ahmedabad', '2017', '2019'],
      ['Rajagiri College of Social Sciences', 'B.A.', 'Fine Arts', 'Kochi', '2014', '2017'],
    ],
    skills: ['Figma', 'Illustrator', 'Photoshop', 'Brand Identity', 'Prototyping', 'User Research', 'Design Systems', 'After Effects'],
    certs: [['Google UX Design Certificate', 'Coursera', '2021']],
    langs: [
      ['English', 'Fluent'],
      ['Malayalam', 'Native'],
      ['Hindi', 'Intermediate'],
    ],
    awards: [['Winner – Poster Challenge', 'Kerala Design Week', '2023', 'Public-health campaign poster series']],
  }),

  mono: persona('mono', {
    name: 'Rohan Deshmukh',
    title: 'Senior DevOps Engineer',
    email: 'rohan.deshmukh@gmail.com',
    phone: '+91 98220 34567',
    location: 'Pune, Maharashtra',
    links: [
      ['github', 'github.com/rohan-dev'],
      ['linkedin', 'linkedin.com/in/rohandeshmukh'],
      ['portfolio', 'rohan.codes'],
    ],
    summary:
      'Backend and DevOps engineer with 6 years of experience building scalable APIs and CI/CD pipelines. Reduced cloud spend by 38% and release time from days to minutes.',
    exp: [
      [
        'Senior DevOps Engineer',
        'Nimbus Cloud Technologies',
        'Pune',
        'Aug 2021',
        '',
        [
          'Run a Kubernetes platform of 140 microservices on AWS with 99.97% availability',
          'Cut deployment time from 3 hours to 9 minutes with GitOps (ArgoCD) and automated canaries',
          'Reduced the monthly cloud bill by ₹46 lakh through right-sizing and spot instances',
        ],
      ],
      [
        'Backend Engineer',
        'Indus Software Labs',
        'Pune',
        'Jun 2018',
        'Jul 2021',
        [
          'Built Go microservices handling 12k requests/sec for a logistics tracking platform',
          'Introduced Terraform modules now used by 9 teams',
        ],
      ],
    ],
    edu: [['COEP Technological University', 'B.Tech', 'Computer Engineering', 'Pune', '2014', '2018', 'CGPA 8.4 / 10']],
    skillGroups: [
      ['Languages', ['Go', 'Python', 'Bash', 'SQL']],
      ['Cloud & DevOps', ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'ArgoCD']],
    ],
    projects: [
      [
        'kubectl-cost',
        'github.com/rohan-dev/kubectl-cost',
        'Go · Kubernetes',
        ['CLI plugin that shows per-namespace spend; 1.1k GitHub stars'],
      ],
    ],
    certs: [['Certified Kubernetes Administrator', 'CNCF', '2022']],
    langs: [
      ['Marathi', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Fluent'],
    ],
  }),

  nordic: persona('nordic', {
    name: 'Priya Reddy',
    title: 'Senior Data Analyst',
    email: 'priya.reddy@gmail.com',
    phone: '+91 99890 45678',
    location: 'Hyderabad, Telangana',
    links: [
      ['linkedin', 'linkedin.com/in/priya-reddy-data'],
      ['kaggle', 'kaggle.com/priyareddy'],
    ],
    summary:
      'Data analyst with 6 years of experience turning messy business data into decisions for e-commerce and logistics teams. Strong in SQL, Python and storytelling with dashboards.',
    exp: [
      [
        'Senior Data Analyst',
        'Vahan Mobility',
        'Hyderabad',
        'Jan 2022',
        '',
        [
          'Built a demand-forecasting model (MAPE 9.4%) that cut vehicle idle time by 17%',
          'Own executive KPI dashboards in Power BI used by 40+ stakeholders weekly',
          'Automated 12 weekly reports with Airflow, saving 25 analyst-hours a week',
        ],
      ],
      [
        'Data Analyst',
        'BluePeak Analytics',
        'Bengaluru',
        'Jun 2018',
        'Dec 2021',
        [
          'Segmented 3M customers with k-means, lifting campaign ROI by 22%',
          'Designed an A/B testing framework adopted across 5 product teams',
        ],
      ],
    ],
    edu: [
      ['University of Hyderabad', 'M.Sc.', 'Statistics', 'Hyderabad', '2016', '2018', 'CGPA 9.1 / 10'],
      ["St. Francis College for Women", 'B.Sc.', 'Maths, Statistics, Computer Science', 'Hyderabad', '2013', '2016'],
    ],
    skills: [['SQL', 5], ['Python', 5], ['Power BI', 5], ['Excel', 5], ['Tableau', 4], ['Machine Learning', 4], ['A/B Testing', 4], ['Statistics', 5], ['Airflow', 3]],
    certs: [
      ['Google Data Analytics Certificate', 'Coursera', '2021'],
      ['Power BI Data Analyst Associate', 'Microsoft', '2022'],
    ],
    langs: [
      ['English', 'Fluent'],
      ['Telugu', 'Native'],
      ['Hindi', 'Fluent'],
    ],
    awards: [['Analyst of the Year', 'Vahan Mobility', '2023', 'For the demand-forecasting programme']],
  }),

  bold: persona('bold', {
    name: 'Vikram Rathore',
    title: 'Marketing Director',
    email: 'vikram.rathore@gmail.com',
    phone: '+91 98290 56789',
    location: 'Jaipur, Rajasthan',
    links: [
      ['linkedin', 'linkedin.com/in/vikramrathore'],
      ['instagram', 'instagram.com/vikram.marketing'],
    ],
    summary:
      'Brand-led marketing director with 12 years of experience growing D2C and hospitality brands. Scaled revenue from ₹40 Cr to ₹260 Cr and built 25-member performance and creative teams.',
    exp: [
      [
        'Director – Marketing',
        'Kesar Naturals',
        'Jaipur',
        'Apr 2020',
        '',
        [
          'Scaled the D2C business from ₹40 Cr to ₹260 Cr in four years at a blended 9.4× ROAS',
          'Built an in-house performance and creative team of 25, cutting agency spend by ₹3.2 Cr',
          'Launched 3 flagship campaigns reaching 8 Cr+ people across Instagram, YouTube and regional TV',
        ],
      ],
      [
        'Senior Brand Manager',
        'Madhuri Foods',
        'Mumbai',
        'Jun 2015',
        'Mar 2020',
        [
          'Relaunched a heritage snack brand, lifting market share from 6% to 11% in 18 months',
          'Managed a ₹55 Cr annual media budget',
        ],
      ],
      [
        'Marketing Manager',
        'Pink City Hotels',
        'Jaipur',
        'Jul 2011',
        'May 2015',
        ['Drove 38% growth in direct bookings through SEO, CRM and OTA strategy'],
      ],
    ],
    edu: [
      ['Management Development Institute', 'MBA', 'Marketing', 'Gurugram', '2009', '2011'],
      ['University of Rajasthan', 'B.Com', 'Commerce', 'Jaipur', '2006', '2009'],
    ],
    skills: ['Brand Strategy', 'Performance Marketing', 'P&L Ownership', 'Team Leadership', 'Go-to-market', 'CRM', 'Media Planning', 'Analytics'],
    langs: [
      ['English', 'Fluent'],
      ['Hindi', 'Native'],
      ['Marwari', 'Fluent'],
    ],
    awards: [['Marketer of the Year', 'Rajasthan Business Awards', '2023', 'For the Kesar Naturals turnaround']],
  }),

  timeline: persona('timeline', {
    name: 'Sneha Kulkarni',
    title: 'Senior Project Manager · PMP',
    email: 'sneha.kulkarni@gmail.com',
    phone: '+91 98600 67891',
    location: 'Pune, Maharashtra',
    links: [['linkedin', 'linkedin.com/in/snehakulkarni-pmp']],
    summary:
      'PMP-certified project manager with 9 years of experience delivering enterprise software programmes for banking clients across India and the UK. Known for on-time delivery and calm stakeholder management.',
    exp: [
      [
        'Senior Project Manager',
        'Pranav Infosolutions',
        'Pune',
        'Jan 2020',
        '',
        [
          'Deliver a ₹95 Cr core-banking modernisation for a top-10 Indian bank with a 120-member distributed team',
          'Brought the programme in 6 weeks early by re-baselining scope and adding weekly risk reviews',
          'Kept CSAT at 4.8/5 across 14 quarterly steering committees',
        ],
      ],
      [
        'Project Manager',
        'Indus Software Labs',
        'Pune',
        'Jun 2016',
        'Dec 2019',
        [
          'Delivered 11 releases for a UK insurance client with zero P1 incidents',
          'Reduced defect leakage by 41% by adding shift-left QA',
        ],
      ],
      [
        'Business Analyst',
        'Indus Software Labs',
        'Pune',
        'Jul 2013',
        'May 2016',
        ['Documented requirements for 3 banking products and led UAT for 20+ releases'],
      ],
    ],
    edu: [
      ['Pune Institute of Computer Technology', 'B.E.', 'Information Technology', 'Pune', '2009', '2013'],
    ],
    skills: ['Agile / Scrum', 'Risk Management', 'Stakeholder Management', 'MS Project', 'Jira', 'Budgeting', 'Vendor Management'],
    certs: [['Project Management Professional (PMP)', 'PMI', '2018']],
    langs: [
      ['Marathi', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Fluent'],
    ],
    awards: [['Project of the Year', 'Pranav Infosolutions', '2022', 'For the ₹40 Cr ERP rollout']],
  }),

  scholar: persona('scholar', {
    name: 'Dr. Arvind Subramanian',
    title: 'Assistant Professor of Physics',
    email: 'arvind.subramanian@university.edu.in',
    phone: '+91 94440 12345',
    location: 'Chennai, Tamil Nadu',
    links: [
      ['googlescholar', 'scholar.google.com/citations?user=a1b2c3', 'Google Scholar'],
      ['orcid', 'orcid.org/0000-0002-1825-0097', 'ORCID 0000-0002-1825-0097'],
    ],
    summary:
      'Condensed-matter physicist with 11 years of research and teaching experience: 34 peer-reviewed papers (h-index 14), ₹2.8 Cr in competitive grants and six PhD students supervised.',
    exp: [
      [
        'Assistant Professor, Department of Physics',
        'Southern Institute of Science & Technology',
        'Chennai',
        'Jul 2019',
        '',
        [
          'Teach Quantum Mechanics and Solid-State Physics to 180 UG/PG students (feedback 4.6/5)',
          'Supervise 6 PhD and 9 M.Sc. dissertations; principal investigator on a ₹1.4 Cr SERB project on topological materials',
        ],
      ],
      [
        'Postdoctoral Research Fellow',
        'Coromandel Centre for Fundamental Research',
        'Chennai',
        'Aug 2015',
        'Jun 2019',
        ['Published 18 papers on electronic transport in 2D materials, including 6 in Physical Review B'],
      ],
    ],
    edu: [
      ['Indian Institute of Science', 'Ph.D.', 'Physics', 'Bengaluru', '2010', '2015', 'Thesis: Electronic transport in 2D topological insulators'],
      ['Indian Institute of Technology Madras', 'M.Sc.', 'Physics', 'Chennai', '2008', '2010'],
      ['Loyola College', 'B.Sc.', 'Physics', 'Chennai', '2005', '2008'],
    ],
    skills: ['Quantum transport', 'Density functional theory', 'Python', 'MATLAB', 'LaTeX', 'Grant writing', 'Research supervision'],
    langs: [
      ['Tamil', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Basic'],
    ],
    awards: [['Young Faculty Research Award', 'Southern Institute', '2022', 'For outstanding research output']],
    custom: (id) => [
      entrySection(id, 'pubs', 'Selected publications', [
        ['Topological edge states in strained bilayer systems', 'Physical Review B 102, 045112', '2021', []],
        ['Quantum Hall plateaus in twisted bilayers', 'Journal of Physics: Condensed Matter 33', '2020', []],
      ]),
    ],
  }),

  metro: persona('metro', {
    name: 'Nisha Gupta',
    title: 'HR Business Partner',
    email: 'nisha.gupta@gmail.com',
    phone: '+91 98110 78901',
    location: 'Noida, Uttar Pradesh',
    links: [['linkedin', 'linkedin.com/in/nishagupta-hr']],
    summary:
      'HR business partner with 8 years of experience across IT services and e-commerce. Passionate about building inclusive cultures, reducing attrition and making HR data-driven.',
    exp: [
      [
        'HR Business Partner',
        'Meghdoot Telecom',
        'Noida',
        'Mar 2020',
        '',
        [
          'Partner with 4 business heads covering 850 employees; cut attrition from 21% to 13% in 18 months',
          'Rolled out a hybrid-work policy with 92% employee approval',
          'Redesigned onboarding, reducing time-to-productivity by 3 weeks',
          'Run leadership-development cohorts for 60 managers with quarterly skip-level connects',
        ],
      ],
      [
        'Senior HR Executive',
        'Rangoli Retail',
        'New Delhi',
        'Jun 2016',
        'Feb 2020',
        [
          'Hired 400+ employees across corporate and store roles with a 28-day average time-to-fill',
          'Launched a recognition programme that lifted engagement scores by 14 points',
        ],
      ],
    ],
    edu: [
      ['Symbiosis Institute of Business Management', 'MBA', 'Human Resources', 'Pune', '2014', '2016'],
      ['Miranda House, University of Delhi', 'B.A.', 'Psychology', 'New Delhi', '2011', '2014'],
    ],
    skills: ['Talent Acquisition', 'Employee Engagement', 'HR Analytics', 'Labour Laws', 'Workday', 'Performance Management'],
    certs: [['People Analytics', 'Wharton (Coursera)', '2021']],
    awards: [['HR Champion of the Year', 'Meghdoot Telecom', '2022', '']],
    langs: [
      ['Hindi', 'Native'],
      ['English', 'Fluent'],
    ],
    projects: [['Inclusive Hiring Initiative', '', 'DEI · Talent acquisition', ['Raised women hires in technical roles from 18% to 31% in two years']]],
  }),

  prism: persona('prism', {
    name: 'Aditya Menon',
    title: 'Full-Stack Developer',
    email: 'aditya.menon@gmail.com',
    phone: '+91 94950 89012',
    location: 'Kochi, Kerala',
    links: [
      ['github', 'github.com/adityamenon'],
      ['linkedin', 'linkedin.com/in/adityamenon-dev'],
      ['portfolio', 'adityamenon.dev'],
    ],
    summary:
      'Full-stack developer with 4 years of experience building SaaS products with React, Node.js and PostgreSQL. Care deeply about performance, accessibility and clean APIs.',
    exp: [
      [
        'Full-Stack Developer',
        'Backwater Technologies',
        'Kochi',
        'Jul 2022',
        '',
        [
          'Shipped a multi-tenant analytics SaaS now used by 140 businesses across the GCC',
          'Cut API p95 latency from 820 ms to 190 ms with query tuning and Redis caching',
          'Mentor 3 junior developers and run weekly code reviews',
          'Introduced Playwright end-to-end tests, reducing regression bugs by 45%',
        ],
      ],
      [
        'Software Engineer',
        'Spice Route Digital',
        'Kochi',
        'Jun 2020',
        'Jun 2022',
        [
          'Built a booking engine processing ₹12 Cr a month for a boutique-hotel chain',
          'Improved the Lighthouse performance score from 54 to 96',
          'Integrated Razorpay with automated reconciliation, saving 15 hours of manual work a week',
        ],
      ],
    ],
    edu: [['National Institute of Technology Calicut', 'B.Tech', 'Computer Science', 'Kozhikode', '2016', '2020', 'CGPA 8.5 / 10']],
    skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'Tailwind CSS'],
    projects: [
      [
        'Cochin Transit',
        'github.com/adityamenon/cochin-transit',
        'Next.js · PWA',
        ['Open-source bus-timing app with 5k monthly users'],
      ],
      ['PocketLedger', 'github.com/adityamenon/pocketledger', 'React Native · SQLite', ['Offline-first expense tracker with 3k downloads and a 4.7★ rating']],
    ],
    certs: [['Meta Front-End Developer Certificate', 'Coursera', '2021']],
    awards: [['Winner – Kerala Startup Mission Hackathon', 'KSUM', '2021', 'Built a ferry-booking prototype in 24 hours']],
    langs: [
      ['Malayalam', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Intermediate'],
    ],
  }),

  harvard: persona('harvard', {
    name: 'Ishaan Kapoor',
    title: 'MBA Graduate · Strategy & Consulting',
    email: 'ishaan.kapoor@gmail.com',
    phone: '+91 98180 11223',
    location: 'New Delhi',
    links: [['linkedin', 'linkedin.com/in/ishaankapoor']],
    summary:
      'MBA graduate from IIM Ahmedabad with 2 years of prior experience in transaction advisory. Seeking a consulting or strategy role where structured thinking and client impact matter.',
    edu: [
      ['Indian Institute of Management Ahmedabad', 'PGP (MBA)', 'Finance & Strategy', 'Ahmedabad', '2022', '2024', 'Dean’s List (top 10%) · Convener, Consulting Club'],
      ['Shri Ram College of Commerce, University of Delhi', 'B.Com (Hons)', 'Commerce', 'New Delhi', '2018', '2021', '92.4% · Gold medallist'],
    ],
    exp: [
      [
        'Summer Associate',
        'Meridian Consulting',
        'Gurugram',
        'Apr 2023',
        'Jun 2023',
        [
          'Built a market-entry strategy for a ₹1,200 Cr FMCG player; recommendations adopted by the CXO team',
          'Interviewed 35 distributors across 6 states to size the Tier-2 opportunity',
        ],
      ],
      [
        'Business Analyst',
        'Kaveri Advisory',
        'New Delhi',
        'Jul 2021',
        'Apr 2022',
        [
          'Led diligence on 7 mid-market acquisitions (₹80–400 Cr enterprise value)',
          'Automated the valuation workflow, saving 12 hours per deal',
        ],
      ],
    ],
    skillGroups: [
      ['Technical', ['Excel (Advanced)', 'PowerPoint', 'Tableau', 'SQL']],
      ['Interests', ['Chess', 'Marathons', 'Carnatic music']],
    ],
    certs: [['CFA Level I Candidate', 'CFA Institute', '2024']],
    custom: (id) => [
      entrySection(id, 'lead', 'Leadership & extra-curricular', [
        ['President, Consulting Club', 'IIM Ahmedabad', '2023 – 2024', ['Ran 18 case workshops for 300 students']],
        ['Captain, Debating Team', 'University of Delhi', '2020', ['Led the team to the inter-university finals']],
      ]),
    ],
  }),

  engineer: persona('engineer', {
    name: 'Siddharth Rao',
    title: 'B.Tech Computer Science Student',
    email: 'siddharth.rao.cse@gmail.com',
    phone: '+91 98450 22334',
    location: 'Mangaluru, Karnataka',
    links: [
      ['github', 'github.com/sidrao'],
      ['linkedin', 'linkedin.com/in/siddharth-rao-cse'],
      ['leetcode', 'leetcode.com/u/sidrao', 'leetcode.com/sidrao'],
    ],
    summary: '',
    edu: [
      [
        'National Institute of Technology Karnataka',
        'B.Tech',
        'Computer Science and Engineering',
        'Surathkal',
        'Aug 2021',
        'May 2025',
        'CGPA 9.12 / 10 · Dean’s Merit List (6 semesters)\nCoursework: Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks, Machine Learning',
      ],
    ],
    exp: [
      [
        'Software Engineering Intern',
        'Nimbus Cloud Technologies',
        'Bengaluru',
        'May 2024',
        'Jul 2024',
        [
          'Built a rate-limiter service in Go handling 25k req/s, reducing API abuse by 63%',
          'Wrote 140+ unit tests, raising service coverage from 58% to 91%',
        ],
      ],
      [
        'Summer Research Intern',
        'NITK – Dept. of Computer Science',
        'Surathkal',
        'May 2023',
        'Jul 2023',
        ['Trained a BERT-based classifier for Kannada news articles (F1 0.91) and open-sourced the dataset'],
      ],
    ],
    projects: [
      [
        'LeaseLedger',
        'github.com/sidrao/leaseledger',
        'React · Node.js · PostgreSQL',
        ['Rental-agreement tracker used by 300+ students; 99.9% uptime on a free tier'],
      ],
      [
        'KannadaBERT-Lite',
        'github.com/sidrao/kannada-bert',
        'PyTorch · Hugging Face',
        ['Distilled language model 4× smaller than baseline with 96% of its accuracy'],
      ],
    ],
    skillGroups: [
      ['Languages', ['Java', 'C++', 'Python', 'Go', 'SQL', 'JavaScript']],
      ['Frameworks', ['React', 'Node.js', 'Spring Boot', 'Flask']],
      ['Tools', ['Git', 'Docker', 'AWS', 'Linux']],
    ],
    awards: [
      ['ICPC Asia-West Regionalist', 'ICPC', '2023', ''],
      ['Smart India Hackathon – Finalist', 'Govt. of India', '2022', ''],
    ],
    langs: [
      ['Kannada', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Fluent'],
    ],
  }),

  euro: persona('euro', {
    name: 'Lakshmi Narayanan',
    title: 'Senior Business Analyst',
    email: 'lakshmi.narayanan@gmail.com',
    phone: '+91 98400 33445',
    location: 'Chennai, Tamil Nadu',
    links: [['linkedin', 'linkedin.com/in/lakshmi-narayanan-ba']],
    summary:
      'Business analyst with 7 years of experience in banking and insurance IT, translating requirements into clear specifications and measurable outcomes.',
    exp: [
      [
        'Senior Business Analyst',
        'Cauvery Bank Ltd.',
        'Chennai',
        'Feb 2021',
        '',
        [
          'Documented requirements for a retail-lending revamp used by 3,400 branches',
          'Reduced loan-processing turnaround from 6 days to 2 via BPMN-led process redesign',
          'Facilitated 60+ workshops across business, compliance and engineering',
          'Built a requirements-traceability toolkit now used by 3 delivery teams',
        ],
      ],
      [
        'Business Analyst',
        'Kaveri Systems',
        'Chennai',
        'Jul 2017',
        'Jan 2021',
        [
          'Authored 150+ user stories and acceptance tests for a policy-administration platform',
          'Cut UAT defects by 29% with traceability matrices',
          'Mapped 40+ as-is and to-be processes in BPMN for a core-banking upgrade',
        ],
      ],
    ],
    edu: [
      ['Loyola Institute of Business Administration', 'MBA', 'Systems & Operations', 'Chennai', '2015', '2017'],
      ['College of Engineering, Guindy (Anna University)', 'B.Tech', 'Information Technology', 'Chennai', '2011', '2015'],
    ],
    skills: ['Requirements elicitation', 'BPMN', 'SQL', 'Jira', 'Confluence', 'Power BI', 'UAT', 'Agile'],
    projects: [['Loan-journey dashboard', '', 'Power BI · SQL', ['Built a real-time dashboard tracking 18 KPIs for the lending PMO']]],
    awards: [['Star Performer – Q3 FY23', 'Cauvery Bank Ltd.', '2023', '']],
    certs: [
      ['ECBA', 'IIBA', '2019'],
      ['Professional Scrum Master I', 'Scrum.org', '2020'],
    ],
    langs: [
      ['Tamil', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Intermediate'],
      ['French', 'Basic'],
    ],
  }),

  fresher: persona('fresher', {
    name: 'Pooja Yadav',
    title: 'B.Com Graduate · Accounts & Finance',
    email: 'pooja.yadav2002@gmail.com',
    phone: '+91 94150 44556',
    location: 'Lucknow, Uttar Pradesh',
    links: [['linkedin', 'linkedin.com/in/pooja-yadav-commerce']],
    summary:
      'Motivated B.Com graduate seeking an entry-level accounts or finance role where I can apply my knowledge of Tally, GST and MS Excel while learning from industry professionals.',
    edu: [
      ['University of Lucknow', 'B.Com', 'Commerce', 'Lucknow', '2020', '2023', 'First Division · 78.4%'],
    ],
    exp: [
      [
        'Accounts Intern',
        'Gomti Traders',
        'Lucknow',
        'Jun 2022',
        'Aug 2022',
        [
          'Maintained purchase and sales ledgers in Tally Prime for 120+ parties',
          'Prepared monthly GSTR-1 and GSTR-3B returns with zero late fees',
        ],
      ],
    ],
    projects: [
      [
        'Ratio analysis of three listed FMCG companies',
        '',
        'Academic project',
        ['Compared liquidity and profitability ratios (FY19–FY22) for a faculty panel'],
      ],
    ],
    skills: ['Tally Prime', 'GST filing', 'MS Excel', 'Bookkeeping', 'Typing 45 WPM', 'Communication'],
    certs: [['Tally Prime with GST', 'Tally Education', '2022']],
    langs: [
      ['Hindi', 'Native'],
      ['English', 'Fluent'],
    ],
    custom: (id) => [
      details(id, [
        ['Date of birth', '12 March 2002'],
        ['Nationality', 'Indian'],
      ]),
      textSection(id, 'decl', 'Declaration', DECLARATION),
    ],
  }),

  campus: persona('campus', {
    name: 'Harsh Patel',
    title: 'Mechanical Engineering Graduate',
    email: 'harsh.patel@gmail.com',
    phone: '+91 98250 55667',
    location: 'Ahmedabad, Gujarat',
    links: [['linkedin', 'linkedin.com/in/harshpatel-mech']],
    summary:
      'Final-year mechanical engineering student with hands-on experience in CAD, 3D printing and lean manufacturing. Seeking a graduate engineer trainee role in automotive or process industries.',
    edu: [
      ['L.D. College of Engineering', 'B.E.', 'Mechanical Engineering', 'Ahmedabad', '2020', '2024', 'CGPA 8.6 / 10 (Gujarat Technological University)'],
      ['Sardar Patel Vidyalaya', 'Class XII (GSEB)', 'Science', 'Ahmedabad', '2019', '2020', '92.4%'],
    ],
    exp: [
      [
        'Engineering Intern',
        'Narmada Auto Components',
        'Sanand',
        'May 2023',
        'Jul 2023',
        [
          'Reduced die-changeover time by 18% using SMED on a 400-tonne press line',
          'Prepared 12 CAD drawings and bills of materials for new fixtures',
        ],
      ],
    ],
    projects: [
      [
        'Formula student chassis – Team Aero Racers',
        '',
        'SolidWorks · ANSYS',
        ['Led chassis & suspension design (−14% mass); team ranked 7th of 42 at the national event'],
      ],
      ['Solar-powered e-rickshaw prototype', '', 'CATIA · MATLAB', ['Designed a 1.2 kW drivetrain with 38 km range']],
    ],
    skills: ['SolidWorks', 'AutoCAD', 'ANSYS', 'CATIA', 'MATLAB', '3D printing', 'Lean (5S, SMED)', 'MS Excel'],
    certs: [
      ['Certified SolidWorks Associate', 'Dassault Systèmes', '2022'],
      ['Six Sigma Yellow Belt', 'KPMG India', '2023'],
    ],
    langs: [
      ['Gujarati', 'Native'],
      ['Hindi', 'Fluent'],
      ['English', 'Fluent'],
    ],
    awards: [['Runner-up – State Robotics Challenge', 'GTU', '2022', '']],
    custom: (id) => [bulletSection(id, 'por', 'Positions of responsibility', ['Technical Secretary – Mechanical Engineering Society (2022–23)', 'Volunteer – Rotaract blood-donation drive; mobilised 300+ donors', 'Member – Institution of Engineers (India), student chapter'])],
  }),

  simple: persona('simple', {
    name: 'Divya Joshi',
    title: 'Customer Success Manager',
    email: 'divya.joshi@gmail.com',
    phone: '+91 98270 66778',
    location: 'Indore, Madhya Pradesh',
    links: [['linkedin', 'linkedin.com/in/divyajoshi-cs']],
    summary:
      'Customer success manager with 6 years of experience in B2B SaaS. Managed a ₹18 Cr book of business with 97% gross retention and 128% net revenue retention.',
    exp: [
      [
        'Customer Success Manager',
        'CloudKaro Software',
        'Indore',
        'Jan 2021',
        '',
        [
          'Own 45 mid-market accounts (₹18 Cr ARR) with 97% gross retention',
          'Built an onboarding playbook that cut time-to-value from 42 to 19 days',
          'Upsold 14 accounts, adding ₹2.6 Cr in expansion revenue',
        ],
      ],
      [
        'Customer Support Lead',
        'Tarang Cloud',
        'Indore',
        'Jul 2018',
        'Dec 2020',
        [
          'Led a 12-member support team with 96% CSAT and under 2-hour first response',
          'Created a knowledge base that deflected 31% of tickets',
        ],
      ],
    ],
    edu: [
      ['Devi Ahilya Vishwavidyalaya', 'MBA', 'Marketing', 'Indore', '2016', '2018'],
      ['Holkar Science College', 'B.Com', 'Commerce', 'Indore', '2013', '2016'],
    ],
    skills: ['Customer onboarding', 'Account management', 'Churn reduction', 'Salesforce', 'Freshdesk', 'NPS', 'SQL (basic)', 'Presentations'],
    certs: [['Customer Success Certification', 'Gainsight', '2022']],
    langs: [
      ['Hindi', 'Native'],
      ['English', 'Fluent'],
      ['Marathi', 'Intermediate'],
    ],
    awards: [['Customer Champion Award', 'CloudKaro Software', '2022', '']],
  }),

  corporate: persona('corporate', {
    name: 'Sandeep Chaudhary',
    title: 'Regional Sales Manager',
    email: 'sandeep.chaudhary@gmail.com',
    phone: '+91 98760 77889',
    location: 'Chandigarh',
    links: [['linkedin', 'linkedin.com/in/sandeepchaudhary-sales']],
    summary:
      'Results-driven sales manager with 11 years of experience in FMCG and building materials. Consistently exceeded targets and built distribution networks across Punjab, Haryana and Himachal Pradesh.',
    exp: [
      [
        'Regional Sales Manager',
        'Punjab Prime Foods',
        'Chandigarh',
        'Apr 2019',
        '',
        [
          'Lead a 28-member team across 3 states; delivered ₹148 Cr revenue (112% of target) in FY24',
          'Expanded the distributor network from 64 to 112, adding 9,000 retail outlets',
          'Lifted secondary sales by 24% through beat-planning and incentive redesign',
          'Launched a four-city modern-trade programme worth ₹26 Cr in its first year',
        ],
      ],
      [
        'Area Sales Manager',
        'Himalaya Building Materials',
        'Ludhiana',
        'Jun 2014',
        'Mar 2019',
        [
          'Grew territory sales from ₹32 Cr to ₹61 Cr in four years',
          'Won the national “Best Territory” award twice',
          'Trained 40 field executives, improving productivity by 22%',
        ],
      ],
    ],
    edu: [
      ['Panjab University', 'MBA', 'Sales & Marketing', 'Chandigarh', '2010', '2012'],
      ['Panjab University', 'B.Com', 'Commerce', 'Chandigarh', '2007', '2010'],
    ],
    skills: ['Key account management', 'Distribution', 'Forecasting', 'CRM', 'Negotiation', 'Team building', 'MS Excel'],
    langs: [
      ['Hindi', 'Native'],
      ['Punjabi', 'Native'],
      ['English', 'Fluent'],
    ],
    certs: [['Strategic Sales Management', 'Executive Education Programme', '2021']],
    awards: [
      ['Top Regional Performer FY23', 'Punjab Prime Foods', '2023', ''],
      ['Best Distributor Development Initiative', 'Punjab Prime Foods', '2021', ''],
    ],
  }),

  elegant: persona('elegant', {
    name: 'Radhika Banerjee',
    title: 'Senior Content Editor',
    email: 'radhika.banerjee@gmail.com',
    phone: '+91 98300 88990',
    location: 'Kolkata, West Bengal',
    links: [
      ['linkedin', 'linkedin.com/in/radhikabanerjee'],
      ['medium', 'medium.com/@radhika.writes'],
    ],
    summary:
      'Editor and content strategist with 9 years of experience in publishing and digital media. Shaped editorial voice for platforms reaching 6M monthly readers, in English and Bengali.',
    exp: [
      [
        'Senior Content Editor',
        'Tarang Media',
        'Kolkata',
        'Jun 2020',
        '',
        [
          'Edit 40+ long-form features a month; grew organic traffic by 62% year on year',
          'Launched a Bengali vertical with 1.1M monthly readers within 9 months',
          'Mentor a team of 7 writers',
        ],
      ],
      [
        'Editor',
        'Pratham Prakashan',
        'Kolkata',
        'Jul 2015',
        'May 2020',
        ['Acquired and edited 24 titles, including 3 regional bestsellers', 'Introduced a style guide adopted across the imprint'],
      ],
    ],
    edu: [
      ['Jadavpur University', 'M.A.', 'English Literature', 'Kolkata', '2012', '2014'],
      ['Presidency University', 'B.A. (Hons)', 'English', 'Kolkata', '2009', '2012'],
    ],
    skills: ['Editing', 'Content strategy', 'SEO', 'Copywriting', 'WordPress', 'Google Analytics', 'Translation (EN–BN)'],
    langs: [
      ['Bengali', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Fluent'],
    ],
    awards: [['Digital Editor of the Year – Finalist', 'Media Excellence Awards', '2022', '']],
    certs: [['Professional Copy-editing Certificate', 'Calcutta Publishing Institute', '2018']],
    custom: (id) => [bulletSection(id, 'pub', 'Publications', ['Editor – “Kolkata Reads” short-fiction anthology (2021)', 'Contributor – regional literary magazines and online journals'])],
  }),

  banker: persona('banker', {
    name: 'Arjun Bhatia',
    title: 'Senior Relationship Manager – Wealth',
    email: 'arjun.bhatia@gmail.com',
    phone: '+91 98190 99001',
    location: 'Mumbai, Maharashtra',
    links: [['linkedin', 'linkedin.com/in/arjunbhatia-wealth']],
    summary:
      'Relationship manager with 8 years of experience in private banking and wealth management. Manages a ₹420 Cr AUM portfolio for 85 HNI families with 98% client retention.',
    exp: [
      [
        'Senior Relationship Manager – Wealth',
        'Konkan Private Bank',
        'Mumbai',
        'Jun 2019',
        '',
        [
          'Manage ₹420 Cr AUM across 85 HNI / UHNI families with 98% retention',
          'Grew the portfolio by ₹135 Cr in 3 years by cross-selling PMS, AIFs and insurance',
          'Ranked in the top 5% of relationship managers nationally in FY22 and FY23',
        ],
      ],
      [
        'Relationship Manager',
        'Indus Bank',
        'Pune',
        'Jul 2016',
        'May 2019',
        ['Acquired 140 new-to-bank relationships worth ₹90 Cr in deposits and investments'],
      ],
    ],
    edu: [
      ['NMIMS School of Business Management', 'MBA', 'Finance', 'Mumbai', '2013', '2015'],
      ['H.R. College of Commerce & Economics', 'B.Com', 'Commerce', 'Mumbai', '2010', '2013'],
    ],
    skills: ['Wealth management', 'Portfolio advisory', 'Risk profiling', 'Mutual funds', 'PMS & AIFs', 'KYC / AML', 'CRM', 'Negotiation'],
    certs: [
      ['NISM Series V-A – Mutual Fund Distributors', 'NISM', '2016'],
      ['AMFI Registered Mutual Fund Distributor', 'AMFI', '2017'],
    ],
    langs: [
      ['Hindi', 'Native'],
      ['English', 'Fluent'],
      ['Marathi', 'Intermediate'],
    ],
    awards: [['Platinum Club – Top 5% Relationship Managers', 'Konkan Private Bank', '2023', '']],
  }),

  ledger: persona('ledger', {
    name: 'Neha Agarwal',
    title: 'Chartered Accountant (CA)',
    email: 'neha.agarwal.ca@gmail.com',
    phone: '+91 98710 10112',
    location: 'New Delhi',
    links: [['linkedin', 'linkedin.com/in/neha-agarwal-ca']],
    summary:
      'Chartered Accountant with 7 years of experience in audit and direct and indirect taxation. Handled statutory audits for 30+ listed and unlisted clients and GST compliance for ₹900 Cr turnover.',
    exp: [
      [
        'Assistant Manager – Audit & Assurance',
        'Shah Mehra & Co.',
        'New Delhi',
        'Jun 2019',
        '',
        [
          'Led statutory audits of 12 companies (turnover up to ₹1,800 Cr) with zero qualified reports',
          'Identified ₹14 Cr of input-tax-credit mismatches during GST audits',
          'Trained 8 articled assistants',
        ],
      ],
      [
        'Senior Associate – Taxation',
        'Bharat Advisors',
        'Gurugram',
        'Jul 2016',
        'May 2019',
        ['Managed direct-tax assessments for 40 corporate clients; successful appeals saved ₹6.2 Cr'],
      ],
    ],
    edu: [
      ['The Institute of Chartered Accountants of India', 'Chartered Accountancy (CA)', '', 'New Delhi', '2011', '2014', 'All India Rank 38 · Cleared both groups in first attempt'],
      ['Shri Ram College of Commerce, University of Delhi', 'B.Com (Hons)', 'Commerce', 'New Delhi', '2011', '2014'],
    ],
    skills: ['Statutory audit', 'Income tax', 'GST', 'Transfer pricing', 'Ind AS / IFRS', 'Tally', 'SAP FICO', 'Advanced Excel', 'Internal controls'],
    certs: [
      ['Diploma in IFRS', 'ICAI', '2018'],
      ['Forensic Accounting & Fraud Detection (FAFD)', 'ICAI', '2020'],
    ],
    langs: [
      ['Hindi', 'Native'],
      ['English', 'Fluent'],
    ],
  }),

  analyst: persona('analyst', {
    name: 'Karthik Subramaniam',
    title: 'Equity Research Analyst – Technology',
    email: 'karthik.subramaniam@gmail.com',
    phone: '+91 98450 11223',
    location: 'Bengaluru, Karnataka',
    links: [['linkedin', 'linkedin.com/in/karthik-subramaniam']],
    summary:
      'Equity research analyst covering IT services and mid-cap technology. 5 years of buy-side and sell-side experience; recommendations delivered 24% average alpha over the Nifty IT index.',
    exp: [
      [
        'Research Analyst – Technology',
        'Cauvery Asset Management',
        'Bengaluru',
        'Jun 2021',
        '',
        [
          'Cover 16 IT and internet names (₹9.4 lakh crore market cap); initiated 5 stocks with 24% average alpha over Nifty IT',
          'Built a channel-check framework that flagged margin pressure two quarters before consensus',
          'Present weekly to the investment committee of a ₹2,800 Cr fund',
        ],
      ],
      [
        'Associate – Equity Research',
        'Sahyadri Securities',
        'Mumbai',
        'Jul 2019',
        'May 2021',
        ['Published 30 earnings notes and 4 thematic reports on digital transformation'],
      ],
    ],
    edu: [
      ['XLRI – Xavier School of Management', 'MBA', 'Finance', 'Jamshedpur', '2017', '2019'],
      ['PES University', 'B.E.', 'Electronics & Communication', 'Bengaluru', '2013', '2017'],
    ],
    skillGroups: [
      ['Valuation', ['DCF', 'Comparables', 'SOTP']],
      ['Tools', ['Bloomberg', 'Capital IQ', 'Excel / VBA', 'Python']],
      ['Coverage', ['IT services', 'SaaS', 'Internet']],
    ],
    certs: [
      ['CFA Level II – Cleared', 'CFA Institute', '2022'],
      ['FRM Part I', 'GARP', '2021'],
    ],
    langs: [
      ['English', 'Fluent'],
      ['Tamil', 'Native'],
      ['Kannada', 'Fluent'],
    ],
    awards: [
      ['Best Newcomer Analyst', 'Sahyadri Securities', '2019', ''],
      ['Top-rated Technology Analyst', 'Cauvery Asset Management', '2023', 'Buy-side analyst survey'],
    ],
    custom: (id) => [bulletSection(id, 'pub', 'Research & publications', ['Author – “India’s SaaS margin story”, sector note (2023)', 'Coverage: 18 listed technology companies, ₹7.5 lakh Cr combined market cap'])],
  }),

  consultant: persona('consultant', {
    name: 'Shreya Mukherjee',
    title: 'Senior Management Consultant',
    email: 'shreya.mukherjee@gmail.com',
    phone: '+91 98730 12121',
    location: 'Gurugram, Haryana',
    links: [['linkedin', 'linkedin.com/in/shreyamukherjee']],
    summary:
      'Management consultant with 6 years of experience advising CPG, healthcare and public-sector clients on growth strategy and operating-model redesign across India and Southeast Asia.',
    exp: [
      [
        'Senior Consultant',
        'Meridian Consulting',
        'Gurugram',
        'Jun 2020',
        '',
        [
          'Led a go-to-market redesign for a ₹3,500 Cr consumer-health business, unlocking ₹210 Cr in incremental revenue',
          'Built a 5-year hospital-network expansion plan for a state government, adopted by the health ministry',
          'Manage a team of 4 analysts across 3 simultaneous engagements',
          'Won and led 3 follow-on engagements worth ₹6.4 Cr in fees',
        ],
      ],
      [
        'Associate',
        'Kautilya Advisory',
        'New Delhi',
        'Jul 2017',
        'May 2019',
        [
          'Analysed 2.4M transactions to redesign a pricing architecture, improving margin by 3.2 points',
          'Supported four CXO and board workshops on market-entry and portfolio choices',
        ],
      ],
    ],
    edu: [
      ['Indian School of Business', 'PGP', 'Strategy & Finance', 'Hyderabad', '2019', '2020', 'Dean’s Merit List'],
      ['Indian Institute of Technology Kharagpur', 'B.Tech', 'Industrial & Systems Engineering', 'Kharagpur', '2013', '2017'],
    ],
    skills: ['Strategy', 'Market entry', 'Pricing', 'Operating models', 'Data analysis', 'Storytelling', 'Excel / PowerPoint'],
    certs: [['Strategy Certificate', 'HBS Online', '2021']],
    langs: [
      ['Bengali', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Fluent'],
    ],
    awards: [['Best Case Competitor', 'ISB Consulting Club', '2020', '']],
  }),
}
