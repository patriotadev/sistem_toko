import express, {Request, Response} from 'express';

const router = express.Router();

router.get('/health', (req: Request, res: Response) => {
    res.send('App is healthy');
});

router.use((req: Request, res: Response) => {
    res.status(400).send('Invalid route.');
})

export default router;

