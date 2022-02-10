// colors: ['#0050b3', '#40a9ff'], // blue
// colors: ['#1d39c4', '#597ef7'], // geekblue
// colors: ['#d48806', '#faad14'], // gold
// colors: ['#389e0d', '#52c41a'], // green
// colors: ['#595959', '#8c8c8c'], // grey
// colors: ['#d46b08', '#fa8c16'], // orange
// colors: ['#531dab', '#b37feb'], // purple
// colors: ['#d4380d', '#fa541c'], // volcano

/**
 * TODO: sync Airtable groups table with static content below:
 * 
 * groups in Airtable, but not here:
 * * "Pro Bono Service & Clinics Committee"
 *   ...(vs "Pro Bono Panel")
 * * "Law Student Leadership Committee"
 *   ...(vs "Leadership Summit")
 * * "Public Interest Law Committee"
 *   ...(vs "Solo & Small Law Firm Practitioners Committee")
 * 
 * groups here, but were not in Airtable - added:
 * * "Judicial Fellowship"
 * * "Law Student Career Fair"
 * * "Leadership Summit"
 */

export const groupCategories = {
  committees: 'Committees & Sections',
  referrals: 'Referrals & Pro Bono',
  leadership: 'Leadership Council',
  volunteering: 'Volunteering at Clinics',
  mentoring: 'Mentoring',
  internship: 'Internship',
}

/** Shared by students and attorneys */

const internship = {
  key: 'internship',
  image: '/images/groups/internship.jpg',
  imageOptions: {
    backgroundPosition: 'center -4px',
  },
  colors: ['#08979c', '#87e8de'],
  title: 'Internship Program',
  description: "Under the guidance of LeGaL's Legal Director and volunteer attorneys, interns participate in client intake, assist with legal research, organize case documents, learn valuable legal resources, and develop a deeper understanding of the profession. They have the opportunity to interact directly with clients through LeGaL's free legal clinics, client phone calls, and online inquiries. As a result, LeGaL's interns gain exposure to a wide range of legal issue and practice areas, including housing, criminal law, discrimination, employment, family law, immigration, and estate planning.",
  links: [
    {
      title: 'Internship Program',
      url: 'https://www.lgbtbarny.org/career-fair',
    },
  ],
  categories: ['internship'],
}

const mentoring = {
  key: 'mentoring',
  image: '/images/groups/mentoring.jpg',
  imageOptions: {
    backgroundPosition: 'center -11px',
  },
  colors: ['#eb2f96'],
  title: 'Mentoring Program',
  description: <span>Through the "Mentorpalooza" Mentoring Program, LeGaL and New York City Bar LGBT Rights Committee seek to foster the professional development of LGBTQ law students and assist them in navigating the unique issues they might encounter during Law School and the beginning of their legal careers. The Mentoring Program aims to reinforce a sense of community among members of the LGBT legal community while enhancing the skills and career prospects of participants.</span>,
  links: [
    {
      title: 'Mentoring Program',
      url: 'https://www.lgbtbarny.org/mentoring',
    },
    {
      title: 'Get Involved',
      url: 'https://www.lgbtbarny.org/get-involved',
    },
  ],
  categories: ['mentoring'],
}

export const ATTORNEY_GROUPS = {
  diversity: {
    key: 'diversity',
    colors: ['#fa541c', '#ff7a45'], // volcano
    title: 'Diversity Committee',
    chairs: ['Bill Crosby', 'Robert Maldonado'],
    description: <span>The Diversity Committee is dedicated to working collaboratively toward creating and maintaining diversity within LeGaL; advocating for diversity in the organization's activities and services; inviting and encouraging participation and involvement of individuals with diverse backgrounds, as well as institutions that seek the same; raising awareness of the diversity within the LGBT community through programs and activities; and strengthening the support provided to LeGaL members and the wider LGBT community by promoting inclusiveness, regardless of race, gender, sexual orientation, gender identity, religious, and economic diversity.</span>,
    links: [
      {
        title: 'Committees & Sections',
        url: 'https://www.lgbtbarny.org/committees-sections',
      }
    ],
    categories: ['committees'],
  },
  family: {
    key: 'family',
    image: '',
    colors: ['#08979c', '#87e8de'],
    title: 'Family & Matrimonial Law Section',
    chairs: ['Mark Hager'],
    viceChairs: ['Jonathan Latimer'],
    description: <span>The Family and Matrimonial Law Section is the first Section for LeGaL and represents an expansion of LeGaL's committee-based structure.  The FMLS offers members who practice, or have an interest in, family and matrimonial law a combination of resources, access to events, and discourse uniquely focused on the intersection of family and matrimonial law and the LGBTQ community.  FMLS members have exclusive access to an online discussion group-the first-ever forum for LeGaL-in which LGBTQ-client-focused family and matrimonial law practitioners can connect and engage with one another.</span>,
    links: [
      {
        title: 'Committees & Sections',
        url: 'https://www.lgbtbarny.org/committees-sections',
      }
    ],
    categories: ['committees'],
  },
  corp: {
    key: 'corp',
    image: '',
    colors: ['#cf1322', '#ff4d4f'], // red
    title: 'In-House Corporate Counsel Committee',
    chairs: ['Mark Hager'],
    description: <span>Forum for counsel serving in-house at corporations. The committee promotes the professional interests of LGBT in-house counsel, conducts events for those interested in in-house counsel opportunities, liaisons with other organizations to foster best practices, and provides opportunities for LGBT in-house counsel to network and share resources.
    </span>,
    links: [
      {
        title: 'Committees & Sections',
        url: 'https://www.lgbtbarny.org/committees-sections',
      }
    ],
    categories: ['committees'],
  },
  internship,
  judiciary: {
    key: 'judiciary',
    image: '/images/groups/judiciary.jpg',
    colors: ['#531dab', '#8c8c8c'], // custom, grey
    title: 'Judiciary Committee',
    chairs: ['Janice Grubin'],
    viceChairs: ['Michael Weiner'],
    description: <span>Oversee LeGaL screening panels that evaluate candidates for judicial office and provide ratings; recruit and select designees to serve on judicial screening panels of other organizations; promote the interests of members of the LGBT community interested in serving within the judiciary; hold events and programs focused on the judiciary; liaison with the judicial community and promote the advancement of judges dedicated to equality and full representation of the LGBT legal community.</span>,
    links: [
      {
        title: 'Committees & Sections',
        url: 'https://www.lgbtbarny.org/committees-sections',
      }
    ],
    categories: ['committees'],
  },
  lrn: {
    key: 'lrn',
    image: '',
    colors: ['#fadb14', '#ffec3d'], // yellow
    title: 'Lawyer Referral Network',
    description: <span>As part of LeGaL's effort to provide and increase access to high quality, culturally competent legal services for members of the LGBTQ community, we offer a Pro Bono Panel (PBP)  and a Lawyer Referral Network (LRN). This provides opportunities for solo lawyers, law firms, and legal services organizations to assist the community by offering pro bono services through the PBP, or to obtain potential fee-paying clients through  the LRN. Both utilize the LeGaL Help Platform, which facilitates quick and appropriate referrals. In 2017, 65 providers made themselves available for approximately 1,000 potential consultations.</span>,
    links: [
      {
        title: 'Lawyer Referral Network',
        url: 'https://www.lgbtbarny.org/lrn-pbp',
      },
      {
        title: 'Legal Services',
        url: 'https://www.lgbtbarny.org/legal-services',
      },
      {
        title: 'Get Involved',
        url: 'https://www.lgbtbarny.org/get-involved',
      },
    ],
    categories: ['referrals'],
  },
  leadership: {
    key: 'leadership',
    image: '',
    colors: ['#389e0d', '#52c41a'], // green
    title: 'Leadership Council',
    description: <span>The Leadership Council brings together firms and companies to assist LeGaL in its mission of safeguarding and advancing the rights of the LGBT community. It provides vital pro bono services, including hosting, sponsorship, and/or legal advocacy to provide life-changing services to member of our community members unlikely to be able to afford an attorney.</span>,
    links: [
      {
        title: 'LeGaL\'s Leadership Council',
        url: 'https://www.lgbtbarny.org/leadership-council',
      },
      {
        title: 'Legal Services',
        url: 'https://www.lgbtbarny.org/legal-services',
      },
    ],
    categories: ['leadership'],
  },
  mentoring,
  social: {
    key: 'social',
    image: '/images/groups/pool-party.jpg',
    imageOptions: { backgroundPosition: `center -32px` },
    colors: ['#c41d7f', '#40a9ff'], // custom, grey
    title: 'Networking & Social Events Committee',
    chairs: ['Nicholas Corsano'],
    description: <span>Organize social and networking events for LeGaL members and, in conjunction with other organizations, promote a sense of community among members while expanding professional and social networks.</span>,
    links: [
      {
        title: 'Committees & Sections',
        url: 'https://www.lgbtbarny.org/committees-sections',
      }
    ],
    categories: ['committees'],
  },
  virtualclinic: {
    key: 'virtualclinic',
    colors: ['#d46b08', '#fa8c16'], // orange
    label: 'Virtual Legal Clinic',
    title: 'Virtual Legal Clinic',
    description: <div>We are pleased to announce the return of LeGaL's Tuesday Night Clinic, now online! The Clinic will continue to operate on Tuesdays from 6-8 pm, now with video consultations with our volunteer lawyers.
    </div>,
    links: [
      {
        title: 'LeGaL\'s Virtual Legal Clinic',
        url: 'https://www.lgbtbarny.org/clinics-information',
      },
      {
        title: 'Legal Services',
        url: 'https://www.lgbtbarny.org/legal-services',
      },
      {
        title: 'Get Involved',
        url: 'https://www.lgbtbarny.org/get-involved',
      },
    ],
    categories: ['volunteering'],
  },
  partners: {
    key: 'partners',
    image: '',
    colors: ['#c41d7f', '#eb2f96'],
    title: 'Partners Group',
    chairs: ['Joe Evall'],
    description: <span>Forum for partners in large law firms and with corporate/institutional clients to network and share experiences and ideas; promote LGBT friendly policies within the law firm community; promote recruiting and mentoring of LGBT associates; work to improve the prospects of LGBT lawyers interested in serving on the bench and sponsor events of interest to large law firm community.</span>,
    links: [
      {
        title: 'Committees & Sections',
        url: 'https://www.lgbtbarny.org/committees-sections',
      }
    ],
    categories: ['committees'],
  },
  probono: {
    key: 'probono',
    image: '',
    colors: ['#d48806', '#faad14'], // gold
    title: 'Pro Bono Panel',
    description: <span>LeGaL also provides several legal services to the LGBTQ community such as LeGaL's Helpline and several legal clinics in NY and NJ. Through these legal services and the LRN/PBP referral platform, LeGaL helps lawyers and legal services organizations connect with members of the LGBTQ community.</span>,
    links: [
      {
        title: 'Lawyer Referral Network',
        url: 'https://www.lgbtbarny.org/lrn-pbp',
      },
      {
        title: 'Get Involved',
        url: 'https://www.lgbtbarny.org/get-involved',
      },
    ],
    categories: ['referrals'],
  },
  solo: {
    key: 'solo',
    image: '',
    colors: ['#5b8c00', '#a0d911'], // lime
    title: 'Solo & Small Law Firm Practitioners Committee',
    description: <span>The Public Interest Law Committee is made up of the LGBT not-for-profit legal services community, governmental attorneys and judges, academics, and attorneys interested in pro bono opportunities and public interest work. The PILC is also working to launch LeGaL's new Leadership Council for law firms and companies to take on innovative pro bono projects.</span>,
    links: [
      {
        title: 'Committees & Sections',
        url: 'https://www.lgbtbarny.org/committees-sections',
      }
    ],
    categories: ['committees'],
  },
  slap: {
    key: 'slap',
    image: '/images/groups/slap.jpg',
    imageOptions: { backgroundPosition: 'center -18px' },
    colors: ['#5cdbd3', '#8c8c8c'], // custom, grey
    title: 'Solutions for Legislative Advocacy and Policy ("SLAP")',
    charis: ['Justin Teres'],
    description: <span>LeGaL's Solutions for Legislative Advocacy and Policy ("SLAP") group pushes for the adoption of policies that protect the civil rights of LGBTQ New Yorkers.</span>,
    link: 'https://www.lgbtbarny.org/policy-advocacy',
    links: [
      {
        title: 'Policy Advocacy',
        url: 'https://www.lgbtbarny.org/policy-advocacy',
      },
      {
        title: 'Committees & Sections',
        url: 'https://www.lgbtbarny.org/committees-sections',
      },
    ],
    categories: ['committees'],
  },
}

export const STUDENT_GROUPS = {
  internship,
  fellowship: {
    key: 'fellowship',
    image: '/images/groups/fellowship.jpg',
    imageOptions: { backgroundPosition: 'center -6px' },
    colors: ['#fadb14'],
    label: 'Judicial Fellowship',
    title: 'Hank Henry Judicial Fellowship',
    description: <span>The Dr. M.L. "Hank" Henry, Jr. Judicial Fellowship Program was established in memory of the groundbreaking efforts by Dr. Henry, as the Executive Director of the Fund for Modern Courts, to ensure that openly gay and lesbian candidates were considered for appointed judicial positions.<br /><br />
    This 10-week summer internship in New York City and Albany remains one-of-a-kind, providing fellows with the opportunity to rotate among several different judges. The law student fellow gets a first-hand look at the work of openly gay and lesbian judges in federal district court, state trial and appellate courts (including the highest court in the state), and administrative tribunals. This experience provides an insider's understanding of the judicial system, along with the opportunity to work alongside openly gay and lesbian judges. Additionally, depending on the assignments selected by the fellow in conjunction with the judges, students can expect to complete 1-2 written assignments consisting of draft decisions and/or memorandums.<br /><br />
    A $4,500 stipend accompanies the position. Students with funding from other sources are encouraged to apply, although the stipend may be limited to assisting students without funding. Additional funding will also be provided to cover travel expenses for the fellow's time spent in Albany.</span>,
    links: [
      {
        title: 'Judicial Fellowship',
        url: 'https://www.lgbtbarny.org/hank-henry',
      },
    ],
  },
  careerfair: {
    key: 'careerfair',
    colors: ['#fa541c', '#ff9c6e'],
    image: '/images/groups/career-fair.jpg',
    imageOptions: { backgroundPosition: 'center -43px' },
    label: 'Law Student Career Fair',
    title: 'LGBTQ Law Student Career Fair',
    description: <span>Targeted specifically to local LGBTQ law students, this one-of-a-kind annual event provides a great opportunity to meet informally with lawyers and recruiters and learn about employment opportunities in preparation for the fall recruiting season.<br /><br />
    LeGaL's LGBTQ Legal Career Fair for First-Year students is held annually at New York Law School in the Spring. The event includes a pre-fair panel discussion with insiders' tips on job searches and the workplace environment, followed by the opportunity to establish networks with many of New York's top firms, largest government employers, and leading public interest organizations.</span>,
    links: [
      {
        title: 'Career Fair',
        url: 'https://www.lgbtbarny.org/career-fair',
      },
    ],
    categories: ['student'],
  },
  summit: {
    key: 'summit',
    image: '/images/groups/summit.jpg',
    imageOptions: { backgroundPosition: 'center -9px' },
    colors: ['#9254de'],
    label: 'Leadership Summit',
    title: 'New York LGBTQ+ Law Student Leadership Summit',
    description: <span>LeGaL invites each local LGBTQ+ law student group to send 1-2 representatives from their school for a unique training opportunity to hear about how to maximize their group's potential in the upcoming year and what LeGaL has to offer area law students.</span>,
  //   links: [
  //     {
  //       title: 'New York LGBTQ+ Law Student Leadership Summit',
  //       url: 'https://www.lgbtbarny.org/events/new-york-lgbtq-law-student-leadership-summit',
  //     },
  //   ],
  },
  mentoring,
}

/** Content on https://www.lgbtbarny.org/ not used on Membership Dashboard:
 * * Manhattan Walk-In Clinic
 * * NJ Legal Assistance Project
 * * LeGaL's LGBT Youth Qlinic
 * * Legal Helpline
*/

const tnc = {
  key: 'tnc',
  colors: ['#d46b08', '#fa8c16'], // orange
  label: 'Manhattan Walk-In Clinic',
  title: 'Manhattan Tuesday Night Walk-In Clinic',
  description: <span>The LeGaL Foundation is pleased to provide a pro bono legal clinic devoted to serving the LGBTQ community of NYC.<br /><br />
  The clinic is staffed by volunteer attorneys who are available to provide general guidance and legal referrals, but not legal representation. Each visitor can expect to have a 15 - 20 minute consultation with our volunteer attorneys.</span>,
  links: [
    {
      title: 'Manhattan Tuesday Night Clinic',
      url: 'https://www.lgbtbarny.org/manhattan-clinic-registration',
    },
    {
      title: 'LeGaL\'s Walk-In Clinics',
      url: 'https://www.lgbtbarny.org/clinics-information',
    },
    {
      title: 'Legal Services',
      url: 'https://www.lgbtbarny.org/legal-services',
    },
    {
      title: 'Get Involved',
      url: 'https://www.lgbtbarny.org/get-involved',
    },
  ],
  categories: ['volunteering'],
}

const njclinic = {
  key: 'njclinic',
  colors: ['#0050b3', '#40a9ff'], // blue
  label: 'NJ Legal Assistance Project',
  title: 'The New Jersey LGBTQ Legal Assistance Project',
  description: <span>The LeGaL Foundation, in partnership with North Jersey Community Research Initiative (NJCRI), is pleased to provide a free pro bono legal clinic devoted to serving the LGBTQ community of Newark (you don't have to live in Newark to qualify for assistance).<br /><br />
  What kind of help is offered?<br /><br />
  The clinic is staffed by volunteer attorneys who are available to provide general guidance and referrals, but not representation, for legal issues affecting gay, lesbian, bisexual, and transgender people. Each visitor can expect to have a 15 - 20 minute consultation with our volunteer attorneys.</span>,
  links: [
    {
      title: 'LeGaL\'s Youth Qlinic',
      url: 'https://www.lgbtbarny.org/youthqlinic',
    },
    {
      title: 'Get Involved',
      url: 'https://www.lgbtbarny.org/get-involved',
    },
  ],
  categories: ['volunteering', 'student'],
}

const youthqlinic = {
  key: 'youthqlinic',
  colors: ['#1d39c4', '#597ef7'], // geekblue
  title: <span>LeGaL's LGBT Youth Qlinic</span>,
  description: <span>The LGBTQ Youth Qlinic (the “Qlinic”) is a project of The LeGaL Foundation in collaboration with Sanctuary for Families' Pro Bono Council to provide free short-term limited scope legal services to LGBTQ youth.  The Qlinic takes place on Saturday evenings at the Church of St. Luke in the Fields in coordination with Art &amp; Acceptance, a weekly program that provides a safe space and community for lesbian, gay, transgender, gender non-conforming, questioning, and allied youth ages 16-24, many of whom are homeless or struggling with unstable living situations.<br /><br />
  What kind of help is offered?<br /><br />
  It is the goal of the Qlinic to intervene in the cycle of alienation, discrimination, and exploitation that marginalizes LGBTQ homeless youth. Through short-term legal consultations and referrals, the Qlinic connects youth participants of Art &amp; Acceptance to legal resources to address critical needs.  In each consultation, Qlinic Volunteer Attorneys identify legal issues and remedies that may be available to youth participants, and, if appropriate, refer youth participants to legal services organizations that  can offer further guidance or representation.  In providing these services, the Qlinic aims to foster an atmosphere of acceptance and inclusiveness, and to communicate to youth participants that their needs are visible and important and that their voices are heard.</span>,
  links: [
    {
      title: 'LeGaL\'s Youth Qlinic',
      url: 'https://www.lgbtbarny.org/youthqlinic',
    },
    {
      title: 'LeGaL\'s Walk-In Clinics',
      url: 'https://www.lgbtbarny.org/clinics-information',
    },
    {
      title: 'Legal Services',
      url: 'https://www.lgbtbarny.org/legal-services',
    },
    {
      title: 'Get Involved',
      url: 'https://www.lgbtbarny.org/get-involved',
    },
  ],
  categories: ['volunteering'],
}

const helpline = {
  key: 'helpline',
  image: '',
  colors: ['#531dab', '#b37feb'], //purple
  title: 'Legal Helpline',
  description: <span>LeGaL's Helpline, which fields legal inquiries and provides information about our walk-in clinics, experienced a surge in calls from LGBTQ community in 2017, with nearly 2,000 requests for legal assistance.</span>,
  links: [
    {
      title: 'Legal Services',
      url: 'https://www.lgbtbarny.org/legal-services',
    },
  ],
  categories: ['volunteering'],
}
