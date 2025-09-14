export function normalizeBody(req, res, next) {
  if (req.body.data) {
    try {
      const parsed = JSON.parse(req.body.data);
      req.body = { ...req.body, ...parsed };
      delete req.body.data;
      console.log(req.body);
      
    } catch (error) {
      return res.status(400).json({ error: "Invalid JSON in 'data' field" });
    }
  }

  next();
}
