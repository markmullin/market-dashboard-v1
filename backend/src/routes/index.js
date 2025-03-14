import express from 'express';
import marketRoutes from './marketRoutes.js';
import macroAnalysisRoutes from './macroAnalysis.js';
import marketEnvironmentRoutes from './marketEnvironmentRoutes.js';
import industryAnalysisRoutes from './industryAnalysis.js';
import llamaRoutes from './llamaRoutes.js';
import ollamaRoutes from './ollamaRoutes.js';

const router = express.Router();

// Mount routes
router.use('/market', marketRoutes);
router.use('/market-environment', marketEnvironmentRoutes);
router.use('/industry-analysis', industryAnalysisRoutes);
router.use('/macro-analysis', macroAnalysisRoutes);
router.use('/llama', llamaRoutes);
router.use('/ollama', ollamaRoutes);

// Debug endpoint to list all routes
router.get('/routes', (req, res) => {
    const routes = [];
    router.stack.forEach(middleware => {
        if (middleware.route) {
            routes.push({
                path: middleware.route.path,
                methods: Object.keys(middleware.route.methods)
            });
        } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach(handler => {
                if (handler.route) {
                    routes.push({
                        path: handler.route.path,
                        methods: Object.keys(handler.route.methods)
                    });
                }
            });
        }
    });
    res.json(routes);
});

export default router;