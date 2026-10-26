export interface Job { id: string; title: string; org?: string; area?: string; description?: string }

// الوظائف المتاحة. ابدأ بمصفوفة فارغة؛ أضف عنصرًا لكل وظيفة.
export const jobs: Job[] = [];
