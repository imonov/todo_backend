import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";

const PORT = 3000;
let data;
try {
    data = JSON.parse(readFileSync("./data/todo.json", { encoding: "utf-8" }));
} catch {
    data = [];
}
const server = createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    const [, resource, id] = parsedUrl.pathname.split("/");

    if (parsedUrl.pathname === "/") {
        const indexPage = readFileSync("./view/index.html", {
            encoding: "utf-8",
        });
        res.writeHead(200, {
            "content-type": "text/html; charset=utf-8",
        });
        res.end(indexPage);
        return;
    } else if (resource === "todo") {
        // todo page
        if (req.method === "GET" && !id) {
            res.writeHead(200, {
                "content-type": "application/json",
            });
            res.end(JSON.stringify(data));
            return;
        }

        // todo by id method get
        if (req.method === "GET" && id) {
            const todoId = Number(id);
            if (Number.isNaN(todoId)) {
                res.writeHead(400, { "content-type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid id" }));
                return;
            }

            for (let e of data) {
                if (Number(e.id) == todoId) {
                    res.writeHead(200, {
                        "content-type": "application/json",
                    });
                    res.end(JSON.stringify(e));
                    return;
                }
            }
            res.writeHead(404, {
                "content-type": "application/json; charset=utf-8",
            });
            res.end(JSON.stringify({ error: "Todo not found" }));
            return;
        }

        // todo by id method delete
        if (req.method === "DELETE" && id) {
            const todoId = Number(id);
            const index = data.findIndex((e) => Number(e.id) == todoId);

            if (index !== -1) {
                data.splice(index, 1);

                try {
                    writeFileSync(
                        "./data/todo.json",
                        JSON.stringify(data, null, 4),
                    );
                    res.writeHead(200, {
                        "content-type": "application/json; charset=utf-8",
                    });
                    return res.end(JSON.stringify({ message: "item deleted" }));
                } catch (error) {
                    res.writeHead(500, {
                        "content-type": "application/json; charset=utf-8",
                    });
                    return res.end(JSON.stringify({ message: "server error" }));
                }
            } else {
                res.writeHead(404, {
                    "content-type": "application/json; charset=utf-8",
                });
                return res.end(JSON.stringify({ message: "item not found" }));
            }
        }

        // add new todo

        if (req.method === "POST") {
            const nameQuery = parsedUrl.searchParams.get("name");
            const descQuery = parsedUrl.searchParams.get("description");

            if (nameQuery && descQuery) {
                data.push({
                    id: Number(data[-1]["id"]) + 1,
                    name: nameQuery,
                    description: descQuery,
                });

                writeFileSync(
                    "./data/todo.json",
                    JSON.stringify(data, null, 4),
                );

                res.writeHead(200, {
                    "content-type": "application/json; charset=utf-8",
                });

                return res.end(JSON.stringify({ message: "todo added" }));
            }
        }

        // updata data by id
        if (req.method === "PATCH" && id) {
            // so'rovdan kelgan paramatrlarni qiymatini ajratib oladi
            const nameQuery = parsedUrl.searchParams.get("name");
            const descQuery = parsedUrl.searchParams.get("description");

            const todoId = Number(id);
            const index = data.findIndex((e) => Number(e.id) == todoId);
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", () => {
                let update = {};
                if (body.trim()) {
                    try {
                        update = JSON.parse(body);
                    } catch (error) {
                        res.writeHead(400, {
                            "content-type": "application/json; charset=utf-8",
                        });
                        res.end(JSON.stringify({ message: "xato json" }));
                    }
                }

                if (nameQuery !== null) {
                    update.name = nameQuery;
                }

                if (descQuery !== null) {
                    update.description = descQuery;
                }

                if (Object.keys(update).length === 0) {
                    res.writeHead(400, {
                        "content-type": "application/json; charset=utf-8",
                    });
                    res.end(
                        JSON.stringify({ message: "data yangilanish yo'q" }),
                    );
                }

                if (update.name !== undefined) {
                    data[index].name = update.name;
                }

                if (update.description !== undefined) {
                    data[index].description = update.description;
                }

                writeFileSync(
                    "./data/todo.json",
                    JSON.stringify(data, null, 4),
                );

                res.writeHead(200, {
                    "content-type": "application/json; charset=utf-8",
                });

                return res.end(JSON.stringify({ message: "todo updated" }));
            });
        }
    } else {
        res.writeHead(404, {
            "content-type": "application/json; charset=utf-8",
        });
        res.end(
            JSON.stringify({
                message: `sahifa mavjud emas`,
            }),
        );
        return;
    }
});

server.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
});
