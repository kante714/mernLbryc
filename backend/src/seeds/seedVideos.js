const now = new Date();
const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

// Seed thumbnails point at Unsplash directly (not Cloudinary) — that's fine,
// thumbnailAsset.publicId stays empty so nothing will ever attempt to delete
// them from Cloudinary. Once an admin re-uploads a real thumbnail through the
// admin UI, publicId gets populated and lifecycle management kicks in.
const videos = [
  {
    title: 'HIGHLIGHTS: LIKHU BHUJEE RYC 0-0 BIGU',
    category: 'highlights',
    thumbnailAsset: { secureUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600', resourceType: 'image' },
    duration: '5:14',
    premium: true,
    publishedAt: daysAgo(1),
    description: 'Watch the highlights from LIKHU BHUJEE RYC\'s goalless draw with BIGU at Amrit Ghamchaya.',
  },
  {
    title: 'HIGHLIGHTS: UNITED RASNALU 1-2 LIKHU BHUJEE RYC',
    category: 'highlights',
    thumbnailAsset: { secureUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600', resourceType: 'image' },
    duration: '6:32',
    premium: true,
    publishedAt: daysAgo(4),
    description: 'Extended highlights from United Rasnalu\'s defeat at Amrit Ghamchaya.',
  },
  {
    title: 'ABIRAJ: Post-Match Reaction vs Bigu',
    category: 'interviews',
    thumbnailAsset: { secureUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600', resourceType: 'image' },
    duration: '3:42',
    premium: true,
    publishedAt: daysAgo(1),
    description: 'Head Manager Abiraj Sunuwar speaks to the media after the draw with Bigu.',
  },
  {
    title: 'RABIN: "We Have The Quality To Win"',
    category: 'interviews',
    thumbnailAsset: { secureUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=600', resourceType: 'image' },
    duration: '2:58',
    premium: true,
    publishedAt: daysAgo(2),
    description: 'Striker Rabin on the team\'s ambitions for the rest of the season.',
  },
  {
    title: 'TRAINING: Libhuras Prepare for Norwich',
    category: 'training',
    thumbnailAsset: { secureUrl: 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=600', resourceType: 'image' },
    duration: '4:07',
    premium: true,
    publishedAt: daysAgo(3),
    description: 'Behind the scenes at NSF Ground as the squad prepares for the weekend fixture.',
  },
  {
    title: 'TRAINING: Set-Piece Work Ahead of We Are Brothers',
    category: 'training',
    thumbnailAsset: { secureUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600', resourceType: 'image' },
    duration: '3:21',
    premium: false,
    publishedAt: daysAgo(4),
    description: 'Free training footage — the coaching staff work on set-pieces.',
  },
  {
    title: 'WOMEN: Match Highlights vs We Are Brothers Women',
    category: 'academy-women',
    thumbnailAsset: { secureUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600', resourceType: 'image' },
    duration: '6:22',
    premium: false,
    publishedAt: daysAgo(2),
    description: 'Watch all the action from Likhu Bhujee RYC Women\'s 1-0 win over We Are Brothers Women.',
  },
  {
    title: 'ACADEMY: Under-18 Highlights vs Bhamti Bhandar',
    category: 'academy-women',
    thumbnailAsset: { secureUrl: 'https://images.unsplash.com/photo-1547940575-1b2b5e34f33f?w=600', resourceType: 'image' },
    duration: '4:55',
    premium: false,
    publishedAt: daysAgo(5),
    description: 'The Under-18s secured a 2-1 win over local rivals Bhamti Bhandar.',
  },
];

module.exports = videos;
