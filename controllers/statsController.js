import Submission from '../models/Submission.js';

export async function getStats(req, res, next) {
  try {
    const [totalSubmissions, awaitingVideo, completed, recentActivity] = await Promise.all([
      Submission.countDocuments(),
      Submission.countDocuments({ status: 'awaiting-video' }),
      Submission.countDocuments({ status: 'completed' }),
      Submission.find().sort({ createdAt: -1 }).limit(5).select('fullName status createdAt'),
    ]);

    res.json({
      totalSubmissions,
      awaitingVideo,
      completed,
      recentActivity: recentActivity.map((s) => ({
        id: s._id,
        title: `${s.fullName} — ${s.status}`,
        updatedAt: s.createdAt,
      })),
      systemHealth: 'Stable',
      database: 'MongoDB connected',
    });
  } catch (error) {
    next(error);
  }
}
