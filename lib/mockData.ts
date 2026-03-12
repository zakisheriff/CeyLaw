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
  }
];

export const mockSections: LawSection[] = [
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
    section_number: "368",
    heading: "Theft in dwelling house, &c.",
    content: "Whoever commits theft in any building, tent, or vessel, which building, tent, or vessel is used as a human dwelling, or for the custody of property, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine."
  },
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
  }
];
