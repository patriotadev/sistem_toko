import express, {Request, Response} from 'express';
import StokRouter from '../modules/stok/stok.route';
import TokoRouter from '../modules/toko/toko.route';

const router = express.Router();

router.get('/health', (req: Request, res: Response) => {
    res.send('App is healthy');
});

router.use('/api/stok', StokRouter);
router.use('/api/toko', TokoRouter);

router.use((req: Request, res: Response) => {
    res.status(400).send('Invalid route.');
})

export default router;

