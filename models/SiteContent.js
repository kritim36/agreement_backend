import mongoose from 'mongoose';
import { DEFAULT_TRANSLATIONS } from './siteContentTranslations.js';

const milestoneSchema = new mongoose.Schema(
  {
    stage: { type: String, required: true },
    subtitle: { type: String, default: '' },
    amount: { type: String, required: true },
    refundPolicy: {
      type: String,
      enum: ['refundable', 'non-refundable', 'custom'],
      default: 'non-refundable',
    },
    refundNote: { type: String, default: '' },
  },
  { _id: false }
);

const tuitionFeeRowSchema = new mongoose.Schema(
  {
    program: { type: String, required: true },
    approxAnnualFee: { type: String, required: true },
  },
  { _id: false }
);

const milestoneTranslationSchema = new mongoose.Schema(
  {
    stage: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    refundNote: { type: String, default: '' },
  },
  { _id: false }
);

// Text-only overlay of the English content for one language. Empty fields fall
// back to English on the student page; milestones and tuition programs are
// matched to the English rows by index.
function localizedContent(defaults) {
  return {
    brand: {
      tagline: { type: String, default: defaults.brand.tagline },
      pillBadgeText: { type: String, default: defaults.brand.pillBadgeText },
    },
    intro: {
      greetingText: { type: String, default: defaults.intro.greetingText },
      calloutText: { type: String, default: defaults.intro.calloutText },
    },
    feeStructure: {
      totalChargeLabel: { type: String, default: defaults.feeStructure.totalChargeLabel },
      totalChargeBreakdown: { type: String, default: defaults.feeStructure.totalChargeBreakdown },
      milestoneColumnLabel: { type: String, default: defaults.feeStructure.milestoneColumnLabel },
      milestones: {
        type: [milestoneTranslationSchema],
        default: () => defaults.feeStructure.milestones,
      },
      refundNote: { type: String, default: defaults.feeStructure.refundNote },
    },
    inclusions: {
      items: { type: [String], default: () => defaults.inclusions.items },
      bonusCallout: { type: String, default: defaults.inclusions.bonusCallout },
    },
    exclusions: {
      items: { type: [String], default: () => defaults.exclusions.items },
      note: { type: String, default: defaults.exclusions.note },
    },
    tuitionFees: {
      countryLabel: { type: String, default: defaults.tuitionFees.countryLabel },
      programs: { type: [String], default: () => defaults.tuitionFees.programs },
    },
    universities: { type: [String], default: () => defaults.universities },
    footerTagline: { type: String, default: defaults.footerTagline },
    videoConsent: {
      scriptText: { type: String, default: defaults.videoConsent.scriptText },
    },
  };
}

const DEFAULT_MILESTONES = [
  {
    stage: '1st Installment',
    subtitle: 'Registration Charge',
    amount: 'INR 30,000',
    refundPolicy: 'refundable',
    refundNote: '',
  },
  {
    stage: '2nd Installment',
    subtitle: 'After Confirmation Letter / Email',
    amount: 'INR 70,000',
    refundPolicy: 'non-refundable',
    refundNote: '',
  },
  {
    stage: '3rd Installment',
    subtitle: 'Before File Submission',
    amount: 'INR 50,000',
    refundPolicy: 'non-refundable',
    refundNote: '',
  },
];

const DEFAULT_INCLUSIONS = [
  'Assessment of your profile & eligibility',
  'Course options based on your profile',
  'Medium of Instruction (MOI) Certificate',
  'Statement of Purpose (SOP)',
  'Essay writing assistance',
  'CV / Resume preparation',
  'Official Transcripts assistance',
  'Internal evaluation of documents',
  'Apostille documentation',
  'Notary of documents',
  'Police Clearance Certificate (PCC)',
  'Language translation of documents',
  'Courier charges',
  'Visa form filling assistance',
  'Interview preparation & mock sessions',
  'Financial guidance for study abroad',
  'Government fee notifications & updates',
  'Part-time job guidance in Czech Republic',
  'Pre-departure training & guidance',
  'Airport arrival assistance & guidance',
  'University accommodation guidance',
  'Czech language translation support',
];

const DEFAULT_EXCLUSIONS = [
  'Application fee of university',
  'Visa application fees',
  'University Tuition Fees',
  'Health / Travel Insurance (mandatory after visa approval)',
];

const DEFAULT_TUITION_ROWS = [
  { program: "Bachelor's Degree", approxAnnualFee: '€ 2,500 / year' },
  { program: "Master's Degree", approxAnnualFee: '€ 5,000 / year' },
];

const DEFAULT_UNIVERSITIES = [
  'Czech University of Life Sciences',
  'Czech Technical University',
  'University of Chemistry & Technology',
  'Brno University of Technology',
  'Mendel University, Brno',
  'Masaryk University, Brno',
  'Charles University, Prague',
  'And many more top-ranked institutions',
];

const DEFAULT_PROGRAM_OPTIONS = ["Bachelor's Degree", "Master's Degree"];

const siteContentSchema = new mongoose.Schema(
  {
    brand: {
      companyName: { type: String, default: 'First Step Overseas' },
      tagline: {
        type: String,
        default: 'Your Trusted Study Abroad Partner  ·  Highest Student Reviews on YouTube',
      },
      pillBadgeText: { type: String, default: 'SERVICE AGREEMENT' },
    },

    intro: {
      greetingText: {
        type: String,
        default:
          'Dear Prospective Student,\n\nGreetings from First Step Overseas! Thank you for your time during our recent conversation. Based on our discussion, please find below the complete details of our service charges, fees, and the process for your study abroad journey to the Czech Republic.',
      },
      calloutText: {
        type: String,
        default:
          '🌟 First Step Overseas is proud to be recognised as having the highest number of student reviews on YouTube — a testament to our commitment to excellence and transparency.',
      },
    },

    feeStructure: {
      totalChargeLabel: { type: String, default: 'Total Consultancy & Documentation Charges' },
      totalChargeBreakdown: {
        type: String,
        default: 'Consultancy: INR 1,00,000  +  Documentation: INR 50,000',
      },
      totalChargeAmount: { type: String, default: 'INR 1,50,000' },
      milestoneColumnLabel: { type: String, default: 'Amount + 18% GST' },
      milestones: { type: [milestoneSchema], default: () => DEFAULT_MILESTONES },
      refundNote: {
        type: String,
        default:
          '* Refund Note: The 1st installment is eligible for a refund only if we are unable to obtain a confirmation letter or email from the university. Once confirmation is received, the 2nd and 3rd installments are strictly non-refundable, as they are directly applied towards services initiated and delivered.',
      },
    },

    inclusions: {
      items: { type: [String], default: () => DEFAULT_INCLUSIONS },
      bonusCallout: {
        type: String,
        default:
          '🎓 BONUS: IELTS Training Included at No Extra Cost!\nIELTS coaching available within the same package — morning to evening batches. Exam registration fees are not included. An IELTS score significantly expands your university and country options.',
      },
    },

    exclusions: {
      items: { type: [String], default: () => DEFAULT_EXCLUSIONS },
      note: {
        type: String,
        default:
          '📋 Insurance Note: Every student must obtain health insurance upon visa approval. Premium ranges from INR 30,000 to INR 90,000, determined by the insurance company based on age.',
      },
    },

    tuitionFees: {
      countryLabel: { type: String, default: 'Czech Republic Public Universities' },
      rows: { type: [tuitionFeeRowSchema], default: () => DEFAULT_TUITION_ROWS },
    },

    universities: { type: [String], default: () => DEFAULT_UNIVERSITIES },
    programOptions: { type: [String], default: () => DEFAULT_PROGRAM_OPTIONS },

    footerTagline: {
      type: String,
      default: 'This is a confidential service proposal prepared exclusively for you.',
    },

    socialLinks: {
      facebook: { type: String, default: '', trim: true },
      instagram: { type: String, default: '', trim: true },
      youtube: { type: String, default: '', trim: true },
      linkedin: { type: String, default: '', trim: true },
      x: { type: String, default: '', trim: true },
      whatsapp: { type: String, default: '', trim: true },
      website: { type: String, default: '', trim: true },
    },

    videoConsent: {
      scriptText: {
        type: String,
        default:
          'I, [Your Name], confirm that I have read and understood the service agreement, fee structure, and terms outlined above. I voluntarily agree to proceed with First Step Overseas for my study abroad application process.',
      },
    },

    email: {
      subject: {
        type: String,
        default: 'Your Agreement & Video Consent Confirmation',
      },
      greetingText: {
        type: String,
        default:
          'Dear {{fullName}},\n\nThank you for completing your service agreement with us. Below is a summary of your agreement for your records.',
      },
      videoConsentText: {
        type: String,
        default:
          'Your recorded video consent has been received. You can view your submission and video anytime using the link below:',
      },
      buttonText: { type: String, default: 'View My Submission & Video' },
    },

    translations: {
      gu: localizedContent(DEFAULT_TRANSLATIONS.gu),
      hi: localizedContent(DEFAULT_TRANSLATIONS.hi),
    },

    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', siteContentSchema);

export async function getOrCreateSiteContent() {
  let content = await SiteContent.findOne();
  if (!content) {
    content = await SiteContent.create({});
  }
  return content;
}

export default SiteContent;
