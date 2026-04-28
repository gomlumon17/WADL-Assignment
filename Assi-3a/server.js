const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");
const uploadsDir = path.join(publicDir, "uploads");

const mimeTypes = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=UTF-8",
};

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=UTF-8",
  });
  res.end(JSON.stringify(payload));
}

function normalizeFileName(fileName) {
  if (typeof fileName !== "string") {
    return "";
  }

  const safeName = path.basename(fileName.trim());
  if (!safeName || safeName === "." || safeName === "..") {
    return "";
  }

  return safeName;
}

function readRequestBody(req, maxBytes, callback) {
  const chunks = [];
  let totalSize = 0;

  req.on("data", (chunk) => {
    totalSize += chunk.length;
    if (totalSize > maxBytes) {
      callback(new Error("payload-too-large"));
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });

  req.on("end", () => {
    callback(null, Buffer.concat(chunks));
  });

  req.on("error", (err) => {
    callback(err);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(
    req.url,
    `http://${req.headers.host || "localhost"}`,
  );
  const pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === "/api/files" && req.method === "GET") {
    fs.readdir(uploadsDir, { withFileTypes: true }, (err, entries) => {
      if (err) {
        sendJson(res, 500, { error: "Failed to read upload directory." });
        return;
      }

      const files = entries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b));

      sendJson(res, 200, { files });
    });
    return;
  }

  if (pathname === "/api/upload" && req.method === "POST") {
    readRequestBody(req, 10 * 1024 * 1024, (bodyErr, rawBody) => {
      if (bodyErr) {
        const statusCode = bodyErr.message === "payload-too-large" ? 413 : 400;
        sendJson(res, statusCode, { error: "Invalid upload body." });
        return;
      }

      let parsedBody;
      try {
        parsedBody = JSON.parse(rawBody.toString("utf8"));
      } catch {
        sendJson(res, 400, { error: "Request body must be valid JSON." });
        return;
      }

      const fileName = normalizeFileName(parsedBody.filename);
      if (!fileName) {
        sendJson(res, 400, { error: "Invalid file name." });
        return;
      }

      if (typeof parsedBody.contentBase64 !== "string") {
        sendJson(res, 400, { error: "File content is missing." });
        return;
      }

      let fileData;
      try {
        fileData = Buffer.from(parsedBody.contentBase64, "base64");
      } catch {
        sendJson(res, 400, { error: "Invalid base64 file content." });
        return;
      }

      const uploadPath = path.join(uploadsDir, fileName);
      if (!uploadPath.startsWith(uploadsDir)) {
        sendJson(res, 403, { error: "Forbidden file path." });
        return;
      }

      fs.writeFile(uploadPath, fileData, (writeErr) => {
        if (writeErr) {
          sendJson(res, 500, { error: "Failed to save file." });
          return;
        }

        sendJson(res, 201, { message: "File uploaded.", fileName });
      });
    });
    return;
  }

  if (pathname === "/api/download" && req.method === "GET") {
    const fileName = normalizeFileName(
      parsedUrl.searchParams.get("name") || "",
    );
    if (!fileName) {
      sendJson(res, 400, { error: "Missing or invalid file name." });
      return;
    }

    const downloadPath = path.join(uploadsDir, fileName);
    if (!downloadPath.startsWith(uploadsDir)) {
      sendJson(res, 403, { error: "Forbidden file path." });
      return;
    }

    fs.stat(downloadPath, (statErr, stats) => {
      if (statErr || !stats.isFile()) {
        sendJson(res, 404, { error: "File not found." });
        return;
      }

      const ext = path.extname(downloadPath).toLowerCase();
      const contentType = mimeTypes[ext] || "application/octet-stream";

      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
      });

      const stream = fs.createReadStream(downloadPath);
      stream.on("error", () => {
        res.writeHead(500, { "Content-Type": "text/plain; charset=UTF-8" });
        res.end("500 Internal Server Error");
      });
      stream.pipe(res);
    });
    return;
  }

  if (pathname.startsWith("/api/files/") && req.method === "DELETE") {
    const rawName = pathname.slice("/api/files/".length);
    const fileName = normalizeFileName(rawName);
    if (!fileName) {
      sendJson(res, 400, { error: "Invalid file name." });
      return;
    }

    const deletePath = path.join(uploadsDir, fileName);
    if (!deletePath.startsWith(uploadsDir)) {
      sendJson(res, 403, { error: "Forbidden file path." });
      return;
    }

    fs.unlink(deletePath, (unlinkErr) => {
      if (unlinkErr) {
        if (unlinkErr.code === "ENOENT") {
          sendJson(res, 404, { error: "File not found." });
          return;
        }
        sendJson(res, 500, { error: "Failed to delete file." });
        return;
      }

      sendJson(res, 200, { message: "File deleted.", fileName });
    });
    return;
  }

  let staticPath = pathname;

  if (staticPath === "/") {
    staticPath = "/index.html";
  }

  const filePath = path.join(publicDir, staticPath);

  // Prevent path traversal outside public directory.
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=UTF-8" });
    res.end("403 Forbidden");
    return;
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=UTF-8" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=UTF-8" });
        res.end("500 Internal Server Error");
        return;
      }

      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
