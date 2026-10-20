import type { ResumeData } from '@/types'
import { bulletSection, details, entrySection, persona, tagSection } from './kit'

/* Personas 25–50. Companies are fictional; institutions are real (they only appear as places of study). */

export const PART2: Record<string, ResumeData> = {
  contemporary: persona('contemporary', {
    name: 'Tanvi Bhatt',
    title: 'Marketing Manager',
    email: 'tanvi.bhatt@gmail.com',
    phone: '+91 98250 31415',
    location: 'Surat, Gujarat',
    links: [
      ['linkedin', 'linkedin.com/in/tanvibhatt'],
      ['instagram', 'instagram.com/tanvi.creates'],
    ],
    summary:
      'Marketing manager with 7 years of experience in textiles and lifestyle brands. Built omnichannel campaigns that grew online revenue 3.4× and lowered CAC by 31%.',
    exp: [
      [
        'Marketing Manager',
        'Tapi Textiles Pvt. Ltd.',
        'Surat',
        'Aug 2021',
        '',
        [
          'Grew online revenue from ₹14 Cr to ₹48 Cr through marketplaces, D2C and influencer partnerships',
          'Lowered blended CAC by 31% by shifting spend to Meta catalogue ads and WhatsApp commerce',
          'Lead a team of 9 across content, performance and CRM',
        ],
      ],
      [
        'Senior Marketing Executive',
        'Rangoli Lifestyle',
        'Ahmedabad',
        'Jun 2017',
        'Jul 2021',
        [
          'Launched 6 seasonal collections with campaigns reaching 2.5 Cr people',
          'Doubled email-driven revenue with segmentation and lifecycle flows',
        ],
      ],
    ],
    edu: [
      ['Nirma University', 'MBA', 'Marketing', 'Ahmedabad', '2015', '2017', 'CGPA 8.4 / 10'],
      ['Veer Narmad South Gujarat University', 'B.Com', 'Commerce', 'Surat', '2012', '2015'],
    ],
    skills: ['Brand strategy', 'Performance marketing', 'CRM & WhatsApp commerce', 'Google Analytics', 'Meta Ads', 'Influencer marketing', 'Team leadership'],
    certs: [['Google Ads Certification', 'Google', '2023']],
    langs: [
      ['Gujarati', 'Native'],
      ['Hindi', 'Fluent'],
      ['English', 'Fluent'],
    ],
    projects: [['Handloom revival campaign', '', 'Brand · Social · Retail', ['Drove a 36% sales lift across 120 stores in three months']]],
    awards: [['Best Campaign – Home Textiles', 'Surat Marketing Club', '2023', '']],
  }),

  compact: persona('compact', {
    name: 'Amit Khanna',
    title: 'Senior Manager – Supply Chain',
    email: 'amit.khanna@gmail.com',
    phone: '+91 98100 27182',
    location: 'Faridabad, Haryana',
    links: [['linkedin', 'linkedin.com/in/amitkhanna-scm']],
    summary:
      'Supply-chain professional with 13 years of experience across procurement, planning and logistics for consumer-electronics and auto-component companies. Saved ₹38 Cr through strategic sourcing.',
    exp: [
      [
        'Senior Manager – Supply Chain',
        'Bhartiya Electronics',
        'Noida',
        'Apr 2019',
        '',
        [
          'Run planning, sourcing and logistics for a ₹1,900 Cr business with 140 suppliers',
          'Cut inventory days from 71 to 49 via S&OP and demand-sensing, freeing ₹86 Cr of cash',
          'Renegotiated 22 contracts, saving ₹38 Cr over three years',
          'Digitised vendor onboarding on SAP Ariba, cutting PO cycle time from 9 days to 3',
          'Lead a 14-member team across planning, sourcing and logistics',
        ],
      ],
      [
        'Manager – Procurement',
        'Aravalli Auto Components',
        'Gurugram',
        'Jun 2014',
        'Mar 2019',
        [
          'Localised 60 imported parts, reducing landed cost by 17%',
          'Built a supplier-scorecard system adopted across 4 plants',
          'Introduced vendor-managed inventory with 11 key suppliers, reducing stock-outs by 31%',
        ],
      ],
      [
        'Assistant Manager – Logistics',
        'Yamuna Logistics',
        'Faridabad',
        'Jul 2011',
        'May 2014',
        ['Optimised milk-run routes, lowering freight cost by 12%', 'Reduced transit damages from 2.1% to 0.6% with revised packaging standards'],
      ],
    ],
    edu: [
      ['Management Development Institute', 'PGDM', 'Operations', 'Gurugram', '2009', '2011'],
      ['J.C. Bose University of Science & Technology', 'B.E.', 'Mechanical Engineering', 'Faridabad', '2005', '2009'],
    ],
    skills: ['S&OP', 'Strategic sourcing', 'Negotiation', 'SAP MM / APO', 'Inventory optimisation', 'Logistics', 'Supplier development', 'Excel'],
    certs: [['CSCP – Certified Supply Chain Professional', 'APICS', '2018']],
    awards: [['Supply Chain Leader of the Year', 'Bhartiya Electronics', '2022', 'For the ₹86 Cr working-capital release programme']],
    langs: [
      ['Hindi', 'Native'],
      ['Punjabi', 'Fluent'],
      ['English', 'Fluent'],
    ],
    projects: [['S&OP transformation programme', '', 'SAP APO · Power BI', ['Led a nine-month cross-functional programme that lifted forecast accuracy from 62% to 81%']]],
  }),

  duo: persona('duo', {
    name: 'Farhan Sheikh',
    title: 'Mobile App Developer (Android & Flutter)',
    email: 'farhan.sheikh@gmail.com',
    phone: '+91 99590 16180',
    location: 'Hyderabad, Telangana',
    links: [
      ['github', 'github.com/farhansheikh'],
      ['linkedin', 'linkedin.com/in/farhan-sheikh-dev'],
      ['portfolio', 'farhan.dev'],
    ],
    summary:
      'Mobile developer with 5 years of experience building consumer apps for 4M+ users. Fluent in Kotlin and Flutter, with a strong eye for smooth animation and offline-first design.',
    exp: [
      [
        'Senior Android Developer',
        'Charminar Labs',
        'Hyderabad',
        'Feb 2022',
        '',
        [
          'Lead the Android app (4.6★, 4M installs); reduced crash rate from 1.8% to 0.2%',
          'Migrated the UI to Jetpack Compose, cutting screen-build time by 40%',
          'Mentor 4 developers and run the release train',
          'Added baseline profiles and startup tracing, cutting cold-start time by 35%',
        ],
      ],
      [
        'Flutter Developer',
        'Deccan Digital',
        'Hyderabad',
        'Jul 2019',
        'Jan 2022',
        [
          'Built a cross-platform food-ordering app handling ₹6 Cr in monthly orders',
          'Implemented offline sync that kept the app usable on 2G networks',
          'Integrated UPI and card payments, lifting checkout success to 94%',
        ],
      ],
      [
        'Android Developer Intern',
        'Nizam Apps',
        'Hyderabad',
        'Jan 2019',
        'Jun 2019',
        ['Built a live bus-tracking feature used by 20,000 riders', 'Reduced APK size by 28% with resource shrinking'],
      ],
    ],
    edu: [['JNTU Hyderabad', 'B.Tech', 'Computer Science', 'Hyderabad', '2015', '2019', 'CGPA 8.2 / 10']],
    skills: ['Kotlin', 'Flutter / Dart', 'Jetpack Compose', 'Firebase', 'REST & GraphQL', 'CI/CD', 'Figma'],
    projects: [
      ['Offline Notes', 'github.com/farhansheikh/offline-notes', 'Flutter · SQLite', ['Local-first notes app with end-to-end encrypted sync; 12k installs']],
      ['Pixel Pals', 'github.com/farhansheikh/pixel-pals', 'Kotlin · Compose', ['Open-source sticker keyboard with 40k downloads and a 4.8★ rating']],
    ],
    certs: [['Associate Android Developer', 'Google', '2021']],
    awards: [['Winner – Smart India Hackathon (Software)', 'Ministry of Education', '2018', '']],
    langs: [
      ['Urdu', 'Native'],
      ['Telugu', 'Fluent'],
      ['English', 'Fluent'],
    ],
  }),

  launch: persona('launch', {
    name: 'Kavya Pillai',
    title: 'Product Marketing Manager',
    email: 'kavya.pillai@gmail.com',
    phone: '+91 98450 14142',
    location: 'Bengaluru, Karnataka',
    links: [
      ['linkedin', 'linkedin.com/in/kavyapillai'],
      ['portfolio', 'kavyapillai.com'],
    ],
    summary:
      'Product marketer who has launched 12 B2B and consumer products at fast-growing startups. Blends positioning, storytelling and growth experiments to move pipeline and adoption.',
    exp: [
      [
        'Product Marketing Manager',
        'Taskwala (Series B)',
        'Bengaluru',
        'May 2022',
        '',
        [
          'Own positioning and launches for a SaaS suite used by 6,000 SMEs; influenced ₹22 Cr in ARR',
          'Rewrote onboarding emails and in-app tours, lifting trial-to-paid conversion from 9% to 14%',
          'Run win/loss interviews that reshaped the 2024 roadmap',
          'Built a sales-enablement hub that shortened new-rep ramp-up from 10 to 6 weeks',
        ],
      ],
      [
        'Growth Marketer',
        'Mithai Box (D2C)',
        'Bengaluru',
        'Jun 2019',
        'Apr 2022',
        [
          'Scaled monthly orders from 1,800 to 22,000 with creative testing and referral loops',
          'Launched a subscription tier contributing 28% of revenue in 8 months',
          'Ran creator partnerships that drove 18% of new customers at a 40% lower CAC',
        ],
      ],
    ],
    edu: [
      ['Christ University', 'MBA', 'Marketing & Analytics', 'Bengaluru', '2017', '2019'],
      ['Mount Carmel College', 'B.A.', 'Journalism & Psychology', 'Bengaluru', '2014', '2017'],
    ],
    skills: ['Positioning', 'GTM strategy', 'Storytelling', 'Customer research', 'HubSpot', 'Mixpanel', 'SEO', 'Webflow'],
    certs: [['Product Marketing Certification', 'Pragmatic Institute', '2021']],
    awards: [['Marketer of the Year – Startups', 'Bengaluru Marketing Forum', '2023', '']],
    langs: [
      ['English', 'Fluent'],
      ['Malayalam', 'Native'],
      ['Kannada', 'Intermediate'],
    ],
  }),

  mint: persona('mint', {
    name: 'Ritika Saxena',
    title: 'QA Automation Engineer',
    email: 'ritika.saxena@gmail.com',
    phone: '+91 98100 17321',
    location: 'Noida, Uttar Pradesh',
    links: [
      ['linkedin', 'linkedin.com/in/ritikasaxena-qa'],
      ['github', 'github.com/ritika-qa'],
    ],
    summary:
      'QA engineer with 6 years of experience in test automation and performance testing for fintech and e-commerce platforms. Believes quality is a team sport.',
    exp: [
      [
        'Senior QA Automation Engineer',
        'Zenith Fintech',
        'Noida',
        'Mar 2021',
        '',
        [
          'Built a Playwright + API test framework covering 85% of critical flows; regression time cut from 2 days to 40 minutes',
          'Introduced contract testing across 14 microservices, preventing 30+ production incidents',
          'Mentor 5 QA engineers',
        ],
      ],
      [
        'QA Engineer',
        'Pranav Infosolutions',
        'Gurugram',
        'Jul 2018',
        'Feb 2021',
        [
          'Automated 600+ Selenium test cases and integrated them with Jenkins',
          'Led load tests for a sale event with 120k concurrent users',
        ],
      ],
    ],
    edu: [['Ambedkar Institute of Advanced Communication Technologies', 'B.Tech', 'Information Technology', 'New Delhi', '2014', '2018']],
    skills: ['Playwright', 'Selenium', 'Cypress', 'Postman / REST Assured', 'JMeter', 'Java', 'Python', 'CI/CD'],
    certs: [['ISTQB Advanced Level – Test Automation Engineer', 'ISTQB', '2022']],
    langs: [
      ['Hindi', 'Native'],
      ['English', 'Fluent'],
    ],
    projects: [['pytest-visual', 'github.com/ritikasaxena/pytest-visual', 'Python · Pytest', ['Visual-regression plugin with 600+ GitHub stars']]],
    awards: [['Quality Champion', 'Zenith Fintech', '2023', '']],
  }),

  horizon: persona('horizon', {
    name: 'Manish Tiwari',
    title: 'Business Development Manager',
    email: 'manish.tiwari@gmail.com',
    phone: '+91 98260 28284',
    location: 'Bhopal, Madhya Pradesh',
    links: [['linkedin', 'linkedin.com/in/manishtiwari-bd']],
    summary:
      'Business development manager with 8 years of experience selling enterprise software and solar solutions to SMEs and public-sector clients across Central India.',
    exp: [
      [
        'Business Development Manager',
        'Sunrise Solar Solutions',
        'Bhopal',
        'Mar 2020',
        '',
        [
          'Closed ₹64 Cr in rooftop-solar contracts across 40 industrial clients (118% of target)',
          'Built a channel-partner network of 35 installers across MP and Chhattisgarh',
          'Shortened the sales cycle from 94 to 61 days through a standardised ROI calculator',
        ],
      ],
      [
        'Senior Sales Executive',
        'Madhya ERP Systems',
        'Indore',
        'Jul 2016',
        'Feb 2020',
        ['Sold ERP and GST software to 120+ SMEs; ranked #1 in the region for three consecutive years'],
      ],
    ],
    edu: [
      ['Barkatullah University', 'MBA', 'Marketing', 'Bhopal', '2014', '2016'],
      ['Rajiv Gandhi Proudyogiki Vishwavidyalaya', 'B.E.', 'Electrical Engineering', 'Bhopal', '2010', '2014'],
    ],
    skills: [['Enterprise sales', 5], ['Lead generation', 5], ['Negotiation', 4], ['CRM (Zoho)', 4], ['Proposal writing', 4], ['Channel management', 4], ['Presentations', 3]],
    langs: [
      ['Hindi', 'Native'],
      ['English', 'Fluent'],
    ],
    awards: [['Regional Sales Champion', 'Sunrise Solar', '2022', '']],
  }),

  pulse: persona('pulse', {
    name: 'Aisha Khan',
    title: 'Social Media Manager',
    email: 'aisha.khan@gmail.com',
    phone: '+91 98200 31622',
    location: 'Mumbai, Maharashtra',
    links: [
      ['instagram', 'instagram.com/aisha.socials'],
      ['linkedin', 'linkedin.com/in/aishakhan-social'],
      ['portfolio', 'aishakhan.co'],
    ],
    summary:
      'Social-first marketer who has grown brand communities from zero to 1.2M followers. Specialises in short-form video, creator partnerships and community-led campaigns.',
    exp: [
      [
        'Social Media Manager',
        'Bombay Beauty Co.',
        'Mumbai',
        'Feb 2022',
        '',
        [
          'Grew Instagram from 90k to 1.2M followers in 24 months with a Reels-first strategy',
          'Run a creator programme with 220 micro-influencers driving ₹9 Cr in attributed sales',
          'Lead a team of 6 across content, community and analytics',
        ],
      ],
      [
        'Content & Community Executive',
        'Tarang Media',
        'Mumbai',
        'Jul 2019',
        'Jan 2022',
        ['Created a meme-led series with 30M views', 'Cut response time to under 15 minutes with a social-care playbook'],
      ],
    ],
    edu: [
      ['Mumbai University – Mithibai College', 'B.M.M.', 'Mass Media', 'Mumbai', '2016', '2019'],
    ],
    skills: ['Short-form video', 'Creator marketing', 'Community management', 'Content calendars', 'Canva & CapCut', 'Meta Business Suite', 'Social analytics'],
    certs: [['Meta Certified Digital Marketing Associate', 'Meta', '2022']],
    langs: [
      ['English', 'Fluent'],
      ['Hindi', 'Native'],
      ['Urdu', 'Fluent'],
    ],
    awards: [['Social Brand of the Year – Beauty (Finalist)', 'Mumbai Digital Awards', '2023', '']],
  }),

  swiss: persona('swiss', {
    name: 'Devansh Trivedi',
    title: 'Principal Software Architect',
    email: 'devansh.trivedi@gmail.com',
    phone: '+91 98250 17724',
    location: 'Ahmedabad, Gujarat',
    links: [
      ['github', 'github.com/devansht'],
      ['linkedin', 'linkedin.com/in/devansh-trivedi'],
    ],
    summary:
      'Software architect with 14 years of experience designing distributed systems for payments and logistics. Passionate about simple architectures, clear documentation and growing engineers.',
    exp: [
      [
        'Principal Architect',
        'Sabarmati Payments',
        'Ahmedabad',
        'Jan 2020',
        '',
        [
          'Architected the payments core (3,000 TPS, 99.99% uptime) serving 70,000 merchants',
          'Led the migration from a monolith to event-driven services, cutting release lead time from 3 weeks to 2 days',
          'Define engineering standards adopted by 11 teams (140 engineers)',
          'Chair a fortnightly architecture review board and mentor 6 staff engineers',
        ],
      ],
      [
        'Tech Lead',
        'Gujarat Logistics Tech',
        'Ahmedabad',
        'Jun 2015',
        'Dec 2019',
        [
          'Designed a fleet-tracking platform ingesting 40M GPS pings a day',
          'Reduced infrastructure cost by 36% through autoscaling and data tiering',
          'Grew the platform team from 5 to 18 engineers',
        ],
      ],
      [
        'Software Engineer',
        'Infocity Systems',
        'Gandhinagar',
        'Jul 2010',
        'May 2015',
        ['Built banking middleware in Java used by 6 co-operative banks'],
      ],
    ],
    edu: [['DA-IICT', 'B.Tech', 'Information & Communication Technology', 'Gandhinagar', '2006', '2010']],
    skills: ['System design', 'Distributed systems', 'Java / Kotlin', 'Kafka', 'PostgreSQL', 'AWS', 'Technical leadership', 'Mentoring'],
    projects: [['OpenLedger', 'github.com/devansht/openledger', 'Kotlin · PostgreSQL', ['Open-source double-entry ledger library with 1.8k GitHub stars']]],
    certs: [['AWS Certified Solutions Architect – Professional', 'Amazon Web Services', '2021']],
    awards: [['Architect of the Year', 'Sabarmati Payments', '2022', '']],
    langs: [
      ['Gujarati', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Fluent'],
    ],
  }),

  minimal: persona('minimal', {
    name: 'Tara Sen',
    title: 'UX Researcher',
    email: 'tara.sen@gmail.com',
    phone: '+91 98310 14142',
    location: 'Kolkata, West Bengal',
    links: [
      ['linkedin', 'linkedin.com/in/tarasen-ux'],
      ['portfolio', 'tarasen.in'],
    ],
    summary:
      'UX researcher with 5 years of experience uncovering what people need — from rural fintech users to enterprise admins. Turns messy qualitative data into clear product decisions.',
    exp: [
      [
        'UX Researcher',
        'Bandhan Digital',
        'Kolkata',
        'Aug 2021',
        '',
        [
          'Conducted 140+ interviews across 6 states to shape a vernacular fintech app used by 1.4M people',
          'Introduced a research repository adopted by 5 product teams',
          'Usability fixes from my studies lifted task success from 62% to 88%',
          'Partner with design and engineering to ship 11 features shaped directly by research findings',
          'Mentor two junior researchers and run a monthly research guild',
        ],
      ],
      [
        'Research Associate',
        'Design Collective India',
        'Bengaluru',
        'Jul 2019',
        'Jul 2021',
        [
          'Ran diary studies and contextual inquiries for health and edtech clients',
          'Delivered a research playbook adopted by 8 client teams',
          'Trained 25 designers in interviewing and synthesis techniques',
        ],
      ],
    ],
    edu: [
      ['IDC School of Design, IIT Bombay', 'M.Des', 'Interaction Design', 'Mumbai', '2017', '2019'],
      ['Jadavpur University', 'B.A.', 'Psychology', 'Kolkata', '2014', '2017'],
    ],
    skills: ['User interviews', 'Usability testing', 'Survey design', 'Synthesis', 'Dovetail', 'Figma', 'Python (basic)'],
    certs: [['UX Research & Strategy Certification', 'Nielsen Norman Group', '2022']],
    custom: (id) => [bulletSection(id, 'talks', 'Talks & publications', ['“Researching in eight languages” – UX India conference, 2023', 'Co-author, “Designing for first-time digital users” – IDC case-study series'])],
    langs: [
      ['Bengali', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Fluent'],
    ],
  }),

  folio: persona('folio', {
    name: 'Ishita Choudhury',
    title: 'Architect · Urban Design',
    email: 'ishita.choudhury@gmail.com',
    phone: '+91 98640 22360',
    location: 'Guwahati, Assam',
    links: [
      ['portfolio', 'ishitachoudhury.studio'],
      ['behance', 'behance.net/ishitachoudhury'],
      ['linkedin', 'linkedin.com/in/ishita-choudhury-arch'],
    ],
    summary:
      'Registered architect with 6 years of experience in residential, civic and adaptive-reuse projects across the North-East. Passionate about climate-responsive design and local materials such as bamboo and cane.',
    exp: [
      [
        'Associate Architect',
        'Brahmaputra Studio',
        'Guwahati',
        'Jul 2020',
        '',
        [
          'Lead design on 9 projects totalling 180,000 sq ft, including a bamboo community centre in Majuli',
          'Cut construction cost by 14% through modular bamboo detailing and local sourcing',
          'Manage a team of 6 architects and interns',
        ],
      ],
      [
        'Junior Architect',
        'Studio Prakriti',
        'Bengaluru',
        'Jul 2018',
        'Jun 2020',
        ['Prepared GFC drawings and 3D visualisations for 14 villas and a boutique resort'],
      ],
    ],
    edu: [
      ['CEPT University', 'M.Arch', 'Urban Design', 'Ahmedabad', '2016', '2018'],
      ['School of Planning and Architecture, New Delhi', 'B.Arch', 'Architecture', 'New Delhi', '2011', '2016'],
    ],
    skills: ['AutoCAD', 'Revit', 'SketchUp', 'Rhino', 'Lumion', 'Adobe Suite', 'Sustainable design', 'Site supervision'],
    certs: [['Registered Architect', 'Council of Architecture, India', '2018']],
    langs: [
      ['Assamese', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Fluent'],
    ],
    awards: [['Young Architect Award – Shortlist', 'IIA North-East Chapter', '2023', '']],
  }),

  wave: persona('wave', {
    name: 'Zoya Ansari',
    title: 'Digital Marketing Specialist',
    email: 'zoya.ansari@gmail.com',
    phone: '+91 98390 31415',
    location: 'Lucknow, Uttar Pradesh',
    links: [
      ['linkedin', 'linkedin.com/in/zoya-ansari-digital'],
      ['medium', 'medium.com/@zoya.digital'],
    ],
    summary:
      'Digital marketer with 4 years of experience in SEO, paid media and email for e-commerce brands. Obsessed with measurable growth and clean funnels.',
    exp: [
      [
        'Digital Marketing Specialist',
        'Awadh Handlooms Online',
        'Lucknow',
        'Jun 2022',
        '',
        [
          'Grew organic traffic by 210% in 14 months with a content and technical-SEO programme',
          'Managed ₹1.2 Cr annual ad spend at 5.8× ROAS across Google and Meta',
          'Built lifecycle email flows contributing 24% of revenue',
          'Launched a Hindi-language content hub that now brings 38,000 monthly visitors',
        ],
      ],
      [
        'SEO Executive',
        'Gomti Digital',
        'Lucknow',
        'Jul 2020',
        'May 2022',
        [
          'Ranked 40+ keywords on page one for local-services clients',
          'Reduced bounce rate by 18% via page-speed improvements',
          'Wrote 60+ long-form articles, 12 of which rank in the top three results',
        ],
      ],
    ],
    edu: [
      ['Integral University', 'MBA', 'Marketing', 'Lucknow', '2018', '2020'],
      ['Lucknow University', 'B.Com', 'Commerce', 'Lucknow', '2015', '2018'],
    ],
    skills: ['SEO', 'Google Ads', 'Meta Ads', 'Email marketing', 'Google Analytics 4', 'Search Console', 'WordPress', 'Copywriting'],
    projects: [['Free SEO checklist for online sellers', 'zoyaansari.in/seo-checklist', 'Notion · Search Console', ['Template downloaded 4,200 times by small-business owners']]],
    certs: [
      ['Google Analytics Certification', 'Google', '2023'],
      ['HubSpot Inbound Marketing', 'HubSpot Academy', '2021'],
    ],
    awards: [['Emerging Performance Marketer', 'Digital Marketing Summit, Lucknow', '2023', '']],
    langs: [
      ['Urdu', 'Native'],
      ['Hindi', 'Native'],
      ['English', 'Fluent'],
    ],
    custom: (id) => [bulletSection(id, 'pub', 'Publications & talks', ['Guest contributor – three articles on regional-language SEO', 'Speaker – Lucknow Digital Meetup, 2023'])],
  }),

  saffron: persona('saffron', {
    name: 'Bhavna Desai',
    title: 'Interior Designer',
    email: 'bhavna.desai@gmail.com',
    phone: '+91 98250 27182',
    location: 'Vadodara, Gujarat',
    links: [
      ['instagram', 'instagram.com/bhavna.interiors'],
      ['portfolio', 'bhavnadesai.design'],
      ['linkedin', 'linkedin.com/in/bhavnadesai'],
    ],
    summary:
      'Interior designer with 7 years of experience in residential and boutique-retail spaces. Blends Indian craft traditions with contemporary layouts and delivers on budget and on time.',
    exp: [
      [
        'Senior Interior Designer',
        'Studio Kala',
        'Vadodara',
        'Apr 2020',
        '',
        [
          'Delivered 38 residential and 6 retail projects (₹22 Cr total value) with 96% on-time handover',
          'Developed a signature “modern haveli” style, featured in two national design magazines',
          'Manage vendors across carpentry, stone and textiles',
        ],
      ],
      [
        'Interior Designer',
        'Aangan Interiors',
        'Ahmedabad',
        'Jul 2017',
        'Mar 2020',
        ['Created concept boards, 3D renders and working drawings for 25 homes', 'Cut material wastage by 11% with better BOQ planning'],
      ],
    ],
    edu: [
      ['CEPT University', 'B.Des', 'Interior Design', 'Ahmedabad', '2013', '2017'],
    ],
    skills: [['AutoCAD', 5], ['SketchUp', 5], ['3ds Max / V-Ray', 4], ['Space planning', 5], ['Material sourcing', 4], ['BOQ & costing', 4], ['Client handling', 4]],
    certs: [['Certified Interior Designer', 'Indian Institute of Interior Designers', '2018']],
    langs: [
      ['Gujarati', 'Native'],
      ['Hindi', 'Fluent'],
      ['English', 'Fluent'],
    ],
  }),

  designer: persona('designer', {
    name: 'Mihir Shah',
    title: 'Senior Graphic Designer',
    email: 'mihir.shah@gmail.com',
    phone: '+91 98790 16180',
    location: 'Ahmedabad, Gujarat',
    links: [
      ['behance', 'behance.net/mihirshah'],
      ['dribbble', 'dribbble.com/mihirshah'],
      ['portfolio', 'mihirshah.design'],
    ],
    summary:
      'Graphic designer with 8 years of experience in branding, packaging and editorial design. Known for bold colour, clean typography and campaigns that people remember.',
    exp: [
      [
        'Senior Graphic Designer',
        'Pixel & Pen Studio',
        'Ahmedabad',
        'Jan 2021',
        '',
        [
          'Led identity design for 18 brands across food, fashion and fintech',
          'Designed packaging for a snack range now on 50,000 shelves nationwide',
          'Mentor 3 junior designers',
        ],
      ],
      [
        'Graphic Designer',
        'Rang Advertising',
        'Mumbai',
        'Jun 2016',
        'Dec 2020',
        ['Produced 300+ print and digital creatives for FMCG clients', 'Won 2 regional ad-festival awards for a festive campaign'],
      ],
    ],
    edu: [['National Institute of Design', 'B.Des', 'Graphic Design', 'Ahmedabad', '2012', '2016']],
    skills: ['Branding', 'Packaging', 'Typography', 'Illustration', 'Photoshop', 'Illustrator', 'InDesign', 'Motion graphics'],
    langs: [
      ['Gujarati', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Fluent'],
    ],
    awards: [['Silver – Packaging Design', 'Regional Ad Festival', '2019', '']],
    custom: (id) => [tagSection(id, 'interests', 'Interests', ['Calligraphy', 'Street photography', 'Letterpress', 'Cycling'])],
  }),

  infographic: persona('infographic', {
    name: 'Naveen Kumar',
    title: 'Data Scientist',
    email: 'naveen.kumar@gmail.com',
    phone: '+91 98410 31415',
    location: 'Chennai, Tamil Nadu',
    links: [
      ['github', 'github.com/naveenk-ds'],
      ['kaggle', 'kaggle.com/naveenkumar'],
      ['linkedin', 'linkedin.com/in/naveenkumar-ds'],
    ],
    summary:
      'Data scientist with 5 years of experience building forecasting and recommendation systems for retail and insurance. Kaggle Expert with a bias for shipping models that drive revenue.',
    exp: [
      [
        'Data Scientist',
        'Marina Analytics',
        'Chennai',
        'Mar 2021',
        '',
        [
          'Built a recommendation engine lifting average order value by 12% for a 6M-user retail app',
          'Reduced churn-model false positives by 31% using gradient boosting and SHAP-guided features',
          'Deployed 9 models to production on AWS SageMaker with automated monitoring',
        ],
      ],
      [
        'Junior Data Scientist',
        'Cauvery Insurance Tech',
        'Chennai',
        'Jul 2019',
        'Feb 2021',
        ['Created a claims-fraud classifier (AUC 0.93) that saved an estimated ₹7 Cr a year'],
      ],
    ],
    edu: [
      ['Indian Institute of Technology Madras', 'M.Tech', 'Data Science', 'Chennai', '2017', '2019', 'CGPA 9.0 / 10'],
      ['Anna University', 'B.E.', 'Computer Science', 'Chennai', '2013', '2017'],
    ],
    skills: [['Python', 5], ['SQL', 5], ['Machine Learning', 5], ['PyTorch', 4], ['Spark', 4], ['AWS SageMaker', 4], ['Statistics', 5], ['MLOps', 3]],
    certs: [['Kaggle Competitions Expert', 'Kaggle', '2022']],
    langs: [
      ['Tamil', 'Native'],
      ['English', 'Fluent'],
      ['Telugu', 'Basic'],
    ],
    custom: (id) => [tagSection(id, 'interests', 'Interests', ['Chess', 'Carnatic music', 'Cycling', 'Open data'])],
  }),

  peacock: persona('peacock', {
    name: 'Aditi Rao',
    title: 'Brand Strategist',
    email: 'aditi.rao@gmail.com',
    phone: '+91 98860 22360',
    location: 'Bengaluru, Karnataka',
    links: [
      ['linkedin', 'linkedin.com/in/aditirao-brand'],
      ['portfolio', 'aditirao.co'],
    ],
    summary:
      'Brand strategist with 8 years of experience shaping positioning and storytelling for consumer, hospitality and social-impact brands. Combines cultural insight with commercial sense.',
    exp: [
      [
        'Associate Director – Brand Strategy',
        'Anvaya Brand Consultancy',
        'Bengaluru',
        'Jan 2021',
        '',
        [
          'Lead strategy for 14 brands; repositioned a heritage coffee label, growing sales 46% in a year',
          'Built a proprietary cultural-insights framework now used in all pitches (win-rate 38% → 55%)',
          'Manage a team of 5 strategists and planners',
        ],
      ],
      [
        'Brand Strategist',
        'Rangmanch Creative',
        'Mumbai',
        'Jun 2016',
        'Dec 2020',
        ['Developed brand platforms for 20+ clients across FMCG, hotels and NGOs', 'Authored a trend report downloaded 9,000+ times'],
      ],
    ],
    edu: [
      ['Symbiosis Institute of Media & Communication', 'PGDM', 'Marketing Communication', 'Pune', '2014', '2016'],
      ['Mount Carmel College', 'B.A.', 'English & Psychology', 'Bengaluru', '2011', '2014'],
    ],
    skills: [['Brand positioning', 5], ['Consumer insights', 5], ['Storytelling', 5], ['Campaign planning', 4], ['Workshop facilitation', 4], ['Quant research', 3]],
    langs: [
      ['English', 'Fluent'],
      ['Kannada', 'Native'],
      ['Hindi', 'Fluent'],
    ],
  }),

  marigold: persona('marigold', {
    name: 'Jaideep Singh Gill',
    title: 'Content Creator & Video Editor',
    email: 'jaideep.gill@gmail.com',
    phone: '+91 98150 27182',
    location: 'Chandigarh',
    links: [
      ['youtube', 'youtube.com/@jaideepgill'],
      ['instagram', 'instagram.com/jaideep.frames'],
      ['portfolio', 'jaideepgill.com'],
    ],
    summary:
      'Video storyteller with 6 years of experience producing documentary-style content, brand films and short-form series. Own a YouTube channel with 420k subscribers.',
    exp: [
      [
        'Lead Video Editor & Producer',
        'Punjab Digital Studios',
        'Chandigarh',
        'Mar 2021',
        '',
        [
          'Produce and edit 30+ brand films a year for D2C and hospitality clients, with a 92% repeat-client rate',
          'Created a travel mini-series with 14M cumulative views',
          'Cut turnaround by 35% with proxy workflows and template systems',
          'Mentor 3 junior editors and maintain the studio’s style guide',
        ],
      ],
      [
        'Video Editor',
        'Sarson Media',
        'Ludhiana',
        'Jul 2018',
        'Feb 2021',
        [
          'Edited 400+ short-form videos for Instagram and YouTube',
          'Introduced colour-grading LUTs adopted across the studio',
          'Shot and edited the opening film for a 2,000-person trade expo',
        ],
      ],
    ],
    edu: [['Panjab University', 'B.A. (Hons)', 'Mass Communication', 'Chandigarh', '2015', '2018']],
    skills: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Storytelling', 'Colour grading', 'Sound design', 'Photography', 'YouTube SEO'],
    projects: [['“Roots of Punjab” documentary series', 'youtube.com/@jaideepgill', 'Direction · Edit · Colour', ['Twelve episodes on rural craftspeople; 2.8M views']]],
    certs: [['DaVinci Resolve Certified Trainer', 'Blackmagic Design', '2021']],
    langs: [
      ['Punjabi', 'Native'],
      ['Hindi', 'Fluent'],
      ['English', 'Fluent'],
    ],
    awards: [['Best Short Film – Regional Festival', 'Chandigarh Film Fest', '2022', '']],
  }),

  lotus: persona('lotus', {
    name: 'Srishti Verma',
    title: 'Fashion Designer',
    email: 'srishti.verma@gmail.com',
    phone: '+91 98110 16180',
    location: 'New Delhi',
    links: [
      ['instagram', 'instagram.com/srishti.atelier'],
      ['portfolio', 'srishtiverma.in'],
      ['behance', 'behance.net/srishtiverma'],
    ],
    summary:
      'Fashion designer specialising in contemporary Indian wear and sustainable textiles. 6 years of experience taking collections from mood board to runway and retail.',
    exp: [
      [
        'Senior Designer – Womenswear',
        'Mehendi Label',
        'New Delhi',
        'Feb 2021',
        '',
        [
          'Design 4 seasonal collections (120+ styles each) for a brand with 35 stores',
          'Introduced handloom-blend lines that now contribute 22% of revenue',
          'Presented at Lakme Fashion Week showcase 2023',
        ],
      ],
      [
        'Assistant Designer',
        'Kala Ghar Couture',
        'Jaipur',
        'Jun 2018',
        'Jan 2021',
        ['Produced tech packs and sampling for bridal and festive wear', 'Worked with 40 artisans in Sanganer on block-print collaborations'],
      ],
    ],
    edu: [
      ['National Institute of Fashion Technology', 'B.F.Tech', 'Apparel Production', 'New Delhi', '2014', '2018'],
    ],
    skills: ['Illustrator', 'Photoshop', 'CLO 3D', 'Pattern making', 'Textile sourcing', 'Trend forecasting', 'Tech packs'],
    langs: [
      ['Hindi', 'Native'],
      ['English', 'Fluent'],
    ],
    custom: (id) => [tagSection(id, 'interests', 'Interests', ['Block printing', 'Heritage crafts', 'Sketching', 'Travel'])],
  }),

  spark: persona('spark', {
    name: 'Dhruv Arora',
    title: 'B.Tech Student · Software Intern',
    email: 'dhruv.arora@gmail.com',
    phone: '+91 98760 31415',
    location: 'Ludhiana, Punjab',
    links: [
      ['github', 'github.com/dhruvarora'],
      ['linkedin', 'linkedin.com/in/dhruv-arora-dev'],
    ],
    summary:
      'Third-year CSE student with two internships and four shipped projects. Looking for a summer 2025 software internship to learn from great engineers.',
    edu: [
      ['Thapar Institute of Engineering & Technology', 'B.E.', 'Computer Science & Engineering', 'Patiala', '2022', '2026', 'CGPA 9.0 / 10 · Dean’s List'],
      ['Sacred Heart Convent School', 'Class XII (CBSE)', 'PCM', 'Ludhiana', '2021', '2022', '96.2%'],
    ],
    exp: [
      [
        'Web Development Intern',
        'Sutlej Software Solutions',
        'Ludhiana',
        'Jun 2024',
        'Aug 2024',
        ['Built an admin dashboard in React used by 25 staff members', 'Cut page-load time by 45% by lazy-loading and caching'],
      ],
    ],
    projects: [
      ['CampusCart', 'github.com/dhruvarora/campuscart', 'MERN · Stripe', ['Student marketplace with 800+ listings in its first month']],
      ['StudyBuddy', 'github.com/dhruvarora/studybuddy', 'Flutter · Firebase', ['Pomodoro app with 1.5k downloads and a 4.5★ rating']],
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'C++', 'Git', 'Figma'],
    langs: [
      ['Punjabi', 'Native'],
      ['Hindi', 'Fluent'],
      ['English', 'Fluent'],
    ],
    custom: (id) => [
      bulletSection(id, 'ach', 'Achievements', ['Top 5% in LeetCode Weekly Contest 388', 'Winner, HackThapar 2023']),
      entrySection(id, 'pos', 'Positions of responsibility', [
        ['Tech Lead', 'Thapar Coding Club', '2023 – Present', ['Mentor 60 first-year students in DSA and web development']],
      ]),
    ],
  }),

  sterling: persona('sterling', {
    name: 'Mohan Krishnan',
    title: 'Chief Financial Officer',
    email: 'mohan.krishnan@gmail.com',
    phone: '+91 98200 27182',
    location: 'Mumbai, Maharashtra',
    links: [['linkedin', 'linkedin.com/in/mohankrishnan-cfo']],
    summary:
      'CFO with 24 years of experience across manufacturing and consumer businesses. Led two IPOs, raised ₹3,800 Cr of capital and partnered with boards on strategy, M&A and capital allocation.',
    exp: [
      [
        'Chief Financial Officer',
        'Bharatiya Consumer Brands Ltd.',
        'Mumbai',
        'Jun 2018',
        '',
        [
          'Lead finance, treasury, investor relations and tax for a ₹7,200 Cr listed group',
          'Executed a ₹2,400 Cr IPO and a ₹1,100 Cr debt refinancing at 90 bps lower cost',
          'Delivered 6 acquisitions (₹1,650 Cr EV); synergy realisation 118% of plan',
        ],
      ],
      [
        'VP – Corporate Finance & Strategy',
        'Sahyadri Industries',
        'Pune',
        'Jul 2012',
        'May 2018',
        ['Built the 5-year plan and capital-allocation framework approved by the board', 'Raised ₹1,400 Cr through bonds and external commercial borrowings'],
      ],
    ],
    edu: [
      ['Indian Institute of Management Ahmedabad', 'PGP (MBA)', 'Finance', 'Ahmedabad', '1998', '2000'],
      ['The Institute of Chartered Accountants of India', 'Chartered Accountant', '', 'New Delhi', '1996', '1998', 'All India Rank 12'],
    ],
    skills: ['Capital markets', 'M&A', 'Investor relations', 'Treasury', 'Financial planning', 'Ind AS', 'Board reporting', 'Risk management'],
    langs: [
      ['English', 'Fluent'],
      ['Tamil', 'Native'],
      ['Hindi', 'Fluent'],
    ],
    awards: [['CFO of the Year – Consumer Sector', 'Business Leaders Forum', '2022', '']],
    certs: [
      ['CFA Charterholder', 'CFA Institute', '2009'],
      ['Advanced Management Programme', 'Indian School of Business', '2018'],
    ],
  }),

  director: persona('director', {
    name: 'Anil Kumar Mehra',
    title: 'Director – Engineering',
    email: 'anil.mehra@gmail.com',
    phone: '+91 98110 31622',
    location: 'Gurugram, Haryana',
    links: [['linkedin', 'linkedin.com/in/anilkumarmehra']],
    summary:
      'Engineering leader with 19 years of experience scaling product teams from 12 to 180 engineers in fintech and e-commerce. Focused on delivery excellence, platform thinking and building leaders.',
    exp: [
      [
        'Director – Engineering',
        'Saral Pay',
        'Gurugram',
        'Jan 2019',
        '',
        [
          'Lead 9 engineering managers and 180 engineers across payments, lending and platform',
          'Cut deployment frequency from fortnightly to 40+ per day; availability up from 99.5% to 99.98%',
          'Reduced engineering attrition from 24% to 11% through career ladders and mentoring',
        ],
      ],
      [
        'Senior Engineering Manager',
        'Rangoli Retail',
        'New Delhi',
        'Jun 2013',
        'Dec 2018',
        ['Grew the platform team from 12 to 60 and re-architected checkout for 8× festive traffic'],
      ],
      [
        'Technical Lead',
        'Indus Software Labs',
        'Noida',
        'Jul 2007',
        'May 2013',
        ['Led 5 delivery teams for global banking clients'],
      ],
    ],
    edu: [
      ['Indian Institute of Technology Roorkee', 'B.Tech', 'Electronics & Communication', 'Roorkee', '2003', '2007'],
    ],
    skills: ['Engineering leadership', 'Platform strategy', 'Scaling teams', 'Cloud architecture', 'Budget ownership', 'Hiring', 'Agile at scale'],
    langs: [
      ['English', 'Fluent'],
      ['Hindi', 'Native'],
    ],
  }),

  atlas: persona('atlas', {
    name: 'Pallavi Hegde',
    title: 'Cloud Solutions Architect',
    email: 'pallavi.hegde@gmail.com',
    phone: '+91 98450 16180',
    location: 'Bengaluru, Karnataka',
    links: [
      ['linkedin', 'linkedin.com/in/pallavihegde'],
      ['github', 'github.com/pallavi-hegde'],
    ],
    summary:
      'Cloud architect with 10 years of experience designing secure, cost-efficient platforms on AWS and Azure for banking and healthcare clients. Led migrations of 200+ workloads.',
    exp: [
      [
        'Senior Cloud Solutions Architect',
        'Nimbus Cloud Technologies',
        'Bengaluru',
        'Jan 2021',
        '',
        [
          'Architected the AWS landing zone and migration of 200+ workloads for a private bank, saving ₹18 Cr a year',
          'Defined zero-trust and encryption standards that passed RBI audits first time',
          'Mentor 12 engineers and run the cloud guild',
        ],
      ],
      [
        'Cloud Engineer',
        'Kaveri Systems',
        'Bengaluru',
        'Jun 2015',
        'Dec 2020',
        ['Built Terraform-based infrastructure pipelines used by 20 product teams', 'Cut recovery time objective from 8 hours to 45 minutes'],
      ],
    ],
    edu: [['RV College of Engineering', 'B.E.', 'Information Science', 'Bengaluru', '2011', '2015']],
    skills: [['AWS', 5], ['Azure', 4], ['Terraform', 5], ['Kubernetes', 4], ['Security & compliance', 5], ['FinOps', 4], ['Python', 3]],
    certs: [
      ['AWS Solutions Architect – Professional', 'Amazon Web Services', '2021'],
      ['Azure Solutions Architect Expert', 'Microsoft', '2022'],
    ],
    langs: [
      ['English', 'Fluent'],
      ['Kannada', 'Native'],
      ['Hindi', 'Fluent'],
    ],
  }),

  cobalt: persona('cobalt', {
    name: 'Suresh Nambiar',
    title: 'IT Programme Manager',
    email: 'suresh.nambiar@gmail.com',
    phone: '+91 94470 31415',
    location: 'Thiruvananthapuram, Kerala',
    links: [['linkedin', 'linkedin.com/in/sureshnambiar-pgm']],
    summary:
      'IT programme manager with 14 years of experience delivering digital-governance and banking programmes. Managed budgets up to ₹180 Cr and teams of 200+.',
    exp: [
      [
        'Programme Manager',
        'Kerala Digital Services',
        'Thiruvananthapuram',
        'Apr 2019',
        '',
        [
          'Run a ₹180 Cr e-governance programme delivering 60 citizen services to 3.3 Cr residents',
          'Reduced average service turnaround from 12 days to 3 through process re-engineering',
          'Govern 14 vendors and a 210-member blended team',
          'Introduced a PMO dashboard giving leadership weekly visibility into 40 milestones',
        ],
      ],
      [
        'Senior Project Manager',
        'Tarang Technologies',
        'Kochi',
        'Jun 2013',
        'Mar 2019',
        [
          'Delivered 9 enterprise projects worth ₹120 Cr, all within 5% of budget',
          'Reduced average project overrun from 14% to 4% by introducing stage-gate reviews',
          'Mentored 12 project managers, 5 of whom were promoted to programme roles',
        ],
      ],
    ],
    edu: [
      ['College of Engineering Trivandrum', 'B.Tech', 'Computer Science', 'Thiruvananthapuram', '2006', '2010'],
      ['IIM Kozhikode', 'Executive Programme', 'Business Management', 'Kozhikode', '2016', '2017'],
    ],
    skills: ['Programme governance', 'Budget & vendor management', 'Risk management', 'Agile / SAFe', 'Digital transformation', 'Stakeholder management'],
    certs: [
      ['PMP', 'PMI', '2015'],
      ['SAFe Programme Consultant', 'Scaled Agile', '2020'],
    ],
    awards: [['Excellence in Digital Governance', 'IT Department, Government of Kerala', '2022', 'For the citizen-services programme']],
    langs: [
      ['Malayalam', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Intermediate'],
    ],
    projects: [['Citizen Services Portal', '', 'Programme · 60 services', ['Delivered a unified portal and app serving 3.3 Cr residents with a 4.4★ rating']]],
  }),

  clinic: persona('clinic', {
    name: 'Dr. Ritu Bansal',
    title: 'Resident Doctor · MD (Internal Medicine)',
    email: 'dr.ritu.bansal@gmail.com',
    phone: '+91 98730 27182',
    location: 'New Delhi',
    links: [
      ['linkedin', 'linkedin.com/in/dr-ritu-bansal'],
      ['researchgate', 'researchgate.net/profile/Ritu-Bansal'],
    ],
    summary:
      'Third-year MD resident with strong clinical grounding in internal medicine and emergency care. Published researcher committed to patient-centred, evidence-based practice.',
    exp: [
      [
        'Senior Resident – Internal Medicine',
        'Yamuna Institute of Medical Sciences (Dept. of Medicine)',
        'New Delhi',
        'Jul 2022',
        '',
        [
          'Manage 40-bed ward and 150+ OPD patients weekly under consultant supervision',
          'Lead daily rounds and teach MBBS interns on bedside diagnosis',
          'Presented 3 case reports at national conferences',
        ],
      ],
      [
        'Junior Resident – Emergency Medicine',
        'Capital City Hospital',
        'New Delhi',
        'Jul 2019',
        'Jun 2022',
        ['Handled 60+ emergency presentations per shift including ACLS cases', 'Audited sepsis protocols, reducing door-to-antibiotic time by 22%'],
      ],
    ],
    edu: [
      ['Maulana Azad Medical College', 'MD', 'Internal Medicine', 'New Delhi', '2022', '2025'],
      ['All India Institute of Medical Sciences', 'MBBS', 'Medicine', 'New Delhi', '2014', '2019', 'Distinction in Pharmacology'],
    ],
    skills: ['Clinical diagnosis', 'ACLS / BLS', 'ECG & bedside USG', 'Critical care', 'Evidence-based medicine', 'Patient counselling', 'Medical research'],
    certs: [
      ['ACLS Provider', 'American Heart Association', '2021'],
      ['NMC Registration – Delhi Medical Council', 'DMC', '2019'],
    ],
    langs: [
      ['Hindi', 'Native'],
      ['English', 'Fluent'],
      ['Punjabi', 'Fluent'],
    ],
    custom: (id) => [
      entrySection(id, 'pubs', 'Publications', [
        ['Dengue with atypical hepatic involvement: a case series', 'Indian Journal of Medical Research', '2023', []],
        ['Door-to-antibiotic time audit in a tertiary emergency department', 'Journal of Emergency Medicine India', '2021', []],
      ]),
    ],
  }),

  medic: persona('medic', {
    name: 'Anjali Thomas',
    title: 'Staff Nurse – ICU',
    email: 'anjali.thomas@gmail.com',
    phone: '+91 94470 16180',
    location: 'Kottayam, Kerala',
    links: [['linkedin', 'linkedin.com/in/anjalithomas-rn']],
    summary:
      'Registered nurse with 6 years of critical-care experience in a 600-bed multi-speciality hospital. Skilled in ventilator management, haemodynamic monitoring and compassionate patient and family communication.',
    exp: [
      [
        'Staff Nurse – ICU',
        'Meenakshi Multi-speciality Hospital',
        'Kottayam',
        'Jun 2020',
        '',
        [
          'Care for 4–6 critically ill patients per shift, including ventilated and post-operative cases',
          'Reduced central-line infections to zero for 14 months through strict bundle compliance',
          'Train new nurses on ICU protocols and charting',
        ],
      ],
      [
        'Staff Nurse – Medical Ward',
        'Kochi Care Hospital',
        'Kochi',
        'Jul 2018',
        'May 2020',
        ['Managed a 30-bed ward with 98% medication-administration accuracy'],
      ],
    ],
    edu: [
      ['Christian Medical College', 'B.Sc.', 'Nursing', 'Vellore', '2014', '2018'],
    ],
    skills: ['Ventilator management', 'Haemodynamic monitoring', 'IV therapy', 'Wound care', 'Patient education', 'Infection control', 'Electronic health records'],
    certs: [
      ['BLS & ACLS Provider', 'American Heart Association', '2023'],
      ['Critical Care Nursing Certificate', 'Indian Society of Critical Care Medicine', '2021'],
    ],
    langs: [
      ['Malayalam', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Intermediate'],
    ],
    custom: (id) => [
      details(id, [
        ['Registration', 'Kerala Nurses & Midwives Council – KL/20418'],
        ['Availability', 'Immediate · open to Gulf & UK opportunities'],
      ]),
    ],
  }),

  chalk: persona('chalk', {
    name: 'Smita Patil',
    title: 'Mathematics Teacher (Grades 8–12)',
    email: 'smita.patil@gmail.com',
    phone: '+91 98220 31415',
    location: 'Nagpur, Maharashtra',
    links: [['linkedin', 'linkedin.com/in/smitapatil-teacher']],
    summary:
      'Dedicated maths teacher with 9 years of experience in CBSE schools. Known for making abstract ideas concrete and helping students raise their board scores.',
    exp: [
      [
        'Senior Mathematics Teacher',
        'Vidya Niketan Public School',
        'Nagpur',
        'Jun 2018',
        '',
        [
          'Teach CBSE Mathematics to Grades 10–12; class average rose from 71% to 86% in three years',
          '14 students scored 95+ in the Class XII board exam in 2024',
          'Introduced GeoGebra labs and peer-teaching circles',
          'Mentor 6 junior teachers through classroom observation and feedback cycles',
        ],
      ],
      [
        'Mathematics Teacher',
        'Orange City Convent',
        'Nagpur',
        'Jul 2015',
        'May 2018',
        [
          'Prepared Grade 8–9 students for NTSE and Olympiads; 6 students reached the state level',
          'Designed a remedial programme that raised Grade 9 pass rates from 78% to 94%',
        ],
      ],
    ],
    edu: [
      ['Rashtrasant Tukadoji Maharaj Nagpur University', 'B.Ed', 'Mathematics Education', 'Nagpur', '2013', '2015'],
      ['Rashtrasant Tukadoji Maharaj Nagpur University', 'M.Sc.', 'Mathematics', 'Nagpur', '2011', '2013', '78%'],
    ],
    skills: ['Curriculum planning', 'Classroom management', 'GeoGebra', 'Assessment design', 'Parent communication', 'Olympiad coaching', 'Google Classroom'],
    certs: [['CTET Paper II – Qualified', 'CBSE', '2015']],
    langs: [
      ['Marathi', 'Native'],
      ['Hindi', 'Fluent'],
      ['English', 'Fluent'],
    ],
    awards: [['Best Teacher Award', 'Vidya Niketan Public School', '2023', 'Chosen by students and parents']],
    custom: (id) => [bulletSection(id, 'extra', 'Extra-curricular', ['Coordinator – Annual maths exhibition (2019–2024)', 'Volunteer teacher for rural outreach programme', 'Mentor – Mathematics Olympiad Club (2020–present)'])],
  }),

  journal: persona('journal', {
    name: 'Dr. Nandini Chakraborty',
    title: 'Research Scientist – Computational Biology',
    email: 'nandini.chakraborty@research.example.in',
    phone: '+91 98300 16180',
    location: 'Kolkata, West Bengal',
    links: [
      ['googlescholar', 'scholar.google.com/citations?user=n7k2m9', 'Google Scholar'],
      ['orcid', 'orcid.org/0000-0001-5109-3700', 'ORCID 0000-0001-5109-3700'],
    ],
    summary:
      'Computational biologist with 9 years of research experience in genomics and machine learning. 21 publications, 1,100+ citations and ₹1.9 Cr in grants as co-investigator.',
    exp: [
      [
        'Scientist C',
        'Eastern Institute of Bioinformatics',
        'Kolkata',
        'Jan 2020',
        '',
        [
          'Lead a 7-member lab building ML models for variant interpretation in Indian population genomes',
          'Co-investigator on two DBT-funded projects (₹1.9 Cr combined)',
        ],
      ],
      [
        'Postdoctoral Fellow',
        'Indian Statistical Research Centre',
        'Kolkata',
        'Aug 2016',
        'Dec 2019',
        ['Developed open-source tools for single-cell RNA analysis (700+ GitHub stars)'],
      ],
    ],
    edu: [
      ['Indian Institute of Science Education and Research Kolkata', 'Ph.D.', 'Biological Sciences', 'Kolkata', '2011', '2016'],
      ['Presidency University', 'M.Sc.', 'Biotechnology', 'Kolkata', '2009', '2011'],
    ],
    skills: ['Genomics', 'Machine learning', 'Python / R', 'Nextflow', 'Statistical modelling', 'Scientific writing', 'Grant proposals'],
    langs: [
      ['Bengali', 'Native'],
      ['English', 'Fluent'],
      ['Hindi', 'Fluent'],
    ],
    awards: [['Young Scientist Award', 'Indian Society of Human Genetics', '2021', '']],
    custom: (id) => [
      entrySection(id, 'pubs', 'Selected publications', [
        ['A population-scale reference for Indian genomic variation', 'Nature Communications 14, 2023', '2023', []],
        ['scVelo-lite: fast RNA velocity for large datasets', 'Bioinformatics 37(12)', '2021', []],
        ['Graph neural networks for variant effect prediction', 'Genome Research 30', '2020', []],
      ]),
    ],
    certs: [['Certified Instructor', 'The Carpentries', '2019']],
    projects: [['scGraph', 'github.com/nandinic/scgraph', 'Python · Scanpy', ['Open-source toolkit for single-cell trajectory analysis; 220 GitHub stars']]],
  }),
}
