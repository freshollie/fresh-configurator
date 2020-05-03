import { InMemoryLRUCache } from "apollo-server-caching";
import { fillPersistedQueries } from "../src";
import persistedQueries from "../src/graph/__generated__/persisted-queries.json";

describe("Persisted queries cache", () => {
    it("should contain the generated persisted queries", async () => {
        const cache = new InMemoryLRUCache();
        await fillPersistedQueries(cache);
        await Promise.all(
            Object.entries(persistedQueries).map(([key, value]) =>
                expect(cache.get(key)).resolves.toEqual(value)
            )
        );
    });
});
