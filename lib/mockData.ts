export interface Law {
  id: string;
  slug: string;
  title: string;
  year: number;
  act_number: string;
  category: string;
  description: string;
}

export interface LawSection {
  id: string;
  law_id: string;
  section_number: string;
  heading: string;
  content: string;
}

export const mockLaws: Law[] = [
  {
    id: "law-1",
    slug: "constitution-of-sri-lanka",
    title: "Constitution of the Democratic Socialist Republic of Sri Lanka",
    year: 1978,
    act_number: "No. 1 of 1978",
    category: "Constitutional Law",
    description: "The supreme law of Sri Lanka, establishing the structure of government, fundamental rights, and executive presidency."
  },
  {
    id: "law-2",
    slug: "penal-code",
    title: "Penal Code",
    year: 1883,
    act_number: "No. 2 of 1883",
    category: "Criminal Law",
    description: "The primary criminal code of Sri Lanka outlining offenses and their core penalties."
  },
  {
    id: "law-3",
    slug: "code-of-criminal-procedure",
    title: "Code of Criminal Procedure Act",
    year: 1979,
    act_number: "No. 15 of 1979",
    category: "Procedure / Evidence",
    description: "Provides the mechanism for the investigation and trial of criminal offences in Sri Lanka."
  },
  {
    id: "law-4",
    slug: "civil-procedure-code",
    title: "Civil Procedure Code",
    year: 1889,
    act_number: "No. 2 of 1889",
    category: "Procedure / Evidence",
    description: "The principal law governing the procedure applied in civil courts in Sri Lanka."
  },
  {
    id: "law-5",
    slug: "evidence-ordinance",
    title: "Evidence Ordinance",
    year: 1895,
    act_number: "No. 14 of 1895",
    category: "Procedure / Evidence",
    description: "An Ordinance to consolidate, define and amend the law of Evidence in Sri Lanka."
  },
  {
    id: "law-6",
    slug: "companies-act",
    title: "Companies Act",
    year: 2007,
    act_number: "No. 07 of 2007",
    category: "Commercial Law",
    description: "Outlines the rules, procedures, registration, and reporting requirements for companies incorporated in Sri Lanka."
  },
  {
    id: "law-7",
    slug: "intellectual-property-act",
    title: "Intellectual Property Act",
    year: 2003,
    act_number: "No. 36 of 2003",
    category: "Commercial Law",
    description: "Provides the legal framework for the protection of intellectual property rights, including trademarks, copyrights, and patents."
  },
  {
    id: "law-8",
    slug: "national-environmental-act",
    title: "National Environmental Act",
    year: 1980,
    act_number: "No. 47 of 1980",
    category: "Environmental Law",
    description: "Established to manage environmental protection, control pollution, and regulate developments."
  },
  {
    id: "law-9",
    slug: "personal-data-protection-act",
    title: "Personal Data Protection Act",
    year: 2022,
    act_number: "No. 9 of 2022",
    category: "Technology & Privacy",
    description: "To provide for the regulation of processing of personal data and to safeguard the privacy of individuals."
  },
  {
    id: "law-10",
    slug: "online-safety-act",
    title: "Online Safety Act",
    year: 2024,
    act_number: "No. 9 of 2024",
    category: "Technology & Privacy",
    description: "To establish the Online Safety Commission and regulate the safety of citizens navigating the digital space."
  },
  {
    id: "law-11",
    slug: "prevention-of-terrorism-act",
    title: "Prevention of Terrorism (Temporary Provisions) Act",
    year: 1979,
    act_number: "No. 48 of 1979",
    category: "National Security",
    description: "An Act to make temporary provision for the prevention of acts of terrorism in Sri Lanka."
  },
  {
    id: "law-12",
    slug: "judicature-act",
    title: "Judicature Act",
    year: 1978,
    act_number: "No. 2 of 1978",
    category: "Constitutional Law",
    description: "Provides for the establishment of the Courts of First Instance and regulates their jurisdiction."
  },
  {
    id: "law-13",
    slug: "inland-revenue-act",
    title: "Inland Revenue Act",
    year: 2017,
    act_number: "No. 24 of 2017",
    category: "Financial Law",
    description: "To provide for the imposition of Income Tax, Capital Gains Tax, and related fiscal controls."
  },
  {
    id: "law-14",
    slug: "sri-lanka-electricity-act",
    title: "Sri Lanka Electricity Act",
    year: 2009,
    act_number: "No. 20 of 2009",
    category: "Infrastructure",
    description: "To provide for the regulation of the generation, transmission, distribution and supply of electricity in Sri Lanka."
  },
  {
    id: "law-15",
    slug: "muslim-marriage-and-divorce-act",
    title: "Muslim Marriage and Divorce Act",
    year: 1951,
    act_number: "No. 13 of 1951",
    category: "Family Law",
    description: "An Act to make provision with respect to the marriages and divorces of Muslims in Sri Lanka."
  }
];

export const mockSections: LawSection[] = [
  // Penal Code
  {
    id: "sec-1",
    law_id: "law-2",
    section_number: "366",
    heading: "Theft",
    content: "Whoever, intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft."
  },
  {
    id: "sec-2",
    law_id: "law-2",
    section_number: "367",
    heading: "Punishment for theft",
    content: "Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both."
  },
  {
    id: "sec-3",
    law_id: "law-2",
    section_number: "293",
    heading: "Culpable Homicide",
    content: "Whoever causes death by doing an act with the intention of causing death, or with the intention of causing such bodily injury as is likely to cause death, or with the knowledge that he is likely by such act to cause death, commits the offence of culpable homicide."
  },
  // Constitution
  {
    id: "sec-4",
    law_id: "law-1",
    section_number: "10",
    heading: "Freedom of thought, conscience and religion",
    content: "Every person is entitled to freedom of thought, conscience and religion, including the freedom to have or to adopt a religion or belief of his choice."
  },
  {
    id: "sec-5",
    law_id: "law-1",
    section_number: "11",
    heading: "Freedom from torture",
    content: "No person shall be subjected to torture or to cruel, inhuman or degrading treatment or punishment."
  },
  {
    id: "sec-6",
    law_id: "law-1",
    section_number: "12",
    heading: "Right to equality",
    content: "(1) All persons are equal before the law and are entitled to the equal protection of the law. (2) No citizen shall be discriminated against on the grounds of race, religion, language, caste, sex, political opinion, place of birth or any one of such grounds."
  },
  // Data Protection Act
  {
    id: "sec-7",
    law_id: "law-9",
    section_number: "6",
    heading: "Lawfulness of Processing",
    content: "A controller shall ensure that personal data is processed lawfully. Processing shall be lawful only if and to the extent that the data subject has given consent to the processing of his personal data."
  },
  // Online Safety Act
  {
    id: "sec-8",
    law_id: "law-10",
    section_number: "12",
    heading: "Communication of false statements of fact",
    content: "Any person who, whether in or outside Sri Lanka, poses a threat to national security, public health or public order or promotes feelings of ill-will and hostility between different classes of people, by communicating a false statement of fact, commits an offence."
  },
  // Evidence Ordinance
  {
    id: "sec-9",
    law_id: "law-5",
    section_number: "24",
    heading: "Confession caused by inducement, threat or promise",
    content: "A confession made by an accused person is irrelevant in a criminal proceeding if the making of the confession appears to the court to have been caused by any inducement, threat or promise having reference to the charge."
  },
  // Companies Act
  {
    id: "sec-10",
    law_id: "law-6",
    section_number: "4",
    heading: "Types of Companies",
    content: "A company incorporated under this Act may be either a limited company; a private company; or an unlimited company."
  }
];
