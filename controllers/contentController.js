import SiteContent, { getOrCreateSiteContent } from '../models/SiteContent.js';

const EDITABLE_FIELDS = [
  'brand',
  'intro',
  'feeStructure',
  'inclusions',
  'exclusions',
  'tuitionFees',
  'universities',
  'programOptions',
  'footerTagline',
  'videoConsent',
  'email',
];

export async function getContent(req, res, next) {
  try {
    const content = await getOrCreateSiteContent();
    res.json(content);
  } catch (error) {
    next(error);
  }
}

export async function getPublicContent(req, res, next) {
  try {
    const content = await getOrCreateSiteContent();
    res.json(content);
  } catch (error) {
    next(error);
  }
}

export async function updateContent(req, res, next) {
  try {
    const existing = await getOrCreateSiteContent();

    const updates = { updatedBy: req.admin.adminId };
    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const content = await SiteContent.findByIdAndUpdate(existing._id, updates, {
      new: true,
      runValidators: true,
    });
    res.json(content);
  } catch (error) {
    next(error);
  }
}
