import { Router } from "express";
import { verifyUser } from "../../middleware/auth.middleware";
import path from "path";
import fs from 'fs';

const router = Router();

router.get('/:id', (req, res, next) => {

    const _path = path.join(__dirname, '../../images/' + req.params.id);
    if (fs.existsSync(_path)) {
        return res.download(_path);
    }

    return res.status(404).end();
});

export default router;