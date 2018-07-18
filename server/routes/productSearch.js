import { Router } from 'express';
import algoliasearch from 'algoliasearch';

const router = Router();
const client = algoliasearch('WWDWJ5LD7N', '8896f69a2fd022c3dbaf08fd25b49b3c');
const index = client.initIndex('amazone_clone');

router.get('/', (req, res, next) => {
  if (req.query.query) {
    index.search({
      query: req.query.query,
      page: req.query.page
    }, (err, content) => {
      res.json({
        success: true,
        message: 'Here is your search',
        status: 200,
        searchResult: req.query.query,
        content
      });
    });
  }
});

export default router;
