import express, {Request, Response} from 'express';
import AuthRouter from '../modules/auth/auth.route';
import StokRouter from '../modules/stok/stok.route';
import TokoRouter from '../modules/toko/toko.route';
import PtRouter from '../modules/pt/pt.route';
import RoleRouter from '../modules/role/role.route';

const router = express.Router();

router.get('/health', (req: Request, res: Response) => {
    res.send('App is healthy');
});

router.use('/api/auth', AuthRouter);
router.use('/api/stok', StokRouter);
router.use('/api/toko', TokoRouter);
router.use('/api/pt', PtRouter);
router.use('/api/role', RoleRouter);

router.use((req: Request, res: Response) => {
    res.status(400).send('Invalid route.');
})

export default router;

