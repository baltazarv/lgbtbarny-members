const lawNotesDataRaw = [
  {
    key: '32863bbf-b4c2-40dc-97ba-e8e2e5efd794',
    title: 'Accurate Passports for Intersex Individuals',
    month: 'June',
    year: '2020',
    latest: true,
    chapters: [
      '10th Circuit Orders State Department to Reconsider Denial of Accurate Passport to Intersex Plaintiff',
      'U.S. Supreme Court Denies Stay of Idaho Prisoner\'s Transgender Confirmation Surgery Case',
      'Ninth Circuit Allows State Law Claims to Proceed Against Corrections Officer for Sexual Assault',
      'Two Federal District Courts Rule on Social Security Survivor Benefits for Same-Sex Spouses Whose Marriages Occurred Fewer Than Nine Months Before the Death of Their Spouse',
      'Tennessee Appeals Court Rejects Lesbian Partner\'s Standing to Seek Parental Rights',
    ],
    url: '/pdfs/law-notes/LawNotes-June-2020.pdf',
  },
  {
    key: '32863bbf-b4c2-40dc-97ba-e8e2e5efd794',
    title: 'Detainees at Risk for COVID-19 Seek Relief',
    month: 'May',
    year: '2020',
    latest: true,
    chapters: [
      'Federal Judge Issues Nationwide Injunction to Screen ICE Detainees at High Risk for COVID-19; ICE Detainee Released in Ohio; Plaintiffs Fail in Georgia and Kansas',
      'Massachusetts SJC Rules Probate Court Has Jurisdiction Over Complex Gestational Surrogacy Petition',
      'Court of Appeals of Michigan Decrees New Trial in Custody and Visitation Dispute Between Lesbian Mothers',
      'Transgender Man in the U.K. Cannot Be Listed as Father on Child\'s Birth Certificate',
      'Idaho Federal Judge Rejects Transgender Inmate\'s Medical and Other Claims, Despite Ninth Circuit Ruling in Edmo v. Corizon',
    ],
    url: '/pdfs/law-notes/LawNotes-May-2020.pdf',
  },
  {
    key: '1a9b9ea5-7482-4123-8c26-d93d1cead485',
    title: 'Court of Appeals Grants Asylum for Gay Man From Ghana',
    month: 'April',
    year: '2020',
    latest: false,
    chapters: [
      '3rd Circuit Court of Appeals Orders Asylum for Gay Man from Ghana',
      'New York Fourth Department Refuses to Extend Brooke S.B. to Tri-Custodial Arrangements',
      'Alaska Federal Court Says Employer’s Denial of Insurance Coverage for Sex-Reassignment Surgery Violates Federal Law',
      'North Carolina Federal Court Refuses to Dismiss Challenge to North Carolina’s Exclusion of Coverage for Gender Transition from State Employee Medical Plan',
      'Ohio Appeals Court Holds Misgendering Defendant During Trial is Not Grounds for Reversal',
    ],
    url: '/pdfs/law-notes/LawNotes-April-2020.pdf',
  },
  {
    key: '5ebcbe44-0ff4-4f53-96ae-e8e7e48a4f05',
    title: 'SCOTUS to Review Catholic Foster Care Agency\'s Claimed Right to Reject Same-Sex Couples',
    month: 'March',
    year: '2020',
    chapters: [
      'Supreme Court Agrees to Review Catholic Foster Care Agency\'s Claimed Right to Discriminate against SameSex Couples',
      'Ninth Circuit Denies En Banc Rehearing in Idaho Inmate\'s Gender Confirmation Surgery Case; Circuit Split Possible; Many Judges Dissent',
      'Eleventh Circuit Relaxes Standards for Inmate Victims of Sexual Acts',
      '11th Circuit Grants Gay Guinean\'s Petition to Vacate BIA\'s Denial of Asylum, Based on Ineffective Assistance of Counsel',
      'Federal Court Refuses Further Delay in Trans Military Ban Discovery',
    ],
    url: '/pdfs/law-notes/LawNotes-March-2020.pdf',
  },
  {
    key: '3a38df75-2b6a-4d4a-99b8-eca0d7427411',
    title: 'SCOTUS Denies Trans Inmate\'s Petition',
    month: 'January',
    year: '2020',
    chapters: [
      'Supreme Court Denies Trans Inmate\'s Petition in Transition Denial Case',
      'Montana High Court Tacks Pre-Marriage Equality Portion of Same-Sex Relationship to Subsequent Marriage Through Common Law Doctrine',
      'Louisiana Appeals Court Awards Shared Custody of Children to Transgender De Facto Father and Estranged Biological Mother',
      'Virginia Court Denies Annulment to Woman Who Claims Her Marriage to Transgender Spouse was Induced by Fraud',
      'Sixth Circuit Upholds Torture Claim Denial of Iraqi Woman With Same-Sex Sexual Abuse Conviction',
    ],
    sample: true,
    url: '/pdfs/law-notes/LawNotes-January-2020.pdf',
  },
  {
    key: '318c17f3-618d-4c27-b13f-c9bb98ec93e6',
    title: 'New York Takes on Trump\'s Religious Refusal Rule',
    month: 'December',
    year: '2019',
    chapters: [
      'New York Federal Judge Vacates Trump Administration "Conscience" Regulation',
      '11th Circuit Finds Transgender Woman from Honduras Ineligible for Relief from CAT Relief Based on Improved Country Conditions',
      '6th Circuit Refuses to Grant Asylum Application to Gay Albanian Refuge',
      'Illinois Federal District Judge Remands Board of Immigration Appeals\' Decision Involving the Denial of a Married Same-Sex Couple\'s I-130 Petition',
      'New York Federal Court Rules on Contested Admissibility of HIV-Expert\'s Testimony in Public Accommodations Discrimination Case',
    ],
    url: '/pdfs/law-notes/LawNotes-December-2019.pdf',
  },
  {
    key: '1b0bc1f8-12d6-4159-b348-5fc7b04d674e',
    title: 'Trump\'s Trans Military Ban to SCOTUS?',
    month: 'December',
    year: '2018',
    chapters: [
      'Federal Judge Issues Nationwide Injunction to Screen ICE Detainees at High Risk for COVID-19; ICE Detainee Released in Ohio; Plaintiffs Fail in Georgia and Kansas',
      'Massachusetts SJC Rules Probate Court Has Jurisdiction Over Complex Gestational Surrogacy Petition',
      'Court of Appeals of Michigan Decrees New Trial in Custody and Visitation Dispute Between Lesbian Mothers',
      'Transgender Man in the U.K. Cannot Be Listed as Father on Child’s Birth Certificate',
      'Idaho Federal Judge Rejects Transgender Inmate’s Medical and Other Claims, Despite Ninth Circuit Ruling in Edmo v. Corizon',
    ],
    url: '/pdfs/law-notes/LawNotes-December-2018.pdf',
  },
  {
    key: 'c44a0df4-cb34-44db-826e-4d2cb7b3d2dd',
    title: 'G’DAY: Results of Australian Postal Survey Are Overwhelming and Parliament Moves Quickly to Enact Marriage Equality',
    month: 'December',
    year: '2017',
    url: '/pdfs/law-notes/LawNotes-December-2017.pdf',
  },
];

// issue = calculation field
const lawNotesData = lawNotesDataRaw.map(item => {
  const issue = `${item.month} ${item.year}`;
  return {...item, issue};
});

export default lawNotesData;