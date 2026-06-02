function health(_req, res) {
  return res.json({ status: 'ok', service: 'backend' });
}

module.exports = {
  health
};
