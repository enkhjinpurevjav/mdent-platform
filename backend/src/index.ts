import { createServer } from "./server.js";

const port = process.env.PORT || 8080;
const app = createServer();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on port ${port}`);
});
