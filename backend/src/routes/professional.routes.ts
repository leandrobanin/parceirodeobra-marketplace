import { Router } from 'express';
import { searchProfessionals, getProfessionalBySlug } from '../controllers/professional.controller';

const router = Router();

router.get('/search', searchProfessionals);
router.get('/:slug', getProfessionalBySlug);

export default router;
