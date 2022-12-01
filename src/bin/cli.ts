#!/usr/bin/env node

import app from '../index.js';

app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
